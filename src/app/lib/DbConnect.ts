import mongoose from 'mongoose';

type ConnectionInstance={
    isConnect?:number
}
const connectionType:ConnectionInstance={}

async function dbConnect():Promise<void> {
     if(connectionType.isConnect){
    console.log("database already connected")
    return
    }
    try {
        const db=await mongoose.connect(process.env.MONGODB_URI || '')
        connectionType.isConnect=db.connections[0].readyState
       
        console.log(`database connected successfully on port: ${db.connection.host}`)

    } catch (error) {
        console.log("mongodb connection error",error)
        process.exit()
    }
}
export default dbConnect