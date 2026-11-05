/**
 * Verdant Haven - Guest Dashboard Module
 * Handles Guest Overview, Bookings, Details, Wishlist, Payments, Profile & Notifications
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

function initGuestAuthProtection() {
  const user = VerdantDB.getCurrentUser();
  if (!user) {
    // Unauthenticated access to customer dashboard redirects to Sign In
    window.location.href = '../auth/login.html';
  }
}

function initGuestTopbarUser() {
  const user = VerdantDB.getCurrentUser() || { name: 'Sarah Jenkins', email: 'guest@homestay.com' };
  const avatarUrl = window.VerdantDB ? VerdantDB.getUserAvatar(user, 120) : '';
  document.querySelectorAll('.current-user-name').forEach(el => el.textContent = user.name);
  document.querySelectorAll('.current-user-email').forEach(el => el.textContent = user.email);
  document.querySelectorAll('.current-user-avatar').forEach(img => {
    img.src = avatarUrl;
    img.alt = user.name;
  });

  // Logout buttons
  document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      VerdantDB.logout();
      showToast('Logged out successfully', 'info', 'Session');
      setTimeout(() => {
        window.location.href = '../auth/login.html';
      }, 500);
    });
  });
}

/* ===================================================================
   GUEST DASHBOARD OVERVIEW
=================================================================== */
function initGuestDashboardOverview() {
  const user = VerdantDB.getCurrentUser();
  const bookings = VerdantDB.getBookings(); // or filter by user.email
  const wishlist = VerdantDB.getWishlist();

  const upcoming = bookings.filter(b => b.bookingStatus === 'Upcoming' || b.bookingStatus === 'Checked In');
  const completed = bookings.filter(b => b.bookingStatus === 'Completed');
  const cancelled = bookings.filter(b => b.bookingStatus === 'Cancelled');
  const totalSpent = bookings.reduce((sum, b) => b.paymentStatus === 'Paid' ? sum + b.totalAmount : sum, 0);

  // Metrics
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
        <div class="card p-4 text-center border rounded-3 bg-white">
          <p class="text-muted mb-2">You don't have any upcoming countryside escapes booked yet.</p>
          <a href="../stays.html" class="btn btn-verdant btn-sm mx-auto">Explore Farmstays & Cottages</a>
        </div>
      `;
    }
  }

  // Recent Bookings Table
  const tableBody = document.getElementById('dash-recent-bookings-tbody');
  if (tableBody) {
    tableBody.innerHTML = bookings.slice(0, 5).map(b => `
      <tr>
        <td><strong>#${b.id}</strong></td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <img src="${b.propertyImage}" class="rounded-2" style="width: 44px; height: 38px; object-fit: cover;">
            <div>
              <div class="fw-bold">${b.propertyName}</div>
              <small class="text-muted">${b.roomType}</small>
            </div>
          </div>
        </td>
        <td>${b.checkIn}</td>
        <td>${b.nights} Nts</td>
        <td><strong>$${b.totalAmount}</strong></td>
        <td>${getStatusBadge(b.bookingStatus)}</td>
        <td>
          <a href="booking-details.html?id=${b.id}" class="btn btn-sm btn-outline-secondary py-1 px-2" title="View Details">
            <i class="bi bi-eye"></i>
          </a>
        </td>
      </tr>
    `).join('');
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
    let bookings = VerdantDB.getBookings();
    if (currentFilter !== 'all') {
      bookings = bookings.filter(b => b.bookingStatus.toLowerCase() === currentFilter.toLowerCase());
    }

    if (bookings.length === 0) {
      container.innerHTML = `
        <div class="text-center py-5">
          <i class="bi bi-calendar-x text-muted" style="font-size: 3rem;"></i>
          <h5 class="mt-3">No bookings found in this category</h5>
          <p class="text-muted">Explore our curated farmstays and discover your next retreat.</p>
          <a href="../stays.html" class="btn btn-verdant btn-sm mt-2">Explore Stays</a>
        </div>
      `;
      return;
    }

    container.innerHTML = bookings.map(b => `
      <div class="card border rounded-3 mb-3 overflow-hidden shadow-sm">
        <div class="card-body p-4">
          <div class="row align-items-center">
            <div class="col-md-2 mb-3 mb-md-0">
              <img src="${b.propertyImage}" class="rounded-3 w-100" style="height: 95px; object-fit: cover;" alt="${b.propertyName}">
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
  const booking = VerdantDB.getBooking(id) || VerdantDB.getBookings()[0];

  if (!booking) return;

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
  setT('detail-guests-count', `${booking.adults} Adults${booking.children ? `, ${booking.children} Children` : ''}`);
  setT('detail-subtotal', `$${booking.subtotal}`);
  setT('detail-cleaning', `$${booking.cleaningFee}`);
  setT('detail-tax', `$${booking.tax}`);
  setT('detail-discount', `-$${booking.discount}`);
  setT('detail-total', `$${booking.totalAmount}`);
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
    printBtn.addEventListener('click', () => window.print());
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
    `).join('');
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

  const bookings = VerdantDB.getBookings();

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
        <a href="booking-details.html?id=${b.id}" class="btn btn-sm btn-outline-secondary py-1 px-2" title="Receipt">
          <i class="bi bi-receipt"></i> Receipt
        </a>
      </td>
    </tr>
  `).join('');
}

