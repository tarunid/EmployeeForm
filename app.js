// Import necessary modules
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require("mysql2");
const path = require("path");

// Create Express app
const app = express();

// Configure session middleware
app.use(session({
    secret: 'secret', // Change this to a random secret
    resave: false,
    saveUninitialized: true
}));

// Configure body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Taruni@03',
    database: 'employeedb',
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'hbs');

// Handle requests to the root URL
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/submit-first-form', (req, res) => {
    res.render('next');
});
app.get('/next', (req, res) => {
    res.render('next');
});
// Handle form submission for the first form
app.post('/submit-first-form', (req, res) => {
    const { employeeName, employeeId, department, dob, gender, designation, salary } = req.body;
    console.log(req.body);
    // Store data from the first form in session or temporary storage
    req.session.firstFormData = { employeeName, employeeId, department, dob, gender, designation, salary };

    res.render('next');
});

// Handle form submission for the second form
app.post('/submit-second-form', (req, res) => {
    // Retrieve data from the first form stored in session or temporary storage
    const firstFormData = req.session.firstFormData;

    // Retrieve data from the second form
    const { address, phone, email } = req.body;

    // Merge data from both forms
    const formData = { ...firstFormData, address, phone, email };
    console.log(firstFormData);
    console.log(formData);
//employeeName, employeeId, department, dob, gender, designation, salary, 
    // Store the combined data in the database
    const sql = "INSERT INTO employees (employeeName, employeeId, department, dob, gender, designation, salary, address, phone, email) VALUES (?, ?, ?,?, ?, ?,?, ?, ?,?)";
    const values = Object.values(formData);

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error storing form data in the database:", err);
            res.status(500).send("Error storing form data in the database");
        } else {
            console.log("Form data stored in the database");
            res.send("Form data stored successfully");
        }
    });
});




// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
