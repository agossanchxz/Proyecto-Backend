import express from 'express';
import ProductManager from './Product-Manager.js'; 
const router = express.Router();
const productManager = new ProductManager('products.json');


router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos", error: error.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const product = { ...req.body, status: true }; 
        await productManager.addProduct(product);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: "Error al agregar producto", error: error.message });
    }
});


router.put('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid);
    try {
        const updatedProduct = await productManager.updateProduct(id, req.body);
        res.json({ message: "Producto actualizado", product: updatedProduct });
    } catch (error) {
        res.status(404).json({ message: "Producto no encontrado", error: error.message });
    }
});


router.delete('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid);
    try {
        await productManager.deleteProduct(id);
        res.json({ message: "Producto eliminado" });
    } catch (error) {
        res.status(404).json({ message: "Producto no encontrado", error: error.message });
    }
});

export default router;
