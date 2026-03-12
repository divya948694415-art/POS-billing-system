import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, required: true },
    customerName: String,
    Mobile: String,

    saleItems: [
      {
        productName: String,
        qnty: Number,
        price: Number
      }
    ],

    total: Number,
    discount: Number,
    gst: Number,
    netAmount: Number,
    profit: Number
  },
  { timestamps: true }
);

const newsale = mongoose.model("newsales", salesSchema);
export default newsale;