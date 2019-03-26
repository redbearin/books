'use strict'
//config environment
require('dotenv').config();

//application dependencies
const express = require('express');
const app = express();

//environment set up
const superagent = require('superagent');
const PORT = process.env.PORT;

app.use (express.urlencoded({extended: true}));
app.use(express.static('./public'));

app.set('view engine', 'ejs');

//path to view page
app.get('/', function(request, response){
  response.render('pages/index');
});

app.get ('*', (request, response) => response.status(404).send('This is route does not exist'));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

//error handler
function handleError(err, res){
  if (res) res.status(500).send('You have achieved an error. Congratulations!');
}

//function to make query for book info
function getBook(request, response) {
  // const url = 'something';

  // return superagent.get(url)
  //   .then(bookData => {
  //     if (!bookData.body.SOMETHING.length) {
  //       throw 'NO BOOK DATA FROM API';
  //     } else {
  //       let bookDetails = new Book(bookData.body.SOMETHING[0], request.query);
  //       // response.send(bookDetails)

  //     }
  //   })

  const url='something';
  return superagent.get(url)
    .then(bookResults =>{
      const bookDetails = bookResults.body.results.map(book =>{
        let searchedBook = new Book(book.id)//?????????
        return searchedBook;
      })
      response.send(bookDetails)
    })
    .catch(error => handleError(error, response));
}

