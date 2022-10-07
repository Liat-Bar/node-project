const express = require("express");
const joi = require("joi");
const Cart = require("../models/Card");
const auth = require("../middlewares/auth");
const router = express.Router();

const cardSchema = joi.object({
  businessName: joi.string().required().min(2),
  BusinessDescription: joi.string().required().min(2),
  businessAddress: joi.string().required().min(2),
  businessPhone: joi.string().required().min(9).max(10),
  businessImage: joi.string().required().min(2),
  quantity: joi.number().required(),
});

router.get("/", auth, async (req, res) => {
  try {
    let card = await Cart.findOne({
      userId: req.payload._id
    });
    if (!card) return res.status(404).send("No such cart for user");
    res.status(200).send(cart.products);
  } catch (error) {
    res.status(400).send(error);
  }
});


router.post("/", auth, async (req, res) => {
  try {

    const {
      error
    } = cardSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);


    let cart = await Cart.findOne({
      userId: req.payload._id
    });
    if (!cart) return res.status(404).send("No such card for user");

    card.users.push(req.body);
    await cart.save();

    res.status(200).send("user was added to card");
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;