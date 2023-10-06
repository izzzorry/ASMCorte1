window.onscroll = function () {
    myFunction();
  };
  
  var secciones = document.getElementsByTagName("section");
  var fechas = document.getElementsByClassName("fecha");
  

  
  function myFunction() {
    if (window.pageYOffset >= secciones[0].offsetTop) {
      eliminarClase();
    }
    if (window.pageYOffset >= secciones[1].offsetTop - 100) {
      eliminarClase();
      fechas[0].classList.add("seleccionado");
    } else if (window.pageYOffset < secciones[1].offsetTop - 100) {
      eliminarClase();
    }
    if (window.pageYOffset >= secciones[2].offsetTop - 100) {
        eliminarClase();
        fechas[1].classList.add("seleccionado");
      } else if (window.pageYOffset < secciones[1].offsetTop - 100) {
        eliminarClase();
      }
      if (window.pageYOffset >= secciones[3].offsetTop - 100) {
        eliminarClase();
        fechas[2].classList.add("seleccionado");
      } else if (window.pageYOffset < secciones[1].offsetTop - 100) {
        eliminarClase();
      }
      if (window.pageYOffset >= secciones[4].offsetTop - 100) {
        eliminarClase();
        fechas[3].classList.add("seleccionado");
      } else if (window.pageYOffset < secciones[1].offsetTop - 100) {
        eliminarClase();
      }
      if (window.pageYOffset >= secciones[5].offsetTop - 100) {
        eliminarClase();
        fechas[4].classList.add("seleccionado");
      } else if (window.pageYOffset < secciones[1].offsetTop - 100) {
        eliminarClase();
      }
  }
  
  function eliminarClase() {
    for (var i = 0; i < fechas.length; i++) {
      fechas[i].classList.remove("seleccionado");
    }
  }
  

  
  