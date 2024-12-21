const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Profile = require("../models/profileSchema");
const Item = require("../models/itemSchema");
const WishList = require("../models/wishList");


const authmiddleware = require('../middleware/AuthMiddleware');
const wishList = require("../models/wishList");


router.route("/add").post(authmiddleware,async (req,res) => {

    const id = req.body.item_id;
    const user_Id = req.body.userID;

    console.log(id)
    console.log(user_Id);

    try{
        const wishList_exsist = await wishList.findOne({userId:user_Id})
        //console.log("wishexttttttt",wishList_exsist);

        if(wishList_exsist){

            console.log("gonna update");
            wishList_exsist.items.push(id);
            await wishList_exsist.save();

            res.status(200).send({message:"Updated",success:true});

            
        }else{
            try{

                const wishlist = await WishList.create({
                    userId : user_Id,
                    items : [id]
        
                })
                console.log("sdsdsdsdsdsds")
                console.log(wishlist);
                console.log("sdsdsdsdsdsds")
        
                res.status(200).send({message:"badu weda",success:true});
        
            }catch(err){
        
                res.status(500).send({message:"badu weda na"+err,success:false});
            }
        }


    }catch(err){
        console.log(err);
    }

})

router.route("/get").get(authmiddleware,async(req,res) => {

    const user_Id = req.body.userID;
    console.log(user_Id);

    try{
        const wishlist_result = await wishList.findOne({userId:user_Id}).populate('items');
        

        if(wishlist_result){
            res.status(200).send({message:"ok",success:true,data:wishlist_result});
            console.log("wishlist",wishlist_result.items[0].name);
        }else{
            res.status(200).send({message:"no data",success:false});
        }

    }catch(err){
        console.log(err);
    }
    
})

router.route("/delete/:id").delete(authmiddleware,async(req,res) => {
    const id = req.params.id;
    const user_Id = req.body.userID;
    console.log("delete");
    console.log(id);

    try{
        const deleteitem = await wishList.findOneAndUpdate(
            {userId : user_Id},
            {$pull:{items:id}},
            {new :true}

        );

        console.log("-------------------------------------")
        console.log(deleteitem);
        console.log("-------------------------------------")


        if(!deleteitem){
            res.status(500).send({message:"not deleted",success:false});
        }
        res.status(200).send({message:"delete",success:true});
    }catch(err){
        console.log(err);
    }
    
})


module.exports =router;