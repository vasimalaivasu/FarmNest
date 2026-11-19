/**
 * Verdant Haven - Guest Dashboard Module
 * Handles Guest Overview, Bookings, Details, Wishlist, Payments, Profile & Notifications
 * Supports both Authenticated Member Mode and Unauthenticated Guest Demo Mode with Zero Values
 * Connects directly to the Left-to-Right Auth Drawer (offcanvas-start)
 */

document.addEventListener('DOMContentLoaded', () => {
  initGuestAuthProtection();
  initGuestTopbarUser();

  if (document.getElementById('guest-dashboard-overview')) {
    initGuestDashboardOverview();
  }

  if (document.getElementById('guest-bookings-page')) {
    initGuestBookingsPage();
  }

  if (document.getElementById('guest-booking-details-page')) {
    initGuestBookingDetailsPage();
  }

  if (document.getElementById('guest-wishlist-page')) {
    initGuestWishlistPage();
  }

  if (document.getElementById('guest-payments-page')) {
    initGuestPaymentsPage();
  }

  if (document.getElementById('guest-profile-page')) {
    initGuestProfilePage();
  }

  if (document.getElementById('guest-notifications-page')) {
    initGuestNotificationsPage();
  }
});

// Global delegated click listener for any dashboard auth drawer triggers
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-auth-drawer]');
  if (trigger) {
    e.preventDefault();
    const tab = trigger.getAttribute('data-auth-drawer') || 'signin';
    if (typeof window.openAuthDrawer === 'function') {
      window.openAuthDrawer(tab);
    }
  }
});

/**
 * Authentication Guard / Preview Mode Initializer
 * Allows unauthenticated guests to explore dashboard features in demo mode.
 */
function initGuestAuthProtection() {
  // Demo mode is explicitly permitted for unauthenticated visitors.
  // Actions requiring account values/persistence will trigger requireAuthRedirect().
}

/**
 * Helper to notify and open the left-to-right sliding auth drawer
 */
function requireAuthRedirect(featureName, tab = 'signin') {
  if (typeof showToast === 'function') {
    showToast(`Sign in required to ${featureName}.`, 'warning', 'Authentication Required');
  }
  if (typeof window.openAuthDrawer === 'function') {
    window.openAuthDrawer(tab);
  }
}

/**
 * Topbar, Sidebar & Auth State Synchronization
 */
function initGuestTopbarUser() {
  const user = VerdantDB.getCurrentUser();
  const isGuestMode = !user;

  const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='50' fill='%231b4332'/><circle cx='50' cy='38' r='18' fill='%23ffffff'/><path d='M22 84c0-15.5 12.5-28 28-28s28 12.5 28 28' fill='%23ffffff'/></svg>";
  const avatarUrl = user && window.VerdantDB ? VerdantDB.getUserAvatar(user, 120) : defaultAvatar;

  document.querySelectorAll('.current-user-name').forEach(el => {
    el.textContent = user ? (user.name || 'Guest Member') : 'Guest Visitor';
  });
  document.querySelectorAll('.current-user-email').forEach(el => {
    el.textContent = user ? (user.email || '') : 'Not signed in';
  });
  document.querySelectorAll('.current-user-role').forEach(el => {
    el.textContent = user ? (user.role || 'Verified Guest') : 'Preview Mode';
  });
  document.querySelectorAll('.current-user-avatar').forEach(img => {
    img.src = avatarUrl;
    img.alt = user ? (user.name || 'Guest Member') : 'Guest Visitor';
  });

  // Dynamic Dashboard Auth Buttons: Shows Login/Signup before login, removed after login
  updateDashboardAuthControls(isGuestMode);

  // Logout buttons
  document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      VerdantDB.logout();
      showToast('Logged out successfully', 'info', 'Session');
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 400);
    });
  });
}

/**
 * Manages Login/Signup vs Sign Out visibility across dashboard
 */
function updateDashboardAuthControls(isGuestMode) {
  // 1. Dashboard Topbar: Show Sign In / Sign Up button before login, remove after login
  const topbarRight = document.querySelector('.dashboard-topbar-right');
  if (topbarRight) {
    let topbarAuthBtn = topbarRight.querySelector('.dashboard-topbar-auth-btn');
    if (isGuestMode) {
      if (!topbarAuthBtn) {
        topbarAuthBtn = document.createElement('button');
        topbarAuthBtn.type = 'button';
        topbarAuthBtn.className = 'btn btn-verdant btn-sm dashboard-topbar-auth-btn d-inline-flex align-items-center gap-1';
        topbarAuthBtn.setAttribute('data-auth-drawer', 'signin');
        topbarAuthBtn.innerHTML = '<i class="bi bi-box-arrow-in-right"></i> <span class="d-none d-sm-inline">Sign In / Sign Up</span>';
        topbarRight.prepend(topbarAuthBtn);
      }
    } else {
      if (topbarAuthBtn) topbarAuthBtn.remove();
    }
  }

  // 2. Dashboard Sidebar Footer: Show Sign In / Register before login, remove after login
  document.querySelectorAll('.sidebar-footer').forEach(footer => {
    let sidebarAuthBox = footer.querySelector('.dashboard-sidebar-auth-box');
    const logoutBtn = footer.querySelector('.logout-btn');

    if (isGuestMode) {
      if (logoutBtn) logoutBtn.style.display = 'none';
      if (!sidebarAuthBox) {
        sidebarAuthBox = document.createElement('div');
        sidebarAuthBox.className = 'dashboard-sidebar-auth-box d-grid gap-2 mt-2';
        sidebarAuthBox.innerHTML = `
          <button type="button" class="btn btn-sm btn-verdant w-100 d-inline-flex align-items-center justify-content-center gap-1 dashboard-sidebar-signin-btn" data-auth-drawer="signin">
            <i class="bi bi-box-arrow-in-right"></i> Sign In / Register
          </button>
        `;
        footer.appendChild(sidebarAuthBox);
      }
    } else {
      if (sidebarAuthBox) sidebarAuthBox.remove();
      if (logoutBtn) logoutBtn.style.display = '';
    }
  });

  // Remove any preview banner from the dashboard content area
  document.querySelectorAll('.guest-preview-banner').forEach(b => b.remove());
  if (!isGuestMode) {
    document.querySelectorAll('.guest-profile-alert').forEach(b => b.remove());
  }
}

