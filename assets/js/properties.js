/**
 * Verdant Haven - Properties & Stays Module
 * Filters, Sorting, Search, Grid/List Toggles, and Details Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('stays-container')) {
    initStaysListing();
  }

  if (document.getElementById('property-details-page')) {
    initPropertyDetails();
  }
});

/* ===================================================================
   STAYS LISTING PAGE LOGIC
=================================================================== */
let allProperties = [];
let filteredProperties = [];
let currentPage = 1;
const itemsPerPage = 9;
let currentViewMode = 'grid'; // 'grid' | 'list'

function initStaysListing() {
  allProperties = VerdantDB.getProperties();

  // Parse URL search parameters if arriving from hero widget
  const params = new URLSearchParams(window.location.search);
  const locationParam = params.get('location');
  const categoryParam = params.get('category');
  const guestsParam = params.get('guests');

  if (locationParam) {
    const locInput = document.getElementById('filter-search');
    if (locInput) locInput.value = locationParam;
  }
  if (categoryParam) {
    const catSelect = document.getElementById('filter-category');
    if (catSelect) catSelect.value = categoryParam;
  }
  if (guestsParam) {
    const guestSelect = document.getElementById('filter-guests');
    if (guestSelect) guestSelect.value = guestsParam;
  }

  setupFilterListeners();
  applyFilters();
}

function setupFilterListeners() {
  const searchInput = document.getElementById('filter-search');
  const catFilter = document.getElementById('filter-category');
  const guestsFilter = document.getElementById('filter-guests');
  const priceRange = document.getElementById('filter-price-range');
  const priceValueDisplay = document.getElementById('price-value-display');
  const sortSelect = document.getElementById('filter-sort');
  const clearBtn = document.getElementById('clear-filters-btn');

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (catFilter) catFilter.addEventListener('change', applyFilters);
  if (guestsFilter) guestsFilter.addEventListener('change', applyFilters);

  if (priceRange) {
    priceRange.addEventListener('input', (e) => {
      if (priceValueDisplay) priceValueDisplay.textContent = `$${e.target.value}`;
      applyFilters();
    });
  }

  if (sortSelect) sortSelect.addEventListener('change', applyFilters);

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (catFilter) catFilter.value = 'all';
      if (guestsFilter) guestsFilter.value = 'all';
      if (priceRange) {
        priceRange.value = 500;
        if (priceValueDisplay) priceValueDisplay.textContent = '$500';
      }
      document.querySelectorAll('.amenity-checkbox:checked').forEach(cb => cb.checked = false);
      applyFilters();
      showToast('Filters cleared', 'info', 'Filters');
    });
  }

  // Amenity Checkboxes
  document.querySelectorAll('.amenity-checkbox').forEach(cb => {
    cb.addEventListener('change', applyFilters);
  });

  // View Switcher (Grid / List)
  const gridBtn = document.getElementById('view-grid-btn');
  const listBtn = document.getElementById('view-list-btn');

  if (gridBtn && listBtn) {
    gridBtn.addEventListener('click', () => {
      currentViewMode = 'grid';
      gridBtn.classList.add('active');
      listBtn.classList.remove('active');
      renderProperties();
    });

    listBtn.addEventListener('click', () => {
      currentViewMode = 'list';
      listBtn.classList.add('active');
      gridBtn.classList.remove('active');
      renderProperties();
    });
  }
}

function applyFilters() {
  const params = new URLSearchParams(window.location.search);
  const urlCat = params.get('category');
  const catFilterEl = document.getElementById('filter-category');
  const selectedCat = (catFilterEl && catFilterEl.value ? catFilterEl.value : null) || urlCat || 'all';
  const searchTerm = (document.getElementById('filter-search')?.value || '').toLowerCase().trim();
  const selectedGuests = document.getElementById('filter-guests')?.value || 'all';
  const maxPrice = parseInt(document.getElementById('filter-price-range')?.value || '1000', 10);
  const sortBy = document.getElementById('filter-sort')?.value || 'popular';

  const selectedAmenities = Array.from(document.querySelectorAll('.amenity-checkbox:checked')).map(cb => cb.value);

  filteredProperties = allProperties.filter(item => {
    // Search
    const matchesSearch = !searchTerm ||
      item.name.toLowerCase().includes(searchTerm) ||
      item.location.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm);

    // Category
    let matchesCategory = true;
    if (selectedCat && selectedCat !== 'all') {
      const cleanSel = selectedCat.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanItem = (item.category || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      matchesCategory = cleanItem.includes(cleanSel) || cleanSel.includes(cleanItem);
    }

    // Guests
    const matchesGuests = selectedGuests === 'all' || item.guests >= parseInt(selectedGuests, 10);

    // Price
    const matchesPrice = item.price <= maxPrice;

    // Amenities
    const matchesAmenities = selectedAmenities.length === 0 ||
      selectedAmenities.every(amenity => item.amenities && item.amenities.includes(amenity));

    return matchesSearch && matchesCategory && matchesGuests && matchesPrice && matchesAmenities;
  });

  // Sorting
  if (sortBy === 'price-low') {
    filteredProperties.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProperties.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredProperties.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'popular') {
    filteredProperties.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
  }

  currentPage = 1;
  renderProperties();
}

