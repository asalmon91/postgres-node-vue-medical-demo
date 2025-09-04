const express = require('express');
const cors = require('cors');
const Joi = require('joi');
const db = require('./db');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;


app.use(cors()); // Allow requests from the Vue frontend
app.use(express.json()); // Enable parsing of JSON request bodies

const patientSchema = Joi.object({
    first_name: Joi.string().min(1).max(100).required(),
    last_name: Joi.string().min(1).max(100).required(),
    date_of_birth: Joi.date().less('now').min('1-1-1900'),
});

// Routes
// Get all patients
app.get('/api/patients', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM patient');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get patient by ID
app.get('/api/patients/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await db.query('SELECT * FROM patient WHERE id = ($1)', [id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Add a new patient
app.post('/api/patients', async (req, res) => {
    const { patient } = req.body;
    const validation = patientSchema.validate(patient);
    if (validation.error) {
        console.error(validation.error);
        res.status(400).send(validation.error.details[0].message);
        return;
    }
    
    // TODO: check for duplicates
    try {
        const result = await db.query(
            'INSERT INTO patient (first_name, last_name) VALUES($1, $2) RETURNING *', 
            [patient.first_name, patient.last_name]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Update a patient
app.put('/api/patients/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const {patient} = req.body;
    const validation = patientSchema.validate(patient);
    if (validation.error) {
        console.error(validation.error);
        res.status(400).send(validation.error.details[0].message);
        return;
    }
    console.debug(id);
    console.debug(validation.value);

    try {
        // TODO: Check for duplicates
        const result = await db.query(
            'UPDATE patient SET first_name = $2, last_name = $3 WHERE id = $1 RETURNING *', 
            [id, patient.first_name, patient.last_name]);
            res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// Delete a patient
app.delete('/api/patients/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await db.query('DELETE FROM patient WHERE id=($1)', [id]);
        res.status(200).json({message: 'Item deleted'});
        // TODO: 404?
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
