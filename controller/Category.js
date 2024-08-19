const { Category } = require("../model/Category");

exports.fetchCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).exec(); // Fetching all categories from the database
    res.status(200).json(categories); // Responding with the fetched categories and a 200 status indicating success
  } catch (err) {
    res.status(400).json(err); // If an error occurs, respond with a 400 status and the error message
  }
};

exports.createCategory = async (req, res) => {
  const category = new Category(req.body); // Creating a new Category instance with the request body data
  try {
    const doc = await category.save(); // Saving the new category to the database
    res.status(201).json(doc); // Responding with the saved category and a 201 status indicating resource creation
  } catch (err) {
    res.status(400).json(err); // If an error occurs during the save, respond with a 400 status and the error message
  }
};
