import mongoose from "mongoose";
const dbConnection = async ()=>{
    try {
        const base = "mongodb+srv://phanithlim22:nith2024@cluster0.7dclj.mongodb.net/eventManagement";
        await mongoose.connect(base);
        console.log('DB connected');
    } catch (error) {
        console.error('DB connection fail')
        process.exit(1);
    }
}
export default dbConnection;