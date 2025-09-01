const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
const port = 3000;


app.use(cors()); // Allow requests from the Vue frontend
app.use(express.json()); // Enable parsing of JSON request bodies

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

// TODO: Get by ID

// Add a new patient
app.post('/api/patients', async (req, res) => {
    // TODO: check for duplicates
    const { patient } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO patient (first_name, last_name) VALUES($1, $2) RETURNING *', [patient.first_name, patient.last_name]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// TODO: Update

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
