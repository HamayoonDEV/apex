import Joi from "joi";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import JwtServices from "../services/JwtServices.js";
import RefreshToken from "../models/token.js";

const passwordPattren =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/;
const authController = {
  //user Register method
  async register(req, res, next) {
    //validate user input using joi
    const userRegisterSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      name: Joi.string().max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattren).required(),
    });
    //validate userReisterSchema
    const { error } = userRegisterSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { username, name, email, password } = req.body;

    //password hashing using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    //handle email and username conflict
    try {
      const emailInUse = await User.exists({ email });
      const usernameInUse = await User.exists({ username });

      if (emailInUse) {
        const error = {
          status: 409,
          message: "email is already in use please use anOther email!!!",
        };
        return next(error);
      }
      if (usernameInUse) {
        const error = {
          status: 409,
          message: "username is not available please use anOther username!!!",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
    //save register method in database
    let user;
    try {
      const userToRegiseter = new User({
        username,
        name,
        email,
        password: hashedPassword,
      });
      user = await userToRegiseter.save();
    } catch (error) {
      return next(error);
    }

    //genrate token
    const accessToken = JwtServices.signAccessToken({ _id: user._id }, "30m");
    const refreshToken = JwtServices.signRefreshToken({ _id: user._id }, "60m");
    //storeRefreshToken in database
    await JwtServices.storeRefreshToken({ _id: user._id, token: refreshToken });
    //sending tokens to the cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });
    //sending response
    res.status(201).json({ user, auth: true });
  },
  //login method
  async login(req, res, next) {
    const userLoginSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattren).required(),
    });
    const { error } = userLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { username, password } = req.body;
    let user;
    try {
      user = await User.findOne({ username });
      if (!user) {
        const error = {
          status: 401,
          message: "invalid Username!!!",
        };
        return next(error);
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        const error = {
          status: 401,
          message: "invalid password",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    //genrate token
    const accessToken = JwtServices.signAccessToken({ _id: user._id }, "30m");
    const refreshToken = JwtServices.signRefreshToken({ _id: user._id }, "60m");
    //update refreshToken to the database
    await RefreshToken.updateOne(
      { _id: user._id },
      { token: refreshToken },
      { upsert: true }
    );
    //sending tokens to the cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    //sending response
    res.status(200).json({ user, auth: true });
  },
  //logOut method
  async logOut(req, res, next) {
    //fetch refresh Token from cookies
    const { refreshToken } = req.cookies;
    //delete refreshToken
    try {
      await RefreshToken.deleteOne({ token: refreshToken });
    } catch (error) {
      return next(error);
    }
    //clearCookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    //send response
    res.status(200).json({ user: null, auth: true });
  },
  //refreshToken method
  async refresh(req, res, next) {
    //fetch refreshToken from cookies
    const originalRefreshToken = req.cookies.refreshToken;
    //verify refreshToken

    let id;
    try {
      id = JwtServices.verifyRefreshToken(originalRefreshToken)._id;
    } catch (error) {
      const e = {
        status: 401,
        message: "unAuthorized!!!",
      };
      return next(e);
    }

    //match refreshToken
    try {
      const match = await RefreshToken.findOne({
        _id: id,
        token: originalRefreshToken,
      });
      if (!match) {
        const error = {
          status: 401,
          message: "unAuthorized!!!",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
    //genrate new token
    const accessToken = JwtServices.signAccessToken({ _id: id }, "30m");
    const refreshToken = JwtServices.signRefreshToken({ _id: id }, "60m");
    //update refreshTokens
    await RefreshToken.updateOne({ _id: id }, { token: refreshToken });
    //send tokens to the cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    //send response
    const user = await User.findOne({ _id: id });
    res.status(200).json({ user, auth: true });
  },
};

export default authController;
