const resNav= document.querySelector('.burgerNav');
const navList = document.querySelector('.navList');
const sect1= document.querySelector('.section-1');
const line1=document.querySelector('.l-1');
const line2=document.querySelector('.l-2');
const line3=document.querySelector('.l-3')




resNav.addEventListener('click',()=>{

   navList.classList.toggle("resnav");
   resNav.classList.toggle('fixed');
   line1.classList.toggle('line-1');
   line2.classList.toggle('d-none');
   line3.classList.toggle('line-2');

   

})


