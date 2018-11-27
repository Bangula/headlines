document.querySelector('#menu-icon').addEventListener('click', () => {
    mobileNav();
});
let navState = false;
const mobileNav = () => {
    if(!navState){
        document.querySelector('#mobile-menu').style.top = '50px';
        navState = true;
    }else {
        document.querySelector('#mobile-menu').style.top = '-200px';
        navState = false;
    }    
    
}