/**
 * Re-renders all active dashboard widgets when auth state changes (e.g. after login from sliding drawer)
 */
window.refreshGuestDashboardState = function () {
  initGuestTopbarUser();
  if (document.getElementById('guest-dashboard-overview')) {
    initGuestDashboardOverview();
  }
  if (document.getElementById('guest-bookings-page')) {
    initGuestBookingsPage();
  }
  if (document.getElementById('guest-booking-details-page')) {
    initGuestBookingDetailsPage();
  }
  if (document.getElementById('guest-wishlist-page')) {
    initGuestWishlistPage();
  }
  if (document.getElementById('guest-payments-page')) {
    initGuestPaymentsPage();
  }
  if (document.getElementById('guest-profile-page')) {
    initGuestProfilePage();
  }
  if (document.getElementById('guest-notifications-page')) {
    initGuestNotificationsPage();
  }
};

/* ===================================================================
   GUEST DASHBOARD OVERVIEW
=================================================================== */
function initGuestDashboardOverview() {
  const user = VerdantDB.getCurrentUser();
  const bookings = user ? VerdantDB.getUserBookings(user.email) : [];
  const wishlist = VerdantDB.getWishlist();

  const upcoming = bookings.filter(b => b.bookingStatus === 'Upcoming' || b.bookingStatus === 'Checked In');
  const completed = bookings.filter(b => b.bookingStatus === 'Completed');
  const cancelled = bookings.filter(b => b.bookingStatus === 'Cancelled');
  const totalSpent = bookings.reduce((sum, b) => b.paymentStatus === 'Paid' ? sum + b.totalAmount : sum, 0);

  // Metrics (Zero values when not logged in)
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setVal('dash-total-bookings', bookings.length);
  setVal('dash-upcoming-bookings', upcoming.length);
  setVal('dash-completed-bookings', completed.length);
  setVal('dash-cancelled-bookings', cancelled.length);
  setVal('dash-total-spent', `$${totalSpent.toLocaleString()}`);
  setVal('dash-wishlist-count', wishlist.length);

  // Highlight Upcoming Reservation Card
  const upcomingCard = document.getElementById('dash-upcoming-reservation-card');
  if (upcomingCard) {
    if (upcoming.length > 0) {
      const topStay = upcoming[0];
      const topStayImg = (window.VerdantDB && VerdantDB.resolveImagePath) ? VerdantDB.resolveImagePath(topStay.propertyImage) : topStay.propertyImage;
      upcomingCard.innerHTML = `
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden" style="background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%); color: #fff;">
          <div class="row g-0 align-items-center">
            <div class="col-md-5">
              <img src="${topStayImg}" class="img-fluid h-100 w-100" style="object-fit: cover; min-height: 220px;" alt="${topStay.propertyName}">
            </div>
            <div class="col-md-7 p-4">
              <span class="badge bg-warning text-dark mb-2"><i class="bi bi-clock-history me-1"></i> Upcoming Stay &bull; #${topStay.id}</span>
              <h3 class="font-serif mb-1">${topStay.propertyName}</h3>
              <p class="text-white-50 small mb-3"><i class="bi bi-geo-alt-fill me-1"></i> ${topStay.location}</p>
              <div class="d-flex flex-wrap gap-3 mb-3 small">
                <div><strong>Check-in:</strong> ${topStay.checkIn}</div>
                <div><strong>Check-out:</strong> ${topStay.checkOut}</div>
                <div><strong>Guests:</strong> ${topStay.adults} Adults</div>
              </div>
              <div class="d-flex gap-2">
                <a href="booking-details.html?id=${topStay.id}" class="btn btn-light btn-sm fw-bold">View Reservation</a>
                <a href="../stay-details.html?id=${topStay.propertyId}" class="btn btn-outline-light btn-sm">Property Guide</a>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      upcomingCard.innerHTML = `
        <div class="card p-4 text-center border rounded-4 bg-white shadow-sm">
          <i class="bi bi-calendar2-range text-muted fs-1 mb-2 d-block"></i>
          <h5 class="font-serif fw-bold mb-1">No Active Reservations</h5>
          <p class="text-muted small mb-3">${user ? "You don't have any upcoming countryside escapes booked yet." : "You are browsing in guest mode with zero values and no account setup. Sign in to view and manage your verified itineraries."}</p>
          <div class="d-flex justify-content-center gap-2">
            ${user ? '' : '<button type="button" class="btn btn-verdant btn-sm px-3" data-auth-drawer="signin"><i class="bi bi-box-arrow-in-right me-1"></i> Sign In</button>'}
            <a href="../stays.html" class="btn ${user ? 'btn-verdant' : 'btn-verdant-outline'} btn-sm px-3">Explore Farmstays & Cottages</a>
          </div>
        </div>
      `;
    }
  }

  // Recent Bookings Table with Interactive Filter Tabs
  const tableBody = document.getElementById('dash-recent-bookings-tbody');
  const bookingFilterBtns = document.querySelectorAll('.dash-booking-filter-btn');
  let currentDashFilter = 'all';

  function renderDashBookings() {
    if (!tableBody) return;
    let filtered = bookings;
    if (currentDashFilter === 'upcoming') {
      filtered = bookings.filter(b => b.bookingStatus === 'Upcoming' || b.bookingStatus === 'Checked In');
    } else if (currentDashFilter === 'completed') {
      filtered = bookings.filter(b => b.bookingStatus === 'Completed');
    } else if (currentDashFilter === 'cancelled') {
      filtered = bookings.filter(b => b.bookingStatus === 'Cancelled');
    }

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-4 text-muted">
            <i class="bi bi-calendar-x d-block fs-3 mb-2 text-muted"></i>
            ${user ? (currentDashFilter === 'all' ? 'No countryside reservations made yet. <a href="../stays.html" class="text-success fw-bold ms-1">Book your first stay</a>' : `No ${currentDashFilter} reservations found.`) : 'No reservations found in guest preview mode. <a href="#" class="text-success fw-bold ms-1" data-auth-drawer="signin">Sign In</a> to view your account history.'}
          </td>
        </tr>
      `;
    } else {
      tableBody.innerHTML = filtered.slice(0, 6).map(b => `
            <tr>
          <td><strong>#${b.id}</strong></td>
          <td>
            <div class="d-flex align-items-center gap-2">
              <img src="${(window.VerdantDB && VerdantDB.resolveImagePath) ? VerdantDB.resolveImagePath(b.propertyImage) : b.propertyImage}" class="rounded-2" style="width: 44px; height: 38px; object-fit: cover;">
              <div>
                <div class="fw-bold">${b.propertyName}</div>
                <small class="text-muted">${b.roomType || 'Standard Haven'}</small>
              </div>
            </div>
          </td>
          <td>${b.checkIn}</td>
          <td>${b.nights} Nts</td>
          <td><strong>$${b.totalAmount}</strong></td>
          <td>${getStatusBadge(b.bookingStatus)}</td>
          <td>
            <div class="d-inline-flex gap-1">
              <a href="booking-details.html?id=${b.id}" class="btn btn-sm btn-verdant-outline py-1 px-2" title="View Reservation Voucher">
                <i class="bi bi-file-earmark-text"></i>
              </a>
              <a href="payments.html" class="btn btn-sm btn-outline-secondary py-1 px-2" title="Payment Receipt">
                <i class="bi bi-receipt"></i>
              </a>
            </div>
          </td>
        </tr>
            `).join('');
    }
  }

  bookingFilterBtns.forEach(btn => {
    btn.onclick = () => {
      bookingFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDashFilter = btn.getAttribute('data-filter') || 'all';
      renderDashBookings();
    };
  });
  renderDashBookings();

  // Quick Date Booking & Escape Planner Widget Setup
  const quickBookForm = document.getElementById('dash-quick-book-form');
  const propSelect = document.getElementById('dash-book-property');
  const checkinInput = document.getElementById('dash-book-checkin');
  const checkoutInput = document.getElementById('dash-book-checkout');
  const guestsSelect = document.getElementById('dash-book-guests');

  const allProps = (window.VerdantDB && VerdantDB.getProperties) ? VerdantDB.getProperties() : [];

  if (propSelect && allProps.length > 0) {
    propSelect.innerHTML = allProps.map(p => `
            <option value="${p.id}"> ${p.name} &mdash; ${p.location} (from $${p.price} /nt)</option>
              `).join('');
  }

  // Set default dates for quick booking (check-in +3 days, check-out +6 days)
  const today = new Date();
  const defIn = new Date();
  defIn.setDate(today.getDate() + 3);
  const defOut = new Date();
  defOut.setDate(today.getDate() + 6);
  const formatDate = d => d.toISOString().split('T')[0];

  if (checkinInput) {
    checkinInput.value = formatDate(defIn);
    checkinInput.min = formatDate(today);
    checkinInput.onchange = () => {
      if (checkinInput.value && checkoutInput) {
        const nextDay = new Date(checkinInput.value);
        nextDay.setDate(nextDay.getDate() + 1);
        checkoutInput.min = formatDate(nextDay);
        if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
          checkoutInput.value = formatDate(nextDay);
        }
      }
    };
  }

  if (checkoutInput) {
    checkoutInput.value = formatDate(defOut);
    const minOut = new Date(defIn);
    minOut.setDate(minOut.getDate() + 1);
    checkoutInput.min = formatDate(minOut);
  }

  if (quickBookForm) {
    quickBookForm.onsubmit = (e) => {
      e.preventDefault();
      const selectedProp = propSelect ? propSelect.value : (allProps[0]?.id || 'prop-1');
      const inDate = checkinInput ? checkinInput.value : '';
      const outDate = checkoutInput ? checkoutInput.value : '';
      const guests = guestsSelect ? guestsSelect.value : '2';

      if (!inDate || !outDate) {
        showToast('Please select both check-in and check-out dates.', 'warning', 'Dates Required');
        return;
      }
      if (new Date(outDate) <= new Date(inDate)) {
        showToast('Check-out date must be after check-in date.', 'warning', 'Invalid Dates');
        return;
      }

      showToast('Checking availability & preparing your reservation checkout...', 'info', 'Reservation Booking');
      setTimeout(() => {
        window.location.href = `../booking/booking.html?id=${encodeURIComponent(selectedProp)}&checkin=${encodeURIComponent(inDate)}&checkout=${encodeURIComponent(outDate)}&guests=${encodeURIComponent(guests)}`;
      }, 350);
    };
  }

  // Browse Stays Grid & Category Filter Chips
  const browseGrid = document.getElementById('dash-browse-stays-grid');
  const catFilterBtns = document.querySelectorAll('.dash-stay-cat');
  let currentStayCategory = 'all';

  function renderBrowseStays() {
    if (!browseGrid || allProps.length === 0) return;
    let stays = allProps;
    if (currentStayCategory !== 'all') {
      stays = allProps.filter(p => (p.category || '').toLowerCase().includes(currentStayCategory.toLowerCase()));
    }

    browseGrid.innerHTML = stays.slice(0, 6).map(p => {
      const rawImg = (p.images && p.images.length > 0) ? p.images[0] : (p.image || 'assets/images/whispering-pines.jpg');
      const imgPath = (window.VerdantDB && VerdantDB.resolveImagePath) ? VerdantDB.resolveImagePath(rawImg) : rawImg;
      const features = (p.amenities || ['Organic Breakfast', 'Animal Feeding', 'Fireplace']).slice(0, 3);
      return `
            <div class="col-md-6 col-xl-4">
              <div class="card border rounded-4 overflow-hidden h-100 shadow-sm bg-theme-surface property-card">
                <div class="property-thumb position-relative" style="height: 200px; overflow: hidden;">
                  <img src="${imgPath}" class="w-100 h-100" style="object-fit: cover;" alt="${p.name}">
                    <span class="badge bg-dark bg-opacity-75 text-white position-absolute top-0 start-0 m-3 px-2 py-1 rounded-pill small">
                      ${p.category || 'Homestay'}
                    </span>
                    <span class="badge bg-warning text-dark position-absolute top-0 end-0 m-3 px-2 py-1 rounded-pill small fw-bold">
                      <i class="bi bi-star-fill text-dark me-1"></i>${p.rating || 4.9}
                    </span>
                </div>
                <div class="card-body p-3 d-flex flex-column justify-content-between">
                  <div>
                    <h6 class="font-serif fw-bold mb-1 text-truncate">${p.name}</h6>
                    <p class="text-muted small mb-2 text-truncate"><i class="bi bi-geo-alt me-1 text-success"></i>${p.location}</p>
                    <div class="d-flex flex-wrap gap-1 mb-3">
                      ${features.map(f => `<span class="badge bg-light text-secondary border small" style="font-size: 11px;">${f}</span>`).join('')}
                    </div>
                  </div>
                  <div class="pt-2 border-top d-flex justify-content-between align-items-center">
                    <div>
                      <span class="fs-5 fw-bold text-success">$${p.price}</span>
                      <small class="text-muted">/ night</small>
                    </div>
                    <div class="d-flex gap-2">
                      <a href="../stay-details.html?id=${p.id}" class="btn btn-sm btn-outline-secondary" title="View Property Guide">Details</a>
                      <button type="button" class="btn btn-sm btn-verdant dash-book-stay-btn" data-prop-id="${p.id}" title="Book dates for this stay">
                        <i class="bi bi-calendar-plus me-1"></i>Book
                      </button>
                    </div>
                  </div>
                </div>
              </div>
        </div>
            `;
    }).join('');

    // Wire up "Book" buttons on each stay card to select this stay in the date booking form
    browseGrid.querySelectorAll('.dash-book-stay-btn').forEach(b => {
      b.onclick = () => {
        const pId = b.getAttribute('data-prop-id');
        if (propSelect && pId) {
          propSelect.value = pId;
          quickBookForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          quickBookForm?.classList.add('border-success', 'shadow');
          setTimeout(() => quickBookForm?.classList.remove('border-success', 'shadow'), 1600);
          showToast('Stay selected in booking planner above. Pick your dates to reserve!', 'success', 'Haven Selected');
        }
      };
    });
  }

  catFilterBtns.forEach(btn => {
    btn.onclick = () => {
      catFilterBtns.forEach(b => {
        b.classList.remove('btn-verdant', 'active');
        b.classList.add('btn-outline-secondary');
      });
      btn.classList.remove('btn-outline-secondary');
      btn.classList.add('btn-verdant', 'active');
      currentStayCategory = btn.getAttribute('data-category') || 'all';
      renderBrowseStays();
    };
  });
  renderBrowseStays();

  // Payments & Billing Management Table Setup
  const paymentsTableBody = document.getElementById('dash-payments-tbody');
  if (paymentsTableBody) {
    if (bookings.length === 0) {
      paymentsTableBody.innerHTML = `
            <tr>
            <td colspan="8" class="text-center py-4 text-muted">
              <i class="bi bi-credit-card-2-front fs-3 d-block mb-1 text-muted"></i>
              ${user ? 'No billing transactions recorded yet. Completed bookings will generate tax invoices and receipts here.' : 'No transactions found in guest preview mode. <a href="#" class="text-success fw-bold ms-1" data-auth-drawer="signin">Sign In</a> to manage payment methods and view tax receipts.'}
            </td>
        </tr>
            `;
    } else {
      paymentsTableBody.innerHTML = bookings.slice(0, 5).map(b => `
            <tr>
          <td><code class="text-success fw-bold">TXN-${b.id}</code></td>
          <td><strong>#${b.id}</strong></td>
          <td>
            <div class="fw-semibold text-truncate" style="max-width: 180px;">${b.propertyName}</div>
            <small class="text-muted">${b.roomType || 'Master Suite'}</small>
          </td>
          <td>${b.checkIn}</td>
          <td><i class="bi bi-credit-card me-1 text-muted"></i>${b.paymentMethod || 'Credit Card'}</td>
          <td><strong class="text-success">$${b.totalAmount}</strong></td>
          <td>
            <span class="badge ${b.paymentStatus === 'Paid' ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-warning-subtle text-warning border border-warning-subtle'}">
              ${b.paymentStatus || 'Paid'}
            </span>
          </td>
          <td>
            <a href="booking-details.html?id=${b.id}" class="btn btn-sm btn-verdant-outline py-1 px-2" title="Download Tax Invoice & Receipt">
              <i class="bi bi-download me-1"></i> Receipt
            </a>
          </td>
        </tr>
            `).join('');
    }
  }
}

