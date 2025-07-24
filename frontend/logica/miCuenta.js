async function cargarCategorias() {
    try {
        const res = await fetch("http://localhost:3000/api/categorias");
        const categorias = await res.json();

        const select = document.getElementById("cambio-categoria");
        select.innerHTML = "";

        categorias.forEach(categoria => {
            const option = document.createElement("option");
            option.value = categoria.id;
            option.textContent = categoria.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar categorías:", error);
        const select = document.getElementById("categoria_preferida");
        select.innerHTML = `<option value="">No se pudieron cargar las categorías</option>`;
    }
}

const usuario_id = JSON.parse(localStorage.getItem("usuario_id"));
let usuario;
(async () => {
    cargarCategorias()
    const response = await fetch(`http://localhost:3000/api/usuarios/${usuario_id}`);
    if (response.ok) {
        usuario = await response.json();
        const responseCategoria = await fetch(`http://localhost:3000/api/categorias/${usuario.categoria_preferida}`)
        const categoria_preferida = await responseCategoria.json()

        document.getElementById("nombre-apellido").textContent = `${usuario.nombre} ${usuario.apellido}`;
        document.getElementById("nombre-usuario").textContent = usuario.nombre_usuario;
        document.getElementById("nombre-actual").textContent = usuario.nombre;
        document.getElementById("apellido-actual").textContent = usuario.apellido;
        document.getElementById("categoria-actual").textContent = categoria_preferida.nombre;
    } else {
        console.error("No se pudo obtener el usuario");
    }
})();

async function actualizarUsuario(cambios) {
    const body = {
        nombre_usuario: usuario.nombre_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        contrasenia: usuario.contrasenia,
        categoria_preferida: usuario.categoria_preferida,
        usuario_id: usuario_id,
        ...cambios
    };

    try {
        const res = await fetch(`http://localhost:3000/api/usuarios/${usuario_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        if (res.ok) {
            alert("Datos actualizados correctamente");
            location.reload();
        } else {
            alert(data.error || 'Error al actualizar');
        }
    } catch (err) {
        console.error(err);
        alert('Error al conectar con el servidor');
    }
}

document.getElementById("titulo-config").addEventListener("click", function() {
  let section = document.getElementById("configuraciones1");
  if (section.style.display === "none") {
    section.style.display = "flex";
  } else {
    section.style.display = "none";
  }
});

document.querySelectorAll(".desplegar-cambio").forEach(button => {
    button.addEventListener("click", function(){
        let targetId = this.getAttribute("data-target");
        let div = document.getElementById(targetId);
        if (div.style.display === "none") {
            div.style.display = "block";
        } else {
            div.style.display = "none";
        }
    });
});

document.getElementById('cambiar-nombre').addEventListener('click', () => {
    const nuevo = document.getElementById('cambio-nombre').value;
    actualizarUsuario({ nombre: nuevo });
});

document.getElementById('cambiar-apellido').addEventListener('click', () => {
    const nuevo = document.getElementById('cambio-apellido').value;
    actualizarUsuario({ apellido: nuevo });
});

document.getElementById('cambiar-categoria').addEventListener('click', () => {
    const nuevo = document.getElementById('cambio-categoria').value;
    actualizarUsuario({ categoria_preferida: nuevo });
});

document.getElementById('cambiar-contrasenia').addEventListener('click', () => {
    const nueva = document.getElementById('cambio-contrasenia').value;
    const confirmar = document.getElementById('cambio-confirmacion-contra').value;

    if (nueva !== confirmar) {
        alert("Las contraseñas no coinciden");
        return;
    }
    actualizarUsuario({ contrasenia: nueva });
});

document.querySelector('#eliminar-cuenta').addEventListener('click', async () => {
    try {
        const res = await fetch(`http://localhost:3000/api/usuarios/${usuario_id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: usuario_id })
        });

        const data = await res.json();

        if (res.ok) {
            alert('Cuenta eliminada');
            localStorage.clear();
            window.location.href = "index.html";
        } else {
            alert(data.error || 'Error al eliminar');
        }
    } catch (err) {
        console.error(err);
        alert('Error al conectar con el servidor');
    }
});