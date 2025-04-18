const express = require("express");
const { registerUser, loginUser, updateUser,getUserProfile } = require("../controllers/userController");
const {verifyUser} = require("../middlewares/authMiddleware")
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update/:id",verifyUser,updateUser);
router.get("/profile", verifyUser,getUserProfile); 

module.exports = router;