/* ===================================================================
   GUEST BOOKINGS PAGE
=================================================================== */
function initGuestBookingsPage() {
  const container = document.getElementById('guest-bookings-list');
  const filterTabs = document.querySelectorAll('.booking-filter-tab');
  let currentFilter = 'all';

  function renderList() {
    const user = VerdantDB.getCurrentUser();
    let bookings = user ? VerdantDB.getUserBookings(user.email) : [];
    if (currentFilter !== 'all') {
      bookings = bookings.filter(b => b.bookingStatus.toLowerCase() === currentFilter.toLowerCase());
    }

    if (bookings.length === 0) {
      container.innerHTML = `
            <div class="text-center py-5">
          <i class="bi bi-calendar-x text-muted" style="font-size: 3rem;"></i>
          <h5 class="mt-3 font-serif">${user ? 'No bookings found in this category' : 'No Bookings in Guest Mode'}</h5>
          <p class="text-muted">${user ? 'Explore our curated farmstays and discover your next retreat.' : 'You are browsing in preview mode with zero values and no account setup. Sign in to view and manage your reservations.'}</p>
          <div class="d-flex justify-content-center gap-2 mt-3">
            ${user ? '' : '<button type="button" class="btn btn-verdant btn-sm" data-auth-drawer="signin"><i class="bi bi-box-arrow-in-right me-1"></i> Sign In to View Bookings</button>'}
            <a href="../stays.html" class="btn ${user ? 'btn-verdant' : 'btn-verdant-outline'} btn-sm">Explore Stays</a>
          </div>
        </div>
            `;
      return;
    }

    container.innerHTML = bookings.map(b => `
            <div class="card border rounded-3 mb-3 overflow-hidden shadow-sm">
              <div class="card-body p-4">
                <div class="row align-items-center">
                  <div class="col-md-2 mb-3 mb-md-0">
                    <img src="${(window.VerdantDB && VerdantDB.resolveImagePath) ? VerdantDB.resolveImagePath(b.propertyImage) : b.propertyImage}" class="rounded-3 w-100" style="height: 95px; object-fit: cover;" alt="${b.propertyName}">
                  </div>
                  <div class="col-md-4 mb-3 mb-md-0">
                    <div class="d-flex align-items-center gap-2 mb-1">
                      <span class="badge bg-light text-dark border">#${b.id}</span>
                      ${getStatusBadge(b.bookingStatus)}
                    </div>
                    <h5 class="font-serif mb-1">${b.propertyName}</h5>
                    <small class="text-muted"><i class="bi bi-geo-alt"></i> ${b.location}</small>
                  </div>
                  <div class="col-md-3 mb-3 mb-md-0">
                    <div class="small text-muted">Dates & Stay</div>
                    <div class="fw-bold">${b.checkIn} &rarr; ${b.checkOut}</div>
                    <small class="text-muted">${b.nights} Nights &bull; ${b.adults} Adults</small>
                  </div>
                  <div class="col-md-3 text-md-end">
                    <div class="small text-muted">Total Paid</div>
                    <div class="fs-5 fw-bold text-success mb-2">$${b.totalAmount}</div>
                    <div class="d-flex justify-content-md-end gap-2">
                      <a href="booking-details.html?id=${b.id}" class="btn btn-verdant-outline btn-sm">Details</a>
                      ${b.bookingStatus === 'Upcoming' ? `
                  <button class="btn btn-outline-danger btn-sm" onclick="openCancelModal('${b.id}')">Cancel</button>
                ` : ''}
                    </div>
                  </div>
                </div>
              </div>
      </div>
            `).join('');
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.getAttribute('data-status') || 'all';
      renderList();
    });
  });

  renderList();
}

