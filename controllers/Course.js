const { trusted } = require("mongoose");
const Course = require("../models/Course");
const Tag = require("../models/Tag");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// create course handler function

exports.createCourse = async (req, res) => {
  try {
    // fetch the data
    const { courseName, courseDescription, price, tag, whatYouWillLearn } =
      req.body;

    // get the thumbnail

    const thumbnail = req.files.thumbnailImage;

    // validation
    if (
      !courseName ||
      !courseDescription ||
      !price ||
      !tag ||
      !whatYouWillLearn ||
      !thumbnail
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    // check the instructor
    const userId = req.user._id;
    const instructorDetails = await User.findById(userId);
    console.log("instructorDetails:", instructorDetails);

    if (!instructorDetails) {
      return res
        .status(404)
        .json({ success: false, message: "Instructor not found" });
    }

    // check tag are valid or not
    const tagDetails = await Tag.findById(tag);

    if (!tagDetails) {
      return res.status(404).json({ success: false, message: "Tag not found" });
    }
    // upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME,
      "course-thumbnails",
      500,
      80
    );

    // create course
    const newCourse = new Course({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      thumbnail: thumbnailImage.secure_url,
      tag: tagDetails._id,
    });

    // save the course
    await Course.save();

    // add course to instructor's courses
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // update tag with the new course
    await Tag.findByIdAndUpdate(
      { _id: tagDetails._id },
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // return response
    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
    });

  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get all course handler function

exports.getAllCourses = async (req, res) => {
    try {
        // fetch all courses
        const allCourses = await Course.find({},
        {
            courseName: true,
            courseDescription: trusted,
            price: true,
            thumbnail: true,
            tag: true,
            instructor: true,
            ratingAndReviews: true,
            whatYouWillLearn: true,
            studentsEnrolled: true,
            totalHours: true,
        }).populate("instructor").exec();

        // return response
        res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            courses: allCourses,
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
