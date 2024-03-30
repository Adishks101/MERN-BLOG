import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  const { username, password, email } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    password === "" ||
    email === "" ||
    username === ""
  ) {
    next(errorHandler(400, "All fields are required."));
  } else {
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    try {
      await user.save();
      res.json("created successfully.");
    } catch (error) {
      next(error);
    }
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(errorHandler(400, "All fields are required."));
  } else {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        next(errorHandler(400, "Invalid Credentials."));
      } else {
        const { password: pass, ...userDetails } = user._doc;
        const isMatch = bcryptjs.compareSync(password, pass);
        if (isMatch) {
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
          res
            .status(200)
            .cookie("access_token", token, { httpOnly: true })
            .json(userDetails);
        } else {
          next(errorHandler(400, "Invalid Credentials."));
        }
      }
    } catch (error) {
      next(error);
    }
  }
};