// Cancel Booking Modal Handler
window.openCancelModal = function (id) {
  const user = VerdantDB.getCurrentUser();
  if (!user) {
    requireAuthRedirect('cancel or manage reservations', 'signin');
    return;
  }
  if (confirm(`Are you sure you wish to cancel reservation #${id}? A refund will be initiated per host policy.`)) {
    VerdantDB.updateBookingStatus(id, 'Cancelled');
    showToast(`Reservation #${id} has been cancelled.`, 'warning', 'Booking Cancelled');
    if (document.getElementById('guest-bookings-page')) {
      initGuestBookingsPage();
    } else {
      location.reload();
    }
  }
};

/* ===================================================================
   GUEST BOOKING DETAILS PAGE
=================================================================== */
function initGuestBookingDetailsPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const user = VerdantDB.getCurrentUser();
  const userBookings = user ? VerdantDB.getUserBookings(user.email) : [];
  const booking = userBookings.find(b => b.id === id) || (id ? VerdantDB.getBooking(id) : null);

  if (!booking) {
    const main = document.querySelector('.dashboard-content');
    if (main) {
      main.innerHTML = `
            <div class="card p-5 text-center border rounded-4 bg-white shadow-sm my-4">
          <i class="bi bi-calendar-x text-muted fs-1 mb-2"></i>
          <h4 class="font-serif">Reservation Not Found</h4>
          <p class="text-muted">${user ? 'This booking does not exist or does not belong to your account.' : 'You are currently browsing in Guest Preview Mode with zero values. Sign in to access your verified reservation vouchers.'}</p>
          <div class="d-flex justify-content-center gap-2 mt-3">
            ${user ? '' : '<button type="button" class="btn btn-verdant btn-sm px-4" data-auth-drawer="signin"><i class="bi bi-box-arrow-in-right me-1"></i> Sign In</button>'}
            <a href="bookings.html" class="btn btn-verdant-outline btn-sm px-4">Back to My Bookings</a>
          </div>
        </div>
            `;
    }
    return;
  }

  const setT = (elemId, text) => {
    const el = document.getElementById(elemId);
    if (el) el.textContent = text;
  };

  setT('detail-book-id', booking.id);
  setT('detail-prop-title', booking.propertyName);
  setT('detail-prop-location', booking.location);
  setT('detail-room-type', booking.roomType);
  setT('detail-checkin-date', booking.checkIn);
  setT('detail-checkout-date', booking.checkOut);
  setT('detail-nights-count', `${booking.nights} Nights`);
  setT('detail-guests-count', `${booking.adults} Adults${booking.children ? `, ${booking.children} Children` : ''} `);
  setT('detail-subtotal', `$${booking.subtotal} `);
  setT('detail-cleaning', `$${booking.cleaningFee} `);
  setT('detail-tax', `$${booking.tax} `);
  setT('detail-discount', `- $${booking.discount} `);
  setT('detail-total', `$${booking.totalAmount} `);
  setT('detail-payment-method', booking.paymentMethod);
  setT('detail-payment-status', booking.paymentStatus);
  setT('detail-special-requests', booking.specialRequests || 'None provided');

  const statusBadgeContainer = document.getElementById('detail-status-badge');
  if (statusBadgeContainer) {
    statusBadgeContainer.innerHTML = getStatusBadge(booking.bookingStatus);
  }

  const propImg = document.getElementById('detail-prop-image');
  if (propImg) propImg.src = (window.VerdantDB && VerdantDB.resolveImagePath) ? VerdantDB.resolveImagePath(booking.propertyImage) : booking.propertyImage;

  // Print button
  const printBtn = document.getElementById('print-receipt-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      if (!user) {
        requireAuthRedirect('download or print verified booking invoices', 'signin');
        return;
      }
      window.print();
    });
  }

  // Cancel reservation button
  const cancelBtn = document.getElementById('detail-cancel-btn');
  if (cancelBtn) {
    if (booking.bookingStatus === 'Upcoming') {
      cancelBtn.addEventListener('click', () => openCancelModal(booking.id));
    } else {
      cancelBtn.style.display = 'none';
    }
  }
}

