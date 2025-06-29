const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de MongoDB
const MONGODB_URI = process.env.MONGODB_URI; // La cadena de conexión se leerá de una variable de entorno
const DB_NAME = 'audiocar_db'; // Puedes cambiar el nombre de tu base de datos 

let db;

async function connectToMongoDB() {
    if (db) return db; // Reutilizar conexión existente
    try {
        const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        db = client.db(DB_NAME);
        console.log("Conectado a MongoDB Atlas");
        return db;
    } catch (error) {
        console.error("Error al conectar a MongoDB Atlas:", error);
        process.exit(1); // Salir si no se puede conectar a la base de datos
    }
}

// --- API Endpoints para Productos ---
app.get('/api/products', async (req, res) => {
    try {
        const database = await connectToMongoDB();
        const products = await database.collection('products').find({}).toArray();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const database = await connectToMongoDB();
        const newProduct = req.body;
        const result = await database.collection('products').insertOne(newProduct);
        res.status(201).json({ _id: result.insertedId, ...newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar producto', error: error.message });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const database = await connectToMongoDB();
        const productId = req.params.id;
        const updatedProduct = req.body;
        const result = await database.collection('products').updateOne(
            { _id: new ObjectId(productId) },
            { $set: updatedProduct }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto actualizado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const database = await connectToMongoDB();
        const productId = req.params.id;
        const result = await database.collection('products').deleteOne({ _id: new ObjectId(productId) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
    }
});

// --- API Endpoints para Consultas (Inquiries) ---
app.get('/api/inquiries', async (req, res) => {
    try {
        const database = await connectToMongoDB();
        const inquiries = await database.collection('inquiries').find({}).toArray();
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener consultas', error: error.message });
    }
});

app.post('/api/inquiries', async (req, res) => {
    try {
        const database = await connectToMongoDB();
        const newInquiry = { ...req.body, timestamp: new Date(), replied: false };
        const result = await database.collection('inquiries').insertOne(newInquiry);
        res.status(201).json({ _id: result.insertedId, ...newInquiry });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar consulta', error: error.message });
    }
});

app.put('/api/inquiries/:id', async (req, res) => {
    try {
        const database = await connectToMongoDB();
        const inquiryId = req.params.id;
        const updatedInquiry = req.body;
        const result = await database.collection('inquiries').updateOne(
            { _id: new ObjectId(inquiryId) },
            { $set: updatedInquiry }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Consulta no encontrada' });
        }
        res.json({ message: 'Consulta actualizada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar consulta', error: error.message });
    }
});

app.delete('/api/inquiries/:id', async (req, res) => {
    try {
        const database = await connectToMongoDB();
        const inquiryId = req.params.id;
        const result = await database.collection('inquiries').deleteOne({ _id: new ObjectId(inquiryId) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Consulta no encontrada' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar consulta', error: error.message });
    }
});

// --- API Endpoints para Ofertas/Novedades ---
app.get('/api/offers', async (req, res) => {
    try {
        const database = await connectToMongoDB();
        const offers = await database.collection('offers').find({}).toArray();
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener ofertas', error: error.message });
    }
});

app.post('/api/offers', async (req, res) => {
    try {
        const database = await connectToMongoDB();
        const newOffer = { ...req.body, timestamp: new Date() };
        const result = await database.collection('offers').insertOne(newOffer);
        res.status(201).json({ _id: result.insertedId, ...newOffer });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar oferta', error: error.message });
    }
});

app.put('/api/offers/:id', async (req, res) => {
    try {
        const database = await connectToMongoDB();
        const offerId = req.params.id;
        const updatedOffer = req.body;
        const result = await database.collection('offers').updateOne(
            { _id: new ObjectId(offerId) },
            { $set: updatedOffer }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Oferta/Novedad no encontrada' });
        }
        res.json({ message: 'Oferta/Novedad actualizada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar oferta', error: error.message });
    }
});

app.delete('/api/offers/:id', async (req, res) => {
    try {
        const database = await connectToMongoDB();
        const offerId = req.params.id;
        const result = await database.collection('offers').deleteOne({ _id: new ObjectId(offerId) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Oferta/Novedad no encontrada' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar oferta', error: error.message });
    }
});

// Exportar la aplicación para Vercel Serverless Functions
module.exports = app;

// Solo para desarrollo local: Iniciar el servidor si no está en un entorno Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`¡Sitio web de Audiocar iniciado!`);
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
        console.log(`Panel de administración en http://localhost:${PORT}/admin.html`);
    });
}

// Pequeña modificación para forzar la actualización en Git y Vercel. (2025-06-29)
