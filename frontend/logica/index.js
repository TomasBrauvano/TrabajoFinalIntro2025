async function cargarRecomendaciones(usuario_id) {
    try {
        const res = await fetch(`http://localhost:3000/api/recomendaciones/${usuario_id}`);
        const data = await res.json();

        const contenedor = document.getElementById("horizontal-1");
        contenedor.innerHTML = "";

        const recomendaciones = [];

        if(data.pelicula) recomendaciones.push({...data.pelicula, tipo: 'Pelicula'});
        if(data.serie) recomendaciones.push({...data.serie, tipo: 'Serie'});
        if(data.libro) recomendaciones.push({...data.libro, tipo: 'Libro'});

        if(recomendaciones.length > 0){
            recomendaciones.forEach(item => {
                const tarjeta = document.createElement("div");
                tarjeta.classList.add("tarjeta");

                const imagen = document.createElement("img");
                imagen.src = item.imagen;
                imagen.alt = item.nombre;
                imagen.classList.add("recomendacion-imagen");

                const titulo = document.createElement("p");
                titulo.classList.add("recomendacion-titulo");
                titulo.textContent = item.nombre;

                const botonAgregar = document.createElement("button");
                botonAgregar.textContent = "Agregar";
                botonAgregar.classList.add("boton-agregar");

                tarjeta.appendChild(imagen);
                tarjeta.appendChild(botonAgregar);
                tarjeta.appendChild(titulo);
                contenedor.appendChild(tarjeta);
            });
    
        }else{
            contenedor.innerHTML = "<p>No hay recomendaciones para tu categoria preferida.<p>";
        }
    } catch(err){
        console.error("Error al cargar las recomendaciones", err);
        const contenedor = document.getElementById("horizontal-1");
        contenedor.innerHTML = "<p>Ha ocurrido un error al cargar las recomendaciones.</p>";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const usuario_id = localStorage.getItem("usuario_id");
    const btnLogin = document.getElementById("btn-login");
    const btnRegister = document.getElementById("btn-register");
    const elementosLogueado = document.querySelectorAll(".logeado");

    if (usuario_id) {
        btnLogin.style.display = "none";
        btnRegister.style.display = "none";

        elementosLogueado.forEach(el => el.style.display = "list-item");

        cargarRecomendaciones(usuario_id);
    } else {
        elementosLogueado.forEach(el => el.style.display = "none");
    }
});