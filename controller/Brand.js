const { Brand } = require("../model/Brand");

exports.fetchBrands = async (req, res) => {
  try {
    const brands = await Brand.find({}).exec(); // Fetch all brand documents from the database
    res.status(200).json(brands); // Respond with the fetched brands and a 200 status indicating success
  } catch (err) {
    res.status(400).json(err); // If an error occurs, respond with a 400 status and the error message
  }
};

exports.createBrand = async (req, res) => {
  const brand = new Brand(req.body); // Create a new Brand instance with the data from the request body
  try {
    const doc = await brand.save(); // Save the new brand to the database
    res.status(201).json(doc); // Respond with the saved brand document and a 201 status indicating resource creation
  } catch (err) {
    res.status(400).json(err); // If an error occurs during the save, respond with a 400 status and the error message
  }
};
