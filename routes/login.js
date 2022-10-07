const express = require("express");
const router = express.Router();
const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middlewares/auth");
const loginSchema = joi.object({
  email: joi.string().required().email().min(6),
  password: joi.string().required().min(8),
});

//3
router.get('/',auth,async (req,res) => {
  try {
      let filter = {userId: req.params.userID}
      let cards = await Cards.find(filter)
      if (cards.length === 0) return res.status(400).send("Wrong details");
      return res.status(200).send(card)
  
  } catch (error) {
      return res.status(400).send(error.message);
  }
 


})
router.get('/', auth, async (req, res) => {
  try {
    let userData = await User.findById(res.locals.user._id)
    res.status(200).send(_.pick(userData, ['name', 'email', 'biz']))
  } catch (error) {
    return res.status(400).send(error.message);
  }
})

//1
router.post("/", async (req, res) => {
  try {
    const {
      error
    } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    let user = await User.findOne({
      email: req.body.email
    });
    if (!user) return res.status(404).send("wrong password or email");

    const compareResult = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!compareResult) return res.status(400).send("wrong password or email");

    const genToken = jwt.sign({
        _id: user._id,
        biz: user.biz
      },
      process.env.jwtKey
    );

    res.status(200).send({
      token: genToken
    });
  } catch (error) {
    res.status(400).send("ERROR in login" + error);
  }
});


module.exports = router;