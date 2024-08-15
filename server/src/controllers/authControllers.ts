import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import {
  validateUsername,
  validateEmail,
  validatePassword,
} from "../utils/validators/userValidator";

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!validateUsername(username)) {
    return res
      .status(400)
      .json({ message: "Username must be 3-15 alphanumeric characters." });
  }

  // Validate email
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  // Validate password
  if (!validatePassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, and a number.",
    });
  }
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const existingName = await User.findOne({ username });
    if (existingName) {
      return res.status(400).json({ message: "Username Already Taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    // Send the token and user information in the response
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }
  if (!validatePassword(password)) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long." });
  }

  try {
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unknown error occurred.");
    }
    res.status(500).send("Server error");
  }
};
