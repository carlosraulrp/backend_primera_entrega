const express = require('express')
const router = express.Router()


const products = [

    {id:1,
        title:"Jack Daniels",
        description:"descripcion del producto 1",
        code: "des-1",
        price:30,
        status: true,
        stock: 50,        
        category:"destilados"},
    {id:2,
        title:"Quilmes",
        description:"descripcion del producto 2",
        code: "ber-1",
        price:5,
        status: true,
        stock: 150,        
        category:"cervezas"},
    {id:3,
        title:"Heineken",
        description:"descripcion del producto 3",
        code: "ber-2",
        price:6,
        status: true,
        stock: 130,        
        category:"cervezas"},
    {id:4,
        title:"Hendricks",
        description:"descripcion del producto 4",
        code: "des-2",
        price:27,
        status: true,
        stock: 47,        
        category:"destilados"}
   
        
]

//ruta todos los productos

router.get('/api/products', (req, res) =>{
    res.json(products)
})

//ruta producto especifico buscado por id

router.get('/api/products/:pid', (req, res) =>{
    const productId = parseInt(req.params.pid)
    //buscamos que el id ingresado por params coincida con alguno del array de productos
    const product = products.find((p) => p.id === productId)

    if(product){
        res.json(product)
    }else{
        res.status(400).json({message:"Producto no encontrado"})
    }
})

//POST agregar un producto

router.post("/api/products", (req, res) =>{
    const {title, description, code, price, status, stock, category} = req.body
    const newProduct = {
        id: products.length +1,
        title: "Cualquier bebida",
        description:"Este es una bebida generica",
        code: "333",
        price: 5,
        status: true,
        stock: 10,
        category: "generico"


    }

    products.push(newProduct)
    res.status(201).json(newProduct)
})

//PUT modificar un producto

router.put("/api/products/:pid", (req, res) =>{
    const productId = parseInt(req.params.pid)
    const product = products.find((p) => p.id === productId)
    if(product){
        const {title, description, code, price, status, stock, category} = req.body
        product.title = "Black Label"
        product.description = "Buen whisky 12 años"
        product.price = 30
        res.json(product)
    }else{
        res.status(404).json({message: "producto no encontrado"})
    }
})

//DELETE 

router.delete("/api/products/:pid", (req, res) =>{
    const productId = parseInt(req.params.pid)
    const product = products.find((p) => p.id === productId)

    if(!product){
        res.status(404).json({message: "producto no existe"})

    }else{

        const deleteProduct = products.splice(product, 1)
        return res.json(deleteProduct[product])

    }
    
})










module.exports = router
