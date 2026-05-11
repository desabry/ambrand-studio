/**
 * File Upload functionality for Ambrand Studio using Supabase Storage
 */

async function uploadFile(file, userId) {
    try {
        // Generate unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;
        
        // Upload file to Supabase Storage
        const { data, error } = await supabaseClient.storage
            .from('uploads')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabaseClient.storage
            .from('uploads')
            .getPublicUrl(fileName);

        // Save file info to database
        const { error: dbError } = await supabaseClient
            .from('files')
            .insert({
                file_name: file.name,
                file_path: fileName,
                file_size: file.size,
                file_type: file.type,
                bucket_name: 'uploads',
                public_url: publicUrl,
                user_id: userId
            });

        if (dbError) throw dbError;

        return { success: true, publicUrl, fileName };
    } catch (error) {
        console.error('Upload error:', error);
        return { success: false, error: error.message };
    }
}

async function deleteFile(fileName, userId) {
    try {
        // Delete from storage
        const { error: storageError } = await supabaseClient.storage
            .from('uploads')
            .remove([fileName]);

        if (storageError) throw storageError;

        // Delete from database
        const { error: dbError } = await supabaseClient
            .from('files')
            .delete()
            .eq('file_path', fileName)
            .eq('user_id', userId);

        if (dbError) throw dbError;

        return { success: true };
    } catch (error) {
        console.error('Delete error:', error);
        return { success: false, error: error.message };
    }
}

async function getUserFiles(userId) {
    try {
        const { data, error } = await supabaseClient
            .from('files')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { success: true, files: data };
    } catch (error) {
        console.error('Get files error:', error);
        return { success: false, error: error.message };
    }
}

// File upload UI functions
function showFileUploadModal() {
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="auth-modal-content">
            <div class="auth-modal-header">
                <h2>Upload File</h2>
                <button class="auth-close-btn" onclick="closeFileUploadModal()">&times;</button>
            </div>
            <form id="fileUploadForm" class="auth-form">
                <div class="form-group">
                    <label for="fileInput">Choose File</label>
                    <input type="file" id="fileInput" required>
                </div>
                <div class="form-group">
                    <label for="fileDescription">Description (Optional)</label>
                    <input type="text" id="fileDescription" placeholder="Enter file description">
                </div>
                <button type="submit" class="auth-btn">Upload File</button>
            </form>
            <div id="uploadProgress" style="display: none; margin-top: 20px;">
                <div style="background: rgba(255,255,255,0.1); border-radius: 8px; height: 8px; overflow: hidden;">
                    <div id="progressBar" style="background: #e31937; height: 100%; width: 0%; transition: width 0.3s ease;"></div>
                </div>
                <p style="color: #a0a0a0; margin-top: 10px; text-align: center;">Uploading... <span id="progressPercent">0%</span></p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listener
    document.getElementById('fileUploadForm').addEventListener('submit', handleFileUpload);
}

function closeFileUploadModal() {
    const modal = document.querySelector('.auth-modal');
    if (modal && modal.innerHTML.includes('Upload File')) {
        modal.remove();
    }
}

async function handleFileUpload(e) {
    e.preventDefault();
    
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a file to upload');
        return;
    }
    
    // Get current user
    const userData = await getCurrentUser();
    if (!userData) {
        alert('You must be logged in to upload files');
        return;
    }
    
    // Show progress
    document.getElementById('uploadProgress').style.display = 'block';
    
    // Simulate progress (since Supabase doesn't provide upload progress)
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress > 90) progress = 90;
        document.getElementById('progressBar').style.width = progress + '%';
        document.getElementById('progressPercent').textContent = Math.round(progress) + '%';
    }, 200);
    
    // Upload file
    const result = await uploadFile(file, userData.user.id);
    
    clearInterval(progressInterval);
    document.getElementById('progressBar').style.width = '100%';
    document.getElementById('progressPercent').textContent = '100%';
    
    if (result.success) {
        alert('File uploaded successfully!');
        closeFileUploadModal();
        // Refresh files list if on dashboard
        if (typeof loadUserFiles === 'function') {
            await loadUserFiles();
        }
    } else {
        alert('Upload failed: ' + result.error);
        document.getElementById('uploadProgress').style.display = 'none';
    }
}

// Display files in dashboard
async function displayUserFiles() {
    const userData = await getCurrentUser();
    if (!userData) return;
    
    const result = await getUserFiles(userData.user.id);
    if (!result.success) return;
    
    const filesContainer = document.getElementById('filesList');
    if (!filesContainer) return;
    
    if (result.files.length === 0) {
        filesContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #a0a0a0;">No files uploaded yet.</div>';
        return;
    }
    
    filesContainer.innerHTML = result.files.map(file => `
        <div class="file-item" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <div style="font-weight: 600; color: #fff; margin-bottom: 5px;">${file.file_name}</div>
                <div style="color: #a0a0a0; font-size: 0.9rem;">
                    ${formatFileSize(file.file_size)} • ${new Date(file.created_at).toLocaleDateString()}
                </div>
            </div>
            <div style="display: flex; gap: 10px;">
                <a href="${file.public_url}" target="_blank" class="btn-small btn-edit">View</a>
                <button class="btn-small btn-delete" onclick="deleteUserFile('${file.file_path}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function deleteUserFile(fileName) {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    const userData = await getCurrentUser();
    if (!userData) return;
    
    const result = await deleteFile(fileName, userData.user.id);
    
    if (result.success) {
        alert('File deleted successfully!');
        await displayUserFiles();
    } else {
        alert('Delete failed: ' + result.error);
    }
}
