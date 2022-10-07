const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  userId: {
   type: String,
   required: true,
 },
  cards: [
    {
      cardId: String,
      businessName: String,
      BusinessDescription: String,
      businessAddress: String,
      businessPhone: String,
      businessImage: String,
      quantity: Number,
     
    },
  ],
});

const Card = mongoose.model("card", cardSchema);
module.exports = Card;
