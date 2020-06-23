const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Joi = require('joi');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
 
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  phone:{
    type: String,
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  },
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      phone: this.phone,
      isAdmin: this.isAdmin
    },
    config.get("jwtPrivateKey")
  );
  return token;
};


const User = mongoose.model("User", userSchema);


function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
    phone:Joi.string().min(10).max(10).required(),
  };
  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
