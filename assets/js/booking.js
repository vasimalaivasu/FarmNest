/**
 * Verdant Haven - Booking & Checkout Flow Module
 * Handles Checkout, Dynamic Recalculation, Coupon Discounts, Confirmation & Invoice
 */

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('booking-checkout-page')) {
    initBookingCheckout();
  }

  if (document.getElementById('booking-confirmation-page')) {
    initBookingConfirmation();
  }
});

let currentBookingState = {
  property: null,
  room: null,
  checkIn: '',
  checkOut: '',
  nights: 2,
  adults: 2,
  children: 0,
  roomsCount: 1,
  pricePerNight: 0,
  subtotal: 0,
  cleaningFee: 45,
  serviceFee: 55,
  tax: 0,
  discount: 0,
  couponCode: '',
  addonsTotal: 0,
  totalAmount: 0
};

function initBookingCheckout() {
  const params = new URLSearchParams(window.location.search);
  const propId = params.get('id') || 'prop-1';
  const roomId = params.get('room');
  
  const property = VerdantDB.getProperty(propId) || VerdantDB.getProperties()[0];
  currentBookingState.property = property;

  // Selected Room
  if (property.rooms && property.rooms.length > 0) {
    currentBookingState.room = property.rooms.find(r => r.id === roomId) || property.rooms[0];
    currentBookingState.pricePerNight = currentBookingState.room.price;
  } else {
    currentBookingState.pricePerNight = property.price;
  }

  // Populate Dates & Guests from URL or defaults
  const today = new Date();
  const defIn = new Date();
  defIn.setDate(today.getDate() + 3);
  const defOut = new Date();
  defOut.setDate(today.getDate() + 6);

  const formatDate = d => d.toISOString().split('T')[0];

  const checkinInput = document.getElementById('book-checkin');
  const checkoutInput = document.getElementById('book-checkout');
  const adultsSelect = document.getElementById('book-adults');
  const childrenSelect = document.getElementById('book-children');

  if (checkinInput) {
    checkinInput.value = params.get('checkin') || formatDate(defIn);
    checkinInput.min = formatDate(today);
    checkinInput.addEventListener('change', recalculateBooking);
  }
  if (checkoutInput) {
    checkoutInput.value = params.get('checkout') || formatDate(defOut);
    checkoutInput.min = formatDate(today);
    checkoutInput.addEventListener('change', recalculateBooking);
  }
  if (adultsSelect) {
    adultsSelect.value = params.get('guests') || '2';
    adultsSelect.addEventListener('change', recalculateBooking);
  }
  if (childrenSelect) {
    childrenSelect.addEventListener('change', recalculateBooking);
  }

  // Populate Property Summary Banner
  document.getElementById('summary-prop-title').textContent = property.name;
  document.getElementById('summary-prop-loc').textContent = property.location;
  document.getElementById('summary-prop-img').src = (window.VerdantDB && VerdantDB.resolveImagePath) ? VerdantDB.resolveImagePath(property.images[0]) : property.images[0];
  document.getElementById('summary-room-name').textContent = currentBookingState.room ? currentBookingState.room.name : 'Standard Country Suite';
  document.getElementById('summary-price-rate').textContent = `$${currentBookingState.pricePerNight} / night`;

  // Update authentication UI state on the booking page
  updateBookingAuthState();

  // Attach login button listeners for unauthenticated guests
  document.getElementById('booking-banner-login-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof openAuthDrawer === 'function') openAuthDrawer('signin');
  });
  document.getElementById('guest-login-action-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof openAuthDrawer === 'function') openAuthDrawer('signin');
  });

  // Coupon Code Listener
  const couponBtn = document.getElementById('apply-coupon-btn');
  if (couponBtn) {
    couponBtn.addEventListener('click', applyCoupon);
  }

  // Addon Checkbox Listeners
  document.querySelectorAll('.booking-addon-checkbox').forEach(cb => {
    cb.addEventListener('change', recalculateBooking);
  });

  // Booking Form Submission
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleBookingSubmit);
  }

  recalculateBooking();
}

