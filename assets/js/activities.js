/**
 * Verdant Haven - Activities & Rural Experiences Module
 * Handles Activity Listings, Filtering, and Interactive Experience Details Booking
 */

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('activities-container')) {
    initActivitiesListing();
  }

  if (document.getElementById('activity-details-page')) {
    initActivityDetails();
  }
});

let allActivities = [];

function initActivitiesListing() {
  allActivities = VerdantDB.getActivities();
  const container = document.getElementById('activities-container');
  const catButtons = document.querySelectorAll('.activity-cat-btn');
  const searchInput = document.getElementById('activity-search-input');

  let currentCategory = 'all';

  // Read URL category param (e.g. from footer links)
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('category');
  if (catParam) {
    currentCategory = catParam;
    catButtons.forEach(b => {
      const bCat = b.getAttribute('data-category');
      if (bCat && (bCat.toLowerCase() === catParam.toLowerCase() || catParam.toLowerCase().includes(bCat.toLowerCase()) || bCat.toLowerCase().includes(catParam.toLowerCase()))) {
        b.classList.add('active');
        currentCategory = bCat;
      } else {
        b.classList.remove('active');
      }
    });
  }

  function renderList() {
    const query = (searchInput?.value || '').toLowerCase().trim();

    const filtered = allActivities.filter(a => {
      const matchCat = currentCategory === 'all' || a.category === currentCategory;
      const matchQuery = !query || a.title.toLowerCase().includes(query) || a.description.toLowerCase().includes(query) || a.location.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="bi bi-compass text-muted" style="font-size: 3rem;"></i>
          <h4 class="mt-3">No activities found</h4>
          <p class="text-muted">Try a different activity keyword or category filter.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(a => {
      const imgSrc = (window.VerdantDB && VerdantDB.resolveImagePath) ? VerdantDB.resolveImagePath(a.image) : a.image;
      return `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="activity-card">
          <div class="activity-thumb">
            <img src="${imgSrc}" alt="${a.title}">
            <span class="badge-category position-absolute top-0 start-0 m-3">${a.category}</span>
          </div>
          <div class="activity-body">
            <div class="activity-meta">
              <span><i class="bi bi-clock me-1"></i> ${a.duration}</span>
              <span>&bull;</span>
              <span><i class="bi bi-people me-1"></i> ${a.ageGroup}</span>
            </div>
            <h5 class="activity-title font-serif">
              <a href="activity-details.html?id=${a.id}">${a.title}</a>
            </h5>
            <p class="activity-desc">${a.description}</p>
            <div class="d-flex align-items-center justify-content-between mt-auto pt-3 border-top">
              <div>
                <span class="fs-5 fw-bold text-success">$${a.price}</span>
                <small class="text-muted">/ person</small>
              </div>
              <a href="activity-details.html?id=${a.id}" class="btn btn-verdant btn-sm">Book Experience</a>
            </div>
          </div>
        </div>
      </div>
    `;
    }).join('');
  }

  catButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category') || 'all';
      renderList();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', renderList);
  }

  renderList();
}

function initActivityDetails() {
  const params = new URLSearchParams(window.location.search);
  const actId = params.get('id') || 'act-1';
  const activity = VerdantDB.getActivity(actId) || VerdantDB.getActivities()[0];

  if (!activity) return;

  document.title = `${activity.title} - Countryside Experience | Verdant Haven`;

  document.getElementById('act-detail-title').textContent = activity.title;
  document.getElementById('act-detail-loc').textContent = activity.location;
  document.getElementById('act-detail-category').textContent = activity.category;
  document.getElementById('act-detail-price').textContent = `$${activity.price}`;
  document.getElementById('act-detail-duration').textContent = activity.duration;
  document.getElementById('act-detail-age').textContent = activity.ageGroup;
  document.getElementById('act-detail-availability').textContent = activity.availability || 'Daily';
  const actImg = document.getElementById('act-detail-img');
  if (actImg) {
    actImg.src = (window.VerdantDB && VerdantDB.resolveImagePath) ? VerdantDB.resolveImagePath(activity.image) : activity.image;
  }
  document.getElementById('act-detail-desc').textContent = activity.description;

  // Included items
  const incList = document.getElementById('act-detail-includes');
  if (incList && activity.includes) {
    incList.innerHTML = activity.includes.map(item => `
      <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i> ${item}</li>
    `).join('');
  }

  // Things to bring
  const bringList = document.getElementById('act-detail-bring');
  if (bringList && activity.thingsToBring) {
    bringList.innerHTML = activity.thingsToBring.map(item => `
      <li class="mb-2"><i class="bi bi-info-circle text-muted me-2"></i> ${item}</li>
    `).join('');
  }

  // Booking Form Calculation
  const participantsInput = document.getElementById('act-participants');
  const totalDisplay = document.getElementById('act-calc-total');
  const bookForm = document.getElementById('act-booking-form');

  function calcTotal() {
    const count = parseInt(participantsInput?.value || '1', 10);
    const total = count * activity.price;
    if (totalDisplay) totalDisplay.textContent = `$${total}`;
  }

  if (participantsInput) {
    participantsInput.addEventListener('change', calcTotal);
    calcTotal();
  }

  if (bookForm) {
    bookForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const currentUser = window.VerdantDB ? VerdantDB.getCurrentUser() : null;
      if (!currentUser) {
        showToast('Please log in to your account before booking this experience.', 'warning', 'Account Login Required');
        if (typeof openAuthDrawer === 'function') openAuthDrawer('signin');
        return;
      }

      const date = document.getElementById('act-date').value;
      const count = participantsInput.value;
      const total = parseInt(count, 10) * activity.price;

      showToast(`Activity reserved for ${count} guest(s) on ${date}! Total: $${total}`, 'success', 'Experience Reserved');
      setTimeout(() => {
        window.location.href = 'guest/bookings.html';
      }, 1200);
    });
  }
}

