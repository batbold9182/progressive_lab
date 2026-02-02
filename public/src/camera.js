import {showStatusMessage} from "./helper.js";
const width = 320;
let height = 0;
let streaming = false;

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photo = document.getElementById('photo');
const startButton = document.getElementById('start-button');
const allowButton = document.getElementById('camera-permissions-button');
const deleteButton = document.getElementById('delete-button');

function clearPhoto() {
  const context = canvas.getContext('2d');
  context.fillStyle = '#aaaaaa';
  context.fillRect(0, 0, canvas.width, canvas.height);

  const data = canvas.toDataURL('image/png');
  photo.setAttribute('src', data);
}

function takePicture() {
  const context = canvas.getContext('2d');
  if (width && height) {
    canvas.width = width;
    canvas.height = height;

    const filterValue = getComputedStyle(video).getPropertyValue('filter');
    context.filter = filterValue !== 'none' ? filterValue : 'none';

    context.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/png');
    photo.setAttribute('src', dataUrl);
    return dataUrl;
  } else {
    clearPhoto();
    return null;
  }
}
let currentStream = null;
function setupCamera() {
  allowButton.addEventListener('click', async () => {
    try {
      // Stop previous stream if exists
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }

      // Get new camera stream
      currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      video.srcObject = currentStream;
      await video.play();
    } catch (err) {
      console.error('Camera error:', err);
      showStatusMessage('Unable to access camera. Check permissions.', 'error');
    }
  });

  video.addEventListener('canplay', () => {
    if (!streaming) {
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      height = video.videoHeight / (video.videoWidth / width);
    } else {
      //height = width * 0.75; 
      height = width * 9 / 16;
    }

    video.setAttribute('width', width);
    video.setAttribute('height', height);
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);

    streaming = true;
  }
  });

  clearPhoto();
}

export { setupCamera, takePicture, clearPhoto, video, canvas, photo, startButton, deleteButton };
