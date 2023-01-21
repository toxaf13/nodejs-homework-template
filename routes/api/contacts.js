const express = require('express');
const router = express.Router();
const ctrlTask = require('../../controller/index');

router.get('/', ctrlTask.get);

router.get('/:id', ctrlTask.getById);

router.post('/', ctrlTask.addContact);

router.put('/:id', ctrlTask.updateContact);

//router.patch('/:id/status', ctrlTask.updateStatus);

router.delete('/:id', ctrlTask.deleteContact);

module.exports = router;