const User = require("../models/User");
const { comparePassword, hashPassword } = require("../utils/hash");
const jwt = require("jsonwebtoken");

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;
    
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    
    const newUser = new User({ name, email, phone, password });
    await newUser.save();
    
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });
    
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }
    
    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
