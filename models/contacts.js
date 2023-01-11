const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.resolve("./models/contacts.json");


const fetchContacts = async () => {
   const data = await fs.readFile(contactsPath, {encoding: "utf-8"});
   return JSON.parse(data);
}
const listContacts = async ()=> {
   const contacts = await fetchContacts();
   //console.table(contacts);
   return contacts;
}
 
 const getContactById = async (contactId) => {
   const contacts = await fetchContacts();
   return contacts.find(( contact ) => contact.id === contactId);
 }
 
 const  removeContact = async (contactId) => {
   const contacts = await fetchContacts();
   const filteredContacts = contacts.filter(({ id }) => id !== contactId);
   await fs.writeFile(contactsPath, JSON.stringify(filteredContacts, null, 2),{encoding: "utf-8"});
   console.log('Remove contact')
 }
 const createNewContact = async (body) => {
   const {name, email, phone} = body;
   const contacts = await fetchContacts();
   const lastId = Math.max(...contacts.map((contact) => parseInt(contact.id, 10))) + 1;
   const id = lastId.toString();
   return {id, name, email, phone};
}

 const addContact = async (body) => {
   const contacts = await fetchContacts();
   const newContact = await createNewContact(body);
   const updateContacts = [...contacts, newContact];
   await fs.writeFile(contactsPath, JSON.stringify(updateContacts, null, 2), {encoding: "utf-8"});
   console.log('Added new contact ')
 }
 const getUpdatedContact = async (contact, body) => {
   const {name, email, phone}= body;
   return{...contact,
   name: name? name : contact.name,
email: email ? email:contact.email,
phone:phone ? phone: contact.phone,};
 };
 const updateContact = async (contactId, body) => {
   const contacts = await listContacts();
   const contact = await getContactById (contactId);
   const updatedContact = await getUpdatedContact(contact, body);
   const indexOfContact = await contacts.findIndex(
      (contact) => contact.id === contactId
   );
   await contacts.splice(indexOfContact, 1 , updatedContact);
   await pushContacts(contacts);
}

// (async ()=> {
//   const contacts = await listContacts();

//   console.log(contacts);

//   console.log(await listContacts('2'))

//   await removeContact('2');

//   await addContact ("Qwery","qwery@gmail.com","235436");

//   console.log(await listContacts());
// })();
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  createNewContact,
}
