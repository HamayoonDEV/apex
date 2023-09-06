import Joi from "joi";
import fs from "fs";
import Blog from "../models/blog.js";
import { SERVER_BACKEND_PATH } from "../config/index.js";
import Comment from "../models/comment.js";

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
const blogController = {
  //create blog
  async createBlog(req, res, next) {
    //validate user input
    const createBlogSchema = Joi.object({
      content: Joi.string().required(),
      title: Joi.string().required(),
      photopath: Joi.string().required(),
      author: Joi.string().regex(mongoIdPattern).required(),
    });
    //validate createBlogSchema
    const { error } = createBlogSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { content, title, photopath, author } = req.body;

    //read photo inthe buffer
    const buffer = Buffer.from(
      photopath.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );
    //Allocate random names
    const imagePath = `${Date.now()}-${author}.png`;
    //store locally
    try {
      fs.writeFileSync(`storage/${imagePath}`, buffer);
    } catch (error) {
      return next(error);
    }
    //save blog in database
    let blog;
    try {
      const newBlog = new Blog({
        content,
        title,
        author,
        photopath: `${SERVER_BACKEND_PATH}/storage/${imagePath}`,
      });
      blog = await newBlog.save();
    } catch (error) {
      return next(error);
    }
    //sending response
    res.status(201).json({ blog });
  },
  //get all blogs method
  async getAll(req, res, next) {
    //get all blogs from database
    try {
      const blogs = await Blog.find({});
      const blogArr = [];
      for (let i = 0; i < blogs.length; i++) {
        const blog = blogs[i];
        blogArr.push(blog);
      }
      return res.status(200).json({ blogs: blogArr });
    } catch (error) {
      return next(error);
    }
  },
  // get blog by Id
  async getBlogById(req, res, next) {
    const getBlogIdSchema = Joi.object({
      id: Joi.string().required(),
    });
    const { error } = getBlogIdSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { id } = req.params;

    let blog;
    try {
      blog = await Blog.findOne({ _id: id });
    } catch (error) {
      return next(error);
    }
    //sending response
    res.status(200).json({ blog });
  },
  //update method
  async update(req, res, next) {
    const updateSchema = Joi.object({
      content: Joi.string(),
      title: Joi.string(),
      photopath: Joi.string(),
      author: Joi.string().regex(mongoIdPattern).required(),
      blogId: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = updateSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { content, title, photopath, author, blogId } = req.body;
    //delete previous photo and update new one
    try {
      const blog = await Blog.findOne({ _id: blogId });

      if (photopath) {
        let previous = blog.photopath;
        previous = previous.split("/").at(-1);
        //delete previous photo
        fs.unlinkSync(`/storage/${previous}`);
        //storeing new photo
        //read photo inthe buffer
        const buffer = Buffer.from(
          photopath.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
          "base64"
        );
        //Allocate random names
        const imagePath = `${Date.now()}-${author}.png`;
        //store locally
        try {
          fs.writeFileSync(`storage/${imagePath}`, buffer);
        } catch (error) {
          return next(error);
        }
        //save blog in database

        try {
          await Blog.updateOne(
            { _id: blogId },
            {
              content,
              title,
              photopath: `${SERVER_BACKEND_PATH}/storage/${imagePath}`,
            }
          );
        } catch (error) {
          return next(error);
        }
      } else {
        await Blog.updateOne({ _id: blogId }, { content, title });
      }
    } catch (error) {
      return next(error);
    }
    //sending response
    res.status(200).json({ message: "blog has been updated!!!" });
  },
  //delete blog method
  async delete(req, res, next) {
    const delteSchema = Joi.object({
      id: Joi.string().required(),
    });
    const { error } = delteSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { id } = req.params;
    try {
      await Blog.deleteOne({ _id: id });
      await Comment.deleteMany({});
    } catch (error) {
      return next(error);
    }
    //sending response
    res.status(200).json({ message: "blog has been deleted!!!" });
  },
};

export default blogController;
