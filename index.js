var express = require('express');
var app = express();

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.send("Hello world!");
});

app.get('/todos', function (req, res) {
  res.send("Todo list");
});

app.post('/todos/:id/mark_as_done', function (req, res) {
  res.send("create todo, id: " + req.params.id);
});

app.put('/todos/:id/update', function (req, res) {
  res.send("update todo, id: " + req.params.id);
});

app.delete('/todos/:id', function (req, res) {
  res.send("delete todo, id: " + req.params.id);
});

app.get('/todo-list', function (req, res) {
  res.render('todo-list');
});

app.listen(3000);