/* ===================================================================
   GUEST WISHLIST PAGE
=================================================================== */
function initGuestWishlistPage() {
  const container = document.getElementById('guest-wishlist-container');
  if (!container) return;

  function renderWishlist() {
    const wishlistIds = VerdantDB.getWishlist();
    const allProps = VerdantDB.getProperties();
    const wishProps = allProps.filter(p => wishlistIds.includes(p.id));

    if (wishProps.length === 0) {
      container.innerHTML = `
            <div class="col-12 py-5 text-center">
          <i class="bi bi-heart text-muted" style="font-size: 3.5rem;"></i>
          <h4 class="mt-3">Your wishlist is empty</h4>
          <p class="text-muted">Save your favorite countryside retreats to easily plan your future vacations.</p>
          <a href="../stays.html" class="btn btn-verdant btn-sm mt-2">Explore Countryside Stays</a>
        </div>
            `;
      return;
    }

    container.innerHTML = wishProps.map(p => {
      const imgSrc = (window.VerdantDB && VerdantDB.resolveImagePath) ? VerdantDB.resolveImagePath(p.images[0]) : p.images[0];
      return `
            <div class="col-md-6 col-lg-4 mb-4">
              <div class="property-card h-100">
                <div class="property-thumb">
                  <img src="${imgSrc}" alt="${p.name}">
                    <div class="property-badge-group">
                      <span class="badge-category">${p.category}</span>
                    </div>
                    <button class="property-wishlist-btn active" data-property-id="${p.id}" title="Remove from Wishlist">
                      <i class="bi bi-heart-fill text-danger"></i>
                    </button>
                </div>
                <div class="property-body">
                  <div class="property-location"><i class="bi bi-geo-alt-fill text-danger"></i> ${p.location}</div>
                  <h5 class="property-title"><a href="../stay-details.html?id=${p.id}">${p.name}</a></h5>
                  <div class="property-features">
                    <div class="property-feature-item"><i class="bi bi-people"></i> ${p.guests} Guests</div>
                    <div class="property-feature-item"><i class="bi bi-door-open"></i> ${p.bedrooms} Beds</div>
                    <div class="property-feature-item"><i class="bi bi-droplet"></i> ${p.bathrooms} Baths</div>
                  </div>
                  <div class="property-footer">
                    <div class="property-price">$${p.price} <span>/ night</span></div>
                    <div class="property-rating"><i class="bi bi-star-fill text-warning"></i> ${p.rating}</div>
                  </div>
                  <div class="d-flex gap-2 mt-3 pt-2 border-top">
                    <a href="../stay-details.html?id=${p.id}" class="btn btn-verdant-outline btn-sm flex-grow-1">Details</a>
                    <a href="../booking/booking.html?id=${p.id}" class="btn btn-verdant btn-sm flex-grow-1">Book Now</a>
                  </div>
                </div>
              </div>
      </div>
            `;
    }).join('');
  }

  renderWishlist();

  // Listen for wishlist changes
  document.addEventListener('click', (e) => {
    if (e.target.closest('.property-wishlist-btn')) {
      setTimeout(renderWishlist, 100);
    }
  });
}

