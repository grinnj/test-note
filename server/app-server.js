const express = require('express');
const config = require('./config.js');
const bodyParser = require('body-parser');

const db = new (require('./database.js'))();

const app = express();
app.use(bodyParser.json({extended: false}));

app.use(function(req, res, next) {
    if(req.headers.origin){
      if(req.headers.origin.split('/')[2]=="localhost:3000")
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    }
    res.setHeader('Access-Control-Allow-Headers','Content-Type');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    return next();
});

app.get('/notes/:id', function(req,res){
    db.findById(Number(req.params.id))
    .then(note => {
        res.json(note);
    })
    .catch(error => {
        console.log(error.message);
        res.status(400).send(error.message);
    });
})

app.get('/notes', function(req, res){
    db.findAll()
    .then(allNotes => {
        res.json(allNotes);
    })
    .catch(error => {
        console.log(error.message);
        res.status(400).send(error.message);
    });
});

app.post('/notes', function(req, res){
    db.insert(Number(req.body.id), req.body.note)
    .then(insertedElem => {
        res.json(insertedElem);
    })
    .catch(error => {
        console.log(error.message);
        res.status(400).json({message:error.message});
    });
});

app.put('/notes/:id', function(req,res){
    db.updateById(Number(req.params.id), req.body.note)
    .then(updatedElem => {
        res.json(updatedElem);
    })
    .catch(error => {
        console.log(error.message);
        res.status(400).send(error.message);
    });
});

app.delete('/notes/:id', function(req,res){
    db.deleteById(Number(req.params.id))
    .then(deletedElem => {
        res.json(deletedElem);
    })
    .catch(error => {
        console.log(error.message);
        res.status(400).send(error.message);
    });
});

app.listen(config.port, function(){
    console.log(`API listening on port ${config.port}`);
  });