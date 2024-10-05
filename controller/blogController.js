const blogModel = require("../model/blogModel");
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const awsAccess = process.env.AWS_ACCESS_KEY;
const awsSecret = process.env.AWS_SECRET_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: awsAccess,
    secretAccessKey: awsSecret,
  },
  region: bucketRegion,
});

const createBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user._id;
    let imageUrl;

    if (req.file) {
      const uniqueFilename = uuidv4() + path.extname(req.file.originalname); // Create unique filename
      const params = {
        Bucket: bucketName,
        Key: uniqueFilename,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const command = new PutObjectCommand(params);
      await s3.send(command); // Upload file to S3
      imageUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${uniqueFilename}`;
    }

    const newBlog = new blogModel({
      title,
      description,
      image: imageUrl,
      createdBy: userId,
    });

    await newBlog.save();

    res.status(201).json({
      status: "success",
      message: "Blog created successfully",
      data: newBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: error.message, status: "error" });
  }
};

const allBlogs = async (req, res) => {
  try {
    const userId = req.user._id;
    const blogs = await blogModel.find({createdBy : {$ne : userId}}).populate("createdBy").sort({ createdAt: -1 });
    res.status(200).json({ status: "success", blogs });
  } catch (error) {
    console.error("Error retrieving allBlogs:", error);
    res.status(500).json({ message: error.message, status: "error" });
  }
};

const myBlogs = async (req, res) => {
  try {
    const userId = req.user._id;
    const blogs = await blogModel.find({createdBy:userId}).populate("createdBy").sort({ createdAt: -1 });
    res.status(200).json({ status: "success", blogs });
  } catch (error) {
    console.error("Error retrieving myBlogs:", error);
    res.status(500).json({ message: error.message, status: "error" });
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
      return res.status(404).json({
        status: "error",
        message: "Blog not found",
      });
    }

    // Check if the user is the owner of the blog
    if (existingBlog.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to update this blog",
      });
    }

   
    if (req.file) {
      const uniqueFilename = uuidv4() + path.extname(req.file.originalname);
      const params = {
        Bucket: bucketName,
        Key: uniqueFilename,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const command = new PutObjectCommand(params);
      await s3.send(command);
      imageUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${uniqueFilename}`;

      // Delete the old image
      if (existingBlog.image) {
        const oldImageKey = existingBlog.image.split('/').pop();
        const deleteParams = {
          Bucket: bucketName,
          Key: oldImageKey,
        };
        const deleteCommand = new DeleteObjectCommand(deleteParams);
        await s3.send(deleteCommand);
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

    res.status(200).json({
      status: "success",
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: error.message, status: "error" });
  }
};


const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;

    // Find the existing blog
    const existingBlog = await blogModel.findById(blogId);

    if (!existingBlog) {
      return res.status(404).json({
        status: "error",
        message: "Blog not found",
      });
    }

    // Check if the user is the owner of the blog
    if (existingBlog.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to delete this blog",
      });
    }

    // Delete the image from S3
    if (existingBlog.image) {
      const imageKey = existingBlog.image.split('/').pop();
      const deleteParams = {
        Bucket: bucketName,
        Key: imageKey,
      };
      const deleteCommand = new DeleteObjectCommand(deleteParams);
      await s3.send(deleteCommand);
    }

    // Delete the blog from the database
    await blogModel.findByIdAndDelete(blogId);

    res.status(200).json({
      status: "success",
      message: "Blog deleted successfully",
      blog:existingBlog
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: error.message, status: "error" });
  }
};


module.exports = { createBlog, allBlogs, myBlogs, updateBlog, deleteBlog };