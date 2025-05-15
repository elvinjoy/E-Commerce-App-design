const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const addressSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["home", "office"],
    required: true,
  },
  phone: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,
  },
  addressLine: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
    match: /^[0-9]{6}$/,
  },
  district: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  role: {
    type: String,
    default: "user",
  },
  addresses: {
    type: [addressSchema],
    default: [],
  },
  userNumber: {
    type: String,
    unique: true,
  },
  otp: {
    type: String,
    default: null,
  },
  otpExpires: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password + generate user number
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    if (this.isNew) {
      const lastUser = await this.constructor.findOne({}, {}, { sort: { createdAt: -1 } });
      if (lastUser && lastUser.userNumber) {
        const lastNumber = parseInt(lastUser.userNumber.replace("USER", ""));
        this.userNumber = `USER${String(lastNumber + 1).padStart(3, "0")}`;
      } else {
        this.userNumber = "USER001";
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
