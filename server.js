const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
const dotenv = require("dotenv");
const dbConfig = require("./config/Db_config");

const User_Routes = require("./routes/User_routes");
const recs = require("./routes/Tag_recom");
const Items_Routes = require("./routes/Items");
const WishList_Routes = require("./routes/WishListRoutes");



const cron = require('node-cron');

//Dushan

const storeRoutes = require('./routes/Dushan/dStoreRoutes');
const salesRoutes = require('./routes/Dushan/dSalesRoutes');
const itemRoutes = require('./routes/Dushan/dItemRoutes');
const staffRoutes = require('./routes/Dushan/dStaffRoutes');

//Geshika
const reviewRoutes = require("./routes/review_routes.js");

//bhanuka fernando
const discountRoutes = require('./routes/Bhanuka/discount.js')
const bannerRoutes = require('./routes/Bhanuka/Banner.js')
const Discount = require('./models/discountModel.js')




const app = express();

const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(bodyParser.json()); 

app.use("/api/user",User_Routes);
app.use("/api/rec",recs);
app.use("/api/items",Items_Routes);
app.use("/api/wishlist",WishList_Routes);


//Dushan
app.use('/api/stores', storeRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/staff', staffRoutes);

//Geshika
app.use("/api", reviewRoutes);

// bhanuka
app.use('/api/discount', discountRoutes)
app.use('/api/banner', bannerRoutes)

cron.schedule('0 0 * * *', async () => {
    try {
      const currentDateTime = new Date();
      const result = await Discount.deleteMany({
        $or: [
          { endDate: { $lt: currentDateTime } },
          { $and: [{ endDate: currentDateTime.toISOString().slice(0, 10) }, { endTime: { $lte: currentDateTime.toTimeString().slice(0, 5) } }] }
        ]
      });
      console.log(`Expired discounts removed: ${result.deletedCount}`);
    } catch (error) {
      console.error('Error deleting expired discounts:', error);
    }
  });

app.listen(PORT, () => console.log(`Nodemon Server started at port ${PORT}`));