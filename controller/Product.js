const { Product } = require("../model/Product");

exports.createProduct = async (req, res) => {
  // this product we have to get from API body
  const product = new Product(req.body); // Creating a new Product instance with the request body data
  try {
    const doc = await product.save(); // Saving the new product to the database
    res.status(201).json(doc); // Responding with the saved product and a 201 status indicating resource creation
  } catch (err) {
    res.status(400).json(err); // If an error occurs during the save, respond with a 400 status and the error message
  }
};

exports.fetchAllProducts = async (req, res) => {
  // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
  // TODO : we have to try with multiple category and brands after change in front-end
  let condition = {};
  if (!req.query.admin) {
    condition.deleted = { $ne: true };
  }

  let query = Product.find(condition); // Fetching all products that are not deleted
  let totalProductsQuery = Product.find(condition); // Query to get the total no. of products

  if (req.query.category) {
    query = query.find({ category: req.query.category }); // Sorting the products based on the query parameters
    totalProductsQuery = totalProductsQuery.find({
      category: req.query.category,
    }); // Query to get the total no. of products
  }
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
    totalProductsQuery = totalProductsQuery.find({ brand: req.query.brand });
  }
  // TODO : How to get sort on discounted Price not on Actual price
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalProductsQuery.count().exec(); // Executing the query to get the total no. of products
  console.log({ totalDocs });

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit; // Implementing pagination based on the query parameters
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec(); // Executing the query to fetch the products
    res.set("X-Total-Count", totalDocs); // Setting the total count header in the response
    res.status(200).json(docs); // Responding with the fetched products and a 200 status indicating success
  } catch (err) {
    res.status(400).json(err); // If an error occurs, respond with a 400 status and the error message
  }
};

exports.fetchProductById = async (req, res) => {
  const { id } = req.params; // Extracting the product ID from the request parameters
  try {
    const product = await Product.findById(id); // Fetching the product with the specified ID from the database
    res.status(200).json(product); // Responding with the fetched product and a 200 status indicating success
  } catch (err) {
    res.status(400).json(err); // If an error occurs, respond with a 400 status and the error message
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params; // Extracting the product ID from the request parameters
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    }); // Updating the product with the specified ID using the request body data
    res.status(200).json(product); // Responding with the updated product and a 200 status indicating success
  } catch (err) {
    res.status(400).json(err); // If an error occurs during the update, respond with a 400 status and the error message
  }
};
