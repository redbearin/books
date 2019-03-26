'use strict'
//config environment
require('dotenv').config();

//application dependencies
const express = require('express');
const app = express();

const superagent = require('superagent');

const PORT = process.env.PORT;

app.use (express.urlencoded({extended: true}));
app.use(express.static('./public'));

app.set('view engine', 'ejs');

// app.post('/contact', (request, response) => {
//   console.log(request.body);
//   response.sendFile('./thanks.html', {root: './public'});
// });

app.get('/', function(request, response){
  response.render('pages/index');
});

app.get ('*', (request, response) => response.status(404).send('This is route does not exist'));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
