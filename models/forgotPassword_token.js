const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema(
  {
    user: {
      ref: 'User',
      type: mongoose.Schema.Types.ObjectId,
    },
    accessToken: {
      type: String,
    },
    isValid: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);
const TokenDetail = mongoose.model('Token', forgotPasswordSchema);

module.exports = TokenDetail;
