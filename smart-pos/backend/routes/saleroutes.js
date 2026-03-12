import express from 'express'
import { barcode, createSale, downloadInvoice, getSaleById, getSalesSummary, saleInsert, saleRead } from '../CONTROLER/controller.js'

console.log("SALE ROUTES FILE LOADED");

const saleRoute = express.Router()
saleRoute.get('/read',saleRead)
saleRoute.post('/add',saleInsert)
saleRoute.post('/create',createSale)
saleRoute.get('/summary',getSalesSummary)
saleRoute.get('/:id',getSaleById)
saleRoute.get("/invoice/:invoiceNo", downloadInvoice);
saleRoute.get("/product/barcode/:barcode", barcode);

export default saleRoute