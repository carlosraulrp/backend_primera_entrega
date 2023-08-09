const express = require('express')
const fs = require('fs')
const router = express.Router()

class contenedor {
    constructor(file){
        this.file = file
    }


    async getAll(){
        try {
            const objects = await this.getAllObjects()
            return objects
        } catch (error) {
            throw new Error ('Error al obtener los objetos')
        }
    }


    async getAllObjects(){
        try {
            const data = await fs.promises.readFile(this.file, 'utf-8')
            return data ? JSON.parse(data) : []
        } catch (error) {
            return []
        }
    }

}

const carts = new contenedor('carts.json')
const products = new contenedor('products.json')

// POST para agregar un producto a un carrito usando /:cid/product/:pid
router.post('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid)
        const productId = parseInt(req.params.pid)

        const allCarts = await carts.getAllObjects()
        const cartIndex = allCarts.findIndex(cart => cart.id === cartId)

        if (cartIndex === -1) {
            res.status(404).json({ message: 'Carrito no encontrado' })
            return
        }

        const allProducts = await products.getAllObjects()
        const product = allProducts.find(p => p.id === productId)

        if (!product) {
            res.status(404).json({ message: 'Producto no encontrado' })
            return
        }

        const indiceProductoExistente = allCarts[cartIndex].products.findIndex(p => p.id === productId)
        if (indiceProductoExistente !== -1) {
            // El producto ya está en el carrito, aumentar la cantidad
            if (allCarts[cartIndex].products[indiceProductoExistente].quantity === undefined) {
                allCarts[cartIndex].products[indiceProductoExistente].quantity = 2
            } else {
                allCarts[cartIndex].products[indiceProductoExistente].quantity += 1
            }
        } else {
            // Agregar el producto al carrito con cantidad 1
            /* product.quantity = 1 */
            allCarts[cartIndex].products.push(product)
        }

        await fs.promises.writeFile(carts.file, JSON.stringify(allCarts))
        res.status(201).json(allCarts[cartIndex]) // Devolver el carrito actualizado
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito' })
    }
})






module.exports = router