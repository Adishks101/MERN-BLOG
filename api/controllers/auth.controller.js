import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

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
