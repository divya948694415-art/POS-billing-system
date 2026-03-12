import bcrypt from "bcrypt" 
import jwt from "jsonwebtoken" 
import newUser from "../models/User.js"



export const register = async (req, res) => {
  try {
    const { userName, userEmail, userPassword } = req.body;

    const existing = await newUser.findOne({ userEmail });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(userPassword, salt);

    const newdata = await newUser({
      userName,
      userEmail,
      userPassword: hashed
    }).save();

    return res.status(201).json({
      message: "New user registered successfully",
      newdata
    });

  } catch (error) {
    return res.status(500).json({ message: "Unable to register" });
  }
};
export const logIn = async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;

    const exist = await newUser.findOne({ userEmail });
    if (!exist) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(userPassword, exist.userPassword);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userEmail: exist.userEmail },"divya",{ expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token
    });

  } catch (error) {
    return res.status(500).json({ message: "Login failure" });
  }
};
export const verifyToken = (req, res, next) => {
  const authorize = req.headers["authorization"];

  if (!authorize) {
    return res.status(401).json({
      message: "Authorization token not provided"
    });
  }

  // Expected format: Bearer token
  const token = authorize.split(" ")[1];

  try {
    const decode = jwt.verify(token, "divya");
    req.user = decode;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Access denied" });
  }
};
