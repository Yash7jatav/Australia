const {
  user: userModel,
  photo: photoModel,
  tag: tagModel,
  searchHistory: searchHistoryModel,
} = require("../models");

async function doesUserExist(email) {
  const user = await userModel.findOne({ where: { email } });
  return user ? true : false;
}

async function validateEmail(query) {
  const errors = [];
  if (!query.username) {
    errors.push("Username is required.");
  }
  if (!query.email) {
    errors.push("Email is required.");
  }
  if (!query.email.includes("@") || !query.email.includes(".")) {
    errors.push("Email must include both @ && .");
  }
  return errors;
}

async function validateSearch(data) {
  const errors = [];
  if (!data.query) {
    errors.push("Query is required.");
  }
  return errors;
}

async function validateImageUrl(imageUrl) {
  let isValid = true;
  if (!imageUrl.startsWith("https://images.unsplash.com/")) {
    isValid = false;
  }
  return isValid;
}

async function validateTags(tags) {
  let isValid = true;
  if (!tags || tags.length > 5) {
    isValid = false;
  }
  return isValid;
}

async function validateTagLength(tags) {
  for (const tag of tags) {
    if (tag.length > 20) {
      return false;
    }
  }
  return true;
}

async function validateTag(tags) {
  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    return {
      isValid: false,
      message: "Tags must be an array and cannot be empty",
    };
  }

  for (tag of tags) {
    if (typeof tag !== "string" || tag.trim() === "") {
      return { isValid: false, message: "Tags must be non-empty strings." };
    }
  }

  return { isValid: true };
}

async function validateSingleTag(tag) {
  if (typeof tag !== "string" || tag.trim === "" || tag.includes(",")) {
    return false;
  }
  return true;
}

async function validateSorting(sort) {
  if (sort !== "ASC" && sort !== "DESC") {
    sort = "ASC";
  }
  return sort;
}

module.exports = {
  doesUserExist,
  validateEmail,
  validateSearch,
  validateImageUrl,
  validateTags,
  validateTagLength,
  validateTag,
  validateSingleTag,
  validateSorting,
};
