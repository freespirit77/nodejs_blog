const mongoose = require("mongoose");

const postsSchema = mongoose.Schema({
    postId: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    editor: {
        type: String,
        required: true,
    },
    postPw: {
        type: String,
        required: true,
    },
    content: {
        type: String,
    },
    editDate : {
        type : Date,
        required : true,
        default: Date.now
    },
});

module.exports = mongoose.model("Posts", postsSchema);