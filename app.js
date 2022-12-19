const express = require('express')
const https = require('https')
const app = express()
require('dotenv').config()

app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html')
})

app.post('/', (req, res) => {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email

    const data = {
        email_address: email,
        status: "subscribed",
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName
        }
    }

    const url = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}/members`
    const options = {
        method: "POST",
        auth: process.env.MAILCHIMP_AUTH
    }
    const request = https.request(url, options, response => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", data => console.log(JSON.parse(data)))
    })

    let jsonData = JSON.stringify(data)
    request.write(jsonData);
    request.end();
})

app.post('/failure', (req, res) => {
    res.redirect("/")
})

const SERVER_PORT = process.env.PORT
app.listen(SERVER_PORT, function () {
    console.log('Server is running on port ' + SERVER_PORT)
})