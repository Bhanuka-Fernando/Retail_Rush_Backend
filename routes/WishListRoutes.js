const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Profile = require("../models/profileSchema");
const Item = require("../models/itemSchema");
const WishList = require("../models/wishList");
const Store = require("../models/storeSchema");



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

    const combinedData = [];

    try {
        const wishlist_result = await wishList.findOne({ userId: user_Id }).populate('items');
        
        if (wishlist_result) {
            const combinedItems = await Promise.all(
                wishlist_result.items.map(async (element) => {
                    console.log(element.storeId);
                    
                    // Fetch the store details for the given storeId
                    const storeDetails = await Store.findOne({ storeId: element.storeId });
                    console.log('---------', storeDetails);
            
                    // Return the combined data, only the item properties and store details
                    return {
                        _id: element._id,  // Item _id
                        storeId: element.storeId,
                        itemId: element.itemId,
                        name: element.name,
                        category: element.category,
                        subcategory: element.subcategory,
                        description: element.description,
                        img_url: element.img_url,
                        price: element.price,
                        quantity: element.quantity,
                        tags: element.tags,  // Assuming tags is an array
                        createdAt: element.createdAt,
                        updatedAt: element.updatedAt,
                        store: storeDetails ? {  // Add the store details
                            storeId: storeDetails.storeId,
                            name: storeDetails.name,
                            location: storeDetails.location,
                            operatingHours : storeDetails.operatingHours
                        } : null
                    };
                })
            );

            console.log("combined records", combinedItems)
    
            // Return the result wrapped inside the 'items' array
            res.status(200).send({
                message: "ok",
                success: true,
                //data:wishlist_result
                data: {
                    items: combinedItems  // Wrap combined data in items array
                }
            });
            
        } else {
            res.status(200).send({ message: "no data", success: false });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "An error occurred", success: false });
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