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

//ruta todos los productos en el carrito

router.get('/api/carts',async (req, res) =>{
    try{
        const allCarts = await carts.getAll()
        res.json(allCarts)
    }catch (error){
        res.status(500).json({error: "Error al obtener los productos"})

    }
})


//POST agregar un producto

// Ruta para agregar un nuevo producto
router.post('/api/carts', async (req, res) => {
    try {
      const {title} = req.body; 
      const newCart = {
        
        title: "otro cart"


    }

    const allCarts = await carts.getAllObjects()
    const newCartId = allCarts.length + 1

    //Agregando el id al nuevo cart

    newCart.id = newCartId

    //Agregar el nuevo cart a el array 
    allCarts.push(newCart)

    // Guardar los productos actualizados en el archivo
    await fs.promises.writeFile(carts.file, JSON.stringify(allCarts));
  
    res.status(201).json(newCart); // Devolver el nuevo carrito
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar carrito' })
  }
});






module.exports = router