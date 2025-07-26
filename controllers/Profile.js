const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    // get the data
    const { gender, dateOfBirth = "", about = "", contactNumber } = req.body;
    // get user id
    const id = req.user.id;
    // validation
    if (!contactNumber || !dateOfBirth || !gender) {
      return res.status(400).json({
        success: false,
        message:
          "Contact number and date of birth are required./ all fields are required",
      });
    }
    // find profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    // update profile

    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;

    await profileDetails.save();

    // return response
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: profileDetails,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// delete account
exports.deleteAccount = async (req, res) => {
  try {
    // get user id
    const id = req.user.id;

    // validation
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

    //delete user
    await User.findByIdAndDelete({ _id: id });

    // return response
    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get all user profiles
exports.getAllDetails = async (req, res) => {
    try {
        // get id
        const id = req.user.id;
        // validation and get the user
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
       

        // return response
        return res.status(200).json({
            success: true,
            message: "User profiles fetched successfully",
            profiles: userDetails.additionalDetails,
        });
        
    } catch (error) {
        console.error("Error fetching profiles:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


