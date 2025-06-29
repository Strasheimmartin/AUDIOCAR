const API_BASE_URL = '/api';
const ADMIN_USERNAME = 'audiocar838';
const ADMIN_PASSWORD = 'Pampa1137';

// --- Funciones de Autenticación ---
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem('loggedIn', 'true');
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        showSection('products'); // Mostrar la sección de productos por defecto
    } else {
        alert('Usuario o contraseña incorrectos');
    }
}

function logout() {
    localStorage.removeItem('loggedIn');
    document.getElementById('login-container').style.display = 'flex';
    document.getElementById('admin-dashboard').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function checkLogin() {
    if (localStorage.getItem('loggedIn') === 'true') {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        showSection('products');
    } else {
        document.getElementById('login-container').style.display = 'flex';
        document.getElementById('admin-dashboard').style.display = 'none';
    }
}

function showSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId + '-section').style.display = 'block';

    // Cargar datos al cambiar de sección
    if (sectionId === 'products') {
        loadProducts();
    } else if (sectionId === 'inquiries') {
        loadInquiries();
    } else if (sectionId === 'offers') {
        loadOffers();
    }
}

// --- Funciones de Gestión de Productos ---
function loadProducts() {
    fetch(`${API_BASE_URL}/products`)
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById('admin-product-list');
            productList.innerHTML = '';
            products.forEach(product => {
                const productItem = document.createElement('div');
                productItem.className = 'admin-item';
                productItem.innerHTML = `
                    <span>${product.name} - $${product.price}</span>
                    <div>
                        <button onclick="editProduct('${product._id}')">Editar</button>
                        <button onclick="deleteProduct('${product._id}')">Eliminar</button>
                    </div>
                `;
                productList.appendChild(productItem);
            });
        });
}

function saveProduct() {
    const id = document.getElementById('product-id').value; // Esto será _id de MongoDB
    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const image = document.getElementById('product-image').value;

    if (!name || !price || !image) {
        alert('Por favor, completa todos los campos obligatorios (Nombre, Precio, URL de Imagen).');
        return;
    }

    const productData = { name, description, price, image };

    if (id) { // Editar producto existente
        fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        })
        .then(response => response.json())
        .then(() => {
            alert('Producto actualizado con éxito!');
            clearProductForm();
            loadProducts();
        });
    } else { // Agregar nuevo producto
        fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        })
        .then(response => response.json())
        .then(() => {
            alert('Producto agregado con éxito!');
            clearProductForm();
            loadProducts();
        });
    }
}

function editProduct(id) {
    fetch(`${API_BASE_URL}/products`)
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p._id === id);
            if (product) {
                document.getElementById('product-id').value = product._id;
                document.getElementById('product-name').value = product.name;
                document.getElementById('product-description').value = product.description;
                document.getElementById('product-price').value = product.price;
                document.getElementById('product-image').value = product.image;
            }
        });
}

function deleteProduct(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE',
        })
        .then(() => {
            alert('Producto eliminado con éxito!');
            loadProducts();
        });
    }
}

function clearProductForm() {
    document.getElementById('product-id').value = '';
    document.getElementById('product-name').value = '';
    document.getElementById('product-description').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-image').value = '';
}

// --- Funciones de Gestión de Consultas ---
function loadInquiries() {
    fetch(`${API_BASE_URL}/inquiries`)
        .then(response => response.json())
        .then(inquiries => {
            const inquiryList = document.getElementById('admin-inquiry-list');
            inquiryList.innerHTML = '';
            if (inquiries.length === 0) {
                inquiryList.innerHTML = '<p>No hay consultas pendientes.</p>';
                return;
            }
            inquiries.forEach(inquiry => {
                const inquiryItem = document.createElement('div');
                inquiryItem.className = 'admin-item inquiry-item';
                inquiryItem.innerHTML = `
                    <span>
                        <strong>Tipo:</strong> ${inquiry.type}<br>
                        <strong>Nombre:</strong> ${inquiry.name}<br>
                        <strong>Email:</strong> ${inquiry.email || 'N/A'}<br>
                        <strong>Teléfono:</strong> ${inquiry.phone || 'N/A'}<br>
                        <strong>Mensaje:</strong> ${inquiry.message}<br>
                        ${inquiry.carModel ? `<strong>Auto:</strong> ${inquiry.carModel}<br>` : ''}
                        <small>Recibido: ${new Date(inquiry.timestamp).toLocaleString()}</small>
                    </span>
                    <div>
                        <button onclick="markInquiryReplied('${inquiry._id}')" ${inquiry.replied ? 'disabled' : ''}>${inquiry.replied ? 'Respondido' : 'Marcar como Respondido'}</button>
                        <button onclick="deleteInquiry('${inquiry._id}')">Eliminar</button>
                    </div>
                `;
                inquiryList.appendChild(inquiryItem);
            });
        });
}

