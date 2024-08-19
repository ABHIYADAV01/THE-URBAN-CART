const { Cart } = require("../model/Cart");

exports.fetchCartByUser = async (req, res) => {
  const { id } = req.user; // Extracting the user's ID from the authenticated request
  try {
    // Fetching all cart items associated with the user, including the associated product details
    const cartItems = await Cart.find({ user: id }).populate("product");
    // Responding with the fetched cart items and a 200 status indicating success
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(400).json(err); // If an error occurs, respond with a 400 status and the error message
  }
};

exports.addToCart = async (req, res) => {
  // Extracting the user's ID from the authenticated request
  const { id } = req.user;

  // Creating a new Cart instance with the request body data and associating it with the user
  const cart = new Cart({ ...req.body, user: id });
  try {
    const doc = await cart.save(); // Saving the new cart item to the database
    const result = await doc.populate("product"); // Populating the product details in the saved cart item
    res.status(201).json(result); // Responding with the populated cart item and a 201 status indicating resource creation
  } catch (err) {
    res.status(400).json(err); // If an error occurs during the save, respond with a 400 status and the error message
  }
};

exports.deleteFromCart = async (req, res) => {
  // Extracting the cart item ID from the request parameters
  const { id } = req.params;
  try {
    const doc = await Cart.findByIdAndDelete(id); // Deleting the cart item with the specified ID from the database
    res.status(200).json(doc); // Responding with the deleted cart item and a 200 status indicating success
  } catch (err) {
    res.status(400).json(err); // If an error occurs during deletion, respond with a 400 status and the error message
  }
};

exports.updateCart = async (req, res) => {
  // Extracting the cart item ID from the request parameters
  const { id } = req.params;
  try {
    // Updating the cart item with the specified ID using the request body data
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true, // Returns the updated document
    });

    const result = await cart.populate("product"); // Populating the product details in the updated cart item
    res.status(200).json(result); // Responding with the updated cart item and a 200 status indicating success
  } catch (err) {
    res.status(400).json(err); // If an error occurs during the update, respond with a 400 status and the error message
  }
};
