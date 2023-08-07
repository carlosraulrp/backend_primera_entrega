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

const products = new contenedor('products.json')

//ruta todos los productos

router.get('/api/products',async (req, res) =>{
    try{
        const allProducts = await products.getAll()
        res.json(allProducts)
    }catch (error){
        res.status(500).json({error: "Error al obtener los productos"})

    }
})

//ruta producto especifico buscado por id

router.get('/api/products/:pid', async (req, res) =>{
    try{
        const productId = parseInt(req.params.pid)
        const allProducts = await products.getAllObjects()
        const product = allProducts.find((p) => p.id === productId)
        if(product){
            res.json(product)
        }else{
            res.status(404).json({message:"Producto no encontrado"})
        }
    }catch(error){
        res.status(500).json({error: "Error al obtener el producto"})
    }
})

//POST agregar un producto

// Ruta para agregar un nuevo producto
router.post('/api/products', async (req, res) => {
    try {
      const {title, description, code, price, status, stock, category} = req.body; // Obtener los datos del nuevo producto del cuerpo de la solicitud
      const newProduct = {
        
        title: "Cualquier bebida",
        description:"Este es una bebida generica",
        code: "333",
        price: 5,
        status: true,
        stock: 10,
        category: "generico"


    }
      const allProducts = await products.getAllObjects();
  
      // Generar un nuevo ID para el producto (por ejemplo, puedes usar la longitud de la matriz + 1)
      const newProductId = allProducts.length + 1;
      
      // Agregar el ID al nuevo producto
      newProduct.id = newProductId;
  
      // Agregar el nuevo producto a la lista de productos
      allProducts.push(newProduct);
  
      // Guardar los productos actualizados en el archivo
      await fs.promises.writeFile(products.file, JSON.stringify(allProducts));
  
      res.status(201).json(newProduct); // Devolver el nuevo producto creado
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar el producto' });
    }
  });
  

//PUT modificar un producto

router.put("/api/products/:pid", async (req, res) =>{
  try{
    const productId = parseInt(req.params.pid)
    const allProducts = await products.getAllObjects()
    const product = allProducts.find((p) => p.id === productId)
    if(product){
        const {title, description, code, price, status, stock, category} = req.body
        product.title = "Black Label"
        product.description = "Buen whisky 12 años"
        product.price = 30

        // Guardar los productos actualizados en el archivo
      await fs.promises.writeFile(products.file, JSON.stringify(allProducts))

        res.json(product)

    }else{
        res.status(404).json({message: "producto no encontrado"})
    }

  }catch (error){
    res.status(500).json({error: "Error al obtener el producto"})

  }
})

//DELETE 

router.delete("/api/products/:pid", async (req, res) =>{
    try{
        const productId = parseInt(req.params.pid)
        const allProducts = await products.getAllObjects()
        const productIndex = allProducts.findIndex((p) => p.id === productId)
       
        if(productIndex === -1){
            res.status(404).json({message: "producto no encontrado"})
    
        }else{
    
            allProducts.splice(productIndex, 1) 
            await fs.promises.writeFile(products.file, JSON.stringify(allProducts))
            return res.json(allProducts)
            
    
        }

    }catch (error){
        res.status(500).json({error: "Error al obtener el producto"})

    }
    
})










module.exports = router
