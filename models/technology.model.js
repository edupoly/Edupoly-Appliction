const mongoose = require("mongoose");

const topicSchema = mongoose.Schema({
    title:String,
    shortheading:String,
    contents:String
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


