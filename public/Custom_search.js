document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "AIzaSyBU78F_NBSDr_aZ8bamzVnSk0OZUQd7A8M"; // Replace with your API key
  const cx = "b685d4503cd5d4dca"; // Replace with your Custom Search Engine ID

  document.getElementById("search-btn").addEventListener("click", function () {
    const query = document.getElementById("search-input").value;
    if (query) {
      search(query);
    }
  });

  function search(query) {
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(
      query
    )}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        displayResults(data.items);
      })
      .catch((error) => {
        console.error("Error fetching the search results:", error);
      });
  }

  function displayResults(items) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (items && items.length > 0) {
      items.forEach((item) => {
        const resultItem = document.createElement("div");
        resultItem.classList.add("result-item");

        const title = document.createElement("h3");
        title.innerHTML = `<a href="${item.link}" target="_blank">${item.title}</a>`;
        resultItem.appendChild(title);

        const snippet = document.createElement("p");
        snippet.textContent = item.snippet;
        resultItem.appendChild(snippet);

        resultsDiv.appendChild(resultItem);
      });
    } else {
      resultsDiv.innerHTML = "<p>No results found.</p>";
    }
  }
});
