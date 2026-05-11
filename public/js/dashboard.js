document.addEventListener('DOMContentLoaded', () => {
    // --- Right Sidebar Tabs Switching ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active to clicked
            btn.classList.add('active');
            const target = btn.getAttribute('data-tab');
            document.getElementById(`tab-${target}`).classList.add('active');
        });
    });

    // --- Block Types Data ---
    const blockTypes = {
        image: { icon: 'fa-camera', label: 'Image', form: '<div class="form-group"><label>Image URL</label><input type="text" placeholder="https://..."></div><div class="form-group"><label>Alt Text</label><input type="text" placeholder="Describe image..."></div>' },
        text: { icon: 'fa-file-alt', label: 'Text', form: '<div class="form-group"><label>Content</label><textarea rows="4" placeholder="Enter text here..."></textarea></div><div class="form-group"><label>Format</label><select><option>Paragraph</option><option>Heading 1</option><option>Heading 2</option></select></div>' },
        grid: { icon: 'fa-th-large', label: 'Photo Grid', form: '<div class="form-group"><label>Columns</label><select><option>2</option><option>3</option><option>4</option></select></div>' },
        video: { icon: 'fa-play', label: 'Video & Audio', form: '<div class="form-group"><label>Video URL (YouTube/Vimeo)</label><input type="text" placeholder="https://..."></div>' },
        embed: { icon: 'fa-code', label: 'Embed', form: '<div class="form-group"><label>Embed Code</label><textarea rows="4" placeholder="<iframe>..."></textarea></div>' },
        lightroom: { icon: 'fa-sliders-h', label: 'Lightroom', form: '<div class="form-group"><label>Before Image</label><input type="file"></div><div class="form-group"><label>After Image</label><input type="file"></div>' },
        prototype: { icon: 'fa-object-group', label: 'Prototype', form: '<div class="form-group"><label>Figma URL</label><input type="text" placeholder="https://figma.com/..."></div>' },
        "3d": { icon: 'fa-cube', label: '3D Model', form: '<div class="form-group"><label>Upload Model (.obj, .gltf)</label><input type="file"></div>' }
    };

    // --- Canvas & Drag/Drop Logic ---
    const canvasContainer = document.getElementById('projectCanvas');
    const emptyState = document.getElementById('emptyState');
    const propertiesForm = document.getElementById('propertiesForm');
    const blockPropertiesSection = document.getElementById('blockProperties');
    
    // Quick Add Buttons
    const quickAddBtns = document.querySelectorAll('.quick-add-btn');
    quickAddBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-type');
            addBlockToCanvas(type);
        });
    });

    function addBlockToCanvas(type) {
        // Hide empty state
        if (emptyState.style.display !== 'none') {
            emptyState.style.display = 'none';
        }

        const blockData = blockTypes[type];
        if (!blockData) return;

        const blockEl = document.createElement('div');
        blockEl.className = 'canvas-block';
        blockEl.setAttribute('data-type', type);
        
        blockEl.innerHTML = `
            <div class="block-header">
                <div class="block-title">
                    <i class="fas ${blockData.icon}"></i>
                    <span>${blockData.label} Block</span>
                </div>
                <div class="block-actions">
                    <button class="block-action-btn settings" title="Settings"><i class="fas fa-cog"></i></button>
                    <button class="block-action-btn delete" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <div class="block-content">
                <div class="placeholder-content">
                    <i class="fas ${blockData.icon}"></i>
                    <p>Configure this ${blockData.label.toLowerCase()} block in the right sidebar.</p>
                </div>
            </div>
        `;

        canvasContainer.appendChild(blockEl);

        // Bind events for the new block
        bindBlockEvents(blockEl, type);
        
        // Auto select the new block
        selectBlock(blockEl, type);
    }

    function bindBlockEvents(blockEl, type) {
        // Delete action
        const deleteBtn = blockEl.querySelector('.delete');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            blockEl.remove();
            checkEmptyState();
            // Clear properties if selected block was deleted
            if (blockEl.classList.contains('active')) {
                blockPropertiesSection.style.display = 'none';
            }
        });

        // Settings / Select action
        const settingsBtn = blockEl.querySelector('.settings');
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            selectBlock(blockEl, type);
        });

        // Click anywhere on block to select
        blockEl.addEventListener('click', () => {
            selectBlock(blockEl, type);
        });
    }

    function selectBlock(blockEl, type) {
        // Remove active class from all blocks
        document.querySelectorAll('.canvas-block').forEach(b => b.classList.remove('active'));
        
        // Add active to selected
        blockEl.classList.add('active');

        // Switch to Content tab in sidebar
        document.querySelector('[data-tab="content"]').click();

        // Populate properties form
        const blockData = blockTypes[type];
        if (blockData) {
            propertiesForm.innerHTML = blockData.form;
            blockPropertiesSection.style.display = 'block';
        }
    }

    function checkEmptyState() {
        const blocks = canvasContainer.querySelectorAll('.canvas-block');
        if (blocks.length === 0) {
            emptyState.style.display = 'block';
        }
    }

    // Initialize SortableJS for the canvas
    if (typeof Sortable !== 'undefined') {
        new Sortable(canvasContainer, {
            animation: 150,
            handle: '.block-header',
            ghostClass: 'sortable-ghost',
            filter: '.empty-state',
            onEnd: function (evt) {
                // Reordered
            }
        });

        // Make right sidebar blocks draggable to canvas
        const blocksGrid = document.querySelector('.blocks-grid');
        new Sortable(blocksGrid, {
            group: {
                name: 'shared',
                pull: 'clone',
                put: false // Do not allow dropping back into the sidebar
            },
            animation: 150,
            sort: false // Do not allow sorting inside the sidebar
        });

        // Make canvas accept drops from sidebar
        new Sortable(canvasContainer, {
            group: 'shared',
            animation: 150,
            handle: '.block-header',
            filter: '.empty-state',
            onAdd: function (evt) {
                const itemEl = evt.item;
                const type = itemEl.getAttribute('data-type');
                
                // Remove the cloned simple element
                itemEl.parentNode.removeChild(itemEl);
                
                // Add the full formatted block
                if (type) {
                    addBlockToCanvas(type);
                }
            }
        });
    } else {
        console.warn("SortableJS not loaded. Drag and drop reordering disabled.");
    }
});
