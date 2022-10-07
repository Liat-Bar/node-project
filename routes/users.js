const express = require("express");
const auth = require("../middlewares/auth");
const Card = require("../models/Card");
const joi = require("joi");
const router = express.Router();

const cardSchema = joi.object({
  businessName: joi.string().required().min(2),
  BusinessDescription: joi.string().required().min(2),
  businessAddress: joi.string().required().min(2),
  businessPhone: joi.string().required().min(9).max(10),
  businessImage: joi.string().required().min(2),
});

//7
router.delete("/:id", auth, async (req, res) => {
  try {
    if (!req.payload.biz)
      return res.status(400).send("Only admin can update card");
    let card = await Card.findByIdAndRemove(req.params.id);
    if (!card) return res.status(404).send("No such card");
    res.status(200).send("card removed successfully!");
  } catch (error) {
    res.status(400).send(error);
  }
});

//6
router.put("/:id", auth, async (req, res) => {
  try {
    if (!req.payload.biz)
      return res.status(400).send("Only biz can update cards");


    const {
      error
    } = cardSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    let card = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!card) return res.status(404).send("No such card");
    res.status(200).send(card);
  } catch (error) {
    res.status(400).send(error);
  }
});

//5
router.get("/:id", auth, async (req, res) => {
  try {
    let card = await Card.findById(req.params.id);
    if (!card) return res.status(404).send("No such card");
    res.status(200).send(card);
  } catch (error) {
    res.status(400).send(error);
  }
});

//4
router.post("/", auth, async (req, res) => {
  try {
    if (!req.payload.biz)
      return res.status(400).send("Only biz can add card");

    const {
      error
    } = cardSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    let card = new Card(req.body);
    await card.save();
    res.status(201).send("card added successfully!");
  } catch (error) {
    res.status(400).send(error);
  }
});

//4 random
async function findUniqueNumber(randomNum) {
  let random = randomNum;
  try {
    let card = await Cards.find({
      uniqueNum: random
    });
    if (card.length > 0) {
      random = _.random(0, 1500, false);
      findUniqueNumber(random);
    }
    return random
  } catch (error) {
    return res.status(400).send("error in register the user: " + error);
  }

}

//8
router.get("/", auth, async (req, res) => {
  try {
    let cards = await Card.find();
    res.status(200).send(cards);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;