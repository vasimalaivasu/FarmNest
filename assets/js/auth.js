/**
 * Verdant Haven - Authentication & Session Management Module
 * Handles Login (with one-click demo credentials), Register, Password Recovery & Role Redirects
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoginHandlers();
  initRegisterHandlers();
  initForgotPasswordHandlers();
  initPasswordVisibilityToggles();
});

function initPasswordVisibilityToggles() {
  document.querySelectorAll('.toggle-password-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input) {
        const isPassword = input.getAttribute('type') === 'password';
        input.setAttribute('type', isPassword ? 'text' : 'password');
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = isPassword ? 'bi bi-eye-slash' : 'bi bi-eye';
        }
      }
    });
  });
}

/* ===================================================================
   LOGIN LOGIC & SOCIAL OAUTH HANDLERS
=================================================================== */
function initLoginHandlers() {
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');

  // Social Auth Handlers (Google & Apple)
  initSocialAuthHandlers();

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput?.value.trim();
      const password = passwordInput?.value.trim();

      if (!email || !password) {
        showToast('Please provide both email and password.', 'warning', 'Authentication');
        return;
      }

      const res = VerdantDB.login(email, password);
      if (res.success) {
        // If user was prompted to login while proceeding to booking
        const pendingBooking = sessionStorage.getItem('verdant_pending_booking');
        if (pendingBooking) {
          sessionStorage.removeItem('verdant_pending_booking');
          showToast(`Welcome back, ${res.user.name}! Returning to your reservation...`, 'success', 'Signed In');
          setTimeout(() => {
            window.location.href = pendingBooking;
          }, 450);
          return;
        }

        const params = new URLSearchParams(window.location.search);
        const returnUrl = params.get('returnUrl');
        if (returnUrl) {
          showToast(`Welcome back, ${res.user.name}! Returning to your reservation...`, 'success', 'Signed In');
          setTimeout(() => {
            window.location.href = returnUrl;
          }, 450);
          return;
        }

        // If user was prompted to login while saving a stay to wishlist
        const pendingWishlist = sessionStorage.getItem('verdant_pending_wishlist');
        if (pendingWishlist) {
          if (!VerdantDB.isInWishlist(pendingWishlist)) {
            VerdantDB.toggleWishlist(pendingWishlist);
          }
          sessionStorage.removeItem('verdant_pending_wishlist');
          showToast(`Welcome, ${res.user.name}! Saved stay to your wishlist.`, 'success', 'Signed In');
          setTimeout(() => {
            window.location.href = '../guest/wishlist.html';
          }, 450);
          return;
        }

        showToast(`Welcome back, ${res.user.name}! Redirecting to customer dashboard...`, 'success', 'Signed In');
        setTimeout(() => {
          window.location.href = '../guest/dashboard.html';
        }, 500);
      } else {
        showToast(res.message || 'Invalid credentials.', 'danger', 'Login Failed');
      }
    });
  }
}

function initSocialAuthHandlers() {
  document.querySelectorAll('.google-auth-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open('https://accounts.google.com/signin', '_blank', 'noopener,noreferrer');
      simulateSocialAuth('Google', 'sarah.jenkins@gmail.com', 'Sarah Jenkins');
    });
  });

  document.querySelectorAll('.apple-auth-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open('https://appleid.apple.com/sign-in', '_blank', 'noopener,noreferrer');
      simulateSocialAuth('Apple', 's.jenkins@privaterelay.appleid.com', 'Sarah J.');
    });
  });
}

function simulateSocialAuth(provider, email, name) {
  let user = VerdantDB.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    const regRes = VerdantDB.register({
      name: name,
      email: email,
      phone: '+1 (555) 234-5678',
      password: 'SocialUser@2026',
      role: 'guest',
      country: 'United States',
      avatar: null
    });
    user = regRes.user;
  } else {
    VerdantDB.setCurrentUser(user);
  }

  const pendingWishlist = sessionStorage.getItem('verdant_pending_wishlist');
  if (pendingWishlist) {
    if (!VerdantDB.isInWishlist(pendingWishlist)) {
      VerdantDB.toggleWishlist(pendingWishlist);
    }
    sessionStorage.removeItem('verdant_pending_wishlist');
    showToast(`Signed in with ${provider}! Saved stay to your wishlist.`, 'success', 'Connected');
    setTimeout(() => {
      window.location.href = '../guest/wishlist.html';
    }, 450);
    return;
  }

  showToast(`Signed in with ${provider} successfully! Redirecting...`, 'success', 'Connected');
  setTimeout(() => {
    window.location.href = '../guest/dashboard.html';
  }, 500);
}

/* ===================================================================
   REGISTRATION LOGIC
=================================================================== */
function initRegisterHandlers() {
  const regForm = document.getElementById('register-form');
  if (!regForm) return;

  regForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('reg-name')?.value.trim();
    const email = document.getElementById('reg-email')?.value.trim();
    const phone = document.getElementById('reg-phone')?.value.trim();
    const password = document.getElementById('reg-password')?.value;
    const confirmPassword = document.getElementById('reg-confirm-password')?.value;
    const termsChecked = document.getElementById('reg-terms')?.checked;

    if (!termsChecked) {
      showToast('You must accept our Terms of Service to register.', 'warning', 'Terms Agreement');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match. Please re-enter.', 'danger', 'Password Mismatch');
      return;
    }

    if (password.length < 6) {
      showToast('Password should be at least 6 characters.', 'warning', 'Password Security');
      return;
    }

    const res = VerdantDB.register({
      name: fullName,
      email: email,
      phone: phone,
      password: password,
      role: 'guest',
      country: 'United States',
      avatar: null
    });

    if (res.success) {
      const pendingWishlist = sessionStorage.getItem('verdant_pending_wishlist');
      if (pendingWishlist) {
        if (!VerdantDB.isInWishlist(pendingWishlist)) {
          VerdantDB.toggleWishlist(pendingWishlist);
        }
        sessionStorage.removeItem('verdant_pending_wishlist');
        showToast('Account created & stay saved to your wishlist!', 'success', 'Welcome');
        setTimeout(() => {
          window.location.href = '../guest/wishlist.html';
        }, 500);
        return;
      }

      showToast('Account created successfully! Redirecting...', 'success', 'Welcome');
      setTimeout(() => {
        window.location.href = '../guest/dashboard.html';
      }, 700);
    } else {
      showToast(res.message, 'danger', 'Registration Error');
    }
  });
}

/* ===================================================================
   FORGOT PASSWORD LOGIC
=================================================================== */
function initForgotPasswordHandlers() {
  const form = document.getElementById('forgot-password-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email')?.value.trim();
    if (!email) {
      showToast('Please enter your account email address.', 'warning', 'Email Required');
      return;
    }

    showToast(`Password recovery link has been dispatched to ${email}.`, 'success', 'Email Sent');
    form.reset();
  });
}

