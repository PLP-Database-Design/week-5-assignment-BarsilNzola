// framework handling HTTP requests/responses
const express = require('express');

// create an instance in the framework
const app = express();

// DBMS Mysql
const mysql = require('mysql2');

// cross origin resource sharing
const cors = require('cors');

// environment variable
const dotenv =require('dotenv');

app.use(express.json());
app.use(cors());
dotenv.config();

// connecting to the database
const db = mysql.createConnection ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// check for connection
db.connect((err) => {
    // if no connection
    if(err) {
    console.log("Error connecting to MYSQL", err.message);
    process.exit(1); // Exit the application if DB connection fails
}

    // if connection
    console.log("Connected to MYSQL");
});

// GET METHOD
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Question 1. Retrieve all patients
// GET method for retrieving all patients, using the same 'data.ejs' template
app.get('/patients', (req, res) => {
    // Query to retrieve data from the 'patients' table
    db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving patients data');
        } else {
            // Column headers for patients
            const columns = ['Patient ID', 'First Name', 'Last Name', 'Date of Birth'];

            // Render the same 'data.ejs' template and pass the results and column headers
            res.render('data', { columns: columns, results: results });
        }
    });
});


// Question 2. Retrieve all providers
// GET method for retrieving all providers, using the same 'data.ejs' template
app.get('/providers', (req, res) => {
    // Query to retrieve data from the 'providers' table
    db.query('SELECT first_name, last_name, provider_speciality FROM providers', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving providers data');
        } else {
            // Column headers for providers
            const columns = ['First Name', 'Last Name', 'Specialty'];

            // Render the generic 'data.ejs' template and pass the results and column headers
            res.render('data', { columns: columns, results: results });
        }
    });
});

// Question 3. Filter patients by First Name
// GET method for retrieving patients by first name
app.get('/patients/first-name', (req, res) => {
    // Get the first name from query parameters
    const firstName = req.query.first_name;

    if (!firstName) {
        return res.status(400).send('First name is required');
    }

    // Query to retrieve data from the 'patients' table where first_name matches
    db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?', [firstName], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving patients data');
        } 
        
        // Column headers for patients
        const columns = ['Patient ID', 'First Name', 'Last Name', 'Date of Birth'];

        // Render the same 'data.ejs' template and pass the results and column headers
        res.render('data', { columns: columns, results: results });
    });
});

// Question 4. Retrieve all providers by their specialty
// GET method for retrieving providers by specialty
app.get('/providers/specialty', (req, res) => {
    // Get the specialty from query parameters
    const speciality = req.query.speciality;

    if (!speciality) {
        return res.status(400).send('Speciality is required');
    }

    // Query to retrieve data from the 'providers' table where provider_speciality matches
    db.query('SELECT first_name, last_name, provider_speciality FROM providers WHERE provider_speciality = ?', [speciality], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving providers data');
        } 
        
        // Column headers for providers
        const columns = ['First Name', 'Last Name', 'Speciality'];

        // Render the same 'data.ejs' template and pass the results and column headers
        res.render('data', { columns: columns, results: results });
    });
});


// listen to the server
app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`)

    // send a message to the browser
    console.log('Sending message to the browser...')
    app.get('/', (req,res) => {
        res.send('the server started successfully !!!')
    });
});



