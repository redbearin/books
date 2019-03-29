'use strict';

//class of isbn defaults to hidden
$(document).ready(function(){
  $('show_class').hide();
})

//when the button is clicked, the id of isbn is hidden and the class of isbn is shown
//we need to be able to target the button by id
$('button').on('click', function(){
  console.log(this.id)
  let show_class = `.${this.id}`;
  let hide_id = `#${this.id}`;
  $('show_class').show();
  $(`#${this.id}`).hide();

});


// $('#book.isbn'.click(function(){
//   $('.content').toggle();
// }))