function recalculateBooking() {
  const checkinVal = document.getElementById('book-checkin')?.value;
  const checkoutVal = document.getElementById('book-checkout')?.value;
  const adultsVal = parseInt(document.getElementById('book-adults')?.value || '2', 10);
  const childrenVal = parseInt(document.getElementById('book-children')?.value || '0', 10);

  currentBookingState.checkIn = checkinVal;
  currentBookingState.checkOut = checkoutVal;
  currentBookingState.adults = adultsVal;
  currentBookingState.children = childrenVal;

  if (checkinVal && checkoutVal) {
    const d1 = new Date(checkinVal);
    const d2 = new Date(checkoutVal);
    let diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    if (isNaN(diff) || diff <= 0) diff = 1;
    currentBookingState.nights = diff;
  }

  // Addons calculation
  let addons = 0;
  document.querySelectorAll('.booking-addon-checkbox:checked').forEach(cb => {
    addons += parseFloat(cb.getAttribute('data-price') || '0');
  });
  currentBookingState.addonsTotal = addons;

  // Subtotal
  currentBookingState.subtotal = currentBookingState.pricePerNight * currentBookingState.nights;
  currentBookingState.tax = Math.round(currentBookingState.subtotal * 0.08);

  // Discount
  let discountAmount = 0;
  if (currentBookingState.couponCode) {
    const coupon = VerdantDB.validateCoupon(currentBookingState.couponCode);
    if (coupon) {
      if (coupon.type === 'percent') {
        discountAmount = Math.round((currentBookingState.subtotal * coupon.discount) / 100);
      } else {
        discountAmount = coupon.discount;
      }
    }
  }
  currentBookingState.discount = discountAmount;

  // Final Total
  currentBookingState.totalAmount = Math.max(0, currentBookingState.subtotal + currentBookingState.cleaningFee + currentBookingState.serviceFee + currentBookingState.tax + currentBookingState.addonsTotal - currentBookingState.discount);

  // Update UI displays
  const updateText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  updateText('summary-nights-label', `${currentBookingState.nights} Nights`);
  updateText('summary-subtotal-val', `$${currentBookingState.subtotal}`);
  updateText('summary-cleaning-val', `$${currentBookingState.cleaningFee}`);
  updateText('summary-service-val', `$${currentBookingState.serviceFee}`);
  updateText('summary-tax-val', `$${currentBookingState.tax}`);
  updateText('summary-addons-val', `$${currentBookingState.addonsTotal}`);
  updateText('summary-discount-val', `-$${currentBookingState.discount}`);
  updateText('summary-total-val', `$${currentBookingState.totalAmount}`);

  const discountRow = document.getElementById('summary-discount-row');
  if (discountRow) {
    discountRow.style.display = currentBookingState.discount > 0 ? 'flex' : 'none';
  }
}

function applyCoupon(e) {
  e.preventDefault();
  const input = document.getElementById('coupon-input');
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (!code) {
    showToast('Please enter a promo coupon code', 'warning', 'Coupon');
    return;
  }

  const validCoupon = VerdantDB.validateCoupon(code);
  if (validCoupon) {
    currentBookingState.couponCode = code;
    recalculateBooking();
    showToast(`Coupon "${code}" applied: ${validCoupon.description}`, 'success', 'Discount Applied');
    input.classList.add('is-valid');
    input.classList.remove('is-invalid');
  } else {
    showToast('Invalid or expired coupon code. Try VERDANT20 or HARVEST15', 'danger', 'Invalid Coupon');
    input.classList.add('is-invalid');
  }
}

