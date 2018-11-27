
window.onscroll = () => {
    if(window.scrollY > 0){
        document.querySelector('header').style.height = '60px';
    }
    else if(window.scrollY == 0) {
        document.querySelector('header').style.height = '80px';
    }     
};