/* ===================================================================
   GUEST PAYMENTS PAGE
=================================================================== */
function initGuestPaymentsPage() {
  const tbody = document.getElementById('guest-payments-tbody');
  if (!tbody) return;

  const user = VerdantDB.getCurrentUser();
  const bookings = user ? VerdantDB.getUserBookings(user.email) : [];

  if (bookings.length === 0) {
    tbody.innerHTML = `
            <tr>
            <td colspan="8" class="text-center py-4 text-muted">
              <i class="bi bi-credit-card-2-front fs-3 d-block mb-1"></i>
              ${user ? 'No payment transactions found for your account.' : 'No payment transactions found in guest preview mode. <a href="#" class="text-success fw-bold ms-1" data-auth-drawer="signin">Sign In</a> to manage payment methods and view tax receipts.'}
            </td>
      </tr>
            `;
  } else {
    tbody.innerHTML = bookings.map((b, idx) => `
            <tr>
        <td><code>TXN-904${idx + 10}</code></td>
        <td><strong>#${b.id}</strong></td>
        <td>${b.propertyName}</td>
        <td>${b.createdAt ? b.createdAt.split('T')[0] : '2026-11-01'}</td>
        <td><i class="bi bi-credit-card me-1"></i> ${b.paymentMethod}</td>
        <td><strong>$${b.totalAmount}</strong></td>
        <td>
          <span class="badge ${b.paymentStatus === 'Paid' ? 'bg-success-subtle text-success' : (b.paymentStatus === 'Refunded' ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning')}">
            ${b.paymentStatus}
          </span>
        </td>
        <td>
          <a href="booking-details.html?id=${b.id}" class="btn btn-sm btn-verdant-outline py-1 px-2" title="Receipt">
            <i class="bi bi-receipt"></i> Receipt
          </a>
        </td>
      </tr>
            `).join('');
  }

  // Intercept actions requiring account values
  if (!user) {
    document.querySelectorAll('.add-payment-btn, [data-bs-target="#addPaymentModal"], .manage-cards-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        requireAuthRedirect('add or manage payment methods', 'signin');
      });
    });
  }
}

