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
//path to view page
app.get('/', newSearch);

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
  this.authors = info.authors || 'No author available';
  this.title = info.title || 'No title available';
  this.description = info.description || 'No description available';
  this.isbn = info.isbn || 'No ISBN available';
  this.thumbnail = info.imageLinks.thumbnail.replace('http://', 'https://') || placeholderImage;
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



// function getOneBook(request, response){
//   console.log('BOOK ID', request.params.task_id);

// }
















/*====================================CORPSE CODE==================*/
//we want to save this code where we can easily access it again when we start refactoring for sql to the specs of the lab.
//we got ahead of ourselves, and this function stopped rendering pages.

//function to make query for book info
// function getBook(request, response) {
//   console.log('hello from get books');
//   const selectSQL = `SELECT * FROM books where search_query=$1;`;
//   //TODO: also broken
//   //const values = [request.query.info];
//   const values = [request.params.content];


//   client.query(selectSQL)
//     .then(result => {
//       if(result.rowCount > 0){
//         response.send(result.rows[0]);
//       } else{
//         // beginning of url
//         console.log('===========this is request.body.search', request.body.search)
//         let url=`https://www.googleapis.com/books/v1/volumes?q=`;
//         if (request.body.search[1] === 'title') {
//           url += `+intitle:${request.body.search[0]}`;
//         }
//         if (request.body.search[1] === 'author') {
//           url += `+inauthor:${request.body.search[0]}`;
//         }
//         //end of url
//         superagent.get(url)
//           .then(apiResponse => {
//             console.log('========API RESPONSE==========', apiResponse.body)

//             if (!apiResponse.body.items.volumeInfo.title) {
//               throw 'NO BOOK INFORMATION';
//             } else {
//               let loggedBook = new Book(bookResult.volumeInfo, request.query);

//               let insertSql = `INSERT INTO books (authors, title, description, isbn, thumbnail) VALUES($1, $2, $3, $4, $5) RETURNING id;`;
//               let newValues = Object.values(loggedBook);

//               client.query(insertSql, newValues)
//                 .then(sqlReturn => {
//                   loggedBook.id = sqlReturn.rows[0].id;
//                   response.send(loggedBook);
//                 });
//             }
//           });
//       }
//     })

//     .catch(error => handleError(error, response))
//     // .then(apiResponse => apiResponse.body.items.map(bookResult =>{
//     //   return new Book(bookResult.volumeInfo);
//     // }))
//     // .then(results => response.render(`pages/searches/show`, {searchResults: results}))
//     // .catch(error => handleError(error, response))
// }

