const resNav= document.querySelector('.burgerNav');
const navList = document.querySelector('.navList');
const sect1= document.querySelector('.section-1');






resNav.addEventListener('click',()=>{

   navList.classList.toggle("resnav");
   sect1.classList.toggle('d-none');

})


