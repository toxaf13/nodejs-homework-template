const {Schema, model} = require('mongoose');

const contactSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 11,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
      minlength: 10,
      maxlength: 20,
    },
    phone: {
      type: String,
      },
    favorite: {
      type: Boolean,
      default: false,
      },
      owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    }
  },
//  { versionKey: false, timestamps: true },
);

const Contact = model('contact', contactSchema);

module.exports = Contact;