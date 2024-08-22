// metrics.js

let memoryChartInstance = null;
let statusChartInstance = null;
let storageChartInstance = null;

async function fetchMetrics() {
  try {
    const response = await fetch("http://localhost:3000/metrics");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching metrics from server:", error);
    alert(
      "Failed to fetch metrics. Please check the server logs for more details."
    );
  }
}

function updateCharts(metrics) {
  const memoryData = metrics.map((m) => ({
    label: m.name,
    value: m.memoryUsage,
  }));
  const statusData = metrics.map((m) => ({ label: m.name, value: m.status }));
  const storageData = metrics.map((m) => ({ label: m.name, value: m.storage }));

  // Destroy existing charts if they exist
  if (memoryChartInstance) {
    memoryChartInstance.destroy();
  }
  if (statusChartInstance) {
    statusChartInstance.destroy();
  }
  if (storageChartInstance) {
    storageChartInstance.destroy();
  }

  // Create new charts
  memoryChartInstance = new Chart(document.getElementById("memoryChart"), {
    type: "bar",
    data: {
      labels: memoryData.map((m) => m.label),
      datasets: [
        {
          label: "Memory Usage (Bytes)",
          data: memoryData.map((m) => m.value),
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
  });

  statusChartInstance = new Chart(document.getElementById("statusChart"), {
    type: "pie",
    data: {
      labels: statusData.map((s) => s.label),
      datasets: [
        {
          label: "Status",
          data: statusData.map((s) => (s.value === "running" ? 1 : 0)),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
  });

  storageChartInstance = new Chart(document.getElementById("storageChart"), {
    type: "bar",
    data: {
      labels: storageData.map((s) => s.label),
      datasets: [
        {
          label: "Storage Usage (Bytes)",
          data: storageData.map((s) => s.value),
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
      ],
    },
  });
}

async function refreshMetrics() {
  const metrics = await fetchMetrics();
  if (metrics) {
    updateCharts(metrics);
  }
}

// Refresh Docker metrics every 5 seconds
refreshMetrics();
setInterval(refreshMetrics, 5000);
