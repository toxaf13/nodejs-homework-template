const service = require('../service/index')

const get = async (req, res, next) => {
  try {
     const results = await service.getAllcontacts();
     
    res.json({
      status: 'success',
      code: 200,
      data: {
        tasks: results,
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await service.getContactById(id);
    if (result) {
      res.json({
        status: 'success',
        code: 200,
        data: { task: result },
      });
    } else {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: `Not found task id: ${id}`,
        data: 'Not Found',
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};


const addContact = async (req, res, next) => {
   const name = req.body.name;
  try {
    if (!name)
      return res.status(400).json({ message: "missing required name field" });
    const result = await service.createContact(req.body);
    if (!result)
      return res.status(404).json({ message: "Something goes wrong" });
    if (result)
      return res.json({
        status: "success",
        code: 201,
        data: { result },
      });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

const updateContact = async (req, res, next) => {
   const { id } = req.params;
  try {
    const { name, email, phone } = req.body;
    if (!name && !email && !phone)
      return res.status(400).json({ message: "missing fields" });
    const result = await service.updateContact(id, req.body);
    if (!result) return res.status(404).json({ message: "Not found" });
    if (result)
      return res.json({
        status: "success",
        code: 200,
        data: { result },
      });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

const deleteContact = async (req, res, next) => {
   const { id } = req.params;
  try {
    const contact = await service.removeContact(id);
    if (!contact) return res.status(404).json({ message: "Not found" });
    if (contact) return res.status(200).json({ message: "Contact deleted" });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

//const updateStatus = async (req, res, next) => {
//   const { id } = req.params;
//   try {

//   }
//}

module.exports = {
   get,
   getById,
   addContact,
   updateContact,
   deleteContact
   
};