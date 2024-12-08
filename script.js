document.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
      header.classList.add('small');
    } else {
      header.classList.remove('small');
    }
  });
/*
  document.querySelector('.hamburger-menu').addEventListener('click', function () {
    const menu = document.querySelector('.dropdown-menu');
    menu.classList.toggle('show');
  });*/