function markInquiryReplied(id) {
    fetch(`${API_BASE_URL}/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replied: true }),
    })
    .then(response => response.json())
    .then(() => {
        alert('Consulta marcada como respondida.');
        loadInquiries();
    });
}

function deleteInquiry(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta consulta?')) {
        fetch(`${API_BASE_URL}/inquiries/${id}`, {
            method: 'DELETE',
        })
        .then(() => {
            alert('Consulta eliminada con éxito!');
            loadInquiries();
        });
    }
}

// --- Funciones de Gestión de Ofertas/Novedades ---
function loadOffers() {
    fetch(`${API_BASE_URL}/offers`)
        .then(response => response.json())
        .then(offers => {
            const offerList = document.getElementById('admin-offer-list');
            offerList.innerHTML = '';
            if (offers.length === 0) {
                offerList.innerHTML = '<p>No hay ofertas o novedades.</p>';
                return;
            }
            offers.forEach(offer => {
                const offerItem = document.createElement('div');
                offerItem.className = 'admin-item';
                offerItem.innerHTML = `
                    <span>
                        <strong>${offer.title}</strong><br>
                        <small>${new Date(offer.timestamp).toLocaleString()}</small>
                    </span>
                    <div>
                        <button onclick="editOffer('${offer._id}')">Editar</button>
                        <button onclick="deleteOffer('${offer._id}')">Eliminar</button>
                    </div>
                `;
                offerList.appendChild(offerItem);
            });
        });
}

function saveOffer() {
    const id = document.getElementById('offer-id').value; // Esto será _id de MongoDB
    const title = document.getElementById('offer-title').value;
    const content = document.getElementById('offer-content').value;

    if (!title || !content) {
        alert('Por favor, completa todos los campos de la oferta/novedad.');
        return;
    }

    const offerData = { title, content };

    if (id) { // Editar oferta existente
        fetch(`${API_BASE_URL}/offers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(offerData),
        })
        .then(response => response.json())
        .then(() => {
            alert('Oferta/Novedad actualizada con éxito!');
            clearOfferForm();
            loadOffers();
        });
    } else { // Agregar nueva oferta
        fetch(`${API_BASE_URL}/offers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(offerData),
        })
        .then(response => response.json())
        .then(() => {
            alert('Oferta/Novedad agregada con éxito!');
            clearOfferForm();
            loadOffers();
        });
    }
}

function editOffer(id) {
    fetch(`${API_BASE_URL}/offers`)
        .then(response => response.json())
        .then(offers => {
            const offer = offers.find(o => o._id === id);
            if (offer) {
                document.getElementById('offer-id').value = offer._id;
                document.getElementById('offer-title').value = offer.title;
                document.getElementById('offer-content').value = offer.content;
            }
        });
}

function deleteOffer(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta oferta/novedad?')) {
        fetch(`${API_BASE_URL}/offers/${id}`, {
            method: 'DELETE',
        })
        .then(() => {
            alert('Oferta/Novedad eliminada con éxito!');
            loadOffers();
        });
    }
}

function clearOfferForm() {
    document.getElementById('offer-id').value = '';
    document.getElementById('offer-title').value = '';
    document.getElementById('offer-content').value = '';
}

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', checkLogin);