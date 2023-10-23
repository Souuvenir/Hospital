const express = require('express');
const router = express.Router();
const patientController = require('../controller/controller');
var upload = require('../multer-config');

router.get('/', (req, res) => {
    res.send('Hola, mundo!');
});

// GET all patients
router.get('/get-all', patientController.getAll);

// GET a specific patient by ID
router.get('/:id', patientController.findById);

// POST a new patient
router.post('/create-patient', patientController.newPaciente);

// PUT (update) an existing patient by ID
router.put('/update/:id', patientController.updatePaciente);

// DELETE a patient by ID
router.delete('/delete/:id', patientController.deleteById);

//Search a patient by criteria
router.post('/search/search:', patientController.search);

//Upload a patient photo
router.post('/upload/photo/:id', upload, patientController.uploadPhoto);

//GET a patient photo
router.get('/get/photo/:filename', patientController.findPhoto);

module.exports = router;
