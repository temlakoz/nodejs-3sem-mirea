const express = require('express');
const http = require('http');
const cors = require('cors');
const { initDB } = require('./db');
const ToDo = require('./db/models/ToDo.model');

const app = express();
const PORT = 3106;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    console.log("Типа логирование...");
    next();
});

http.createServer(app).listen(PORT, () => {console.log(`Server is working on port ${PORT}`);})

initDB().then(() => {console.log("db initialized.")});

app.get("/todos", async (req, res) => {
    try{
        const todoList = await ToDo.findAll();
        res.status(200).json({todoList});
    }
    catch {
        res.status(500).send("Error 500. Internal Server Error.");
    }
});

app.post("/todos", async (req, res) => {
    try {
        const todoList = await ToDo.create({
            title: req.body.title,
            description: req.body.description
        })
        res.status(200).json(todoList);
    }
    catch {
        res.status(500).send("Error 500. Internal Server Error.");
    }
});

app.patch("/todos/:id", async (req, res) => {
    try {
        const toDo = await ToDo.findByPk(req.params.id);
        await toDo.update({
            title : req.body.title,
            description : req.body.description});
        res.json({
            toDo
        })
    }
    catch {
        res.status(404).send("Объект не найден");
    }

});


app.delete("/todos/:id", async (req, res) => {
    try {
        const toDo = await ToDo.findByPk(req.params.id);
        await toDo.destroy();
        res.status(200).send("Задача удалена.");
    }
    catch {
        res.status(500).send("Error 500. Internal Server Error.");
    }
});

app.delete("/todos", async (req, res) => {
    try {
        await ToDo.destroy({
            where: {},
            truncate: true
        })

        res.status(200).send("База данных очищена.");
    }
    catch {
        res.status(500).send("Error 500. Internal Server Error.");
    }
});


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////FIRST HOME WORK///////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
app.post("/sum", async (req, res) => {
    let numbers = {
        a: req.body.a,
        b: req.body.b
    }
    if (numbers.a && numbers.b) {
        res.status(200).send((numbers.a + numbers.b).toString());
    }
    else {
        res.status(400).send("Error 400. Bad Request. Отсутствуют параметры a или b");
    }
});

app.post("/reverseCase", async (req, res) => {
    let myString = req.body.string;

    if (myString) {
        let new_str = "";
        let len = myString.length;
        for (let i = 0; i < len; i++) {
            if (myString[i] === myString[i].toLowerCase()) {
                new_str += myString[i].toUpperCase();
            } else {
                new_str += myString[i].toLowerCase();
            }
        }
        res.status(200).send(new_str);
    }
    else {
        res.status(400).send("Error 400. Bad Request. Отсутствует параметр string");
    }
});

app.post("/reverseArray", async (req, res) => {
    let array = req.body.array;

    if (array) {
        array = array.reverse();
        res.status(200).send(`${array}`)
    }
    else {
        res.status(400).send("Error 400. Bad Request. Отсутствует параметр array");
    }
});
