document.addEventListener('DOMContentLoaded', () => {
    const listaMisPlataformasDiv = document.getElementById('lista-mis-plataformas');
    const usuario_id = JSON.parse(localStorage.getItem("usuario_id"));

    async function obtenerYMostrarMisPlataformas() {
        listaMisPlataformasDiv.innerHTML = '<p>Cargando tus plataformas...</p>';

        try{
            const res = await fetch(`http://localhost:3000/api/plataformas/creadores/${usuario_id}`);

            if(!res.ok) {
                const errorText = await res.text();
                throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`)
            }

            const plataformas = await res.json();

            if(plataformas.length == 0) {
                listaMisPlataformasDiv.innerHTML = '<p>No has creado ninguna plataforma aún.</p>';
                return;
            }

            const contenedor = document.createElement('div');
            contenedor.classList.add('mostrador-de-contenido');

            for(const plataforma of plataformas){
                const tarjetaDiv = document .createElement('div');
                tarjetaDiv.classList.add('pelicula-item', 'plataforma-card');

                tarjetaDiv.innerHTML = `
                    <h3 class="recomendacion-titulo">${plataforma.nombre}</h3>
                    <img src="${plataforma.logo_url}" alt="Logo de ${plataforma.nombre}">
                    
                    <div class="mis-plataformas-acciones">
                        <button class="btn-actualizar-plataforma" data-id="${plataforma.id}">Actualizar</button>
                        <button class="btn-eliminar-plataforma" data-id="${plataforma.id}">Eliminar</button>
                    </div>
                `;
                contenedor.appendChild(tarjetaDiv);

                tarjetaDiv.querySelector(".btn-actualizar-plataforma").addEventListener("click", (event) => {
                    event.stopPropagation();
                    window.location.href = `actualizar-plataforma.html?id=${plataforma.id}`;
                });

                tarjetaDiv.querySelector(".btn-eliminar-plataforma").addEventListener("click", async (event) => {
                    event.stopPropagation();
                    const confirmar = confirm(`¿Estás seguro de que quieres eliminar la plataforma "${plataforma.nombre}"?`);
                    if (!confirmar) return;

                    try {
                        const resEliminar = await fetch(`http://localhost:3000/api/plataformas/${plataforma.id}`, {
                            method: "DELETE",
                            headers: { 'Content-Type': 'application/json' },
                        });

                        if(resEliminar.ok){
                            alert("Plataforma eliminada correctamente.");
                            obtenerYMostrarMisPlataformas();
                        } else{
                            const errorData = await resEliminar.json();
                            alert(`Error al eliminar la plataforma: ${errorData.error || 'Mensaje desconocido'}`);
                        }
                    } catch(error){
                        console.error('Error al eliminar la plataforma:', error);
                        alert("Error al conectar con el servidor para eliminar la plataforma.");
                    }
                });
            }

            listaMisPlataformasDiv.innerHTML = '';
            listaMisPlataformasDiv.appendChild(contenedor);
            
        }catch (error) {
            console.error('Error al cargar tus plataformas:', error);
            listaMisPlataformasDiv.innerHTML = `<p class="error-message">Error al cargar tus plataformas: ${error.message}.</p>`;
        }
    }

    obtenerYMostrarMisPlataformas();
})