// Manage user authentication state on the checkout/order page
window.updateBookingAuthState = function () {
  const currentUser = window.VerdantDB ? VerdantDB.getCurrentUser() : null;
  const banner = document.getElementById('booking-auth-banner');
  const authBox = document.getElementById('guest-auth-box');
  const unauthBox = document.getElementById('guest-unauth-box');
  const statusBadge = document.getElementById('guest-card-status-badge');
  const nameInput = document.getElementById('guest-name');
  const emailInput = document.getElementById('guest-email');
  const phoneInput = document.getElementById('guest-phone');
  const submitBtn = document.getElementById('btn-submit-booking');

  if (currentUser) {
    if (banner) {
      banner.classList.add('d-none');
      banner.classList.remove('d-flex');
      banner.style.setProperty('display', 'none', 'important');
    }
    if (unauthBox) {
      unauthBox.classList.add('d-none');
      unauthBox.classList.remove('d-block');
      unauthBox.style.setProperty('display', 'none', 'important');
    }
    if (authBox) {
      authBox.classList.remove('d-none');
      authBox.classList.add('d-flex');
      authBox.style.setProperty('display', 'flex', 'important');
      const nameDisp = document.getElementById('auth-guest-name-display');
      const emailDisp = document.getElementById('auth-guest-email-display');
      if (nameDisp) nameDisp.textContent = `Signed in as: ${currentUser.name}`;
      if (emailDisp) emailDisp.textContent = currentUser.email;
    }
    if (statusBadge) {
      statusBadge.innerHTML = `<span class="badge bg-success-subtle text-success border border-success-subtle"><i class="bi bi-check-circle-fill me-1"></i>Logged In</span>`;
    }
    if (nameInput) {
      nameInput.value = currentUser.name || '';
      nameInput.removeAttribute('disabled');
      nameInput.readOnly = false;
    }
    if (emailInput) {
      emailInput.value = currentUser.email || '';
      emailInput.removeAttribute('disabled');
      emailInput.setAttribute('readonly', 'true');
    }
    if (phoneInput) {
      if (!phoneInput.value && currentUser.phone) {
        phoneInput.value = currentUser.phone;
      }
      phoneInput.removeAttribute('disabled');
    }
    if (submitBtn) {
      submitBtn.innerHTML = `<i class="bi bi-lock-fill me-1"></i> Confirm & Complete Reservation`;
      submitBtn.classList.remove('btn-warning');
      submitBtn.classList.add('btn-verdant');
    }
  } else {
    if (banner) {
      banner.classList.remove('d-none');
      banner.classList.add('d-flex');
      banner.style.removeProperty('display');
    }
    if (unauthBox) {
      unauthBox.classList.remove('d-none');
      unauthBox.classList.add('d-block');
      unauthBox.style.removeProperty('display');
    }
    if (authBox) {
      authBox.classList.add('d-none');
      authBox.classList.remove('d-flex');
      authBox.style.setProperty('display', 'none', 'important');
    }
    if (statusBadge) {
      statusBadge.innerHTML = `<span class="badge bg-warning-subtle text-dark border border-warning-subtle"><i class="bi bi-exclamation-triangle-fill me-1"></i>Sign In Required</span>`;
    }
    if (nameInput) {
      nameInput.value = '';
      nameInput.placeholder = 'Please sign in to your account';
      nameInput.setAttribute('disabled', 'true');
    }
    if (emailInput) {
      emailInput.value = '';
      emailInput.placeholder = 'Please sign in to your account';
      emailInput.setAttribute('disabled', 'true');
    }
    if (phoneInput) {
      phoneInput.setAttribute('disabled', 'true');
    }
    if (submitBtn) {
      submitBtn.innerHTML = `<i class="bi bi-person-lock me-1"></i> Sign In to Complete Reservation`;
      submitBtn.classList.remove('btn-verdant');
      submitBtn.classList.add('btn-warning');
    }
  }
};

