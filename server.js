'use strict'
//config environment
require('dotenv').config();

//application dependencies
const express = require('express');
const app = express();

//environment set up
const superagent = require('superagent');
const PORT = process.env.PORT;

//middleware
app.use (express.urlencoded({extended: true}));
app.use(express.static('./public'));

//sets the view engine for the server side
app.set('view engine', 'ejs');

//API routes
//path to view page
app.get('/', newSearch);

// app.get('/', function(request, response){
//   response.render('pages/index');
// });

//creates a new search to Google Books API
app.post('/searches', getBook);

//catch-all
app.get ('*', (request, response) => response.status(404).send('This is route does not exist'));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

//error handler
function handleError(err, res){
  if (res) res.status(500).send('You have achieved an error. Congratulations!');
}

//HELPER FUNCTIONS

function Book(info) {
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  this.author = info.author || 'No author available';
  this.title = info.title || 'No title available';
  this.description = info.description || 'No description available';
  this.isbn = info.isbn || 'No ISBN available';
  this.thumbnail = info.thumbnail || placeholderImage;
}

function newSearch (request, response) {
  response.render('pages/index');
}

//function to make query for book info
function getBook(request, response) {
  let url=`https://www.googleapis.com/books/v1/volumes?q=`;
  console.log(request.body);
  if (request.body.search[1] === 'title') {
    url += `+intitle:${request.body.search[0]}`;
  }
  if (request.body.search[1] === 'author') {
    url += `+inauthor:${request.body.search[0]}`;
  }
  superagent.get(url)
    .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
    .then(results => response.render(`pages/searches/show`, {searchResults: results}))
    .catch(error => handleError(error, response));
}

