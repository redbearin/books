'use strict'
//config environment
require('dotenv').config();

//application dependencies
const express = require('express');
const app = express();

const pg = require('pg');

//environment set up
const superagent = require('superagent');
const PORT = process.env.PORT;

//middleware
app.use (express.urlencoded({extended: true}));
app.use(express.static('./public'));

//database setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.log(err));
//sets the view engine for the server side
app.set('view engine', 'ejs');

//API routes
//path to view page/home route
//TODO: this route works fine no touch
app.get('/searches/new', newBookSearchForm);

//internal local host routes

app.get('/books/:book_id', getOneBook)


app.get('/books/show', getBooksFromDB)

//TODO: bring back in when getBooks is fully resolved
//
//app.post('/searches/show', addBookToDB)

//creates a new search to Google Books API
//TODO: this route works do not touch
app.post('/searches/show', booksFromAPI);


//catch-all
app.get ('*', (request, response) => response.status(404).send('This is route does not exist'));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

//error handler
function handleError(err, res){
  if (res) res.status(500).send('You have achieved an error. Congratulations!');
}



function newBookSearchForm (request, response) {
  response.render('pages/searches/new');
}

function getOneBook(request, response){
  console.log('BOOK ID', request.params.book_id);

  let SQL = 'SELECT * FROM books WHERE id=$1;';
  let values = [request.params.book_id];

  return client.query(SQL, values)
    .then(bookResult =>{
      return response.render('pages/detail', {book: bookResult.rows[0]});
    })
    .catch(error => handleError(error, response));
}


function getBooksFromDB (request, response){
  let SQL = 'SELECT * FROM books;';

  return client.query(SQL)
    .then(bookResultsFromDB =>{
      console.log(bookResultsFromDB);
      response.render('/books/show', {bookResultsFromDB: bookResultsFromDB.rows})
    })
    .catch(handleError);
}

function addBookToDB(request, response){
  console.log(request.body);

  let{authors, title, description, isbn, thumbnail} = request.body;

  let SQL= 'INSERT INTO books(authors, title, description, isbn, thumbnail) VALUES ($1, $2, $3, $4, $5);';
  let values = [authors, title, description, isbn, thumbnail];

  return client.query(SQL, values)
    .then(sqlResult =>{
      console.log(sqlResult);
      response.redirect('/')
    })
    .catch(error => handleError(error, response));
}



function booksFromAPI(request, response) {
  console.log('hit the books from API page')
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



//HELPER FUNCTIONS

function Book(info) {
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  this.authors = info.authors || 'No author available';
  this.title = info.title || 'No title available';
  this.description = info.description || 'No description available';
  this.isbn = info.isbn || 'No ISBN available';
  this.thumbnail = info.imageLinks.thumbnail.replace('http://', 'https://') || placeholderImage;
}











// ======================CORPRSE CODE=================
//brings you to the original search form
// function newBookSearch (request, response) {
//   response.render('pages/index');
// }

//function to make query for book info
// function getBooks(request, response) {
//   let url=`https://www.googleapis.com/books/v1/volumes?q=`;
//   console.log(request.body);
//   if (request.body.search[1] === 'title') {
//     url += `+intitle:${request.body.search[0]}`;
//   }
//   if (request.body.search[1] === 'author') {
//     url += `+inauthor:${request.body.search[0]}`;
//   }
//   superagent.get(url)
//     .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
//     .then(results => response.render(`pages/searches/show`, {searchResults: results}))
//     .catch(error => handleError(error, response));
// }



// function getOneBook(request, response){
//   console.log('BOOK ID', request.params.book_id);

//   let SQL = 'SELECT * FROM books WHERE id=$1;';
//   let values = [request.params.book_id];

//   return client.query(SQL, values)
//     .then(bookResult =>{
//       return response.render('pages/detail', {book: bookResult.rows[0]});
//     })
//     .catch(error => handleError(error, response));
// }

//TODO: add getBooksFromDB function

//TODO: we need to add a route for the function and modify the routes for the newSearch functions

// function addBookToDB(request, response){
//   console.log(request.body);

//   let{authors, title, description, isbn, thumbnail} = request.body;

//   let SQL= 'INSERT INTO books(authors, title, description, isbn, thumbnail) VALUES ($1, $2, $3, $4, $5);';
//   let values = [authors, title, description, isbn, thumbnail];

//   return client.query(SQL, values)
//     .then(sqlResult =>{
//       console.log(sqlResult);
//       response.redirect('/')
//     })
//     .catch(error => handleError(error, response));
// }


