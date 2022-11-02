const express = require('express');
const http = require('http');
const cors = require('cors');
const {initDB} = require('./db');
const ToDo = require('./db/models/ToDo.model');

const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use((req, res, next) => {
    next();
});

http.createServer(app).listen(3000, () => {
    console.log("Server is working on port 3000");
})
initDB();

app.get("/todos", async (req, res) => {
    try {
        const todoList = await ToDo.findAll();
        if (todoList) {
            res.status(200).json({todoList});
        } else {
            res.status(404).json({message: "Error 404. Not found."});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.get("/todos/:id", async (req, res) => {
    try {
        const todo = await ToDo.findByPk(req.params.id);
        if (todo) {
            res.status(200).json(todo);
        } else {
            res.status(404).json({message: "Error 404. Not found."});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.post("/todos", async (req, res) => {
    try {
        const todo = await ToDo.create({
            title: req.body.title,
            description: req.body.description
        })
        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.patch("/todos/:id", async (req, res) => {
    try {
        const toDo = await ToDo.findByPk(req.params.id);
        if (toDo) {
            await toDo.update({
                title: req.body.title,
                description: req.body.description
            });
            res.json(toDo);
        }
        else {
            res.status(404).json({message: "Error 404. Not found."});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }

});


app.delete("/todos/:id", async (req, res) => {
    try {
        const toDo = await ToDo.findByPk(req.params.id);
        if (toDo) {
            await toDo.destroy();
            res.status(200).json({message: "Задача удалена."});
        }
        else {
            res.status(404).json({message: "Error 404. Not found."});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.delete("/todos", async (req, res) => {
    try {
        await ToDo.destroy({
            truncate: true
        })

        res.status(200).json({message: "База данных очищена."});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
