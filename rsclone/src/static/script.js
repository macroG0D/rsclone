const btn = document.querySelector('.header__burger');
const header = document.querySelector('.header');


btn.addEventListener('click',()=>{
  btn.classList.toggle('header__burger--close');
  btn.classList.toggle('header__burger--open');
  header.classList.toggle('header__hidden');
})