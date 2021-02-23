const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()

app.get('/', (req, res) => {
    res.send("This is root")
})

app.post('/login', (req, res) => {
    //authentication logic
    const user = { id: 1}
    const token = jwt.sign({user}, 'mysecretkey')
    res.json({
        token: token
    })
})

app.get('/protected', ensureToken, (req, res) => {
    jwt.verify(req.token, 'mysecretkey', function(err, data){
        if (err){
            res.sendStatus(403)
        }
        else {
            res.json ({
                text: 'this is protected',
                data: data
            })
        }
    })
})

//add header => authorization : Bearer (token retured by login)
//eg header => authorization : Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxfSwiaWF0IjoxNjA3OTY5ODg3fQ.X8xHmcE-3X2tI9RXCyNHHZRZmhoGUOcVT5QOfwbJIMM
function ensureToken(req, res, next){
    const bearerHeader = req.headers["authorization"]
    if (typeof bearerHeader != 'undefined'){
        const bearer = bearerHeader.split(" ")
        const bearerToken = bearer[1]
        req.token = bearerToken
        next()
    }
    else {
        res.sendStatus(403)
    }
}

app.listen(3000, () => {
    console.log("Listening on port 3000")
})