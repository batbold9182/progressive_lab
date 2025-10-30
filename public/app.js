// ================== COUNTER ==================
let count = 0;
const countDisplay = document.getElementById("count");

document.getElementById("inc").addEventListener("click", () => {
  count++;
  countDisplay.textContent = count;
});

document.getElementById("dec").addEventListener("click", () => {
  if (count > 0) count--;
  countDisplay.textContent = count;
});

// ================== SERVICE WORKER ==================
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker registered with scope:", registration.scope);
      })
      .catch((error) => {
        console.log("Service Worker registration failed:", error);
      });
  }
}

// ================== TEST BUTTON ==================
function test() {
  const testButton = document.getElementById("test");
  testButton.addEventListener("click", () => {
    alert("Testing method button clicked!");
  });
}

// ================== CAMERA SETUP ==================
const width = 320;
let height = 0;
let streaming = false;

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const photo = document.getElementById("photo");
const startButton = document.getElementById("start-button");
const allowButton = document.getElementById("camera-permissions-button");
const deleteButton = document.getElementById("delete-button");

function clearPhoto() {
  const context = canvas.getContext("2d");
  context.fillStyle = "#aaaaaa";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const data = canvas.toDataURL("image/png");
  photo.setAttribute("src", data);
}

// Take photo and return data URL
function takePicture() {
  const context = canvas.getContext("2d");
  if (width && height) {
    canvas.width = width;
    canvas.height = height;

    const filterValue = getComputedStyle(video).getPropertyValue("filter");
    context.filter = filterValue !== "none" ? filterValue : "none";

    context.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL("image/png");
    photo.setAttribute("src", dataUrl);
    return dataUrl;
  } else {
    clearPhoto();
    return null;
  }
}

// ================== CAMERA BUTTONS ==================
function setupCamera() {
  deleteButton.addEventListener("click", (ev) => {
    ev.preventDefault();
    clearPhoto();
  });

  allowButton.addEventListener("click", () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error("Camera error:", err);
        alert("Unable to access camera. Check permissions.");
      });
  });

  video.addEventListener("canplay", () => {
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth / width);
      video.setAttribute("width", width);
      video.setAttribute("height", height);
      canvas.setAttribute("width", width);
      canvas.setAttribute("height", height);
      streaming = true;
    }
  });

  clearPhoto();
}

// ================== LOCATION ==================
async function getUserLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ latitude: 0, longitude: 0 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      () => resolve({ latitude: 0, longitude: 0 }) // fallback
    );
  });
}

function geoFindMe() {
  getUserLocation().then((coords) => {
    const status = document.querySelector("#status");
    const mapLink = document.querySelector("#map-link");
    status.textContent = "";
    mapLink.href = `https://www.openstreetmap.org/#map=18/${coords.latitude}/${coords.longitude}`;
    mapLink.textContent = `Latitude: ${coords.latitude}°, Longitude: ${coords.longitude}°`;
  });
}

document.querySelector("#find-me").addEventListener("click", geoFindMe);
document.querySelector("#hide-button").addEventListener("click", () => {
  document.querySelector("#status").textContent = "Location hidden.";
  document.querySelector("#map-link").textContent = "";
});

// ================== LEAFLET MAP ==================
let map;
let markers = [];

function initMap() {
  map = L.map("map").setView([0, 0], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  loadSavedPhotos();
}

function addPhotoMarker(entry) {
  const popupContent = `
    <div style="text-align:center;">
      <p><strong>${new Date(entry.timestamp).toLocaleString()}</strong></p>
      <img src="${entry.imageUrl}" style="width:150px;border-radius:10px;" />
      <p>Lat: ${entry.lat}, Lon: ${entry.lon}</p>
    </div>
  `;
  const marker = L.marker([entry.lat, entry.lon]).addTo(map).bindPopup(popupContent);
  markers.push(marker);
}

// ================== UPLOAD PHOTO ==================
async function takePictureAndUpload() {
  const dataUrl = takePicture();
  if (!dataUrl) return;

  const coords = await getUserLocation();

  try {
    const res = await fetch("http://localhost:3000/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: dataUrl,
        lat: coords.latitude,
        lon: coords.longitude,
      }),
    });

    const result = await res.json();
    if (result.success) {
      addPhotoMarker(result.entry);
      map.setView([coords.latitude, coords.longitude], 16);

      // Increment counter
      count++;
      countDisplay.textContent = count;
    } else {
      alert("Upload failed.");
    }
  } catch (err) {
    console.error("Upload error:", err);
    alert("Failed to upload photo.");
  }
}

startButton.addEventListener("click", async (ev) => {
  ev.preventDefault();
  await takePictureAndUpload();
});

// ================== LOAD EXISTING PHOTOS ==================
async function loadSavedPhotos() {
  try {
    const res = await fetch("http://localhost:3000/server/uploads");
    const photos = await res.json();
    photos.forEach((photo) => addPhotoMarker(photo));
  } catch (err) {
    console.error("Failed to load saved photos:", err);
  }
}

// ================== INITIALIZE ==================
window.addEventListener("load", () => {
  setupCamera();
  initMap();
  test();
  registerServiceWorker();
});
