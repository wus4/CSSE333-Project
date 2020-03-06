const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const cors = require('cors')


var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'csv')
    },
    filename: function(req, file, cb) {
        cb(null, 'uploaded CSV: ' + new Date() + '.csv ')
    }
})

const upload = multer({
    dest: 'csv',
    fileFilter(req, file, cb) {
        if (!file.originalname.endsWith('.csv')) {
            return cb(new Error('Please upload CSV'))
        }

        cb(undefined, true)

    },
    storage: storage
})


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'test'
});


const app = express()
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    expires: new Date(Date.now() + (30 * 86400 * 1000))
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

app.listen('4000', () => {
    console.log('listening on 4000');
})

app.get('/createtable', (req, res) => {
    let sql = "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))";
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.send('Posted');
    })
})

app.get('/createcustomer', (req, res) => {
    let customer = { name: 'James', address: 'qaz' };
    let sql = 'insert into customers set ?'; //question mark is for the customer data
    let query = connection.query(sql, customer, (err, result) => { // need to put post as a param
        res.send('customer added');
    })
})

app.get('/getcustomers', (req, res) => {
    let sql = 'select * from customers';
    let query = connection.query(sql, (err, result) => {
        console.log(result)
        res.send(result);
    })
})

app.get('/users', (req, res) => {
    let sql = 'select * from users';
    let query = connection.query(sql, (err, result) => {
        console.log(result)
        res.send(result);
    })
})

app.get('/getcustomer/:name', (req, res) => {
    let sql = `select * from customers where name=${req.params.name}`; //use backslash for adding in variables
    let query = connection.query(sql, (err, result) => {
        console.log(result)
        res.send('Name fetched');
    })
})

app.get('/home', (request, response) => {
    if (request.session.loggedin) {
        response.send('Welcome back, ' + request.session.email + '! Your profile is: ' + request.session.profile);

    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});

app.post('/logout', (request, response) => {
    request.session.destroy(function(err) {
        if (err) {
            return next(err);
        }
        return response.send({ success: true });
    });

});

app.post('/auth', (request, response) => {
    var email = request.body.email;
    var password = request.body.password;
    console.log(email + password)
    if (email && password) {
        connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (error, results, fields) => {
            console.log("result is: " + JSON.stringify(results))
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.email = email;
                request.session.profile = JSON.stringify(results[0].profile);
                response.redirect('/home');
                // response.send('Success' + JSON.stringify(results[0].profile))
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send('upload success')

})