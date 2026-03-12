import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true
    },

    productName: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    stock: {
      type: Number,
      required: true,
      min: 0
    },

    gst: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

const newProduct = mongoose.model(
  "newProducts",
  productSchema,
  "products"
);

export default newProduct;
                    