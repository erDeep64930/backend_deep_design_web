const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// auth

exports.auth = async (req, res, next) => {
  try {
    // extract the token from the request header
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization")?.replace("Bearer ", "");
    // if token is missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing. Please login again.",
      });
    }
    // verify the token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      clg("Decoded token:", decoded);
      req.user = decoded; // attach user info to request object
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
      next(); // proceed to the next middleware or route handler
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Internal server error during authentication. Please try again. / something went wrong in validating the token.",
    });
  }
};

// isStudent

exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "student") {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. You are not authorized to access this resource. this is student route",
      });
    }
    next(); // proceed to the next middleware or route handler
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while checking accountType role.",
    });
  }
};

// isTeacher

exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "instructor") {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. You are not authorized to access this resource. this is instructor route",
      });
    }
    next(); // proceed to the next middleware or route handler
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while checking accountType role.",
    });
  }
};

// isAdmin

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. You are not authorized to access this resource. this is Admin route",
      });
    }
    next(); // proceed to the next middleware or route handler
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while checking accountType role.",
    });
  }
};
