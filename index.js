var express = require('express');
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');
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
	date: Date,
	description: String,
	done: Boolean
});
var Todo = mongoose.model("Todo", todoSchema);

app.get('/', function (req, res) {
	res.redirect('/todos');
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

app.post('/todo-create', function (req, res) {
	var todoInfo = req.body;

	if (todoInfo == undefined) {
		res.render('todo-create', {
			message: "Please post right info",
			type: "error"
		});
	}
	else if (!todoInfo.date || !todoInfo.description) {
		res.render('todo-create', {
			message: "Sorry, you provided worng info",
			type: "error"
		});
	} else {
		var newTodo = new Todo({
			date: todoInfo.date,
			description: todoInfo.description,
			done: false
		});

		newTodo.save(function (err, Todo) {
			if (err)
				res.render('todo-create', {
					message: "Database error",
					type: "error"
				});
			else
				res.redirect('/todos');
		});
	}
});

app.get('/todos', function (req, res) {
	Todo.find({}, function(err, response) {
		var data = []
		var todos = response
		for(let i in todos) {
			var todo = todos[i];
			todo.human_date = dateFormat(todo.date, "yyyy-mm-dd");
			data.push(todo)
		}

		res.render('todo-list', {
			todos: data
		});
	});
});

app.get('/todos/:id', function(req, res) {
	var id = req.params.id
	
	Todo.findById(id, function(err, response) {
		var todo = response;
		todo.human_date = dateFormat(todo.date, "yyyy-mm-dd");
		res.render('todo-edit', {
			todo: todo
		});
	});
});

app.post('/todos/:id', function (req, res) {
	var todoInfo = req.body;

	if (todoInfo == undefined) {
		res.render('todo-edit', {
			message: "Please post right info",
			type: "error"
		});
	}
	else if (!todoInfo.date || !todoInfo.description) {
		res.render('todo-edit', {
			message: "Sorry, you provided worng info",
			type: "error"
		});
	} else {
		var data = {
			date: todoInfo.date,
			description: todoInfo.description,
			done: todoInfo.done
		};

		Todo.findByIdAndUpdate(req.params.id, data,
			function (err, response) {
				if (err) {
					res.render('todo-edit', {
						message: "Database error",
						type: "error",
						todo: response
					});
				}
				else {
					res.redirect('/todos');
				}
			});
	}
});

app.get('/todo-delete/:id', function(req, res) {
	var id = req.params.id;

	Todo.findByIdAndRemove(id, function(err, response) {
		if (err) {
			res.render('todos', {
				message: "Database error",
				type: "error"
			});
		}
		else {
			res.redirect('/todos');
		}
	});
});

app.get('/todo-toggle/:id/:done', function(req, res) {
	var id = req.params.id;
	var done = req.params.done;

	Todo.findByIdAndUpdate(req.params.id, {done: done},
		function (err, response) {
			if (err) {
				res.send(JSON.stringify({ type: "error" }));
			}
			else {
				res.send(JSON.stringify({ type: "success" }));
			}
		});
});

app.listen(3000);