function crearTarjetaPlataforma(plataforma){
    const tarjetaDiv = document.createElement("div");
    tarjetaDiv.classList.add("tarjeta", "plataforma-item");

    tarjetaDiv.innerHTML = `
    <img src = "${plataforma.logo_url}" alt="Logo de ${plataforma.nombre}" class="recomendacion-imagen">
    <h3 class="recomendacion-titulo">${plataforma.nombre}</h3>
    <p class="plataforma-costo">Costo Mensual: $${Number(plataforma.costo_mensual).toFixed(2)}</p>
    <p class="plataforma-disponibilidad">${plataforma.disponibie_en_argentina ? 'Disponible en Argentina' : 'No disponible en Argentina'}</p>
    <p class="plataforma-ceo">CEO: ${plataforma.ceo}</p>
    <a href="${plataforma.pagina_url}" target="_blank" class="boton">Visitar Sitio</a>
    `;

    return tarjetaDiv;
}

async function cargarPlataformas() {
    const mostradorDeContenido = document.querySelector(".mostrador-de-contenido");
    mostradorDeContenido.innerHTML = '<p>Cargando plataformas...</p>'

    try{
        const res = await fetch("http://localhost:3000/api/plataformas");

        if(!res.ok){
            throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`);
        }

        const plataformas = await res.json();

        mostradorDeContenido.innerHTML = '';

        if(plataformas.length == 0){
            mostradorDeContenido.innerHTML = '<p>No hay plataformas registradas en este momento.</p>';
            return;
        }

        plataformas.forEach(plataforma => {
            const tarjeta = crearTarjetaPlataforma(plataforma);
            mostradorDeContenido.appendChild(tarjeta);
        });
    }catch(error){
        console.error("Error al cargar plataformas", error);
        mostradorDeContenido.innerHTML = `<p>Error al cargar las plataformas: ${error.message}. Por favor, intente de nuevo mas tarde.</p>`
    }
}

document.addEventListener("DOMContentLoaded", cargarPlataformas);