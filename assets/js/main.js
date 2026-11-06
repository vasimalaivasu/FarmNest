/**
 * Verdant Haven - Homestay & Farmstay Booking Template
 * Global UI & Interaction Manager (Theme, RTL, Toasts, Wishlist, Navigation)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure DB initialized
  if (window.VerdantDB) {
    VerdantDB.init();
  }

  ensureGlobalDrawers();
  initTheme();
  initRTL();
  initNavbar();
  initNavbarAuth();
  updateWishlistBadge();
  syncAllWishlistButtons();
  setupGlobalWishlistTriggers();
  setupSearchForms();
  setupDateInputsDefaults();
  highlightActiveNav();
  initFooterNewsletter();
});

function initFooterNewsletter() {
  document.querySelectorAll('.footer-newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input?.value.trim();
      if (!email) return;

      try {
        const subs = JSON.parse(localStorage.getItem('verdant_subscribers') || '[]');
        if (!subs.includes(email)) {
          subs.push(email);
          localStorage.setItem('verdant_subscribers', JSON.stringify(subs));
        }
      } catch (err) {}

      showToast('Thank you for subscribing to The Verdant Journal! Check your inbox for your $30 welcome voucher.', 'success', 'Newsletter Subscription');
      if (input) input.value = '';
    });
  });
}

/* ==========================================
   THEME TOGGLE (Dark / Light)
========================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('verdant_haven_theme_v1') || 'light';
  applyTheme(savedTheme);

  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const current = document.documentElement.getAttribute('data-bs-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('verdant_haven_theme_v1', next);
      showToast(`Switched to ${next === 'dark' ? 'Dark Forest' : 'Warm Cream Light'} mode`, 'info', 'Theme Updated');
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-bs-theme', theme);
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  document.querySelectorAll('.theme-toggle-btn i').forEach(icon => {
    icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
  });
}

/* ==========================================
   RTL TOGGLE (Right-to-Left Layout)
========================================== */
function initRTL() {
  const savedRTL = localStorage.getItem('verdant_haven_rtl_v1') || 'ltr';
  applyRTL(savedRTL);

  document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const current = document.documentElement.getAttribute('dir') || 'ltr';
      const next = current === 'rtl' ? 'ltr' : 'rtl';
      applyRTL(next);
      localStorage.setItem('verdant_haven_rtl_v1', next);
      showToast(`Switched to ${next.toUpperCase()} layout direction`, 'info', 'Layout Direction');
    });
  });
}

function applyRTL(dir) {
  document.documentElement.setAttribute('dir', dir);
  document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
    btn.setAttribute('title', dir === 'rtl' ? 'Switch to LTR Layout' : 'Switch to RTL Layout');
    btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR Layout' : 'Switch to RTL Layout');
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = 'bi bi-arrow-left-right';
    }
  });
}

