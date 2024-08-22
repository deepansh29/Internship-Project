// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const Docker = require("dockerode");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
//app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
const docker = new Docker();

app.post("/chat", async (req, res) => {
   const { message } = req.body;

  try {
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command-xlarge-nightly",
        prompt: message,
        max_tokens: 300,
        temperature: 0.75,
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(`Cohere API Error: ${errorDetails.message}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: error.message });
  }
});


app.get("/metrics", async (req, res) => {
    try {
      
    const containers = await docker.listContainers({ all: true });
    const metrics = await Promise.all(
      containers.map(async (container) => {
        const containerInfo = docker.getContainer(container.Id);
        const stats = await containerInfo.stats({ stream: false });
        return {
          name: container.Names[0],
          memoryUsage: stats.memory_stats.usage,
          memoryLimit: stats.memory_stats.limit,
          status: container.Status,
          storage: stats.storage_stats.size, // Simplified; adjust depending on actual storage data
        };
      })
    );
    res.json(metrics);
  } catch (error) {
    res.status(500).send("Error fetching metrics");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
