document.addEventListener("DOMContentLoaded", function () {
  const startBtn = document.getElementById("start-btn");
  const resultText = document.getElementById("result");

  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    startBtn.addEventListener("click", () => {
      recognition.start();
    });

    recognition.onstart = () => {
      resultText.textContent = "Listening...";
      resultText.style.color = "#999";
    };

    recognition.onspeechend = () => {
      recognition.stop();
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      resultText.textContent = `You said: ${transcript}`;
      resultText.style.color = "#333";
    };

    recognition.onerror = (event) => {
      resultText.textContent = `Error occurred in recognition: ${event.error}`;
      resultText.style.color = "red";
    };
  } else {
    resultText.textContent = "Web Speech API is not supported in this browser.";
    resultText.style.color = "red";
  }
});
