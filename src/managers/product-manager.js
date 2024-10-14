import fs from "fs";
import { fileURLToPath } from "url"; // Importar fileURLToPath
import { dirname, join } from "path"; // Importar dirname y join para manejar rutas

class ProductManager {
    static ultId = 0;

    constructor(filePath) {
        const __filename = fileURLToPath(import.meta.url);
        const _dirname = dirname(_filename);
        this.path = join(__dirname, '../data/productos.json');
        this.products = [];
        this.cargarArray();
    }

    async cargarArray() {
        try {
            if (!fs.existsSync(this.path)) {
                await this.guardarArchivo([]); // Crea el archivo si no existe
            }
            this.products = await this.leerArchivo();
            ProductManager.ultId = this.products.length > 0 
                ? Math.max(...this.products.map(product => product.id)) 
                : 0; // Establece el último ID usado
        } catch (error) {
            console.log("Error al inicializar ProductManager", error);
        }
    }

    async addProduct({ title, description, price, code, stock }) {
        // Validar que todos los campos estén presentes
        if (!title || !description || !price || !code || !stock) {
            throw new Error("Completar todos los campos");
        }

        // Validar que el código del producto sea único
        if (this.products.some(item => item.code === code)) {
            throw new Error("El código debe ser único");
        }

        // Crear el nuevo producto
        const nuevoProducto = {
            id: ++ProductManager.ultId,
            title,
            description,
            price,
            code,
            stock
        };

        this.products.push(nuevoProducto);
        await this.guardarArchivo(this.products);
        console.log("Producto fue agregado de manera exitosa");
    }

    async getProducts() {
        try {
            return await this.leerArchivo();
        } catch (error) {
            console.log("Error al leer el archivo", error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const arrayProductos = await this.leerArchivo();
            const buscado = arrayProductos.find(item => item.id === id);

            if (!buscado) {
                console.log("Producto no disponible);
                return null;
            } else {
                console.log("Producto disponible");
                return buscado;
            }
        } catch (error) {
            console.log("Error al buscar por ID", error);
        }
    }

    async leerArchivo() {
        try {
            const respuesta = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(respuesta);
        } catch (error) {
            console.log("Error al leer el archivo", error);
            return [];
        }
    }

    async guardarArchivo(arrayProductos) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
        } catch (error) {
            console.log("Error al guardar el archivo", error);
        }
    }

    async updateProduct(id, productoActualizado) {
        try {
            const arrayProductos = await this.leerArchivo();
            const index = arrayProductos.findIndex(item => item.id === id);

            if (index !== -1) {
                arrayProductos[index] = { ...arrayProductos[index], ...productoActualizado };
                await this.guardarArchivo(arrayProductos);
                console.log("Producto actualizado en el sistema");
            } else {
                throw new Error("Producto no disponible en el sistema");
            }
        } catch (error) {
            console.log("Error al actualizar el producto ", error);
        }
    }

    async deleteProduct(id) {
        try {
            const arrayProductos = await this.leerArchivo();
            const index = arrayProductos.findIndex(item => item.id === id);

            if (index !== -1) {
                arrayProductos.splice(index, 1);
                await this.guardarArchivo(arrayProductos);
                console.log("Producto eliminado del sistema");
            } else {
                throw new Error("No se encuentra el producto disponible ");
            }
        } catch (error) {
            console.log("Error al eliminar el producto", error);
        }
    }
}

export default ProductManager;
