var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));

// Database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todos');

var todoSchema = mongoose.Schema({
	title: String,
	description: String,
});
var Todo = mongoose.model("Todo", todoSchema);

app.get('/', function (req, res) {
	res.send("Hello world!");
});

app.post('/todo-create', function (req, res) {
	var todoInfo = req.body;
		
	if(todoInfo == undefined) {
		res.render('todo-create', {
			message: "Please post right info",
			type: "error"
		});
	}
	else if (!todoInfo.title || !todoInfo.description) {
		res.render('todo-create', {
			message: "Sorry, you provided worng info",
			type: "error"
		});
	} else {
		var newTodo = new Todo({
			title: todoInfo.title,
			description: todoInfo.description,
		});

		newTodo.save(function (err, Todo) {
			if (err)
				res.render('todo-create', {
					message: "Database error",
					type: "error"
				});
			else
				res.render('todo-create', {
					message: "added",
					type: "success",
					todo: todoInfo
				});
		});
	}
});

app.put('/todos/:id/update', function (req, res) {
	res.send("update todo, id: " + req.params.id);
});

app.delete('/todos/:id', function (req, res) {
	res.send("delete todo, id: " + req.params.id);
});

app.get('/todo-create', function (req, res) {
	res.render('todo-create');
});

app.get('/todos', function (req, res) {
	res.render('todo-list');
});

app.listen(3000);