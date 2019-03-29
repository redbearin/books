'use strict';

//class of isbn defaults to hidden
$(document).ready(function(){
  $('button + div').hide();
})

//when the button is clicked
$('button').on('click', function(){
  $('button + div').show();
});

