//In models you define your database the schema of your data
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
       
    },{timestamps: true});

module.exports = mongoose.model("Category",CategorySchema);