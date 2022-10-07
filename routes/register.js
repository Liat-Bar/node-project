const express = require("express");
const router = express.Router();
const joi = require("joi");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Card = require("../models/Card");
const jwt = require("jsonwebtoken");

const registerSchema = joi.object({
  name: joi.string().required().min(2),
  email: joi.string().required().email().min(6),
  password: joi.string().required().min(8),
  biz: joi.boolean().required(),
});

router.post("/", async (req, res) => {
  try {
    const {
      error
    } = registerSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    let user = await User.findOne({
      email: req.body.email
    });
    if (user) return res.status(400).send("user already exist");

    user = new User(req.body);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    let card = new Card({
      userId: user._id,
      cards: [],
      biz: true
    });
    await card.save();

    const genToken = jwt.sign({
        _id: user._id,
        biz: user.biz
      },
      process.env.jwtKey
    );

    await user.save();
    res.status(201).send({
      token: genToken
    });
  } catch (error) {
    res.status(400).send("ERROR in register" + error);
  }
});

module.exports = router;