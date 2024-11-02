const express = require("express");
const cors = require("cors");
const port = 3000;
const app = express();

const {
  createNewUser,
  searchImages,
  createNewPhoto,
  addNewTag,
  searchImagesByTags,
  displaySearchHistory,
} = require("./controllers/dataControllers.js");

app.use(express.json());
app.use(cors());

const { sequelize } = require("./models/index.js");

app.post("/api/users", createNewUser);
app.post("/api/photos", createNewPhoto);
app.post("/api/photos/:photoId/tags", addNewTag);
app.get("/api/photos/search", searchImages);
app.get("/api/photos/tag/search", searchImagesByTags);
app.get("/api/search-history", displaySearchHistory);

sequelize
  .authenticate()
  .then(() => console.log("Database connected."))
  .catch((error) => console.log("Unable to connect to database", error));

app.listen(port, () => {
  console.log("Server is running on port :- ", port);
});

module.exports = app;
