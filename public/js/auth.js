/**
 * Authentication logic for Ambrand Studio using Supabase.
 * Handles Login, Signup, Logout, and Role management.
 */

/**
 * Sign up a new user and create a profile
 * @param {string} email 
 * @param {string} password 
 * @param {string} fullName 
 * @param {string} role 'user' or 'provider'
 */
async function signUp(email, password, fullName, role = 'user') {
    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role
                }
            }
        });

        if (error) throw error;

        return { success: true, user: data.user };
    } catch (err) {
        console.error('Signup error:', err.message);
        return { success: false, error: err.message };
    }
}

/**
 * Sign in an existing user
 * @param {string} email 
 * @param {string} password 
 */
async function signIn(email, password) {
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        // Build profile from user metadata
        const profile = {
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name || data.user.email,
            role: data.user.user_metadata?.role || 'user'
        };

        return { success: true, user: data.user, profile };
    } catch (err) {
        console.error('Signin error:', err.message);
        return { success: false, error: err.message };
    }
}

/**
 * Sign out the current user
 */
async function signOut() {
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        window.location.href = '/';
        return { success: true };
    } catch (err) {
        console.error('Signout error:', err.message);
        return { success: false, error: err.message };
    }
}

/**
 * Get the current session and user profile
 */
async function getCurrentUser() {
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session) return null;

        // Build profile from user metadata
        const profile = {
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || session.user.email,
            role: session.user.user_metadata?.role || 'user'
        };

        return { user: session.user, profile };
    } catch (err) {
        console.error('Get current user error:', err.message);
        return null;
    }
}

// UI Functions
function openAuthModal() {
    document.getElementById('authModal').classList.remove('hidden');
}

function closeAuthModal() {
    document.getElementById('authModal').classList.add('hidden');
}

function switchToSignup() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.remove('hidden');
    document.getElementById('authTitle').textContent = 'Sign Up';
    document.getElementById('authSwitchText').innerHTML = 'Already have an account? <a href="#" onclick="switchToLogin()">Login</a>';
}

function switchToLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('authTitle').textContent = 'Login';
    document.getElementById('authSwitchText').innerHTML = 'Don\'t have an account? <a href="#" onclick="switchToSignup()">Sign up</a>';
}

// Manually callable init function (for Next.js where DOMContentLoaded already fired)
function initAuthForms() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm && !loginForm._authBound) {
        loginForm._authBound = true;
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const result = await signIn(email, password);
            if (result.success) {
                closeAuthModal();
                window.location.href = '/';
            } else {
                alert('Login failed: ' + result.error);
            }
        });
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm && !signupForm._authBound) {
        signupForm._authBound = true;
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            
            const result = await signUp(email, password, name);
            if (result.success) {
                alert('Signup successful! Please check your email to verify your account.');
                closeAuthModal();
            } else {
                alert('Signup failed: ' + result.error);
            }
        });
    }

    checkAuthState();
}

// Form Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initAuthForms();
});

async function checkAuthState() {
    const userData = await getCurrentUser();
    if (userData) {
        // User is logged in - update UI
        updateUIForLoggedInUser(userData);
    }
}

function updateUIForLoggedInUser(userData) {
    const navLoginItem = document.getElementById('nav-login-item');
    if (navLoginItem) {
        navLoginItem.innerHTML = '<a href="/dashboard" class="nav-link">Dashboard</a>';
    }
}