/* ===================================================================
   GUEST PROFILE PAGE
=================================================================== */
function initGuestProfilePage() {
  const user = VerdantDB.getCurrentUser();

  const nameInput = document.getElementById('profile-name');
  const emailInput = document.getElementById('profile-email');
  const phoneInput = document.getElementById('profile-phone');
  const addressInput = document.getElementById('profile-address');
  const countryInput = document.getElementById('profile-country');
  const langInput = document.getElementById('profile-lang');

  if (nameInput) nameInput.value = user ? (user.name || '') : 'Guest Visitor';
  if (emailInput) emailInput.value = user ? (user.email || '') : 'Not signed in';
  if (phoneInput) phoneInput.value = user ? (user.phone || '') : 'No phone registered';
  if (addressInput) addressInput.value = user ? (user.address || '') : 'No address saved';
  if (countryInput) countryInput.value = user ? (user.country || '') : 'United Kingdom';
  if (langInput) langInput.value = user ? (user.language || 'English') : 'English';

  const form = document.getElementById('profile-form');
  const pwdForm = document.getElementById('password-form');
  const photoInput = document.getElementById('profile-photo-input');

  // If in guest mode, show notice and redirect to drawer when user attempts changes
  if (!user) {
    const profileCard = document.querySelector('.card');
    if (profileCard && !profileCard.querySelector('.guest-profile-alert')) {
      const alertDiv = document.createElement('div');
      alertDiv.className = 'alert alert-warning border-0 rounded-4 mb-4 p-3 guest-profile-alert shadow-sm';
      alertDiv.innerHTML = `
            <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div class="d-flex align-items-center gap-2 min-w-0">
            <i class="bi bi-exclamation-triangle-fill fs-5 text-warning flex-shrink-0"></i>
            <span class="small mb-0">You are in <strong>Guest Preview Mode</strong>. Updating profile or password settings requires an active account.</span>
          </div>
          <div class="d-flex align-items-center gap-2 flex-nowrap flex-shrink-0 guest-profile-actions">
            <button type="button" class="btn btn-verdant btn-sm text-nowrap fw-semibold flex-shrink-0" data-auth-drawer="signin">
              <i class="bi bi-box-arrow-in-right"></i> <span>Sign In</span>
            </button>
            <button type="button" class="btn btn-verdant-outline btn-sm text-nowrap fw-semibold flex-shrink-0" data-auth-drawer="signup">
              <i class="bi bi-person-plus"></i> <span>Sign Up</span>
            </button>
          </div>
        </div>
            `;
      profileCard.prepend(alertDiv);
    }

    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        requireAuthRedirect('save profile information', 'signin');
      };
    }
    if (pwdForm) {
      pwdForm.onsubmit = (e) => {
        e.preventDefault();
        requireAuthRedirect('change password', 'signin');
      };
    }
    if (photoInput) {
      photoInput.onclick = (e) => {
        e.preventDefault();
        requireAuthRedirect('upload profile avatar', 'signin');
      };
    }
    return;
  }

  // Authenticated State: Immediately remove any guest preview alert banner
  document.querySelectorAll('.guest-profile-alert').forEach(b => b.remove());

  // Authenticated Profile Form submission
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const newName = nameInput.value.trim();
      if (!isValidFullName(newName)) {
        showToast('Please enter a valid full name (at least 2 letters, letters only, no numbers).', 'warning', 'Invalid Name');
        nameInput.focus();
        return;
      }
      const newPhone = phoneInput.value.trim();
      if (newPhone && typeof isValidPhone === 'function' && !isValidPhone(newPhone)) {
        showToast('Please enter a valid phone number (digits only, minimum 7 digits, e.g. +1 (555) 000-0000).', 'warning', 'Invalid Phone Number');
        phoneInput.focus();
        return;
      }
      VerdantDB.updateProfile({
        name: newName,
        phone: newPhone,
        address: addressInput.value.trim(),
        country: countryInput.value.trim(),
        language: langInput.value.trim()
      });
      showToast('Your guest profile has been updated.', 'success', 'Profile Saved');
      initGuestTopbarUser();
    };
  }

  // Password change simulation
  if (pwdForm) {
    pwdForm.onsubmit = (e) => {
      e.preventDefault();
      pwdForm.reset();
      showToast('Your password has been changed securely.', 'success', 'Security');
    };
  }

  // Profile photo upload handler
  if (photoInput) {
    photoInput.onclick = null;
    photoInput.onchange = (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          VerdantDB.updateProfile({ avatar: re.target.result });
          showToast('Profile photo updated successfully!', 'success', 'Photo Updated');
          initGuestTopbarUser();
        };
        reader.readAsDataURL(file);
      }
    };
  }
}

