const axiosInstance = require("../lib/axios.js");
const { Op } = require("sequelize");
require("dotenv").config();

const {
  user: userModel,
  photo: photoModel,
  tag: tagModel,
  searchHistory: searchHistoryModel,
} = require("../models");

const {
  doesUserExist,
  validateEmail,
  validateSearch,
  validateImageUrl,
  validateTags,
  validateTagLength,
  validateTag,
  validateSingleTag,
  validateSorting,
} = require("../validations/index.js");

//MS1_Assignment_1.2: Making API Calls to create Users.
const createNewUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const userExist = await doesUserExist(email);
    if (userExist) {
      return res.status(400).json({ message: "User already exists." });
    }
    const errors = await validateEmail(req.body);
    if (errors.length > 0) {
      res.status(400).json({ errors });
    }

    const savedUser = await userModel.create({ username, email });

    res
      .status(201)
      .json({ message: "User created successfully", user: savedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

//MS1_Assignment_1.3: Making API Calls to Unsplash.
const searchImages = async (req, res) => {
  const errors = await validateSearch(req.query);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    throw new Error(
      "Unsplash API key is missing. Please configure it in the .env file."
    );
  }

  try {
    const query = req.query.query;
    const response = await axiosInstance.get(`/search/photos?query=${query}`, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
    });

    const images = Array.isArray(response.data.results)
      ? response.data.results
      : null;

    if (!images || images.length === 0) {
      return res
        .status(404)
        .json({ message: "No images found for the given query." });
    }

    const photos = images.map((image) => ({
      imageUrl: image.urls.small, // Correctly accessing the small image URL
      description: image.description || "No description available", // Handle null descriptions
      altDescription:
        image.alt_description || "No alternative description available", // Handle null alt descriptions
    }));

    res.status(200).json({ photos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

//MS1_Assignment_1.4: Saving Photos into Collections.
const createNewPhoto = async (req, res) => {
  try {
    const { imageUrl, description, altDescription, tags, userId } = req.body;

    const isValidImageUrl = await validateImageUrl(imageUrl);
    if (!isValidImageUrl) {
      return res.status(400).json({ message: "Invalid image URL." });
    }

    const isValidTags = await validateTags(tags);
    if (!isValidTags) {
      return res.status(400).json({ message: "No more than 5 tags allowed." });
    }

    const checkTagLength = await validateTagLength(tags);
    if (!checkTagLength) {
      return res
        .status(400)
        .json({ message: "The length of the tag must be below 20" });
    }

    const savedPhoto = await photoModel.create({
      imageUrl,
      description,
      altDescription,
      userId,
    });

    if (tags && tags.length > 0) {
      const savedTag = tags.map((tag) => {
        return tagModel.create({ name: tag, photoId: savedPhoto.id });
      });
      await Promise.all(savedTag);
    }

    res.status(201).json({ message: "Photo saved successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

//MS1_Assignment_1.5: Adding Tags for Photos.
const addNewTag = async (req, res) => {
  try {
    const { tags } = req.body;
    const photoId = parseInt(req.params.photoId);

    const validate = await validateTag(tags);
    if (!validate.isValid) {
      return res.status(400).json({ message: validate.message });
    }

    const existingTags = await tagModel.findAll({ where: { photoId } });
    const totalTags = existingTags.length + tags.length;

    if (totalTags > 5) {
      return res
        .status(400)
        .json({ message: "A photo can have a maximum of 5 tags." });
    }

    const savedTags = tags.map((tag) => {
      return tagModel.create({ name: tag, photoId });
    });

    await Promise.all(savedTags);

    res.status(201).json({ message: "Tags added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

//MS1_Assignment_1.6: Searching Photos by Tags and Sorting by Date Saved.
const searchImagesByTags = async (req, res) => {
  try {
    const tags = req.query.tags;
    const sort = req.query.sort;
    const userId = req.query.userId;

    const isValidTag = await validateSingleTag(tags);
    if (!isValidTag) {
      return res
        .status(400)
        .json({ message: "Only a single non-empty tag is allowed." });
    }

    let sortOrder = await validateSorting(sort);

    const tagDetails = await tagModel.findAll({ where: { name: tags } });

    if (tagDetails.length === 0) {
      return { message: "No tag found in the database." };
    }

    if (userId) {
      await searchHistoryModel.create({ query: tags, userId });
    }

    const photoIds = tagDetails.map((tagDetail) => tagDetail.photoId);

    const photoDetails = await photoModel.findAll({
      where: { id: { [Op.in]: photoIds } },
      include: [
        {
          model: tagModel,
          attributes: ["name"],
        },
      ],
      order: [["dateSaved", sortOrder]],
    });

    const photos = photoDetails.map((photo) => {
      return {
        imageUrl: photo.imageUrl,
        description: photo.description,
        dateSaved: photo.dateSaved,
        tags: photo.tags.map((tag) => tag.name),
      };
    });

    res.status(200).json({ photos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

//MS1_Assignment_1.7: Tracking and Displaying Search History.
const displaySearchHistory = async (req, res) => {
  try {
    const userId = parseInt(req.query.userId);

    if (!userId) {
      return res.status(400).json({ message: "Invalid user id." });
    }

    const response = await searchHistoryModel.findAll({
      where: { userId },
    });

    if (response.length === 0) {
      return res.status(400).json({ message: "No data found." });
    }

    const searchHistory = response.map((data) => {
      return {
        query: data.query,
        timestamp: data.timestamp,
      };
    });

    res.status(200).json({ searchHistory });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createNewUser,
  searchImages,
  createNewPhoto,
  addNewTag,
  searchImagesByTags,
  displaySearchHistory,
};
