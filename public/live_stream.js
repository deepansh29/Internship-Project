// Access the video element in the HTML
const video = document.getElementById("video");

// Prompt the user for permission to access the camera
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    // Set the video element's source to the stream
    video.srcObject = stream;
  })
  .catch((error) => {
    console.error("Error accessing the camera: ", error);
    alert("An error occurred while trying to access the camera.");
  });
