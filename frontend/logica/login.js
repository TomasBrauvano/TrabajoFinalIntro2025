document.getElementById('boton-ingreso').addEventListener('click', async () => {
    const nombre_usuario = document.getElementById('ingreso-usuario').value;
    const contrasenia = document.getElementById('ingreso-contrasenia').value;
    const loginData = {
        nombre_usuario,
        contrasenia
    };
    console.log(localStorage.getItem('usuario_id'))
    if (!localStorage.getItem('usuario_id')) {
        try {
            const response = await fetch('http://localhost:3000/api/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();
            console.log(data)
            if (response.ok) {
                localStorage.setItem('usuario_id', data.id);
                window.location.href = '/frontend/html/index.html';
            } else {
                alert(data.error || 'Error al iniciar sesión');
            }
        } catch (err) {
            console.error('Error en la solicitud:', err);
            alert('No se pudo conectar con el servidor');
        }
    } else {
        alert('Ya estas logeado');
    }

});