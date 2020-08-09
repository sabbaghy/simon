const mainNav = document.getElementById('nav__links');
const toggleMenu = document.getElementById('toggle-menu');
const navList = document.getElementById('nav__list');
const navItems = document.querySelectorAll('.nav__item');
const navLenght = navItems.length;
let menuOpen = false;

/*----------------------------------------------------------------
   Control animacion toggle menu
----------------------------------------------------------------*/
toggleMenu.addEventListener('click', () =>{
   mainNav.classList.toggle('show-menu');
   toggleMenu.classList.toggle('open');
   menuOpen ? menuOpen = false : menuOpen = true;
})

/* -----------------------------------------------------------------------------------------
  Revisa en que link se hizo click, busca el link que tenia la clase active para removerla 
  y luego agregarle al link donde se hizo click la clase active
------------------------------------------------------------------------------------------*/
navItems.forEach(link => {
   link.addEventListener('click', function(){
      navList.querySelector('.nav__item--active').classList.remove('nav__item--active');
      link.classList.add('nav__item--active');
      
      if (menuOpen) {
         mainNav.classList.toggle('show-menu');
         toggleMenu.classList.toggle('open');
         menuOpen = false;
      }
   })
});