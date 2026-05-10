/**
 * Auth Guard for Ambrand Studio
 * Checks authentication status and role before allowing access to the page.
 */

(async function() {
    // Wait for Supabase to be ready
    if (typeof supabaseClient === 'undefined') {
        console.error('Supabase client not found. Make sure supabase-config.js is loaded.');
        return;
    }

    const { data: { session } } = await supabaseClient.auth.getSession();
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (!session) {
        // Not logged in
        if (currentPage !== 'index.html' && currentPage !== '') {
            console.log('Redirecting to login...');
            window.location.href = 'index.html';
        }
    } else {
        // Logged in, build profile from metadata
        const profile = {
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || session.user.email,
            role: session.user.user_metadata?.role || 'user'
        };

        // Protected Admin Area
        if (currentPage === 'admin.html' && profile.role !== 'provider') {
            console.warn('Unauthorized access to admin panel.');
            alert('You do not have permission to access this page.');
            window.location.href = 'index.html';
        }
    }
})();
