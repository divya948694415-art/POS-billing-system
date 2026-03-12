import express from 'express';
import Database from './Database.js'
import route from './backend/routes/ProductRoutes.js'
import saleRoute from './backend/routes/saleroutes.js'
import cors from 'cors'




const app = express()
const PORT =8173
app.use(express.json())

app.use(cors({
     origin:"http://localhost:5173",
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:['Content-Type','Authorization']
}))
app.use(route)
app.use("/sales",saleRoute)
Database("mongodb://127.0.0.1:27017/productsDb")
app.listen(PORT,()=>{
    console.log(`running in http://localhost:${PORT}`);
    
})

// "userName": "Divya",
// "userEmail":"divya@gmail.com",
// "userPassword":"178487"