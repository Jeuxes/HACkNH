import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import postRoutes from './routes/post.js';

const app = express(); //App instance



//Setup body-parser for requests
app.use(bodyParser.json({limit : "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit : "30mb", extended: true}));

app.use(cors());

app.use('/posts', postRoutes);
// https://www.mongodb.com/cloud/atlas
const CONNECTION_URL = 'mongodb+srv://classmateoffical:tPLdpKWanVaOknuy@pmcluster0.gzf9ouu.mongodb.net/?retryWrites=true&w=majority&appName=PMCluster0';
const PORT = process.env.PORT || 8000;

mongoose.connect(CONNECTION_URL)
    .then(() => app.listen(PORT, () => console.log('Server Running on port: ' + PORT)))
    .catch((error) => console.log(error.message));


