const { instance } = require("../config/razorpay");

const Course = require("../models/Course");

const User = require("../models/User");

const mailSender = require("../utils/mailSender");

const {
  courseEnrollmentEnail,
} = require("../utils/emailTemplates/courseEnrollmentEmail");

// capture the payment

exports.capturePayment = async (req, res) => {
  //get the course and user id
  //  validation
  // valid cousreID
  // VALID COURSEdETAILS
  // user already pay for the same course
  // order create
  // return response

  // step1
  const { course_id } = req.body;
  const userId = req.user.id;
  // step2
  if (!course_id) {
    return res.json({
      success: false,
      message: "please provide the valid course",
    });
  }
  //   step3
  let course;
  try {
    course = await Course.findById(course_id);
    if (!course) {
      return res.json({
        success: false,
        message: "could not find the course",
      });
    }
    //  step4 user already pay for the same

    const uid = new mongoose.Types.ObjectId(userId);

    if (Course.studentsEnrolled.includes(uid)) {
      return res.status(200).json({
        success: false,
        message: "this student is already enrolled",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  // create order

  const amount = course.price;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
    notes: {
      courseID: course_id,
      userId,
    },
  };

  try {
    // initiate the payment using razorpay
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);
    return res.status(200).json({
      success: true,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      thumbnail: course.thumbnail,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false.valueOf,
      message: "could not initiate the order",
    });
  }

  // return response
};

// verify Signature of Razorpay and server

exports.verifySignature = async (req, res) => {
  const webhookSecret = "123456789";

  const signature = req.headers["x-razorpay-signature"];

  const shasun = crypto.createHmac("sha256", webhookSecret);

  shasun.update(JSON.stringify(req.body));

  const digest = shasun.digest("hex");

  if (signature === digit) {
    console.log("payment is authorised");
    const { course, userId } = req.body.payload.payment.entity.notes;
    try {
      // fulfill the action
      // find the coursed and enrolled the student in it
      const enrolledCourse = await courseEnrollmentEnail.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          message: "course not found",
        });
      }
      console.log(enrolledCourse);

      // find the student and add  the course to their list of enrolled courses

      const enrolledStudent = await Usre.findOneAndUpdate(
        { _id: userId },
        { $push: { courses: courseId } },
        { new: true }
      );
      console.log(enrolledStudent);

      //   send the mail / confirmation mail send to the user
      const emailResponse = await mailSender(
        enrolledStudent.email,
        "Congratulation you are enrolled into deep design web"
      );
      console.log(emailResponse);
      return res.status(200).json({
        success: true,
        message: "signature verified and course added",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "invalid request",
    });
  }
};