function handleBookingSubmit(e) {
  e.preventDefault();

  // 1. Mandatory check: Must be signed in before completing order!
  const currentUser = window.VerdantDB ? VerdantDB.getCurrentUser() : null;
  if (!currentUser) {
    showToast('Please log in to your account before completing your order.', 'warning', 'Account Login Required');
    if (typeof openAuthDrawer === 'function') {
      openAuthDrawer('signin');
    }
    return;
  }

  const guestName = document.getElementById('guest-name')?.value.trim() || currentUser.name;
  const guestEmail = currentUser.email || document.getElementById('guest-email')?.value.trim();
  const guestPhone = document.getElementById('guest-phone')?.value.trim() || currentUser.phone || '';
  const specialRequests = document.getElementById('special-requests')?.value.trim() || '';

  const paymentMethodRadio = document.querySelector('input[name="paymentMethod"]:checked');
  const paymentMethod = paymentMethodRadio ? paymentMethodRadio.value : 'PayPal';

  if (!guestPhone) {
    showToast('Please provide a contact phone number for check-in coordination.', 'warning', 'Phone Number Required');
    document.getElementById('guest-phone')?.focus();
    return;
  }

  // Create booking object linked to the authenticated user account
  const bookingPayload = {
    userId: currentUser.id || currentUser.email,
    propertyId: currentBookingState.property.id,
    propertyName: currentBookingState.property.name,
    propertyImage: currentBookingState.property.images[0],
    location: currentBookingState.property.location,
    roomType: currentBookingState.room ? currentBookingState.room.name : 'Master Suite',
    guestName: guestName,
    guestEmail: guestEmail,
    guestPhone: guestPhone,
    checkIn: currentBookingState.checkIn,
    checkOut: currentBookingState.checkOut,
    nights: currentBookingState.nights,
    adults: currentBookingState.adults,
    children: currentBookingState.children,
    roomsCount: currentBookingState.roomsCount,
    pricePerNight: currentBookingState.pricePerNight,
    subtotal: currentBookingState.subtotal,
    cleaningFee: currentBookingState.cleaningFee,
    serviceFee: currentBookingState.serviceFee,
    tax: currentBookingState.tax,
    discount: currentBookingState.discount,
    couponApplied: currentBookingState.couponCode,
    totalAmount: currentBookingState.totalAmount,
    paymentMethod: paymentMethod,
    paymentStatus: (paymentMethod === 'Cash on Arrival' || paymentMethod === 'Bank Transfer') ? 'Pending' : 'Paid',
    bookingStatus: 'Upcoming',
    specialRequests: specialRequests
  };

  const newBooking = VerdantDB.createBooking(bookingPayload);

  showToast(`Booking ${newBooking.id} confirmed!`, 'success', 'Reservation Successful');

  // Redirect to confirmation page
  setTimeout(() => {
    window.location.href = `confirmation.html?id=${newBooking.id}`;
  }, 600);
}

/* ===================================================================
   BOOKING CONFIRMATION & INVOICE PAGE LOGIC
=================================================================== */
function initBookingConfirmation() {
  const params = new URLSearchParams(window.location.search);
  const bookingId = params.get('id');

  const user = window.VerdantDB ? VerdantDB.getCurrentUser() : null;
  const bookings = user ? VerdantDB.getUserBookings(user.email) : VerdantDB.getBookings();
  const booking = bookingId ? bookings.find(b => b.id === bookingId) : (bookings.length > 0 ? bookings[0] : null);

  if (!booking) return;

  document.getElementById('conf-booking-id').textContent = booking.id;
  document.getElementById('conf-prop-name').textContent = booking.propertyName;
  document.getElementById('conf-prop-location').textContent = booking.location;
  document.getElementById('conf-prop-img').src = (window.VerdantDB && VerdantDB.resolveImagePath) ? VerdantDB.resolveImagePath(booking.propertyImage) : booking.propertyImage;
  document.getElementById('conf-room-name').textContent = booking.roomType;
  document.getElementById('conf-checkin').textContent = booking.checkIn;
  document.getElementById('conf-checkout').textContent = booking.checkOut;
  document.getElementById('conf-nights').textContent = `${booking.nights} Nights`;
  document.getElementById('conf-guests').textContent = `${booking.adults} Adults${booking.children > 0 ? `, ${booking.children} Children` : ''}`;
  document.getElementById('conf-total-amount').textContent = `$${booking.totalAmount}`;
  document.getElementById('conf-payment-status').textContent = booking.paymentStatus;
  document.getElementById('conf-payment-method').textContent = booking.paymentMethod;
  document.getElementById('conf-guest-name').textContent = booking.guestName;
  document.getElementById('conf-guest-email').textContent = booking.guestEmail;

  // Print invoice button
  const printBtn = document.getElementById('print-invoice-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // View in dashboard button
  const dashBtn = document.getElementById('view-in-dashboard-btn');
  if (dashBtn) {
    dashBtn.href = `../guest/bookings.html`;
  }
}

