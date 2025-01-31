const mongoose = require("mongoose");

const contentSchema = mongoose.Schema({
    title: String,
    shortheading: String,
    type:String,
    content:String
})

const topicSchema = mongoose.Schema({
    title:String,
    shortheading:String,
    contents:[contentSchema]
})

const conceptSchema = mongoose.Schema({
    conceptName:String,
    topics:[topicSchema]
})

const technologySchema = mongoose.Schema({
    title:String,
    image:String,
    description:String,
    concepts:[conceptSchema]
},{timestamps:true});


const Technology = mongoose.model("Technology",technologySchema)
module.exports = Technology