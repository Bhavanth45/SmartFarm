const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Farmer name is required'], trim: true },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  phone: { type: String, unique: true, required: [true, 'Phone number is required'], trim: true },
  password: { type: String, required: [true, 'Password is required'], minlength: 6 },
  role: { type: String, enum: ['Farmer', 'Agronomist', 'Admin', 'Buyer', 'farmer', 'buyer'], default: 'Farmer' },
  farmLocation: { type: String, default: 'Maharashtra, India' }
}, { timestamps: true });

// Pre-save hook: Hash password with bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed DB password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
