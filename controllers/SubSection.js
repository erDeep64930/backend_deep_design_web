const SubSection = require('../models/SubSection');
const Section = require('../models/Section');


// create a sub section
exports.createSubSection = async (req, res) => {
    try {

        // get the data from the request body /fetch the data
const { title, description, videoUrl, sectionId ,timeDuration} = req.body;

        // extract the video

        const video = req.files.videoFile;

        // validation

        if (!title || !description || !videoUrl || !sectionId) {
            return res.status(400).json({ message: 'All fields are required' });
        }


        // upload video to cloudinary

        const videoUpload = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);

    //    update the section with the new sub section
 const SubSectionDetails = await SubSection.create({
        title,
        description,
        timeDuration,
        videoUrl: videoUpload.secure_url,
    });

    // update the section with the new sub section
    const updatedSection = await Section.findByIdAndUpdate(
        {_id: sectionId },
        { $push: { subSections: SubSectionDetails._id } },
        { new: true }
    );
// return the response
    res.status(200).json({
        message: 'Sub section created successfully',
        subSection: SubSectionDetails,
    })
    
    
    // log updated section here , after adding populate query
    console.log('Updated Section:', updatedSection);
        

    } catch (error) {
        console.error('Error creating sub section:', error);
        res.status(500).json({ message: 'Internal server error' });
        
    }
}

// delete sub section
exports.deleteSubSection = async (req, res) => {
    try {
        // get the sub section id from the request params
        const { subSectionId } = req.params;

        // find the sub section by id and delete it
        const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);

        // if sub section not found, return 404
        if (!deletedSubSection) {
            return res.status(404).json({ message: 'Sub section not found' });
        }

        // remove the sub section id from the section's subSections array
        await Section.updateOne(
            { subSections: subSectionId },
            { $pull: { subSections: subSectionId } }
        );

        // return success response
        res.status(200).json({
            message: 'Sub section deleted successfully',
            deletedSubSection,
        });
        
    } catch (error) {
        console.error('Error deleting sub section:', error);
        res.status(500).json({ message: 'Internal server error' });
        
    }
}