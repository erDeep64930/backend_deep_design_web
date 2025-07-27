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
