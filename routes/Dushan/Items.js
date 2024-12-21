//Items.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Profile = require("../models/profileSchema");
const Item = require("../models/itemSchema");

const authmiddleware = require('../middleware/AuthMiddleware');


router.route('/getItemById/:id').get(async (req,res) => {
    const id = req.params.id
    console.log(id);

    try{
        const item = await Item.findById(id);

        if(!item){
            return res.status(200).send({message : "no item",sucess:false});
        }

        res.status(200).send({message:"Item fetched",data:item,sucess:true});
        console.log(item);
    }catch(err){
        res.status(500).send(err.message);
    }
})

router.route("/getAllitems").get(async (req,res) =>{
    console.log("gey all items ---------------------------------------")

    const page = parseInt(req.query.page) || 1;  // Default to page 1
    const limit = parseInt(req.query.limit) || 12; // Default to 10 items per page

    try {
        const item_List = await Item.find();
        console.log("iem_list.length",item_List.length);
        console.log(item_List[0].name);

        if(!item_List){
            return res.status(200).send({message: "no Items", sucess:false});
        }

        const startIndex = (page -1) * limit;
        const paginatedResults = item_List.slice(startIndex,startIndex + limit);
        console.log(paginatedResults.length)

        res.status(200).send({message:"Items fetched",totalpages:Math.ceil(item_List.length/limit),data:paginatedResults,sucess:true});
    } catch (error) {
        res.status(500).send(error.message);
    }

})

module.exports =router;