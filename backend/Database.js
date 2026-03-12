import mongoose from "mongoose";

const Database = (val)=>{
    try {
        mongoose.connect(val)
        const db = mongoose.connection

        db.once('open',()=>{
            console.log("db is connected");
            
        })
        
    } catch (error) {
        console.log(error);
        
    }
}
export default Database
