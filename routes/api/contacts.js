const express = require('express')

const router = express.Router()

const {
   listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  createNewContact,
 } = require("./../../models/contacts");

//const createTask = (name)=>({
//   name,isCompleted:false,dateCraeted:new Date().toISOString()
//});
//const tasks = [createT]

router.get('/', async (req, res, next) => {
   const contacts = await listContacts();
   res.status(200).json(contacts);
})

router.get('/:contactId', async (req, res, next) => {
   const { contactId } = req.params;
   const contact = await getContactById(contactId);
   if(!contact) return res.status(404).json({message:"Contact not found"});
   if(contact) res.status(200).json(contact);
})

router.post('/', async (req, res, next) => {
   const { name, email, phone} = req.body;
   if (!name ||!email || !phone)
       return res.status(400).json({message:"missing required name field"});
       const newContact = await createNewContact(req.body)
   await addContact(req.body);
   res.status(201).send(newContact)
})

router.delete('/:contactId', async (req, res, next) => {
  const {contactId} = req.params;
  const contact = await getContactById(contactId);
  if(!contact ) return res.status(404).json({message:'Contact not found'});
  else {await removeContact(contactId);
res.status(200).json({message:'Contact deleted'})}
})

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

module.exports = router
