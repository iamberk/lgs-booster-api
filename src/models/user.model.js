const mongoose = require("mongoose");

const userShema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    days: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Day",
      },
    ],
    missed_days: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Day",
      },
    ],
    day_status: {
      type: Number,
      default: 0,
    },
    last_day: {
      type: Number,
      default: 0,
    },
    reset: {
      code: {
        type: String,
        default: null,
      },
      time: {
        type: String,
        default: null,
      },
    },
    stats: {
      point: {
        type: Number,
        default: 0,
        min: 0,
      },
      streak_point: {
        type: Number,
        default: 0,
        min: 0,
      },
      longest_streak:{
        type: Number,
        default: 0,
        min: 0,
      },
      miss_count: {
        type: Number,
        default: 0,
        min: 0,
      },
      success_rate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      }
    },
    subscription: {
      subscribe: {
        type: Boolean,
        default: false,
      },
      subs_detail: {
        type: String,
        default: "basic",
        enum: ["basic", "premium", "pro"],
      },
      expires_at: {
        type: Date,
        default: null,
      },
    },
  },
  { collection: "users", timestamps: true }
);

const user = mongoose.model("User", userShema);

module.exports = user;