/* ===================================================================
   GUEST NOTIFICATIONS PAGE
=================================================================== */
function initGuestNotificationsPage() {
  const container = document.getElementById('guest-notif-list');
  const markAllBtn = document.getElementById('mark-all-read-btn');
  const user = VerdantDB.getCurrentUser();

  function renderNotifications() {
    const list = user ? VerdantDB.getUserNotifications(user.email) : [];
    if (list.length === 0) {
      container.innerHTML = `
            <div class="p-5 text-center text-muted">
              <i class="bi bi-bell-slash fs-1 d-block mb-2 text-muted"></i>
          ${user ? 'No notifications yet for your account.' : 'No notifications in guest preview mode. <a href="#" class="text-success fw-bold ms-1" data-auth-drawer="signin">Sign In</a> to receive real-time booking alerts.'}
        </div>
            `;
      return;
    }

    container.innerHTML = list.map(n => `
            <div class="list-group-item list-group-item-action p-3 ${!n.read ? 'bg-light border-start border-4 border-success' : ''}">
        <div class="d-flex w-100 justify-content-between align-items-center mb-1">
          <h6 class="mb-1 font-serif fw-bold ${!n.read ? 'text-success' : ''}">${n.title}</h6>
          <small class="text-muted">${n.date ? n.date.split('T')[0] : 'Today'}</small>
        </div>
        <p class="mb-1 small text-muted">${n.message}</p>
      </div>
            `).join('');
  }

  if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
      if (!user) {
        requireAuthRedirect('manage notifications', 'signin');
        return;
      }
      VerdantDB.markUserNotificationsRead(user.email);
      renderNotifications();
      showToast('All notifications marked as read', 'info', 'Notifications');
    });
  }

  if (container) renderNotifications();
}

/* Helpers */
function getStatusBadge(status) {
  if (status === 'Upcoming' || status === 'Confirmed') {
    return `<span class="badge bg-success-subtle text-success"> <i class="bi bi-calendar-check me-1"></i> ${status}</span> `;
  }
  if (status === 'Checked In') {
    return `<span class="badge bg-primary-subtle text-primary"> <i class="bi bi-house-door me-1"></i> Checked In</span> `;
  }
  if (status === 'Completed') {
    return `<span class="badge bg-secondary-subtle text-secondary"> <i class="bi bi-check2-all me-1"></i> Completed</span> `;
  }
  if (status === 'Cancelled') {
    return `<span class="badge bg-danger-subtle text-danger"> <i class="bi bi-x-circle me-1"></i> Cancelled</span> `;
  }
  return `<span class="badge bg-warning-subtle text-warning"> <i class="bi bi-hourglass-split me-1"></i> ${status}</span> `;
}
