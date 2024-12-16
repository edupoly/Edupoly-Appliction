const express = require("express");
const bodyparser = require("body-parser")
const mongoose = require('mongoose')
const cors = require("cors")
const Technology = require("./models/technology.model")


const app = express();

app.use(cors())
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

mongoose.connect("mongodb+srv://sai:sai987654321@atlascluster.ym1yuin.mongodb.net/edupoly?retryWrites=true&w=majority&appName=AtlasCluster")

// technology routes

app.get("/technologies", async(req,res)=>{
    try {
        const data = await Technology.find({})
        console.log(data)
        if(!data){
            return res.json({msg:"Technologies not found"})
        }
        res.send(data)
    } catch (error) {
         res.json({msg:"server Error"})
    }
})

app.post("/addtechnology", async(req, res) => {
    try {
        const { title, description, image } = req.body;
        const technology = new Technology({
            title,
            image,
            description
        });
        const savedtechnology = await technology.save()
        if(!savedtechnology){
            return res.json({msg:"Technology not added"})
        }
        res.json({msg:"Technology added successfully",id:savedtechnology._id})
        
    } 
    catch (error) {
        res.json({msg:"Error in adding technology"})
    }
});


app.get("/gettechnologies",async(req,res)=>{
    try {
        const tech = await Technology.find()
        if(!tech){
        return res.json({msg:"no technology found"})
        }
        res.send(tech)
    } catch (error) {
        res.json({msg:"Error in finding technologies"})
    }
})

app.get("/gettechnology/:id",async(req,res)=>{
    try {
        const technology = await Technology.findOne({_id:req.params.id})
        if(!technology){
        return res.json({msg:"no technology found"})
        }
        res.send(technology)
    } catch (error) {
        res.json({msg:"Error in finding technologyy"})
    }
})


app.put("/updatetechnology/:id",async(req,res)=>{
    try {
        var updateddata = req.body
        const technology = await Technology.findOneAndUpdate({_id:req.params.id},updateddata,{new:true})
        console.log(technology)
        if(!technology){
           return res.json({msg:"technology not updated"})
        }
        res.json({msg:"technology updated succesfully"})
    } catch (error) {
        res.json({msg:"server error"})
    }
})


app.delete("/deletetechnology/:tid", async (req, res) => {
    try {
        console.log(req.params.tid)
        const deletedTechnology = await Technology.findByIdAndDelete(req.params.tid);
        console.log(deletedTechnology)
        if (!deletedTechnology) {
            return res.json({ message: "Technology not found" });
        }
        res.json({ msg: "Technology deleted successfully"});

    } catch (error) {
        res.json({ msg: "Server error"});
    }
});


// concept routes


app.put("/addconcept/:tid",async(req,res)=>{
    try {
        var obj = req.body
        const concept  = await Technology.findOneAndUpdate(
            {_id:req.params.tid },
            {$push:{concepts:obj}} 
        )
        if(!concept){
           return res.json({msg: "concept is not added"})
        }
        res.json({msg:"concept added succesfully"})
    } catch (error) {
        res.json({ msg: "Server error", error });
    }
    
})


app.put("/updateconceptname/:tid/:cid",async(req,res)=>{
    try {
        var {conceptName} = req.body
        const concept = await Technology.findOneAndUpdate(
                {_id:req.params.tid,"concepts._id":req.params.cid},
                {$set:{"concepts.$.conceptName":conceptName}}
        )
        if(!concept){
            return res.json({msg: "concept not updated"})
         }
         res.json({msg: "concept updated succesfully"})
    } catch (error) {
        res.json({ msg: "Server error", error });
    }
})


app.delete("/deleteconcept/:tid/:cid",async(req,res)=>{
    try {
        const concept = await Technology.findOneAndUpdate(
            { _id: req.params.tid },
            { $pull: { concepts: { _id: req.params.cid } } },
            {new:true}
        );
        if(!concept){
            return res.json({msg: "concept not deleted"})
        }
        res.json({msg: "concept deleted succesfully"})
    } catch (error) {
        res.json({ msg: "Server error", error });
    }
})



// topic routes


app.get("/topicdetails/:tid/:cid",async(req,res)=>{
    try {
       var topic = await Technology.findOne(
        {_id:req.params.tid,"concepts._id":req.params.cid},
        { "concepts.$": 1 }
       )
       console.log(topic)
       res.send(topic)
    } catch (error) {
        console.log("error in topic")
    }
})



app.put("/addtopic/:tid/:cid",async(req,res)=>{
    try {
        console.log("88888",req.body)
        var obj = {...req.body}
        console.log("ooo",obj)
        const topic = await Technology.findOneAndUpdate(
            {_id: req.params.tid, "concepts._id": req.params.cid},
            {$push:{"concepts.$.topics":obj}},
            {new:true}
        )
        console.log("topic",topic)
        if(!topic){
           return res.json({msg:"topic is not added"})
        }
        res.json({msg:"topic added succesfully"})
    } catch (error) {
        res.json({ msg: "Server error", error });
    }
})


app.get("/gettopicdetails/:tid/:cid/:toid",async(req,res)=>{
     try {
      var topic =  await Technology.findOne(
        {_id:req.params.tid,"concepts._id":req.params.cid,"concepts.topics._id":req.params.toid},
        {"concepts.topics.$":1}
      )
      res.send(topic)
     } catch (error) {
        res.json({msg:"server error"})
     }
})



app.put("/updatetopic/:tid/:cid/:toid",async(req,res)=>{
    try {
        console.log(req.body)
        const updatedTopic = await Technology.findOneAndUpdate(
            {_id: req.params.tid,"concepts._id": req.params.cid,"concepts.topics._id": req.params.toid,},
            {
                $set: {
                    "concepts.$.topics.$[topic].title": req.body.title,
                    "concepts.$.topics.$[topic].shortheading": req.body.shortheading,
                    "concepts.$.topics.$[topic].contents": req.body.contents,
                },
            },
            {
                arrayFilters: [{ "topic._id": req.params.toid }],
                new: true,
            }
        );
        if(!updatedTopic){
            return res.json({msg:"topic is not updated"})
        }
        res.json({msg:"topic updated succesfully"})

    } catch (error) {
        res.json({msg:"server error"})
    }
})



app.delete("/deletetopic/:tid/:cid/:toid",async(req,res)=>{
    try {
       var topic =  await Technology.findOneAndUpdate(
            { _id:req.params.tid,"concepts._id":req.params.cid },
            { $pull: {"concepts.$.topics":{ _id: req.params.toid}}},
            {new:true}
        )
        if(!topic){
            return res.json({msg:"topic not deleted"})
        }
        res.json({msg:"topic deleted succesfully"})
    } catch (error) {
        res.json({msg:"server error"})
    }
})


app.listen(7777,()=>{
    console.log("server is running on 7777")
})