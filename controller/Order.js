const { Order } = require("../model/Order");

exports.fetchOrdersByUser = async (req, res) => {
  const { id } = req.user; // Extracting the user's ID from the authenticated request
  try {
    const orders = await Order.find({ user: id }); // Fetching all orders associated with the user
    res.status(200).json(orders); // Responding with the fetched orders and a 200 status indicating success
  } catch (err) {
    res.status(400).json(err); // If an error occurs, respond with a 400 status and the error message
  }
};

exports.createOrder = async (req, res) => {
  const order = new Order(req.body); // Creating a new Order instance with the request body data
  try {
    const doc = await order.save(); // Saving the new order to the database
    res.status(201).json(doc); // Responding with the saved order and a 201 status indicating resource creation
  } catch (err) {
    res.status(400).json(err); // If an error occurs during the save, respond with a 400 status and the error message
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params; // Extracting the order ID from the request parameters
  try {
    const order = await Order.findByIdAndDelete(id); // Deleting the order with the specified ID from the database
    res.status(200).json(order); // Responding with the deleted order and a 200 status indicating success
  } catch (err) {
    res.status(400).json(err); // If an error occurs during deletion, respond with a 400 status and the error message
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params; // Extracting the order ID from the request parameters
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    }); // Updating the order with the specified ID using the request body data
    res.status(200).json(order); // Responding with the updated order and a 200 status indicating success
  } catch (err) {
    res.status(400).json(err); // If an error occurs during the update, respond with a 400 status and the error message
  }
};

exports.fetchAllOrders = async (req, res) => {
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
  let query = Order.find({ deleted: { $ne: true } }); // Fetching all orders that are not deleted
  let totalOrdersQuery = Order.find({ deleted: { $ne: true } }); // Query to get the total no. of orders
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order }); // Sorting the orders based on the query parameters
  }

  const totalDocs = await totalOrdersQuery.count().exec(); // Executing the query to get the total no. of orders
  console.log({ totalDocs });

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize); // Implementing pagination based on the query parameters
  }

  try {
    const docs = await query.exec(); // Executing the query to fetch paginated orders
    res.set("X-Total-Count", totalDocs); // Setting the total count header in the response
    res.status(200).json(docs); // Responding with the fetched orders and a 200 status indicating success
  } catch (err) {
    res.status(400).json(err); // If an error occurs, respond with a 400 status and the error message
  }
};
