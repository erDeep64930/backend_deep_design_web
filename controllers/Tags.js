const Tag = require("../models/Tag");

exports.createTag = async (req, res) => {
  try {
    // fetch data
    const { name, description } = req.body;
    // validation
    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and description are required", success: false });
    }
    //   create entry in db
    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });
    console.log("tag created successfully", tagDetails);
    // send response
    return res.status(200).json({
      message: "Tag created successfully",
      success: true,
      data: tagDetails,
    });
  } catch (error) {
    console.error("Error creating tag:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// get all handler function
exports.getAllTags = async (req, res) => {
  try {
    // fetch all tags
    const tags = await Tag.find();
    // send response
    return res.status(200).json({
      message: "Tags fetched successfully",
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};