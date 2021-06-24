var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const {Pool, Client} = require('pg');
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

//connect database
const pool = new Pool({
  user: 'marco',
  password: "Binx2006",
  database: "restapiproject",
  host: 'restapiproject.cocwrklhvjfc.eu-west-2.rds.amazonaws.com',
  port: 5432
});


//view


app.get('/applicants', async function (req, res) {

      const client = await pool.connect();
      
      const restapiresult = await client.query(`SELECT * FROM applicant`)

       let returning = []
        returning.push(restapiresult.rows)

      res.json(returning)

      client.release();
  
});

app.get('/joblisting', async function (req, res) {

  const client = await pool.connect();
  
  const restapiresult = await client.query(`SELECT * FROM joblisting`)

    let returning = []
    returning.push(restapiresult.rows)

  res.json(returning)

  client.release();

});

app.get('/applicants/:id',async function(req, res) {
  const client = await pool.connect();
      
  const restapiresult = await client.query(`SELECT * FROM applicant WHERE applicantid = $1`, [req.params.id])

    let returning = []
    returning.push(restapiresult.rows)

  res.json(returning)

  client.release();
});

app.get('/joblisting/:id',async function(req, res) {
  const client = await pool.connect();
      
  const restapiresult = await client.query(`SELECT * FROM joblisting WHERE jobid = $1`, [req.params.id])

    let returning = []
    returning.push(restapiresult.rows)

  res.json(returning)

  client.release();
});

//add

app.post('/applicants',async function(req, res) {
  const client = await pool.connect();
      
  const restapiresult = await client.query(`INSERT INTO applicant (first_name,last_name,email,phone,jobid) VALUES ($1,$2,$3,$4,$5) returning *`, 
  [req.body.first_name,req.body.last_name,req.body.email,req.body.phone,req.body.jobid])

    let returning = []
    returning.push(restapiresult.rows)

  res.json(returning)

  client.release();
});

app.post('/joblisting',async function(req, res) {
  const client = await pool.connect();
      
  const restapiresult = await client.query(`INSERT INTO joblisting (jobdesc) VALUES ($1) returning *`, 
  [req.body.jobdesc])

    let returning = []
    returning.push(restapiresult.rows)

  res.json(returning)

  client.release();
});


//update

app.put('/applicants/:id',async function(req, res) {
  const client = await pool.connect();
      
  const restapiresult = await client.query(`UPDATE applicant
  set first_name = $1,
   last_name = $2,
   email = $3,
   phone = $4,
   jobid = $5
  WHERE applicantid = $6
  returning *;`, 
  [req.body.first_name,req.body.last_name,req.body.email,req.body.phone,req.body.jobid,req.params.id])

    let returning = []
    returning.push(restapiresult.rows)

  res.json(returning)

  client.release();
});

app.put('/joblisting/:id',async function(req, res) {
  const client = await pool.connect();
      
  const restapiresult = await client.query(`UPDATE joblisting
  set jobdesc = $1
  WHERE jobid = $2
  returning *;`,
  [req.body.jobdesc,req.params.id])

    let returning = []
    returning.push(restapiresult.rows)

  res.json(returning)

  client.release();
});

//delete

app.delete('/applicants/:id',async function(req, res) {
  const client = await pool.connect();
      
  const restapiresult = await client.query(`DELETE FROM applicant WHERE applicantid = $1`, 
  [req.params.id])

    let returning = []
    returning.push(restapiresult.rows)
    console.log("deleted");
  res.json(returning)

  client.release();
});

app.delete('/joblisting/:id',async function(req, res) {
  const client = await pool.connect();
      
  const restapiresult = await client.query(`DELETE FROM joblisting WHERE jobid = $1`, 
  [req.params.id])

    let returning = []
    returning.push(restapiresult.rows)
    console.log("deleted");
  res.json(returning)

  client.release();
});





app.listen(3007, function() {
    console.log("App started")
});

module.exports = app
