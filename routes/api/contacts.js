const express = require('express')
const joi = require("joi");
const router = express.Router()

const {
   listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  createNewContact,
  getUpdatedContact,
 } = require("./../../models/contacts");

/////VALIDATE/////
 
const contactSchema = joi.object({
  name: joi.string().min(3).required(),
  email: joi.string().email().required(),
  phone: joi.string().min(9).required(),
});

/////GET/////

router.get('/', async (req, res, next) => {
   const contacts = await listContacts();
   res.status(200).json(contacts);
})

/////GETBYID/////

router.get('/:contactId', async (req, res, next) => {
   const { contactId } = req.params;
   const contact = await getContactById(contactId);
   if(!contact) return res.status(404).json({message:"Contact not found"});
   if(contact) res.status(200).json(contact);
})

/////POST/////

router.post('/', async (req, res, next) => {
   const { name, email, phone} = req.body;
   const {error, value} = contactSchema.validate(req.body);
   if(error){
      console.log(error);
      return res.send('Invalid Request')
   }
   if (!name || !email || !phone)
       return res.status(400).json({message:"missing required name field"});
       const newContact = await createNewContact(req.body)
      await addContact(req.body);
      res.status(201).send(newContact)
})

/////DELETE/////

router.delete('/:contactId', async (req, res, next) => {
  const {contactId} = req.params;
  const contact = await getContactById(contactId);
  if(!contact ) return res.status(404).json({message:'Contact not found'});
  else {await removeContact(contactId);
res.status(200).json({message:'Contact deleted'})}
})

/////PUT/////

router.put('/:contactId', async (req, res, next) => {
  const {name, email, phone} = req.body;
  const {contactId} = req.params;

  const {error, value} = contactSchema.validate(req.body);
  if(error){
     console.log(error);
     return res.send({message: error.details[0].message})}

  if (!name && !email && !phone)
   return res.status(400).json({message:"missing fields"});
   const contact = await getContactById(contactId);

   if(!contact) return res.status(404).json({ message: 'Not Found'});
   if (contact){
      const updated = await getUpdatedContact(contact, req.body);
      await updateContact(contactId, req.body);
      res.status(200).send(updated);
      
      
   }
})

module.exports = router
