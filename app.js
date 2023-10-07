require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const https = require('https')
const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/signup.html')
})

app.post('/', function(req, res) {
    const firstName = req.body.fNameInput
    const lastName = req.body.lNameInput
    const email = req.body.emailInput

    console.log(`First Name: ${firstName} \nLast Name: ${lastName} \nEmail: ${email}`)

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data)

    const url = 'https://us21.api.mailchimp.com/3.0/lists/5406ddc37b'
    const options = {
        method: 'POST',
        auth: process.env.API_KEY
    }

    https.request(url, options, function (response) {

        if(response.statusCode == 200) {
            res.sendFile(__dirname + '/success.html')
        } else {
            res.sendFile(__dirname + '/failure.html')
        }
        response.on('data', function(data) {
            console.log(JSON.parse(data))
        })
    }).end(jsonData)
})

app.post('/failure', function (req, res) {
    res.redirect('/')
})

app.listen(3000, function () {
    console.log('Server 3000 is up and running')
})