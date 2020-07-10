document.body.addEventListener('keyup', function(e) {
    if (e.which === 9) /* tab */ {
      document.documentElement.classList.remove('no-focus-outline');
    }
  });