'use strict';

//class of isbn defaults to hidden
$(document).ready(function(){
  $('button + div').hide();
})

//when the button is clicked
$('button').on('click', function(){
  $(this)
    .next()
    .attr("style", "display:inline");
  // console.log('here i am')
  // // $('button div').show();
  // // console.log(this.sibling());
  // // $(this).next().show();
});

