const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    // data fetch
    const { sectionName, courseId } = req.body;
    // data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required / missing properties",
      });
    }
    // create section
    const newSection = await Section.create({
      sectionName,
    });
    // update course with section id
    const updateCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      { $push: { sections: newSection._id } },
      { new: true }
    );
    // populate to replace section and sub section both in the updatedCourseDetails

    // return response
    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      data: updateCourseDetails,
    });
  } catch (error) {
    console.error("Error creating section:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// handler section update

exports.updateSection = async (req, res) => {
  try {
    // data input
    const { sectionId, sectionName } = req.body;

    // data validation

    if (!sectionId || !sectionName) {
      return res.status(400).json({
        success: false,
        message: "Section ID and section name are required ",
      });
    }

    // find section by id / update section
    const section = await Section.findById(sectionId);
    if ((sectionId, { sectionName }, { new: true }))
      // update section name
  return res.status(200).json({
        success: true,
        message: "Section updated successfully",
        data: section,
      });

    // if section not found
    return res.status(404).json({
      success: false,
      message: "Section not found",
    });
 
    // return response
  } catch (error) {
    console.error("Error updating section:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// export delete section

exports.deleteSection = async (req, res) => {
  try {
  // get the id
  const { sectionId } = req.params;

  // use findByIdAndDelete to delete section

  await Section.findByIdAndDelete(sectionId);
  
  // [testing] do we need to delete the entry from the course schema
  
  // return response
  
  return res.status(200).json({
    success: true,
    message: "Section deleted successfully",
  });

  } catch (error) {
    console.error("Error deleting section:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    
  }
}
