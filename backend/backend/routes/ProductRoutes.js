import express from 'express'
import { edit, insert, read, remove } from '../CONTROLER/controller.js'
import { logIn, register, verifyToken } from '../CONTROLER/login.js'


const route = express.Router()

route.post('/register',register)
route.post('/login',logIn)
route.get('/verify',verifyToken)


route.get('/',read)
route.post('/insert',insert)
route.put('/update/:productId',edit)
route.delete('/delete/:productId',remove)



export default route