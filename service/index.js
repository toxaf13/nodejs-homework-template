const Contact = require('./schemas/contact.js');

const getAllcontacts = async () => {
  return Contact.find();
};

const getContactById = id => {
  return Contact.findOne({ _id: id });
};

const createContact = ( body ) => {
  return Contact.create(body);
};

const updateContact = (id, fields) => {
  return Contact.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

const removeContact = ( id ) => {
  return Contact.findByIdAndRemove({ _id: id });
};
const updateContactStatus = ( { _id: id }, body ) => {
   return Contact.findByIdAndUpdate(id, body, { new: true });
   }
module.exports = {
  getAllcontacts,
  getContactById,
  createContact,
  updateContact,
   removeContact,
  updateContactStatus
};