/* ==========================================
   NAVBAR & SCROLL BEHAVIOR
========================================== */
function initNavbar() {
  const navbar = document.querySelector('.verdant-navbar');
  if (navbar) {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    }
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // Mobile menu close on in-page hash links ONLY (e.g. href="#explore")
  // Real multi-page navigation links (index.html, index-2.html, stays.html, etc.) must navigate naturally without being aborted by a collapsing animation
  document.querySelectorAll('.navbar-collapse a[href^="#"]:not([href="#"]):not([data-bs-toggle])').forEach(link => {
    link.addEventListener('click', () => {
      const collapseEl = document.querySelector('.navbar-collapse');
      if (collapseEl && collapseEl.classList.contains('show') && typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
        const bsCollapse = bootstrap.Collapse.getInstance(collapseEl);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });

  // Navbar dropdown toggle (ensures dropdown opens reliably on mobile, tablet, and desktop)
  document.querySelectorAll('.verdant-navbar .dropdown-toggle').forEach(toggleBtn => {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parentDropdown = toggleBtn.closest('.dropdown');
      const menu = parentDropdown ? parentDropdown.querySelector('.dropdown-menu') : null;
      if (!menu) return;

      const isShown = menu.classList.contains('show');

      // Close any other open dropdowns in navbar
      document.querySelectorAll('.verdant-navbar .dropdown-menu.show').forEach(m => {
        if (m !== menu) m.classList.remove('show');
      });
      document.querySelectorAll('.verdant-navbar .dropdown.show').forEach(d => {
        if (d !== parentDropdown) d.classList.remove('show');
      });
      document.querySelectorAll('.verdant-navbar .dropdown-toggle.show, .verdant-navbar .dropdown-toggle[aria-expanded="true"]').forEach(btn => {
        if (btn !== toggleBtn) {
          btn.classList.remove('show');
          btn.setAttribute('aria-expanded', 'false');
        }
      });

      if (isShown) {
        menu.classList.remove('show');
        toggleBtn.classList.remove('show');
        if (parentDropdown) parentDropdown.classList.remove('show');
        toggleBtn.setAttribute('aria-expanded', 'false');
      } else {
        menu.classList.add('show');
        toggleBtn.classList.add('show');
        if (parentDropdown) parentDropdown.classList.add('show');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Desktop hover auto-dismiss when cursor leaves dropdown
  document.querySelectorAll('.verdant-navbar .dropdown').forEach(dropdownEl => {
    dropdownEl.addEventListener('mouseleave', () => {
      if (window.innerWidth >= 992) {
        const menu = dropdownEl.querySelector('.dropdown-menu');
        const toggleBtn = dropdownEl.querySelector('.dropdown-toggle');
        if (menu) menu.classList.remove('show');
        dropdownEl.classList.remove('show');
        if (toggleBtn) {
          toggleBtn.classList.remove('show');
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Close dropdown menu when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.verdant-navbar .dropdown')) {
      document.querySelectorAll('.verdant-navbar .dropdown-menu.show').forEach(m => {
        m.classList.remove('show');
      });
      document.querySelectorAll('.verdant-navbar .dropdown.show').forEach(d => {
        d.classList.remove('show');
      });
      document.querySelectorAll('.verdant-navbar .dropdown-toggle[aria-expanded="true"], .verdant-navbar .dropdown-toggle.show').forEach(btn => {
        btn.classList.remove('show');
        btn.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/* ==========================================
   GLOBAL OFFCANVAS DRAWERS (Left Auth & Right Wishlist)
========================================== */
function ensureGlobalDrawers() {
  const path = window.location.pathname.toLowerCase();
  const isSubdir = path.includes('/guest/') || path.includes('/booking/') || path.includes('/blog/') || path.includes('/auth/') || path.includes('/errors/');
  const relPrefix = isSubdir ? '../' : '';

  // 1. Left-to-Right Auth Drawer (offcanvas-start)
  if (!document.getElementById('authDrawer')) {
    const authDrawerEl = document.createElement('div');
    authDrawerEl.className = 'offcanvas offcanvas-start auth-drawer shadow-lg';
    authDrawerEl.id = 'authDrawer';
    authDrawerEl.tabIndex = -1;
    authDrawerEl.setAttribute('aria-labelledby', 'authDrawerLabel');
    authDrawerEl.innerHTML = `
      <div class="offcanvas-header border-bottom py-3 px-4">
        <div class="d-flex align-items-center gap-2">
          <span class="brand-icon" style="width: 36px; height: 36px; font-size: 1.1rem;"><i class="bi bi-flower1"></i></span>
          <span class="offcanvas-title font-serif fw-bold fs-5 mb-0" id="authDrawerLabel">Verdant Haven</span>
        </div>
        <button type="button" class="btn-close shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body p-4" id="authDrawerBody"></div>
    `;
    document.body.appendChild(authDrawerEl);
  }

  // 2. Right-to-Left Wishlist Drawer (offcanvas-end)
  if (!document.getElementById('wishlistDrawer')) {
    const wishDrawerEl = document.createElement('div');
    wishDrawerEl.className = 'offcanvas offcanvas-end wishlist-drawer shadow-lg';
    wishDrawerEl.id = 'wishlistDrawer';
    wishDrawerEl.tabIndex = -1;
    wishDrawerEl.setAttribute('aria-labelledby', 'wishlistDrawerLabel');
    wishDrawerEl.innerHTML = `
      <div class="offcanvas-header border-bottom py-3 px-4">
        <div class="d-flex align-items-center gap-2">
          <div class="rounded-circle bg-danger-subtle text-danger d-inline-flex align-items-center justify-content-center" style="width: 34px; height: 34px;">
            <i class="bi bi-heart-fill"></i>
          </div>
          <div>
            <h5 class="offcanvas-title font-serif fw-bold mb-0" id="wishlistDrawerLabel">Saved Stays</h5>
            <small class="text-muted"><span id="wishlist-drawer-count">0</span> items saved</small>
          </div>
        </div>
        <button type="button" class="btn-close shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body p-3" id="wishlistDrawerBody"></div>
      <div class="offcanvas-footer border-top p-3" id="wishlistDrawerFooter"></div>
    `;
    document.body.appendChild(wishDrawerEl);
  }

  renderAuthDrawer();
  renderWishlistDrawer();
}

/* ==========================================
   AUTH DRAWER RENDERING & TOGGLE (Sign In / Sign Up)
========================================== */
function renderAuthDrawer(activeTab = 'signin') {
  const container = document.getElementById('authDrawerBody');
  if (!container) return;

  const path = window.location.pathname.toLowerCase();
  const isSubdir = path.includes('/guest/') || path.includes('/booking/') || path.includes('/blog/') || path.includes('/auth/') || path.includes('/errors/');
  const relPrefix = isSubdir ? '../' : '';

  const user = window.VerdantDB ? VerdantDB.getCurrentUser() : null;

  if (user) {
    // Authenticated Profile View
    const avatarUrl = window.VerdantDB ? VerdantDB.getUserAvatar(user, 100) : '';
    container.innerHTML = `
      <div class="text-center py-3 mb-3 border-bottom">
        <div class="position-relative d-inline-block mb-2">
          <img src="${avatarUrl}" alt="${escapeHTML(user.name)}" class="rounded-circle border border-2 border-success shadow-sm" style="width: 72px; height: 72px; object-fit: cover;">
          <span class="position-absolute bottom-0 end-0 bg-success border border-2 border-white rounded-circle p-1" style="width: 14px; height: 14px;"></span>
        </div>
        <h5 class="fw-bold mb-0">${escapeHTML(user.name || 'Guest Member')}</h5>
        <small class="text-muted d-block">${escapeHTML(user.email || '')}</small>
        <span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill mt-2 px-3 py-1">
          <i class="bi bi-patch-check-fill me-1"></i> Verified Guest Member
        </span>
      </div>

      <div class="mb-4">
        <div class="small fw-bold text-uppercase text-muted px-2 mb-2" style="font-size: 11px; letter-spacing: 0.08em;">Customer Account</div>
        <a href="${relPrefix}guest/dashboard.html" class="drawer-nav-item">
          <i class="bi bi-speedometer2 text-success fs-5"></i>
          <div>
            <div class="fw-semibold">Customer Dashboard</div>
            <small class="text-muted d-block">Overview, quick stats & recent activity</small>
          </div>
        </a>
        <a href="${relPrefix}guest/bookings.html" class="drawer-nav-item">
          <i class="bi bi-calendar-check text-primary fs-5"></i>
          <div>
            <div class="fw-semibold">My Reservations</div>
            <small class="text-muted d-block">Confirmed stays, invoices & vouchers</small>
          </div>
        </a>
        <a href="#" class="drawer-nav-item open-wishlist-from-drawer">
          <i class="bi bi-heart text-danger fs-5"></i>
          <div>
            <div class="fw-semibold">Saved Stays</div>
            <small class="text-muted d-block">Manage your saved retreats</small>
          </div>
        </a>
        <a href="${relPrefix}guest/profile.html" class="drawer-nav-item">
          <i class="bi bi-person-gear text-secondary fs-5"></i>
          <div>
            <div class="fw-semibold">Guest Profile</div>
            <small class="text-muted d-block">Personal details, preferences & security</small>
          </div>
        </a>
      </div>

      <div class="pt-3 border-top mt-auto">
        <button type="button" class="btn btn-outline-danger w-100 py-2 drawer-signout-btn d-flex align-items-center justify-content-center gap-2">
          <i class="bi bi-box-arrow-right"></i>
          <span>Sign Out</span>
        </button>
      </div>
    `;

    // Sign out handler
    container.querySelector('.drawer-signout-btn')?.addEventListener('click', () => {
      if (window.VerdantDB) {
        VerdantDB.logout();
      }
      showToast('Signed out successfully.', 'info', 'Logged Out');
      initNavbarAuth();
      renderAuthDrawer('signin');
      if (typeof window.updateBookingAuthState === 'function') {
        window.updateBookingAuthState();
      }
      if (path.includes('/guest/')) {
        setTimeout(() => {
          window.location.href = `${relPrefix}index.html`;
        }, 350);
      }
    });

    // Wishlist shortcut from inside auth drawer
    container.querySelector('.open-wishlist-from-drawer')?.addEventListener('click', (e) => {
      e.preventDefault();
      closeAuthDrawer();
      setTimeout(() => openWishlistDrawer(), 200);
    });

  } else {
    // Unauthenticated: Top Buttons select [ Sign In ] vs [ Sign Up ]
    container.innerHTML = `
      <!-- Top Tab Switcher Buttons -->
      <div class="auth-drawer-tabs d-flex p-1 rounded-pill mb-4 border bg-light-subtle">
        <button type="button" class="btn btn-sm w-50 rounded-pill auth-tab-btn ${activeTab === 'signin' ? 'active' : 'text-muted'}" id="auth-tab-btn-signin">
          <i class="bi bi-box-arrow-in-right me-1"></i> Sign In
        </button>
        <button type="button" class="btn btn-sm w-50 rounded-pill auth-tab-btn ${activeTab === 'signup' ? 'active' : 'text-muted'}" id="auth-tab-btn-signup">
          <i class="bi bi-person-plus me-1"></i> Sign Up
        </button>
      </div>

      <!-- Sign In Pane -->
      <div id="auth-drawer-pane-signin" style="display: ${activeTab === 'signin' ? 'block' : 'none'};">
        <div class="mb-3">
          <h5 class="fw-bold font-serif mb-1">Welcome Back</h5>
          <p class="text-muted small">Sign in to manage your bookings and saved stays.</p>
        </div>

        <!-- Form: NO demo credentials pre-filled -->
        <form id="drawer-signin-form">
          <div class="mb-3">
            <label class="form-label small fw-semibold">Email Address</label>
            <div class="input-group">
              <span class="input-group-text bg-transparent text-muted"><i class="bi bi-envelope"></i></span>
              <input type="email" class="form-control" id="drawer-login-email" placeholder="name@example.com" required autocomplete="email">
            </div>
          </div>
          <div class="mb-3">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <label class="form-label small fw-semibold mb-0">Password</label>
              <a href="${relPrefix}auth/forgot-password.html" class="small text-success text-decoration-none" style="font-size: 12px;">Forgot?</a>
            </div>
            <div class="input-group">
              <span class="input-group-text bg-transparent text-muted"><i class="bi bi-lock"></i></span>
              <input type="password" class="form-control" id="drawer-login-pass" placeholder="Enter your password" required autocomplete="current-password">
              <button class="btn btn-outline-secondary toggle-drawer-pass" type="button"><i class="bi bi-eye"></i></button>
            </div>
          </div>
          <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="drawer-remember" checked>
            <label class="form-check-label small text-muted" for="drawer-remember" style="font-size: 12px;">Remember me</label>
          </div>
          <button type="submit" class="btn btn-verdant w-100 py-2 fw-semibold">
            <i class="bi bi-box-arrow-in-right me-1"></i> Sign In
          </button>
        </form>

        <div class="text-center mt-3 small text-muted">
          Don't have an account? <a href="#" class="text-success fw-bold switch-drawer-tab" data-tab="signup">Sign Up</a>
        </div>
      </div>

      <!-- Sign Up Pane -->
      <div id="auth-drawer-pane-signup" style="display: ${activeTab === 'signup' ? 'block' : 'none'};">
        <div class="mb-3">
          <h5 class="fw-bold font-serif mb-1">Create Guest Account</h5>
          <p class="text-muted small">Join to save favorite retreats and book stays.</p>
        </div>

        <!-- Social Buttons -->
        <button type="button" class="btn btn-outline-secondary w-100 mb-2 py-2 d-flex align-items-center justify-content-center gap-2 drawer-social-btn" data-provider="Google">
          <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/></svg>
          <span class="small fw-semibold">Sign up with Google</span>
        </button>
        <button type="button" class="btn btn-outline-secondary w-100 mb-3 py-2 d-flex align-items-center justify-content-center gap-2 drawer-social-btn" data-provider="Apple">
          <i class="bi bi-apple fs-6"></i>
          <span class="small fw-semibold">Sign up with Apple</span>
        </button>

        <div class="position-relative text-center my-3">
          <hr class="my-0">
          <span class="position-absolute top-50 start-50 translate-middle px-2 small text-muted bg-theme-warm auth-divider-text" style="font-size: 11px;">or register with email</span>
        </div>

        <form id="drawer-signup-form">
          <div class="mb-2">
            <label class="form-label small fw-semibold">Full Name</label>
            <div class="input-group">
              <span class="input-group-text bg-transparent text-muted"><i class="bi bi-person"></i></span>
              <input type="text" class="form-control" id="drawer-reg-name" placeholder="John Doe" required>
            </div>
          </div>
          <div class="mb-2">
            <label class="form-label small fw-semibold">Email Address</label>
            <div class="input-group">
              <span class="input-group-text bg-transparent text-muted"><i class="bi bi-envelope"></i></span>
              <input type="email" class="form-control" id="drawer-reg-email" placeholder="name@example.com" required>
            </div>
          </div>
          <div class="mb-2">
            <label class="form-label small fw-semibold">Phone Number</label>
            <div class="input-group">
              <span class="input-group-text bg-transparent text-muted"><i class="bi bi-telephone"></i></span>
              <input type="tel" class="form-control" id="drawer-reg-phone" placeholder="+1 (555) 000-0000">
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label small fw-semibold">Password</label>
            <div class="input-group">
              <span class="input-group-text bg-transparent text-muted"><i class="bi bi-lock"></i></span>
              <input type="password" class="form-control" id="drawer-reg-pass" placeholder="Create a strong password" required minlength="6">
              <button class="btn btn-outline-secondary toggle-drawer-pass" type="button"><i class="bi bi-eye"></i></button>
            </div>
          </div>
          <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="drawer-reg-terms" required>
            <label class="form-check-label small text-muted" for="drawer-reg-terms" style="font-size: 12px;">
              I agree to the <a href="${relPrefix}terms.html" class="text-success">Terms</a> & <a href="${relPrefix}privacy.html" class="text-success">Privacy Policy</a>
            </label>
          </div>
          <button type="submit" class="btn btn-verdant w-100 py-2 fw-semibold">
            <i class="bi bi-person-plus me-1"></i> Create Account
          </button>
        </form>

        <div class="text-center mt-3 small text-muted">
          Already registered? <a href="#" class="text-success fw-bold switch-drawer-tab" data-tab="signin">Sign In</a>
        </div>
      </div>
    `;

    // Tab buttons event listeners
    const signinTabBtn = container.querySelector('#auth-tab-btn-signin');
    const signupTabBtn = container.querySelector('#auth-tab-btn-signup');
    const signinPane = container.querySelector('#auth-drawer-pane-signin');
    const signupPane = container.querySelector('#auth-drawer-pane-signup');

    function switchAuthTab(tab) {
      if (tab === 'signin') {
        signinTabBtn.classList.add('active');
        signinTabBtn.classList.remove('text-muted');
        signupTabBtn.classList.remove('active');
        signupTabBtn.classList.add('text-muted');
        signinPane.style.display = 'block';
        signupPane.style.display = 'none';
      } else {
        signupTabBtn.classList.add('active');
        signupTabBtn.classList.remove('text-muted');
        signinTabBtn.classList.remove('active');
        signinTabBtn.classList.add('text-muted');
        signupPane.style.display = 'block';
        signinPane.style.display = 'none';
      }
    }

    signinTabBtn?.addEventListener('click', () => switchAuthTab('signin'));
    signupTabBtn?.addEventListener('click', () => switchAuthTab('signup'));

    container.querySelectorAll('.switch-drawer-tab').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthTab(a.getAttribute('data-tab'));
      });
    });

    // Password visibility toggle
    container.querySelectorAll('.toggle-drawer-pass').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.closest('.input-group').querySelector('input');
        if (input) {
          const isPass = input.type === 'password';
          input.type = isPass ? 'text' : 'password';
          btn.innerHTML = `<i class="bi ${isPass ? 'bi-eye-slash' : 'bi-eye'}"></i>`;
        }
      });
    });

    // Social auth buttons
    container.querySelectorAll('.drawer-social-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const provider = btn.getAttribute('data-provider') || 'Google';
        handleDrawerSocialAuth(provider);
      });
    });

    // Sign in form submit
    container.querySelector('#drawer-signin-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = container.querySelector('#drawer-login-email')?.value.trim();
      const pass = container.querySelector('#drawer-login-pass')?.value;
      if (!window.VerdantDB) return;

      const res = VerdantDB.login(email, pass);
      if (res.success) {
        showToast(`Welcome back, ${res.user.name}!`, 'success', 'Signed In');
        initNavbarAuth();
        renderAuthDrawer();
        closeAuthDrawer();
        if (typeof window.updateBookingAuthState === 'function') {
          window.updateBookingAuthState();
        }
      } else {
        showToast(res.message || 'Invalid email or password.', 'danger', 'Authentication Error');
      }
    });

    // Sign up form submit
    container.querySelector('#drawer-signup-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = container.querySelector('#drawer-reg-name')?.value.trim();
      const email = container.querySelector('#drawer-reg-email')?.value.trim();
      const phone = container.querySelector('#drawer-reg-phone')?.value.trim();
      const pass = container.querySelector('#drawer-reg-pass')?.value;
      const terms = container.querySelector('#drawer-reg-terms')?.checked;

      if (!terms) {
        showToast('Please accept the Terms & Conditions.', 'warning', 'Agreement Required');
        return;
      }
      if (!window.VerdantDB) return;

      const res = VerdantDB.register({
        name,
        email,
        phone,
        password: pass,
        role: 'guest'
      });

      if (res.success) {
        showToast(`Account created! Welcome to Verdant Haven, ${res.user.name}.`, 'success', 'Registered');
        initNavbarAuth();
        renderAuthDrawer();
        closeAuthDrawer();
        if (typeof window.updateBookingAuthState === 'function') {
          window.updateBookingAuthState();
        }
      } else {
        showToast(res.message || 'Could not complete registration.', 'danger', 'Registration Error');
      }
    });
  }
}

function handleDrawerSocialAuth(provider) {
  if (!window.VerdantDB) return;
  const inputEmail = prompt(`Please enter your ${provider} account email address to continue:`);
  if (!inputEmail) return;
  const cleanEmail = inputEmail.trim().toLowerCase();
  if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    showToast('Please enter a valid email address.', 'warning', 'Social Sign-In');
    return;
  }

  let user = VerdantDB.getUsers().find(u => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    const defaultName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const regName = prompt(`Enter your full name for this account:`, defaultName) || defaultName;
    const regRes = VerdantDB.register({
      name: regName,
      email: cleanEmail,
      phone: '',
      password: 'SocialUser@' + Math.floor(1000 + Math.random() * 9000),
      role: 'guest',
      avatar: null
    });
    user = regRes.user;
  } else {
    VerdantDB.setCurrentUser(user);
  }

  showToast(`Signed in as ${user.name}!`, 'success', 'Connected');
  initNavbarAuth();
  renderAuthDrawer();
  closeAuthDrawer();
  if (typeof window.updateBookingAuthState === 'function') {
    window.updateBookingAuthState();
  }
}

function openAuthDrawer(tab = 'signin') {
  ensureGlobalDrawers();
  renderAuthDrawer(tab);
  const el = document.getElementById('authDrawer');
  if (el) {
    const body = el.querySelector('#authDrawerBody');
    if (body) body.scrollTop = 0;
    if (window.bootstrap && bootstrap.Offcanvas) {
      const bsOff = bootstrap.Offcanvas.getOrCreateInstance(el);
      bsOff.show();
    }
  }
}

function closeAuthDrawer() {
  const el = document.getElementById('authDrawer');
  if (el && window.bootstrap && bootstrap.Offcanvas) {
    const bsOff = bootstrap.Offcanvas.getInstance(el);
    if (bsOff) bsOff.hide();
  }
}

// Expose drawers to global window scope
window.openAuthDrawer = openAuthDrawer;
window.closeAuthDrawer = closeAuthDrawer;

/* ==========================================
   WISHLIST DRAWER RENDERING (Right-to-Left)
========================================== */
function renderWishlistDrawer() {
  const container = document.getElementById('wishlistDrawerBody');
  const footer = document.getElementById('wishlistDrawerFooter');
  const countEl = document.getElementById('wishlist-drawer-count');
  if (!container || !window.VerdantDB) return;

  const path = window.location.pathname.toLowerCase();
  const isSubdir = path.includes('/guest/') || path.includes('/booking/') || path.includes('/blog/') || path.includes('/auth/') || path.includes('/errors/');
  const relPrefix = isSubdir ? '../' : '';

  const list = VerdantDB.getWishlist();
  if (countEl) countEl.textContent = list.length;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5 px-3">
        <div class="rounded-circle bg-light-subtle border d-inline-flex align-items-center justify-content-center mb-3" style="width: 70px; height: 70px;">
          <i class="bi bi-heart text-muted fs-1"></i>
        </div>
        <h5 class="fw-bold mb-2 font-serif">No Saved Stays Yet</h5>
        <p class="text-muted small mb-4">Click the heart icon on any countryside retreat or farmstay to save it to your personal collection.</p>
        <a href="${relPrefix}stays.html" class="btn btn-verdant btn-sm px-4 py-2">
          <i class="bi bi-compass me-1"></i> Explore Stays
        </a>
      </div>
    `;
    if (footer) {
      footer.innerHTML = `
        <div class="text-center small text-muted">
          Your saved items are preserved locally on this device.
        </div>
      `;
    }
    return;
  }

  // Render items
  let itemsHtml = '';
  list.forEach(propId => {
    const p = VerdantDB.getProperty(propId);
    if (!p) return;
    const rawThumb = (p.images && p.images[0]) || 'assets/images/whispering-pines.jpg';
    const thumb = (window.VerdantDB && VerdantDB.resolveImagePath) ? VerdantDB.resolveImagePath(rawThumb) : rawThumb;
    itemsHtml += `
      <div class="card border rounded-3 mb-3 overflow-hidden wishlist-drawer-item shadow-sm" data-property-id="${p.id}">
        <div class="row g-0 align-items-center">
          <div class="col-4">
            <img src="${thumb}" alt="${escapeHTML(p.name)}" class="img-fluid w-100" style="height: 96px; object-fit: cover;">
          </div>
          <div class="col-8">
            <div class="card-body p-2 d-flex flex-column justify-content-between" style="min-height: 96px;">
              <div>
                <div class="d-flex justify-content-between align-items-start">
                  <h6 class="card-title fw-bold font-serif mb-1 text-truncate" style="font-size: 14px;">
                    <a href="${relPrefix}stay-details.html?id=${p.id}" class="text-decoration-none text-dark">${escapeHTML(p.name)}</a>
                  </h6>
                  <button type="button" class="btn btn-sm text-danger p-0 ms-1 border-0 drawer-remove-wishlist" data-property-id="${p.id}" title="Remove from Saved">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
                <div class="small text-muted text-truncate mb-1" style="font-size: 12px;">
                  <i class="bi bi-geo-alt-fill text-danger me-1"></i>${escapeHTML(p.location)}
                </div>
              </div>
              <div class="d-flex justify-content-between align-items-center mt-1">
                <span class="fw-bold text-success" style="font-size: 13px;">$${p.price}<span class="text-muted fw-normal" style="font-size: 11px;">/nt</span></span>
                <a href="${relPrefix}booking/booking.html?id=${p.id}" class="btn btn-sm btn-verdant py-0 px-2" style="font-size: 12px;">
                  Book Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = itemsHtml;

  // Render footer
  if (footer) {
    footer.innerHTML = `
      <div class="d-flex gap-2">
        <a href="${relPrefix}guest/wishlist.html" class="btn btn-verdant-outline btn-sm flex-grow-1">
          <i class="bi bi-heart-fill text-danger me-1"></i> Full Wishlist Page
        </a>
        <button type="button" class="btn btn-sm btn-outline-danger drawer-clear-wishlist" title="Clear all saved items">
          <i class="bi bi-trash3"></i> Clear
        </button>
      </div>
    `;

    footer.querySelector('.drawer-clear-wishlist')?.addEventListener('click', () => {
      VerdantDB.saveWishlist([]);
      updateWishlistBadge();
      syncAllWishlistButtons();
      renderWishlistDrawer();
      showToast('Cleared all saved items.', 'info', 'Wishlist');
      if (typeof renderWishlistPage === 'function') {
        renderWishlistPage();
      }
    });
  }

  // Remove buttons inside drawer
  container.querySelectorAll('.drawer-remove-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pid = btn.getAttribute('data-property-id');
      if (pid) {
        VerdantDB.toggleWishlist(pid);
        updateWishlistBadge();
        syncAllWishlistButtons();
        renderWishlistDrawer();
        const p = VerdantDB.getProperty(pid);
        showToast(`Removed "${p ? p.name : 'Stay'}" from saved items.`, 'info', 'Wishlist');
        if (typeof renderWishlistPage === 'function') {
          renderWishlistPage();
        }
      }
    });
  });
}

