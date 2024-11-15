const blogModel = require("../model/blogModel");
require("dotenv").config();
const createFilename = require("../utils/generateUniqueFilename")
const {addToS3,deleteFromS3} = require("../utils/manageS3")
const ResponseEnum = require("../utils/enums/responseEnum");

const createBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user._id;
    let imageUrl;

    if (req.file) {
      const uniqueFilename = createFilename(req.file.originalname) // Create unique filename
      imageUrl = await addToS3(uniqueFilename,req.file.buffer,req.file.mimetype)
    }

    const newBlog = new blogModel({
      title,
      description,
      image: imageUrl,
      createdBy: userId,
    });

    await newBlog.save();

    res.status(ResponseEnum.SUCCESS.BLOG_CREATED.statusCode).json({
      ...ResponseEnum.SUCCESS.BLOG_CREATED,
      data: newBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(ResponseEnum.ERROR.INTERNAL_SERVER_ERROR.statusCode).json(ResponseEnum.ERROR.INTERNAL_SERVER_ERROR);
  }
};

const allBlogs = async (req, res) => {
  try {
    const userId = req.user._id;
    const blogs = await blogModel.find({createdBy : {$ne : userId}}).populate("createdBy").sort({ createdAt: -1 });
    res.status(ResponseEnum.SUCCESS.BLOGS.statusCode).json({ ...ResponseEnum.SUCCESS.BLOGS, blogs });
  } catch (error) {
    console.error("Error retrieving allBlogs:", error);
    res.status(ResponseEnum.ERROR.INTERNAL_SERVER_ERROR.statusCode).json(ResponseEnum.ERROR.INTERNAL_SERVER_ERROR);
  }
};

const myBlogs = async (req, res) => {
  try {
    const userId = req.user._id;
    const blogs = await blogModel.find({createdBy:userId}).populate("createdBy").sort({ createdAt: -1 });
    res.status(ResponseEnum.SUCCESS.BLOGS.statusCode).json({ ...ResponseEnum.SUCCESS.BLOGS, blogs });
  } catch (error) {
    console.error("Error retrieving myBlogs:", error);
    res.status(ResponseEnum.ERROR.INTERNAL_SERVER_ERROR.statusCode).json(ResponseEnum.ERROR.INTERNAL_SERVER_ERROR);
  }
};

const updateBlog = async (req, res) => {
  try {
    const { blogId, title, description } = req.body;
    const userId = req.user._id;
    let imageUrl;

    // Find the existing blog
    const existingBlog = await blogModel.findById(blogId);

    if (!existingBlog) {
      return res.status(ResponseEnum.ERROR.BLOG_NOT_FOUND.statusCode).json(ResponseEnum.ERROR.BLOG_NOT_FOUND);
    }

    // Check if the user is the owner of the blog
    if (existingBlog.createdBy.toString() !== userId.toString()) {
      return res.status(ResponseEnum.ERROR.INVALID_AUTHORIZATION.statusCode).json(
        ResponseEnum.ERROR.INVALID_AUTHORIZATION
      );
    }

   
    if (req.file) {
      const uniqueFilename = createFilename(req.file.originalname) 
      imageUrl = await addToS3(uniqueFilename,req.file.buffer,req.file.mimetype)

      // Delete the old image
      if (existingBlog.image) {
        const oldImageKey = existingBlog.image.split('/').pop();
        await deleteFromS3(oldImageKey)
      }
    }

    // Update the blog
    const updatedBlog = await blogModel.findByIdAndUpdate(
      blogId,
      {
        title,
        description,
        image: imageUrl || existingBlog.image,
      },
      { new: true }
    );

    res.status(ResponseEnum.SUCCESS.BLOG_UPDATED.statusCode).json({
      ...ResponseEnum.SUCCESS.BLOG_UPDATED,
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(ResponseEnum.ERROR.INTERNAL_SERVER_ERROR.statusCode).json(ResponseEnum.ERROR.INTERNAL_SERVER_ERROR);
  }
};


const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;

    // Find the existing blog
    const existingBlog = await blogModel.findById(blogId);

    if (!existingBlog) {
      return res.status(ResponseEnum.ERROR.BLOG_NOT_FOUND.statusCode).json(
        ResponseEnum.ERROR.BLOG_NOT_FOUND
      );
    }

    // Check if the user is the owner of the blog
    if (existingBlog.createdBy.toString() !== userId.toString()) {
      return res.status(ResponseEnum.ERROR.INVALID_AUTHORIZATION.statusCode).json(
        ResponseEnum.ERROR.INVALID_AUTHORIZATION
      );
    }

    // Delete the image from S3
    if (existingBlog.image) {
      const imageKey = existingBlog.image.split('/').pop();
      await deleteFromS3(imageKey)
    }

    // Delete the blog from the database
    await blogModel.findByIdAndDelete(blogId);

    res.status(ResponseEnum.SUCCESS.BLOG_DELETED.statusCode).json({
      ...ResponseEnum.SUCCESS.BLOG_DELETED,
      blog:existingBlog
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(ResponseEnum.ERROR.INTERNAL_SERVER_ERROR.statusCode).json(ResponseEnum.ERROR.INTERNAL_SERVER_ERROR);
  }
};


module.exports = { createBlog, allBlogs, myBlogs, updateBlog, deleteBlog };