async function cargarRecomendaciones(usuario_id) {
    try {
        const res = await fetch(`http://localhost:3000/api/recomendaciones/${usuario_id}`);
        const data = await res.json();
        console.log(data)

        const contenedor = document.getElementById("horizontal-1");
        contenedor.innerHTML = "";

        const tarjetaPeli = document.createElement("div");
        tarjetaPeli.classList.add("tarjeta");
        tarjetaPeli.textContent = `Película: ${data.pelicula?.nombre ?? "No disponible"}`;

        const tarjetaSerie = document.createElement("div");
        tarjetaSerie.classList.add("tarjeta");
        tarjetaSerie.textContent = `Serie: ${data.serie?.nombre ?? "No disponible"}`;

        const tarjetaLibro = document.createElement("div");
        tarjetaLibro.classList.add("tarjeta");
        tarjetaLibro.textContent = `Libro: ${data.libro?.nombre ?? "No disponible"}`;

        contenedor.appendChild(tarjetaPeli);
        contenedor.appendChild(tarjetaSerie);
        contenedor.appendChild(tarjetaLibro);
    } catch (error) {
        console.error("Error al cargar recomendaciones:", error);
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