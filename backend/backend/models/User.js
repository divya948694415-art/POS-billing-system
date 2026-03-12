import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userName:String,
        userEmail:String,
        userPassword:String
    }
)
const newUser = mongoose.model("newUsers",userSchema,"user")
export default newUser