function renderProperties() {
  const container = document.getElementById('stays-container');
  const countDisplay = document.getElementById('properties-count-badge');
  if (!container) return;

  if (countDisplay) {
    countDisplay.textContent = `${filteredProperties.length} Stays Available`;
  }

  if (filteredProperties.length === 0) {
    container.innerHTML = `
      <div class="col-12 py-5 text-center">
        <i class="bi bi-tree text-muted" style="font-size: 3.5rem;"></i>
        <h4 class="mt-3">No countryside retreats found</h4>
        <p class="text-muted">Explore our full collection of peaceful sanctuaries and farmstays.</p>
        <a class="btn btn-verdant-outline btn-sm mt-2" href="stays.html">View All Stays</a>
      </div>
    `;
    renderPagination(0);
    return;
  }

  // Pagination slice
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pagedItems = filteredProperties.slice(startIndex, endIndex);

  const isList = currentViewMode === 'list';
  const colClass = isList ? 'col-12 mb-4' : 'col-md-6 col-lg-4 mb-4';

  container.innerHTML = pagedItems.map(p => {
    const isWishlisted = VerdantDB.isInWishlist(p.id);
    const imgSrc = (window.VerdantDB && VerdantDB.resolveImagePath) ? VerdantDB.resolveImagePath(p.images[0]) : p.images[0];
    return `
      <div class="${colClass}">
        <div class="property-card h-100 ${isList ? 'list-view' : ''}">
          <div class="property-thumb">
            <img src="${imgSrc}" alt="${p.name}" loading="lazy">
            <div class="property-badge-group">
              <span class="badge-category">${p.category}</span>
            </div>
            <button class="property-wishlist-btn ${isWishlisted ? 'active' : ''}" data-property-id="${p.id}" title="Save to Wishlist">
              <i class="bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}"></i>
            </button>
          </div>
          <div class="property-body">
            <div class="property-location">
              <i class="bi bi-geo-alt-fill text-danger"></i> ${p.location}
            </div>
            <h5 class="property-title">
              <a href="stay-details.html?id=${p.id}">${p.name}</a>
            </h5>
            <div class="property-features">
              <div class="property-feature-item">
                <i class="bi bi-people"></i> ${p.guests} Guests
              </div>
              <div class="property-feature-item">
                <i class="bi bi-door-open"></i> ${p.bedrooms} Beds
              </div>
              <div class="property-feature-item">
                <i class="bi bi-droplet"></i> ${p.bathrooms} Baths
              </div>
            </div>
            <p class="text-muted small mb-3 text-truncate-2">${p.tagline || p.description.substring(0, 110)}...</p>
            <div class="property-footer">
              <div class="property-price">
                $${p.price} <span>/ night</span>
              </div>
              <div class="property-rating">
                <i class="bi bi-star-fill"></i> ${p.rating} <span class="text-muted fw-normal">(${p.reviewCount})</span>
              </div>
            </div>
            <div class="d-flex gap-2 mt-3 pt-2 border-top">
              <a href="stay-details.html?id=${p.id}" class="btn btn-verdant-outline btn-sm flex-grow-1">View Details</a>
              <a href="booking/booking.html?id=${p.id}" class="btn btn-verdant btn-sm flex-grow-1">Book Now</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  renderPagination(filteredProperties.length);
  if (typeof syncAllWishlistButtons === 'function') {
    syncAllWishlistButtons();
  }
}

function renderPagination(totalCount) {
  const container = document.getElementById('pagination-container');
  if (!container) return;

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = `<ul class="pagination justify-content-center mt-4">`;
  html += `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <button class="page-link" onclick="changePage(${currentPage - 1})"><i class="bi bi-chevron-left"></i></button>
    </li>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <li class="page-item ${currentPage === i ? 'active' : ''}">
        <button class="page-link" onclick="changePage(${i})">${i}</button>
      </li>
    `;
  }

  html += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <button class="page-link" onclick="changePage(${currentPage + 1})"><i class="bi bi-chevron-right"></i></button>
    </li>
  `;
  html += `</ul>`;

  container.innerHTML = html;
}

window.changePage = function (page) {
  currentPage = page;
  renderProperties();
  window.scrollTo({ top: 250, behavior: 'smooth' });
};

/* ===================================================================
   PROPERTY DETAILS PAGE LOGIC
=================================================================== */
function initPropertyDetails() {
  const params = new URLSearchParams(window.location.search);
  const propId = params.get('id') || 'prop-1';
  const property = VerdantDB.getProperty(propId) || VerdantDB.getProperties()[0];

  if (!property) return;

  // Set Page Title & Meta
  document.title = `${property.name} - Verdant Haven Homestays`;

  // Populate Header
  document.getElementById('detail-title').textContent = property.name;
  document.getElementById('detail-location').innerHTML = `<i class="bi bi-geo-alt-fill text-danger me-1"></i> ${property.location} &bull; <span class="text-muted">${property.address}</span>`;
  document.getElementById('detail-rating-badge').innerHTML = `<i class="bi bi-star-fill text-warning me-1"></i> <strong>${property.rating}</strong> (${property.reviewCount} verified guest reviews)`;
  document.getElementById('detail-category-badge').textContent = property.category;
  document.getElementById('detail-price-night').textContent = `$${property.price}`;

  // Gallery
  const mainImage = document.getElementById('detail-main-img');
  if (mainImage && property.images && property.images.length > 0) {
    mainImage.src = (window.VerdantDB && VerdantDB.resolveImagePath) ? VerdantDB.resolveImagePath(property.images[0]) : property.images[0];
    mainImage.alt = property.name;
  }

  const galleryThumbs = document.getElementById('detail-gallery-thumbs');
  if (galleryThumbs && property.images) {
    galleryThumbs.innerHTML = property.images.slice(1, 5).map((img, idx) => {
      const resImg = (window.VerdantDB && VerdantDB.resolveImagePath) ? VerdantDB.resolveImagePath(img) : img;
      return `
      <div class="col-6 mb-2">
        <img src="${resImg}" class="img-fluid rounded-2 gallery-thumb-img cursor-pointer" style="height: 125px; width: 100%; object-fit: cover;" onclick="swapMainImage('${resImg}')" alt="Gallery photo ${idx + 2}">
      </div>
    `;
    }).join('');
  }

  // Quick Specs
  document.getElementById('detail-guests').textContent = `${property.guests} Guests max`;
  document.getElementById('detail-bedrooms').textContent = `${property.bedrooms} Bedrooms`;
  document.getElementById('detail-beds').textContent = `${property.beds || 3} Beds`;
  document.getElementById('detail-baths').textContent = `${property.bathrooms} Bathrooms`;

  // Description
  document.getElementById('detail-desc').innerHTML = `<p class="lead">${property.tagline}</p><p>${property.description}</p>`;

  // Amenities
  const amenitiesList = document.getElementById('detail-amenities-list');
  if (amenitiesList && property.amenities) {
    const getAmenityIcon = (name) => {
      if (name.includes('Wi-Fi')) return 'bi-wifi';
      if (name.includes('Pool')) return 'bi-water';
      if (name.includes('Parking')) return 'bi-p-circle';
      if (name.includes('Garden')) return 'bi-flower1';
      if (name.includes('Campfire') || name.includes('Fireplace')) return 'bi-fire';
      if (name.includes('Mountain')) return 'bi-image';
      if (name.includes('Breakfast') || name.includes('Kitchen')) return 'bi-cup-hot';
      if (name.includes('Pet')) return 'bi-emoji-smile';
      if (name.includes('Balcony')) return 'bi-house-heart';
      if (name.includes('Animals') || name.includes('Horse')) return 'bi-heart-pulse';
      return 'bi-check-circle-fill text-success';
    };

    amenitiesList.innerHTML = property.amenities.map(a => `
      <div class="col-md-4 col-sm-6 mb-3">
        <div class="d-flex align-items-center gap-2 p-2 rounded-2 bg-light">
          <i class="bi ${getAmenityIcon(a)} text-success fs-5"></i>
          <span>${a}</span>
        </div>
      </div>
    `).join('');
  }

  // Available Rooms
  const roomsContainer = document.getElementById('detail-rooms-container');
  if (roomsContainer && property.rooms) {
    const isWishlisted = VerdantDB.isInWishlist(property.id);
    roomsContainer.innerHTML = property.rooms.map(room => `
      <div class="col-md-6 mb-4">
        <div class="card h-100 border rounded-3 overflow-hidden shadow-sm position-relative">
          <div class="position-relative">
            <img src="${room.image}" class="card-img-top" style="height: 180px; object-fit: cover;" alt="${room.name}">
            <button class="property-wishlist-btn ${isWishlisted ? 'active' : ''}" data-property-id="${property.id}" title="Save to Wishlist" style="position: absolute; top: 12px; right: 12px; z-index: 5;">
              <i class="bi ${isWishlisted ? 'bi-heart-fill text-danger' : 'bi-heart'}"></i>
            </button>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title mb-0 font-serif">${room.name}</h5>
              <span class="badge bg-success-subtle text-success fs-6 fw-bold">$${room.price}<small class="fw-normal text-muted">/nt</small></span>
            </div>
            <p class="text-muted small mb-2"><i class="bi bi-people me-1"></i> Capacity: ${room.capacity} Guests &bull; ${room.bedType}</p>
            <p class="text-muted small mb-3"><i class="bi bi-droplet me-1"></i> ${room.bathType}</p>
            <ul class="list-unstyled small mb-3">
              ${room.features.map(f => `<li class="mb-1"><i class="bi bi-check2 text-success me-1"></i> ${f}</li>`).join('')}
            </ul>
            <a href="booking/booking.html?id=${property.id}&room=${room.id}" class="btn btn-verdant-outline btn-sm w-100">Select This Room</a>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Host Info
  if (property.host) {
    document.getElementById('detail-host-name').textContent = property.host.name;
    document.getElementById('detail-host-role').textContent = property.host.role;
    document.getElementById('detail-host-bio').textContent = property.host.bio;
    document.getElementById('detail-host-joined').textContent = `Host since ${property.host.joined}`;
    document.getElementById('detail-host-response').textContent = `Responds ${property.host.responseTime}`;
    document.getElementById('detail-host-avatar').src = property.host.avatar;
    document.getElementById('detail-host-badge').textContent = property.host.badge;
  }

  // Reviews List
  renderReviewsSection(property.id);

  // Setup Dynamic Booking Calculator Widget on Details Page
  setupBookingWidget(property);

  // Setup Review Submission Form
  setupReviewForm(property.id);

  // Wishlist button on detail page
  const wishlistBtn = document.getElementById('detail-wishlist-btn');
  if (wishlistBtn) {
    const isWish = VerdantDB.isInWishlist(property.id);
    wishlistBtn.classList.toggle('active', isWish);
    wishlistBtn.innerHTML = `<i class="bi ${isWish ? 'bi-heart-fill text-danger' : 'bi-heart'} me-1"></i> ${isWish ? 'Saved to Wishlist' : 'Add to Wishlist'}`;
    wishlistBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const user = VerdantDB.getCurrentUser();
      if (!user) {
        showToast('Please sign in to save stays and rooms to your wishlist.', 'info', 'Sign In Required');
        if (typeof openAuthDrawer === 'function') openAuthDrawer('signin');
        return;
      }

      const isNowSaved = VerdantDB.toggleWishlist(property.id);
      wishlistBtn.classList.toggle('active', isNowSaved);
      wishlistBtn.innerHTML = `<i class="bi ${isNowSaved ? 'bi-heart-fill text-danger' : 'bi-heart'} me-1"></i> ${isNowSaved ? 'Saved to Wishlist' : 'Add to Wishlist'}`;
      if (typeof syncAllWishlistButtons === 'function') syncAllWishlistButtons();
      if (typeof updateWishlistBadge === 'function') updateWishlistBadge();
      showToast(
        isNowSaved
          ? `Saved "${property.name}" to your collection. Click the heart icon in the navigation bar to view saved stays.`
          : `Removed "${property.name}" from your collection.`,
        isNowSaved ? 'success' : 'info',
        'Saved Stays'
      );
    });
  }

  // Share button
  const shareBtn = document.getElementById('detail-share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: property.name,
          text: property.tagline,
          url: window.location.href
        }).catch(() => { });
      } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!', 'success', 'Share');
      }
    });
  }
}

window.swapMainImage = function (src) {
  const mainImage = document.getElementById('detail-main-img');
  if (mainImage) mainImage.src = src;
};

function renderReviewsSection(propId) {
  const container = document.getElementById('detail-reviews-list');
  if (!container) return;

  const reviews = VerdantDB.getReviews(propId);
  if (reviews.length === 0) {
    container.innerHTML = `<p class="text-muted">No reviews yet for this retreat. Be the first to leave one below!</p>`;
    return;
  }

  container.innerHTML = reviews.map(r => `
    <div class="border-bottom pb-4 mb-4">
      <div class="d-flex align-items-center gap-3 mb-2">
        <img src="${(r.authorAvatar && !r.authorAvatar.includes('photo-1534528741775-53994a69daeb')) ? r.authorAvatar : (window.VerdantDB ? VerdantDB.getUserAvatar({ name: r.author }, 80) : '')}" class="rounded-circle" style="width: 48px; height: 48px; object-fit: cover;" alt="${r.author}">
        <div>
          <h6 class="mb-0 fw-bold">${r.author}</h6>
          <small class="text-muted">${r.date}</small>
        </div>
        <div class="ms-auto text-warning">
          ${'<i class="bi bi-star-fill"></i>'.repeat(Math.floor(r.rating))}
          <span class="ms-1 fw-bold text-dark">${r.rating}</span>
        </div>
      </div>
      <p class="mb-0 text-muted">${r.text}</p>
    </div>
  `).join('');
}

function setupBookingWidget(property) {
  const checkin = document.getElementById('widget-checkin');
  const checkout = document.getElementById('widget-checkout');
  const guests = document.getElementById('widget-guests');
  const reserveBtn = document.getElementById('widget-reserve-btn');

  const nightsDisplay = document.getElementById('widget-nights-count');
  const subtotalDisplay = document.getElementById('widget-subtotal');
  const cleanDisplay = document.getElementById('widget-cleaning-fee');
  const taxDisplay = document.getElementById('widget-tax-fee');
  const totalDisplay = document.getElementById('widget-total-amount');

  function calculate() {
    if (!checkin || !checkout) return;
    const d1 = new Date(checkin.value);
    const d2 = new Date(checkout.value);

    let diffDays = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    if (isNaN(diffDays) || diffDays <= 0) diffDays = 1;

    const basePrice = property.price;
    const subtotal = basePrice * diffDays;
    const cleanFee = 45;
    const taxFee = Math.round(subtotal * 0.08);
    const total = subtotal + cleanFee + taxFee;

    if (nightsDisplay) nightsDisplay.textContent = `${diffDays} Nights`;
    if (subtotalDisplay) subtotalDisplay.textContent = `$${subtotal}`;
    if (cleanDisplay) cleanDisplay.textContent = `$${cleanFee}`;
    if (taxDisplay) taxDisplay.textContent = `$${taxFee}`;
    if (totalDisplay) totalDisplay.textContent = `$${total}`;
  }

  if (checkin && checkout) {
    checkin.addEventListener('change', calculate);
    checkout.addEventListener('change', calculate);
    calculate();
  }

  if (reserveBtn) {
    reserveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const cIn = checkin ? checkin.value : '';
      const cOut = checkout ? checkout.value : '';
      const gCount = guests ? guests.value : '2';

      window.location.href = `booking/booking.html?id=${property.id}&checkin=${cIn}&checkout=${cOut}&guests=${gCount}`;
    });
  }
}

function setupReviewForm(propId) {
  const form = document.getElementById('submit-review-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const author = document.getElementById('review-author')?.value.trim() || 'Guest';
    const rating = parseFloat(document.getElementById('review-rating')?.value || '5');
    const text = document.getElementById('review-text')?.value.trim();

    if (!text) {
      showToast('Please enter review comments', 'warning', 'Review');
      return;
    }

    VerdantDB.addReview({
      propertyId: propId,
      author: author,
      rating: rating,
      text: text,
      authorAvatar: window.VerdantDB ? VerdantDB.getUserAvatar(VerdantDB.getCurrentUser() || { name: author }, 80) : null
    });

    form.reset();
    showToast('Your review has been published!', 'success', 'Thank You');
    renderReviewsSection(propId);
  });
}

