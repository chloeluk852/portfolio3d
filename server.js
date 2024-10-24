const express = require("express");
const path = require("path");
const app = express();

// Serve static files from the root directory
app.use(express.static(__dirname));

// Send index.html for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
