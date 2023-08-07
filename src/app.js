const express = require('express')
const productsRouter = require('./routes/products.router')
const app = express()
const PORT = 8080

app.use (express.json())
app.use (express.urlencoded ({extended:true}))

app.use ('/', productsRouter)







app.listen(PORT, () =>{
    console.log(`Server listen on port: ${PORT}`)
})