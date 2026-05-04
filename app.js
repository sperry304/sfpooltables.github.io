const MAP_CENTER = [37.7749, -122.4194];
const MAP_ZOOM = 12;

const map = L.map("map").setView(MAP_CENTER, MAP_ZOOM);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const venueList = document.getElementById("venue-list");
const venueCount = document.getElementById("venue-count");
const sortSelect = document.getElementById("sort-select");
const details = document.getElementById("details");
const previewWarning = document.getElementById("preview-warning");

let venues = [];
let selectedVenueId = null;
const markersById = new Map();

if (window.location.protocol === "file:") {
  previewWarning.hidden = false;
  previewWarning.textContent =
    "Map tiles may be blocked in direct file preview. Open the site through GitHub Pages or a local web server such as http://localhost:8000/.";
}

function sortVenues(items, mode) {
  const sorted = [...items];

  if (mode === "name") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }

  sorted.sort((a, b) => {
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }

    return a.name.localeCompare(b.name);
  });

  return sorted;
}

function popupHtml(venue) {
  return `
    <h3>${venue.name}</h3>
    <p>${venue.address}</p>
    <p><strong>Rating:</strong> ${venue.rating.toFixed(1)}/5</p>
    <p><strong>Table:</strong> ${venue.table_size}, ${venue.make}</p>
  `;
}

function detailsHtml(venue) {
  return `
    <article class="details-card">
      <h3>${venue.name}</h3>
      <p class="details-address">${venue.address}</p>
      <div class="details-grid">
        <div class="detail-block">
          <span class="detail-label">Overall Rating</span>
          <strong>${venue.rating.toFixed(1)} / 5</strong>
        </div>
        <div class="detail-block">
          <span class="detail-label">Table Size</span>
          <strong>${venue.table_size}</strong>
        </div>
        <div class="detail-block">
          <span class="detail-label">Make</span>
          <strong>${venue.make}</strong>
        </div>
        <div class="detail-block">
          <span class="detail-label">Cost</span>
          <strong>${venue.cost}</strong>
        </div>
        <div class="detail-block">
          <span class="detail-label">Condition</span>
          <strong>${venue.condition}</strong>
        </div>
        <div class="detail-block">
          <span class="detail-label">Cue Ball Type</span>
          <strong>${venue.cue_ball_type}</strong>
        </div>
        <div class="detail-block">
          <span class="detail-label">Obstructions</span>
          <strong>${venue.obstructions}</strong>
        </div>
        <div class="detail-block">
          <span class="detail-label">Neighborhood</span>
          <strong>${venue.neighborhood}</strong>
        </div>
      </div>
      <div class="notes">
        <span class="detail-label">Notes</span>
        <p>${venue.notes}</p>
      </div>
    </article>
  `;
}

function setActiveListItem() {
  const buttons = document.querySelectorAll(".venue-item");
  buttons.forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.venueId === selectedVenueId
    );
  });
}

function renderDetails() {
  const venue = venues.find((item) => item.id === selectedVenueId);

  if (!venue) {
    details.className = "details-empty";
    details.textContent = "Select a venue to inspect its pool table review.";
    return;
  }

  details.className = "";
  details.innerHTML = detailsHtml(venue);
}

function selectVenue(venueId, openPopup = true) {
  selectedVenueId = venueId;
  setActiveListItem();
  renderDetails();

  const venue = venues.find((item) => item.id === venueId);
  const marker = markersById.get(venueId);

  if (!venue || !marker) {
    return;
  }

  map.flyTo([venue.lat, venue.lng], Math.max(map.getZoom(), 14), {
    duration: 0.4,
  });

  if (openPopup) {
    marker.openPopup();
  }
}

function renderList() {
  const sortedVenues = sortVenues(venues, sortSelect.value);
  venueCount.textContent = `${sortedVenues.length} venues listed`;

  venueList.innerHTML = sortedVenues
    .map(
      (venue) => `
        <li>
          <button class="venue-item" data-venue-id="${venue.id}" type="button">
            <div class="venue-item-title">
              <strong>${venue.name}</strong>
              <span class="rating-pill">${venue.rating.toFixed(1)}</span>
            </div>
            <p>${venue.neighborhood} · ${venue.table_size} · ${venue.cost}</p>
          </button>
        </li>
      `
    )
    .join("");

  venueList.querySelectorAll(".venue-item").forEach((button) => {
    button.addEventListener("click", () => {
      selectVenue(button.dataset.venueId);
    });
  });

  setActiveListItem();
}

function addMarkers() {
  venues.forEach((venue) => {
    const marker = L.marker([venue.lat, venue.lng])
      .addTo(map)
      .bindPopup(popupHtml(venue));

    marker.on("click", () => {
      selectVenue(venue.id, false);
    });

    markersById.set(venue.id, marker);
  });
}

async function loadVenues() {
  try {
    if (!Array.isArray(window.VENUES)) {
      throw new Error("VENUES data is missing");
    }

    venues = window.VENUES;
    addMarkers();
    renderList();

    if (venues.length > 0) {
      const initialVenue = sortVenues(venues, sortSelect.value)[0];
      selectVenue(initialVenue.id);
    }
  } catch (error) {
    venueCount.textContent = "Could not load venue data.";
    details.className = "details-empty";
    details.textContent =
      "The site could not read venue data. Check data/bars.js and try again.";
    console.error(error);
  }
}

sortSelect.addEventListener("change", () => {
  renderList();
});

loadVenues();
