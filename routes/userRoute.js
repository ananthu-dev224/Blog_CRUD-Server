const express = require("express");
const router = express.Router();
const { signup, login } = require("../controller/authController");
const {
  createBlog,
  allBlogs,
  myBlogs,
  updateBlog,
  deleteBlog,
} = require("../controller/blogController");
const userTokenVerify = require("../middleware/userToken");
const upload = require("../config/storage");

router.post("/register", signup);
router.post("/login", login);
router.post("/blog", userTokenVerify, upload.single("image"), createBlog);
router.put("/blog", userTokenVerify, upload.single("image"), updateBlog);
router.delete("/blog/:id", userTokenVerify, deleteBlog);
router.get("/all-blogs", userTokenVerify, allBlogs);
router.get("/my-blogs", userTokenVerify, myBlogs);

module.exports = router;