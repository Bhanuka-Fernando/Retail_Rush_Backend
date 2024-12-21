const Review = require("../models/reviewSchema");
const express = require("express");
const router = express.Router();

const authmiddleware = require('../middleware/AuthMiddleware');


router.route("/reviews/:storeId").get(async (req, res) => {
  const { storeId } = req.params; // Get storeId from params

  try {
    const reviews = await Review.find({ storeId });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

router.route("/reviews").post(authmiddleware,async (req, res) => {
  console.log("-----------------------------------------")
  console.log("lllllllllllllll",req.body);
  const {name,email,review,value,storeId } = req.body.newReview;
  //console.log(userId);

  const userId = req.body.userID;
  console.log(userId);
  try {
    const newReview = await Review.create({
      name,
      email,
      review,
      value,
      date: Date.now(),
      storeId,
      userId,
    });
    res.status(200).json(newReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Review adding failed" });
  }
});

router.route("/reviews/:id").delete(async (req, res) => {
  const { id } = req.params;

  try {
    const deletedReview = await Review.findByIdAndDelete(id);
    res.status(200).json({ deletedReview: deletedReview });
  } catch (error) {
    res.status(500).json({ message: "Review Delete Failed" });
  }
});

router.route("/reviews/:id/response").post(async (req, res) => {
  const { id } = req.params;
  const { response } = req.body;

  console.log(req.body);

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { response },
      { new: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    console.log(updatedReview);

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: "Failed to add response" });
  }
});

router.route("/reviews/:id/vote").post(async (req, res) => {
  const { id } = req.params;
  const { voteType } = req.body;

  try {
    const review = await Review.findById(id);

    if (voteType === "thumbsUp") {
      review.helpfulVotes.thumbsUp += 1; // Increment thumbs-up count
    } else if (voteType === "thumbsDown") {
      review.helpfulVotes.thumbsDown += 1; // Increment thumbs-down count
    }

    await review.save(); // Save changes

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: "Failed to record vote" });
  }
});

router.route("/reviews/:id").put(async (req, res) => {
  const { id } = req.params; // Get review ID from params
  const { name, email, review, value } = req.body; // Get the fields to be updated from request body

  try {
    // Find and update the review by ID, returning the updated review
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { name, email, review, value }, // Update these fields
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    // If no review is found, return a 404 error
    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Return the updated review
    res.status(200).json(updatedReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update review" });
  }
});

module.exports = router;
