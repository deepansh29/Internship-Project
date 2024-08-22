const startRecordingBtn = document.getElementById("start-recording");
const responseDiv = document.getElementById("response");

// Function to start speech recognition
function startSpeechRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function (event) {
    const speechResult = event.results[0][0].transcript;
    console.log("Speech received: " + speechResult);
    getChatResponse(speechResult); // Call the unified chat function
  };

  recognition.onspeechend = function () {
    recognition.stop();
  };

  recognition.onerror = function (event) {
    if (event.error === "no-speech") {
      console.error("No speech detected. Please try again.");
      alert(
        "No speech detected. Please try speaking louder or closer to the microphone."
      );
      // Optionally, restart the recognition process
      startSpeechRecognition();
    } else {
      console.error("Speech recognition error detected: " + event.error);
    }
  };
}

// Function to get response from the chat API
async function getChatResponse(userInput) {
  try {
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userInput }), // Send the user's input to the server
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    displayResponse(data.reply); // Display the response from the server
  } catch (error) {
    console.error("Error fetching chat response:", error);
  }
}

// Function to display the response in the DOM
function displayResponse(response) {
  responseDiv.textContent = response;
}

// Event listener for the start recording button
startRecordingBtn.addEventListener("click", startSpeechRecognition);
