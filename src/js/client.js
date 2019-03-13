import chartElement from './chartElement.js';

var pagination = document.getElementsByClassName("pagination");

for(let i = 0; i < pagination.length; i++) {
    pagination[i].addEventListener("click", function() {
      document.querySelector('.pagination.active').classList.remove('active');
      document.getElementById(`pagination-${i}`).classList.add('active');
    })
  } 

