import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import userRoutes from './routes/user.js'

const app = express()
const port = 6969

app.use(bodyParser.json({limit : '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit : '30mb', extended: true}));
app.use(cors())

app.use('/user', userRoutes)

app.get('/', (req, res) => {
    res.send('hello world')
    console.log('root request recieved')
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