/* ===================================================================
   GUEST PROFILE PAGE
=================================================================== */
function initGuestProfilePage() {
  const user = VerdantDB.getCurrentUser();
  if (!user) return;

  const nameInput = document.getElementById('profile-name');
  const emailInput = document.getElementById('profile-email');
  const phoneInput = document.getElementById('profile-phone');
  const addressInput = document.getElementById('profile-address');
  const countryInput = document.getElementById('profile-country');
  const langInput = document.getElementById('profile-lang');

  if (nameInput) nameInput.value = user.name || '';
  if (emailInput) emailInput.value = user.email || '';
  if (phoneInput) phoneInput.value = user.phone || '';
  if (addressInput) addressInput.value = user.address || '';
  if (countryInput) countryInput.value = user.country || 'United States';
  if (langInput) langInput.value = user.language || 'English';

  const form = document.getElementById('profile-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      VerdantDB.updateProfile({
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        address: addressInput.value.trim(),
        country: countryInput.value.trim(),
        language: langInput.value.trim()
      });
      showToast('Your guest profile has been updated.', 'success', 'Profile Saved');
      initGuestTopbarUser();
    });
  }

  // Password change simulation
  const pwdForm = document.getElementById('password-form');
  if (pwdForm) {
    pwdForm.addEventListener('submit', (e) => {
      e.preventDefault();
      pwdForm.reset();
      showToast('Your password has been changed securely.', 'success', 'Security');
    });
  }

  // Profile photo upload handler
  const photoInput = document.getElementById('profile-photo-input');
  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
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
    });
  }
}

/* ===================================================================
   GUEST NOTIFICATIONS PAGE
=================================================================== */
function initGuestNotificationsPage() {
  const container = document.getElementById('guest-notif-list');
  const markAllBtn = document.getElementById('mark-all-read-btn');

  function renderNotifications() {
    const list = VerdantDB.getNotifications();
    if (list.length === 0) {
      container.innerHTML = `<div class="p-5 text-center text-muted">No notifications yet.</div>`;
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
      VerdantDB.markAllNotificationsRead();
      renderNotifications();
      showToast('All notifications marked as read', 'info', 'Notifications');
    });
  }

  if (container) renderNotifications();
}

/* Helpers */
function getStatusBadge(status) {
  if (status === 'Upcoming' || status === 'Confirmed') {
    return `<span class="badge bg-success-subtle text-success"><i class="bi bi-calendar-check me-1"></i> ${status}</span>`;
  }
  if (status === 'Checked In') {
    return `<span class="badge bg-primary-subtle text-primary"><i class="bi bi-house-door me-1"></i> Checked In</span>`;
  }
  if (status === 'Completed') {
    return `<span class="badge bg-secondary-subtle text-secondary"><i class="bi bi-check2-all me-1"></i> Completed</span>`;
  }
  if (status === 'Cancelled') {
    return `<span class="badge bg-danger-subtle text-danger"><i class="bi bi-x-circle me-1"></i> Cancelled</span>`;
  }
  return `<span class="badge bg-warning-subtle text-warning"><i class="bi bi-hourglass-split me-1"></i> ${status}</span>`;
}

