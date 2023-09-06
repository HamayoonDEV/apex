import Joi from "joi";
import Comment from "../models/comment.js";

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
const commentController = {
  //create comment methd
  async createComment(req, res, next) {
    const createCommentSchema = Joi.object({
      content: Joi.string().required(),
      blog: Joi.string().regex(mongoIdPattern).required(),
      author: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = createCommentSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { content, blog, author } = req.body;
    let comment;
    try {
      const newComment = new Comment({
        content,
        blog,
        author,
      });
      comment = await newComment.save();
    } catch (error) {
      return next(error);
    }
    //sending response
    res.status(201).json({ comment });
  },
  //read comment method
  async readComments(req, res, next) {
    const readCommentSchema = Joi.object({
      id: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = readCommentSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { id } = req.params;
    try {
      const comments = await Comment.find({ blog: id });
      const commentArr = [];
      for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];
        commentArr.push(comment);
      }
      //sending response
      res.status(200).json({ commentArr });
    } catch (error) {
      return next(error);
    }
  },
};

export default commentController;
