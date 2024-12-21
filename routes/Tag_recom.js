const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Profile = require("../models/profileSchema");
const Item = require("../models/itemSchema");

const authmiddleware = require('../middleware/AuthMiddleware');



// Helper function to calculate similarity score
function calculateScore(userTags, itemTags,itemname) {
    const commonTags = userTags.filter(tag => itemTags.includes(tag.tag));
    //console.log("ItemName:",itemname)
    commonTags.forEach(element => {
       // console.log("Tag:",element.tag,"Count:",element.count);
        
    })
    const score = commonTags.reduce((acc,element) => {
        return acc + element.count;
    },0);
    //const commonTags = userTags.filter(tag => itemTags.includes(tag));
    //console.log("userTags",userTags);
    //console.log("itemtags",itemTags)
    //console.log("commontags",commonTags)
    //console.log("SCore:",score);
    return score;
  }
  
  // Route to get recommendations for a user
  router.get('/recommendations/:userId', async (req, res) => {
    try {
      const user = await Profile.findById(req.params.userId);
      const pu = user.tags.map(tag => tag);
      console.log("tagcount",pu)
      const ptags = user.tags.map(tag => tag.tag);
      const ptags_counts = user.tags.map(count => count.count);
      //console.log("tag.count",ptags_counts);
      /*pu.forEach(element => {
        console.log("TAG:",element.tag);
        console.log("count",element.count);
      })*/
      //console.log("user.tags",ptags)
      const items = await Item.find();
        
      const recommendations = items.map(item => ({
        item,
        score: calculateScore(pu, item.tags,item.name),
      })).sort((a, b) => b.score - a.score);
  
      res.json(recommendations);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });


  router.route("/recommendations").get(authmiddleware,async(req,res)=>{
    const id = req.body.userID;
    console.log("Recoms for ",id)

    try {
        const user = await Profile.findById(id);
        const pu = user.tags.map(tag => tag);
        //console.log("tagcount",pu)
        const ptags = user.tags.map(tag => tag.tag);
        const ptags_counts = user.tags.map(count => count.count);
        console.log("tag.count",ptags_counts);
        /*pu.forEach(element => {
          console.log("TAG:",element.tag);
          console.log("count",element.count);
        })*/
        console.log("user.tags",ptags)
        const items = await Item.find();
       //console.log("items",items);
          
        const recommendations = items.map(item => ({
          item,
          score: calculateScore(pu, item.tags,item.name),
        })).sort((a, b) => b.score - a.score).slice(0,10);
        //console.log("recoms",recommendations);
        
        res.json(recommendations);

        
      } catch (err) {
        res.status(500).send(err.message);
      }
    
  });

  
  router.route("/clicked").post(authmiddleware,async(req,res)=>{
  
    console.log(".....")
    console.log(".....")
    console.log(".....")
    console.log(".....")
    console.log(".....")
    console.log(".....")

    
      try{
        const itemId = req.body.item_id;
          const idp = req.body.userID;
          console.log("itemid",itemId);
          const profile = await Profile.findById(idp);
          const ptags = profile.tags.map(tag => tag.tag);
          console.log(ptags)
          const tags = await Item.findById(itemId);
          console.log(tags.tags);
          const matchingtags = tags.tags.filter(tag => ptags.includes(tag));
          console.log('matched1:',matchingtags);
          const newtags = [];
           
          const tagmap = tags.tags.forEach(element =>{
              if(ptags.includes(element)){
                  console.log("element matched:",element);
                  const mt = profile.tags.find(tag => tag.tag === element);
                  mt.count = mt.count + 1;
                  console.log("mt",mt);
              }else{
                  console.log("element not matched:",element);
                  profile.tags.push({tag:element,count : 1});
                  newtags.push(element);
              }
          });
          const ptagmap = ptags.forEach(element => {
              if(!tags.tags.includes(element)){
                  const tm = profile.tags.find(tag => tag.tag === element);
                  if(tm.count <= 0){
                    tm.count = 0
                  }else{
                    tm.count = tm.count  - 1;
                  }
                  
              }
          })
          console.log('new Tags:',newtags);
          await profile.save();
  
          
          
          /*matchingtags.forEach(element => {
              const mt = profile.tags.find(tag => tag.tag === element);
              mt.count = mt.count + 1;
              console.log('mt',mt)
              
          });*/
         
          
          res.json(tags.tags);
      }catch (err){
          res.status(500).send(err.message);
      }
  
    });


    router.route('/simileritems/:id').get(async (req,res) =>{


      const id = req.params.id;
      console.log(id);

      try{
        const tags = await Item.findById(id);
        console.log(tags.tags);
        const mainItemTags = tags.tags;
        let resp = await Item.find({tags: {$in:mainItemTags}})
        console.log(resp);

        let scoredItems = resp.filter(item => item._id.toString() !== id)
        .map(item => {
          const matchedTags = item.tags.filter(tag => mainItemTags.includes(tag));
          return {
            ...item._doc,
            score:matchedTags.length
          };
        });

        scoredItems = scoredItems.sort((a,b) => b.score - a.score).slice(0,6);

        //resp = resp.filter(item => item._id.toString() !== id).sort((a, b) => a.score - b.score).slice(0,6);;
        //console.log("----------------------------------------");
        //console.log(resp);
        res.status(200).send(scoredItems);
      }
      catch(err){
        console.log(err)
        res.status(500).send({message:"unsucess"});
      }


      
    })

  module.exports =router;