function openWishlistDrawer() {
  ensureGlobalDrawers();
  renderWishlistDrawer();
  const el = document.getElementById('wishlistDrawer');
  if (el) {
    const body = el.querySelector('#wishlistDrawerBody');
    if (body) body.scrollTop = 0;
    if (window.bootstrap && bootstrap.Offcanvas) {
      const bsOff = bootstrap.Offcanvas.getOrCreateInstance(el);
      bsOff.show();
    }
  }
}

function closeWishlistDrawer() {
  const el = document.getElementById('wishlistDrawer');
  if (el && window.bootstrap && bootstrap.Offcanvas) {
    const bsOff = bootstrap.Offcanvas.getInstance(el);
    if (bsOff) bsOff.hide();
  }
}

window.openWishlistDrawer = openWishlistDrawer;
window.closeWishlistDrawer = closeWishlistDrawer;

/* ==========================================
   NAVBAR AUTH STATE (Sign In vs Customer Dashboard)
========================================== */
function initNavbarAuth() {
  const authContainer = document.getElementById('nav-auth-container');
  if (!authContainer) return;

  const user = window.VerdantDB ? VerdantDB.getCurrentUser() : null;

  // Determine relative path prefix based on subdirectory
  const path = window.location.pathname.toLowerCase();
  const isSubdir = path.includes('/guest/') || path.includes('/booking/') || path.includes('/blog/') || path.includes('/auth/') || path.includes('/errors/');
  const relPrefix = isSubdir ? '../' : '';

  if (user) {
    // LOGGED IN: Show personalized account avatar/button that triggers the left-to-right Auth/Account Drawer
    const userName = user.name || 'Guest Member';
    const firstName = userName.split(' ')[0];
    const avatarUrl = window.VerdantDB ? VerdantDB.getUserAvatar(user, 48) : '';

    authContainer.innerHTML = `
      <div class="nav-account-wrapper d-inline-flex align-items-center">
        <button type="button" class="nav-account-btn" id="nav-account-trigger" data-bs-toggle="offcanvas" data-bs-target="#authDrawer" title="My Account (${escapeHTML(userName)})" aria-label="My Account">
          <div class="nav-avatar-circle position-relative">
            <img src="${avatarUrl}" alt="${escapeHTML(userName)}" class="nav-avatar-img">
            <span class="nav-avatar-dot" title="Active"></span>
          </div>
          <span class="nav-account-label d-none d-md-inline">${escapeHTML(firstName)}</span>
          <i class="bi bi-chevron-down d-none d-md-inline nav-account-chevron"></i>
        </button>
      </div>
    `;

      authContainer.querySelector('#nav-account-trigger')?.addEventListener('click', (e) => {
        e.preventDefault();
        openAuthDrawer();
      });
    } else {
      // NOT LOGGED IN / INITIAL: Show ONLY the Sign In button which pops LEFT drawer
      authContainer.innerHTML = `
      <button type="button" class="btn btn-verdant btn-sm px-3 d-inline-flex align-items-center gap-1 nav-signin-btn" id="nav-signin-trigger" data-bs-toggle="offcanvas" data-bs-target="#authDrawer" title="Sign In or Register" aria-label="Sign In">
        <i class="bi bi-box-arrow-in-right"></i>
        <span>Sign In</span>
      </button>
    `;

      authContainer.querySelector('#nav-signin-trigger')?.addEventListener('click', (e) => {
        e.preventDefault();
        openAuthDrawer('signin');
      });
    }
}

  function escapeHTML(str) {
    return String(str || '').replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  /* ==========================================
     ACTIVE NAVIGATION HIGHLIGHT
  ========================================== */
  function highlightActiveNav() {
    const currentPath = window.location.pathname.toLowerCase();
    document.querySelectorAll('.nav-link, .sidebar-link').forEach(link => {
      const href = (link.getAttribute('href') || '').toLowerCase();
      if (href && (currentPath.endsWith(href) || (href === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('index.html'))))) {
        link.classList.add('active');
      }
    });
  }

  /* ==========================================
     WISHLIST HANDLERS & BADGE
  ========================================== */
  function updateWishlistBadge() {
    if (!window.VerdantDB) return;
    const list = VerdantDB.getWishlist();
    document.querySelectorAll('.wishlist-counter').forEach(el => {
      el.textContent = list.length;
      el.style.display = list.length > 0 ? 'flex' : 'none';
    });
    const drawerCount = document.getElementById('wishlist-drawer-count');
    if (drawerCount) drawerCount.textContent = list.length;
  }

  function syncAllWishlistButtons() {
    if (!window.VerdantDB) return;
    const list = VerdantDB.getWishlist();
    document.querySelectorAll('.property-wishlist-btn').forEach(btn => {
      const propId = btn.getAttribute('data-property-id') || btn.closest('[data-property-id]')?.getAttribute('data-property-id');
      if (propId) {
        const isWish = list.includes(propId);
        btn.classList.toggle('active', isWish);
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = isWish ? 'bi bi-heart-fill text-danger' : 'bi bi-heart';
        }
      }
    });
  }

  function setupGlobalWishlistTriggers() {
    document.addEventListener('click', (e) => {
      // 1. Intercept navbar & footer wishlist triggers -> pop RIGHT drawer (right to left)
      const wishlistTrigger = e.target.closest('.wishlist-nav-btn, .footer-wishlist-trigger, [data-drawer="wishlist"], .verdant-footer a[href*="wishlist.html"]');
      if (wishlistTrigger) {
        e.preventDefault();
        e.stopPropagation();
        openWishlistDrawer();
        return;
      }

      // 2. Intercept property card wishlist buttons (Save item button)
      const btn = e.target.closest('.property-wishlist-btn');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();

        const currentUser = window.VerdantDB ? VerdantDB.getCurrentUser() : null;
        if (!currentUser) {
          showToast('Please sign in to save stays and rooms to your wishlist.', 'info', 'Sign In Required');
          openAuthDrawer('signin');
          return;
        }

        const propId = btn.getAttribute('data-property-id') || btn.closest('[data-property-id]')?.getAttribute('data-property-id');
        if (propId && window.VerdantDB) {
          // Toggle in DB
          const isAdded = VerdantDB.toggleWishlist(propId);

          // Sync buttons on page
          syncAllWishlistButtons();

          // Sync detail page button if present
          const detailBtn = document.getElementById('detail-wishlist-btn');
          if (detailBtn) {
            detailBtn.classList.toggle('active', isAdded);
            detailBtn.innerHTML = isAdded
              ? `<i class="bi bi-heart-fill text-danger me-1"></i> Saved to Wishlist`
              : `<i class="bi bi-heart me-1"></i> Add to Wishlist`;
          }

          updateWishlistBadge();
          const prop = VerdantDB.getProperty(propId);
          const propTitle = prop ? prop.name : 'Stay';

          showToast(
            isAdded
              ? `Saved "${propTitle}" to your collection. Click the heart icon in the navigation bar to view saved stays.`
              : `Removed "${propTitle}" from your collection.`,
            isAdded ? 'success' : 'info',
            isAdded ? 'Saved Stays' : 'Wishlist'
          );

          // Re-render full page wishlist if currently on guest/wishlist.html
          if (typeof renderWishlistPage === 'function') {
            renderWishlistPage();
          }

          // Do NOT pop out the drawer automatically:
          // User can first select/save all their desired rooms & stays,
          // then navigate to saved items whenever ready via the navbar heart icon.
        }
        return;
      }

      // 3. Intercept Sign In button click in navbar -> pop LEFT drawer
      const navSignInBtn = e.target.closest('.nav-signin-btn, #nav-signin-trigger');
      if (navSignInBtn) {
        e.preventDefault();
        e.stopPropagation();
        openAuthDrawer('signin');
        return;
      }

      // 4. Intercept Sign In and Register links in footer or anywhere with auth attributes -> pop LEFT drawer
      const authTrigger = e.target.closest('.footer-auth-trigger, [data-auth-tab], .verdant-footer a[href*="auth/login.html"], .verdant-footer a[href*="auth/register.html"]');
      if (authTrigger) {
        e.preventDefault();
        e.stopPropagation();
        const explicitTab = authTrigger.getAttribute('data-auth-tab');
        const href = (authTrigger.getAttribute('href') || '').toLowerCase();
        const tab = explicitTab || (href.includes('register') ? 'signup' : 'signin');
        openAuthDrawer(tab);
        return;
      }
    });
  }

  /* ==========================================
     TOAST NOTIFICATION ENGINE
  ========================================== */
  function showToast(message, type = 'info', title = 'Verdant Haven') {
    let container = document.getElementById('verdant-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'verdant-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `verdant-toast toast-${type}`;

    let iconClass = 'bi-info-circle-fill text-primary';
    if (type === 'success') iconClass = 'bi-check-circle-fill text-success';
    if (type === 'warning') iconClass = 'bi-exclamation-triangle-fill text-warning';
    if (type === 'danger') iconClass = 'bi-x-circle-fill text-danger';

    toast.innerHTML = `
    <i class="bi ${iconClass} fs-5 mt-1"></i>
    <div class="flex-grow-1">
      <div class="verdant-toast-title">${title}</div>
      <div class="verdant-toast-msg">${message}</div>
    </div>
    <button type="button" class="btn-close ms-2" style="font-size: 11px;" aria-label="Close"></button>
  `;

    const closeBtn = toast.querySelector('.btn-close');
    closeBtn.addEventListener('click', () => {
      toast.remove();
    });

    container.appendChild(toast);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }
    }, 4000);
  }

  /* ==========================================
     DATE INPUT INITIALIZERS
  ========================================== */
  function setupDateInputsDefaults() {
    const checkinInput = document.querySelector('input[name="checkin"], #hero-checkin, #booking-checkin');
    const checkoutInput = document.querySelector('input[name="checkout"], #hero-checkout, #booking-checkout');

    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 5);
    const checkoutDate = new Date();
    checkoutDate.setDate(today.getDate() + 8);

    const formatDate = (d) => d.toISOString().split('T')[0];

    if (checkinInput && !checkinInput.value) {
      checkinInput.value = formatDate(nextWeek);
      checkinInput.min = formatDate(today);
    }
    if (checkoutInput && !checkoutInput.value) {
      checkoutInput.value = formatDate(checkoutDate);
      checkoutInput.min = formatDate(today);
    }
  }

  /* ==========================================
     HERO / MAIN SEARCH FORM
  ========================================== */
  function setupSearchForms() {
    const searchForm = document.querySelector('#hero-search-form, .main-search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const destination = (searchForm.querySelector('[name="destination"]')?.value || '').trim();
        const checkin = searchForm.querySelector('[name="checkin"]')?.value || '';
        const checkout = searchForm.querySelector('[name="checkout"]')?.value || '';
        const guests = searchForm.querySelector('[name="guests"]')?.value || '2';
        const category = searchForm.querySelector('[name="category"]')?.value || '';

        const params = new URLSearchParams();
        if (destination) params.set('location', destination);
        if (checkin) params.set('checkin', checkin);
        if (checkout) params.set('checkout', checkout);
        if (guests) params.set('guests', guests);
        if (category) params.set('category', category);

        // Check current path to determine relative redirect to stays.html
        const currentPath = window.location.pathname;
        const isSubdir = currentPath.includes('/guest/') || currentPath.includes('/booking/') || currentPath.includes('/auth/') || currentPath.includes('/blog/') || currentPath.includes('/errors/');
        const prefix = isSubdir ? '../' : '';

        window.location.href = `${prefix}stays.html?${params.toString()}`;
      });
    }
  }

  /* ==========================================
     DASHBOARD MOBILE SIDEBAR TOGGLE
  ========================================== */
  function toggleDashboardSidebar() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (sidebar) {
      sidebar.classList.toggle('show');
    }
  }

