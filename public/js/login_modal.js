const ADMIN_USERNAME = 'audiocar838';
const ADMIN_PASSWORD = 'Pampa1137';

function openLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('modal-username').value = '';
    document.getElementById('modal-password').value = '';
    document.getElementById('login-error').textContent = '';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function modalLogin() {
    const username = document.getElementById('modal-username').value;
    const password = document.getElementById('modal-password').value;
    const errorMessage = document.getElementById('login-error');

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        errorMessage.textContent = '';
        window.location.href = 'admin.html'; // Redirigir al panel de administración
    } else {
        errorMessage.textContent = 'Usuario o contraseña incorrectos.';
    }
}

// Cerrar el modal si se hace clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
}
