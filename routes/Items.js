const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Profile = require("../models/profileSchema");
const Item = require("../models/itemSchema");
const Store = require("../models/storeSchema");
const Discount = require("../models/discountModel");
//const Discount = require("../models/Bhanuka/discountModel");

const authmiddleware = require('../middleware/AuthMiddleware');

router.route('/getdiscount').get(async (req,res) => {
    const itemId = "1001";
    const storeId = "s001";

    res = await Discount.findOne({itemId:itemId,storeId:storeId});
    console.log(res);
})

/*router.route('/getstoresby_Id/:id').get(async (req,res) => {
    const id = req.params.id;
    //const validItemId = mongoose.Types.ObjectId(id);


    try{
    const store = await Store.find({ items: id }).populate('items');
    console.log("------")
    console.log("------")
    console.log("------")
    console.log(store);

    if(!store){
        return res.status(200).send({message : "no stores",sucess:false});
    }
    res.status(200).send({message:"stores fetched",data:store,sucess:true});
    }
catch(err){
    console.log(err);
    res.status(500).send(err.message);
}})
*/

router.route('/getstoresby_Id/:id').get(async (req, res) => {
    const id = req.params.id;
    let storeIds = [];
    let currentStore = "";
    let discounts = [];

    try {
        // Find the item by id
        const item = await Item.findById(id);
        
        // Find all discounts related to the item
        let alldiscounts = await Discount.find({ itemId: item.itemId });
        console.log("All discounts:", alldiscounts);

        // Get all items with the same itemId
        const allitems = await Item.find({ itemId: item.itemId });
        console.log("All Items",allitems);
        allitems.forEach(element => {
            console.log("Store ID:", element.storeId);
            storeIds.push(element.storeId);
        });
        console.log("Store IDs:", storeIds);

        // Find stores based on the collected storeIds
        let stores = await Store.find({ storeId: { $in: storeIds } });
        console.log("Found stores:", stores);

        // Separate the current store from the rest
        currentStore = stores.filter(store => store.storeId == item.storeId);
        let otherStores = stores.filter(store => store.storeId !== item.storeId);

        // Dynamically attach discount and item information to the stores
        otherStores = otherStores.map(storeElement => {
            
            const matchingDiscount = alldiscounts.find(discount => discount.storeId == storeElement.storeId);
            const matchingItem     = allitems    .find(item=> item.storeId == storeElement.storeId );

            return {
                ...storeElement._doc, // Spread the original store document
                discount: matchingDiscount ? matchingDiscount.discountPercentage : null, // Attach discount if found
                storeItem: matchingItem || null // Attach the matching item if found
            };

            
        });
       
        /*
        otherStores = otherStores.map(storeElement => {
            const matchingItems = allitems.find(item => item.storeId == storeElement.storeId);
                console.log("||||||||||||||||||||||||||||||||||||",matchingItems);
            if(matchingItems){
                storeElement = {
                    ...storeElement._doc,
                    storeItem:matchingItems

                };

            }
            return storeElement;
        });
        */

        console.log("------------AAAAAAAAAAA-----",otherStores);

        // Also, check and add discount information to the current store (if any)
        currentStore = currentStore.map(storeElement => {
            const matchingDiscount = alldiscounts.find(discount => discount.storeId == storeElement.storeId);
            if (matchingDiscount) {
                storeElement = {
                    ...storeElement._doc,
                    discount:matchingDiscount.discount
                };
            }
            return storeElement;
        });

        console.log("Current Store:", currentStore);
        console.log("Other Stores with Discounts:", otherStores);

        // If no stores are found, return an appropriate message
        if (!otherStores.length && !currentStore.length) {
            return res.status(200).send({ message: "No stores found", success: false });
        }

        res.status(200).send({
            message: "Stores fetched",
            data: { currentStore, otherStores },
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});


router.route('/getItemById/:id').get(async (req,res) => {
    const id = req.params.id
    console.log(id);
    let dis = 0;
    const currentDate = new Date();
    
    

    try{
        const item = await Item.findById(id);

        if(!item){
            return res.status(200).send({message : "no item",sucess:false});
        }

        const discountP = await Discount.findOne({
            itemId:item.itemId,
            storeId:item.storeId,
            startDate:{$lte:currentDate},
            endDate:   {$gte : currentDate},
            active:true});
        
        if(discountP){
            //discount to discountpercentage
            dis = discountP.discountPercentage;
        }
        console.log("dissssssssssssssssssss",dis);
        

        res.status(200).send({message:"Item fetched",data:{item,discount:dis},sucess:true});
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

router.route("/getFilteredItems").get(async(req,res) => {
    console.log("getFilteredItems");

    let { category, minPrice, maxPrice, tags,subcategory,searchQuery } = req.query;
    console.log("Filters-----------------",minPrice,maxPrice);
    console.log(searchQuery)
  
    let query = {};
  
    if (category && category.length) {
        if(category == "Home_Appliances" ){
            category = "Home Appliances"
        }
        if(category == "SportsOutdoors" ){
            category = "Sports & Outdoors"
        }
      query.category = { $in: category };
    }
    if (subcategory && subcategory.length) {
        query.subcategory = { $in: subcategory };
      }
    if (minPrice || maxPrice) {
      query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    }
    if (tags && tags.length) {
      query.tags = { $in: tags };
      console.log(tags)
    }
    if (searchQuery && searchQuery.trim()) {
        query.$or = [
          { name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search in name
          { description: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search in description
        ];
      }

    console.log("Query::::",query);
    
  
    try {
      const items = await Item.find(query);
      //console.log(items);
      res.json(items)
      //res.status(200).send({message:"items fetched", item:items, sucess:true})
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    
})


module.exports =router;