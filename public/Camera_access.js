document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const photo = document.getElementById("photo");
  const captureBtn = document.getElementById("capture-btn");

  // Access the camera
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((err) => {
      console.error("Error accessing the camera: ", err);
    });

  // Capture photo
  captureBtn.addEventListener("click", () => {
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current frame from the video on the canvas
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas image to a data URL and display it
    const dataUrl = canvas.toDataURL("image/png");
    photo.src = dataUrl;
    photo.style.display = "block";
  });
});
