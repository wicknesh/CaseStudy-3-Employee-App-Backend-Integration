// Task1: initiate app and run server at 3000
const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

var app = new express();
app.use(morgan('dev'));

app.use(express.json());

app.listen(process.env.port, () => {
    console.log(`Server is up and listening to port ${process.env.port}`);
})

const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));

// Task2: create mongoDB connection 
const mongoose = require('mongoose');

mongoose
.connect(process.env.mongo_url)
.then(() => {
    console.log("MongoDB Atlas is connected");
})
.catch((err) => {
    console.log(err);
})

const employeeSchema = mongoose.Schema({
    name: String,
    position: String,
    salary: Number
});

// Task 2 : write api with error handling and appropriate api mentioned in the TODO below
// TODO: get data from db  using api '/api/employeelist'
app.get('/api/employeelist', async (req, res) => {
    try {
        var data = await empModel.find();
        res.status(200).send(data);
    } catch (error) {
        res.status(404).send(error);
    }
})

// TODO: get single data from db  using api '/api/employeelist/:id'
app.get('/api/employeelist/:id', async (req, res) => {
    try {
        var data = await empModel.findById(req.params.id);
        res.status(200).send(data);
    } catch (error) {
        res.status(404).send(error);
    }
})

// TODO: send data from db using api '/api/employeelist'
// Request body format:{name:'',location:'',position:'',salary:''}
app.post('/api/employeelist', async (req, res) => {
    try {
        var item = req.body;
        var data = new empModel(item);
        await data.save();
        data = JSON.stringify(await empModel.find(), null, 2);
        res.status(200).send(`Data added successfully\n${data}`);
    } catch (error) {
        res.status(404).send(error);
    }
});

const empModel = mongoose.model('employeeDB', employeeSchema);

//TODO: delete a employee data from db by using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        var data = JSON.stringify(await empModel.findByIdAndDelete(req.params.id));
        res.status(200).send(`Data deleted successfully ${data}`);
    } catch (error) {
        res.status(404).send(error);
    }
})

//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.put('/api/employeelist/:id', async (req, res) => {
    try {
        await empModel.findByIdAndUpdate(req.params.id, req.body);
        var data = await empModel.find();
        res.status(200).send(`Data updated successfully\n${data}`);
    } catch (error) {
        res.status(404).send(error);
    }
})

//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});



