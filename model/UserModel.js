const mongoose = require('mongoose');
const shortid = require ('shortid');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const UserModel = new Schema({
    _id: {
      type: String,
      default: shortid.generate
    },
    created_at: { type: Date, default: new Date() },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    // contact: { type: String },
    password: { type: String, required: true },
    // phone_number: { type: String },
    // user_type: { type: String, default: 'user' }, 
    // gender:  { 
    //   type: String, 
    //   enum: ['male', 'female'], 
    // }
});

UserModel.pre('save', async function(next) {
  user = this;
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
})

UserModel.methods.validatePassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
}

const User = mongoose.model('User', UserModel);
module.exports = User;