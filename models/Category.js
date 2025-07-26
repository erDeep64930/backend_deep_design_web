const mongoose = require('mongoose');
// define the tags schema
const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
       
        
    },
    description:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    }
})

// export the tag model
const Category = mongoose.model('Category', categorySchema);