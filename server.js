//import fetch from 'node-fetch';
import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/animeDB');
//import file from 'fs';

var Schema = mongoose.Schema;

/*Schema and model for the data we need to save*/
var animeDataSchema = new Schema({
    title: {type: String, required:true},
    info: String,
    episodes: String
})
var AnimeDataModel = mongoose.model('AnimeData',animeDataSchema);







const app = express()
const port = 3000
const basedir = "./assets/html/"


//Because im treating this file as module and using imports these need to be defined seperatly.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



app.use('/static', express.static('assets'))
app.use(bodyParser.urlencoded({ extended: true }));

app.get(['/','/index','/home'], (req, res) => {
    //res.redirect('/marketplace');
    //res.sendFile(path.join(__dirname, basedir+'index.html'));
    res.send("REST front page.")
})


app.get('/api/getall', (req, res) => {
    AnimeDataModel.find().then(function(doc){
        res.send(doc)
    })
})

app.get('/api/:id', (req, res) => {
    let id = req.params.id
    console.log("Recieved get request: "+id)

    //Update data with given id. Send back json array with success:true/false and reason if needed.
    AnimeDataModel.findById(id,function(err,doc){
        if(err) {
            res.send({success:false,reason:"Found nothing with given id: "+id})
        } else {
            res.send(doc)
        }
    })
})

app.post('/api/add', (req, res) => {
    console.log("Recieved post request")
    var item = {
        title: req.body.title,
        info: req.body.info,
        episodes: req.body.episodes
    }
    console.log(item)
    var data = new AnimeDataModel(item)
    data.save()
    /*
    */

    res.send(item)
 })

 app.post('/api/update/:id', (req, res) => {
    console.log("Recieved update request")

    let id = req.params.id

    //Update data with given id. Send back json array with success:true/false and reason if needed.
    AnimeDataModel.findById(id,function(err,doc){
        let response = {success:true,reason:""}
        if(err) {
            console.log("ID found nothing: "+id)
            response = {success:false,reason:"Found nothing with given id: "+id}
        } else {
            doc.title = req.body.title
            doc.info = req.body.info
            doc.episodes = req.body.episodes
            doc.save()
        }
        res.send(response)
    }) 
 })

app.delete('/api/delete/:id', function (req, res) {
    console.log("Recieved delete request")

    const id = req.params.id

    let response = {success:true,reason:""}
    AnimeDataModel.findByIdAndRemove(id).exec()
    res.send(response)
})







app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})