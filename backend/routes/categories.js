const express = require("express");
const mongoose = require("mongoose");

const Category = require("../models/Category");
const auth = require("../middleware/auth");

const router = express.Router();

// Create Category
router.post("/", auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json("Permission Denied");
  }

  const { name, description } = req.body;

  try {
    const isCategoryExists = await Category.findOne({ name: req.body.name });
    if (isCategoryExists) {
      return res.status(400).json({
        message: "Category with the same name",
      });
    }
    const newCategory = new Category({ name: name, description: description });
    await newCategory.save();
    res
      .status(201)
      .json({ message: "Category Created Successfull", newCategory });
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get Cateogry
router.get("/:id", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Category not found" });
  }

  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(400).json("Category not found...");
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get All Categories
router.get("/", auth, async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Update Category
router.put("/:id", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Category not found" });
  }

  const { name, description } = req.body;
  try {
    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(400).json("Category not found...");
    }
    if (!req.user.isAdmin) {
      return res.status(403).json("Permission Denied");
    }
    const isCategoryExists = await Category.findOne({ name: req.body.name });
    if (isCategoryExists) {
      return res.status(400).json({
        message: "Category with the same name",
      });
    }
    if (name) category.name = name;
    if (description) category.description = description;
    await category.save();
    res
      .status(200)
      .json({ message: "Category Updated Successfully", category });
  } catch (error) {
    res.status(500).json(error);
  }
});

//Delete Category
router.delete("/:id", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json("Category not found" );
  }

  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json("Category not found");
    }
    if (!req.user.isAdmin) {
      return res.status(403).json( "Permission denied" );
    }
    await category.deleteOne();
    res.status(200).json("Category Deleted Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

module.exports = router;
