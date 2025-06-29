const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'db.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// --- Funciones de Base de Datos (db.json) ---
function readDB() {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify({ products: [], inquiries: [], offers: [] }));
    }
    const dbRaw = fs.readFileSync(DB_PATH);
    return JSON.parse(dbRaw);
}

function writeDB(db) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// --- API Endpoints para Productos ---
// Obtener todos los productos
app.get('/api/products', (req, res) => {
    const db = readDB();
    res.json(db.products);
});

// Agregar un nuevo producto
app.post('/api/products', (req, res) => {
    const db = readDB();
    const newProduct = {
        id: Date.now(),
        ...req.body
    };
    db.products.push(newProduct);
    writeDB(db);
    res.status(201).json(newProduct);
});

// Actualizar un producto existente
app.put('/api/products/:id', (req, res) => {
    const db = readDB();
    const productId = parseInt(req.params.id);
    const productIndex = db.products.findIndex(p => p.id === productId);

    if (productIndex > -1) {
        db.products[productIndex] = { ...db.products[productIndex], ...req.body };
        writeDB(db);
        res.json(db.products[productIndex]);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

// Eliminar un producto
app.delete('/api/products/:id', (req, res) => {
    const db = readDB();
    const productId = parseInt(req.params.id);
    const initialLength = db.products.length;
    db.products = db.products.filter(p => p.id !== productId);

    if (db.products.length < initialLength) {
        writeDB(db);
        res.status(204).send(); // No Content
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

// --- API Endpoints para Consultas (Inquiries) ---
// Obtener todas las consultas
app.get('/api/inquiries', (req, res) => {
    const db = readDB();
    res.json(db.inquiries);
});

// Agregar una nueva consulta
app.post('/api/inquiries', (req, res) => {
    const db = readDB();
    const newInquiry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        replied: false, // Nuevo campo para el estado de respuesta
        ...req.body
    };
    db.inquiries.push(newInquiry);
    writeDB(db);
    res.status(201).json(newInquiry);
});

// Actualizar el estado de una consulta (ej. marcar como respondida)
app.put('/api/inquiries/:id', (req, res) => {
    const db = readDB();
    const inquiryId = parseInt(req.params.id);
    const inquiryIndex = db.inquiries.findIndex(i => i.id === inquiryId);

    if (inquiryIndex > -1) {
        db.inquiries[inquiryIndex] = { ...db.inquiries[inquiryIndex], ...req.body };
        writeDB(db);
        res.json(db.inquiries[inquiryIndex]);
    } else {
        res.status(404).json({ message: 'Consulta no encontrada' });
    }
});

// Eliminar una consulta
app.delete('/api/inquiries/:id', (req, res) => {
    const db = readDB();
    const inquiryId = parseInt(req.params.id);
    const initialLength = db.inquiries.length;
    db.inquiries = db.inquiries.filter(i => i.id !== inquiryId);

    if (db.inquiries.length < initialLength) {
        writeDB(db);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Consulta no encontrada' });
    }
});

// --- API Endpoints para Ofertas/Novedades ---
// Obtener todas las ofertas/novedades
app.get('/api/offers', (req, res) => {
    const db = readDB();
    res.json(db.offers);
});

// Agregar una nueva oferta/novedad
app.post('/api/offers', (req, res) => {
    const db = readDB();
    const newOffer = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...req.body
    };
    db.offers.push(newOffer);
    writeDB(db);
    res.status(201).json(newOffer);
});

// Actualizar una oferta/novedad
app.put('/api/offers/:id', (req, res) => {
    const db = readDB();
    const offerId = parseInt(req.params.id);
    const offerIndex = db.offers.findIndex(o => o.id === offerId);

    if (offerIndex > -1) {
        db.offers[offerIndex] = { ...db.offers[offerIndex], ...req.body };
        writeDB(db);
        res.json(db.offers[offerIndex]);
    } else {
        res.status(404).json({ message: 'Oferta/Novedad no encontrada' });
    }
});

// Eliminar una oferta/novedad
app.delete('/api/offers/:id', (req, res) => {
    const db = readDB();
    const offerId = parseInt(req.params.id);
    const initialLength = db.offers.length;
    db.offers = db.offers.filter(o => o.id !== offerId);

    if (db.offers.length < initialLength) {
        writeDB(db);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Oferta/Novedad no encontrada' });
    }
});

// --- Iniciar Servidor ---
app.listen(PORT, () => {
    console.log(`¡Sitio web de Audiocar iniciado!`);
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Panel de administración en http://localhost:${PORT}/admin.html`);
});
