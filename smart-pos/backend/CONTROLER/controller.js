import newProduct from "../models/product.js"
import newsale from "../models/sales.js"
import { generateInvoicePDF } from "../utils/invoicePdf.js"


export const read = async(req,res)=>{
    try {
        const exist = await newProduct.find()
        res.status(202).json(exist)
        
    } catch (error) {
        res.status(402).json(error)
        
    }
}
export const insert = async(req,res)=>{
    try {
        const {productId,productName,price,stock,gst}=req.body
        const existing = await newProduct.findOne({productId})
        if(existing){
            res.status(409).json({message:"product already exist"})
        }
        const addNew = await newProduct({productId,productName,price,stock,gst}).save()
        res.status(201).json(addNew)
    } 
    catch (error) {
        res.status(500).json({message:"could not insert"})
        
    }
}
export const edit = async (req, res) => {
  try {
    const { productId } = req.params;
    const { productName, price, stock, gst } = req.body;

    const editdata = await newProduct.findOneAndUpdate(
      { productId: String(productId) },
      {
        $set: { productName, price, stock, gst }
      },
      { new: true }
    );

    if (!editdata) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      data: editdata
    });
  } catch (err) {
    console.error("Edit error:", err);
    res.status(500).json({ message: "Could not edit" });
  }
};


export const remove = async(req,res)=>{
    const{productId} =req.params
    try{
      const dlt = await newProduct.findOneAndDelete({productId})
      if(!dlt){
     res.status(404).json({message:"not found"})
      }
      res.status(204).json({message:'deleted'})
      }
    catch(err){
        res.status(400).json(err)
    }
    
}

export const saleRead = async(req,res)=>{
    try {
        const exist = await newsale.find()
        res.status(202).json(exist)
        
    } catch (error) {
        res.status(402).json(error)
        
    }
}
export const saleInsert = async(req,res)=>{
    try {
        const {customerName,Mobile,saleItems,total,discount,gst,netAmount}=req.body
        
        const addNew = await newsale({customerName,Mobile,saleItems,total,discount,gst,netAmount}).save()
        res.status(203).json(addNew)
    } 
    catch (error) {
        res.status(408).json({message:"could not insert"})
        
    }
}

export const createSale = async (req, res) => {
  try {
    const {
      invoiceNo,
      customerName,
      Mobile,
      saleItems,
      discount =  0,
      gst = 0
    } = req.body;

    if (!saleItems || saleItems.length === 0) {
      return res.status(400).json({ message: "Sale items required" });
    }

    const total = saleItems.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.qnty),
      0
    );

    const discountAmount = (total * Number(discount)) / 100;
    const gstAmount = ((total - discountAmount) * Number(gst)) / 100;
    const netAmount = total - discountAmount + gstAmount;

    const sale = new newsale({
      invoiceNo: invoiceNo || `INV-${Date.now()}`,
      customerName,
      Mobile,
      saleItems,
      total,
      discount,
      gst,
      netAmount,
      profit: total - netAmount
    });

    await sale.save();
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const barcode = async (req, res) => {
  const product = await Product.findOne({
    productId: req.params.barcode
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
};
// GET /sales/summary
export const getSalesSummary = async (req, res) => {
  try {
    const sales = await newsale.find(
      {},
      {
        invoiceNo: 1,
        customerName: 1,
        Mobile: 1,
        netAmount: 1,
        createdAt: 1
      }
    ).sort({ createdAt: -1 });

    res.status(200).json(sales);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
// GET /sales/:id
export const getSaleById = async (req, res) => {
  try {
    const sale = await newsale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.status(200).json(sale);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};


export const downloadInvoice = async (req, res) => {
  try {
    const { invoiceNo } = req.params;

    const sale = await newsale.findOne({ invoiceNo });

    if (!sale) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    generateInvoicePDF(sale, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}
