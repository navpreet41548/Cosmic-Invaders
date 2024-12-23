import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, index: true },
    totalKills: Number,
    currentBase: String,
    username: String,
    cosmicToken: Number,
    proCoin: Number,
    powerUps: {
      forceField: Number,
      energyPulse: Number,
    },
    referCode: {
      type: String,
      index: true,
    },
    dailyBonus: [
      {
        day: { type: Number, default: 1 },
        reward: { type: String, default: "1 Cosmic Token" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: { type: Date, default: Date.now },
      },
      {
        day: { type: Number, default: 2 },
        reward: { type: String, default: "2 Cosmic Tokens" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 3 },
        reward: { type: String, default: "3 Cosmic Tokens" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 4 },
        reward: { type: String, default: "4 Cosmic Tokens" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 5 },
        reward: { type: String, default: "5 Cosmic Tokens" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 6 },
        reward: { type: String, default: "6 Cosmic Tokens" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 7 },
        reward: { type: String, default: "1 $Pro Coin" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 8 },
        reward: { type: String, default: "8 Cosmic Tokens" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 9 },
        reward: { type: String, default: "9 Cosmic Tokens" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 10 },
        reward: { type: String, default: "10 Cosmic Tokens" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 11 },
        reward: { type: String, default: "11 Cosmic Tokens" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 12 },
        reward: { type: String, default: "12 Cosmic Tokens" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 13 },
        reward: { type: String, default: "13 Cosmic Tokens" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 14 },
        reward: { type: String, default: "2 $Pro Coins" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 15 },
        reward: { type: String, default: "15 Cosmic Tokens" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 16 },
        reward: { type: String, default: "16 Cosmic Tokens" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 17 },
        reward: { type: String, default: "17 Cosmic Tokens" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 18 },
        reward: { type: String, default: "18 Cosmic Tokens" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 19 },
        reward: { type: String, default: "19 Cosmic Tokens" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 20 },
        reward: { type: String, default: "20 Cosmic Tokens" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 21 },
        reward: { type: String, default: "5 $Pro Coins" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 22 },
        reward: { type: String, default: "22 Cosmic Tokens" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 23 },
        reward: { type: String, default: "23 Cosmic Tokens" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 24 },
        reward: { type: String, default: "24 Cosmic Tokens" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 25 },
        reward: { type: String, default: "25 Cosmic Tokens" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 26 },
        reward: { type: String, default: "26 Cosmic Tokens" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 27 },
        reward: { type: String, default: "27 Cosmic Tokens" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 28 },
        reward: { type: String, default: "28 Cosmic Tokens" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 29 },
        reward: { type: String, default: "29 Cosmic Tokens" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
      {
        day: { type: Number, default: 30 },
        reward: { type: String, default: "10 $Pro Coins" },
        collected: { type: Boolean, default: false },
        collectedOn: { type: Date },
        availableOn: Date,
      },
    ],
    invite: {
      isInvited: Boolean,
      invitedBy: String,
      rewarded: Boolean,
    },
    referredUser: [{ userId: String }],
  },
  { timestamps: true }
);

mongoose.models = {};

export default mongoose.model("User", userSchema);
