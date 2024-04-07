import mongoose from "mongoose";


export async function connect () {
    try {
        mongoose.connect(process.env.MONGO_DB_URI!)
        const connection = mongoose.connection

        connection.on('error', (err) => {
            console.error('MongoDB connection error: ', err)
            process.exit()
        })

        connection.once('connected', () => {
            console.log('MongoDB connected')
        })
    } catch (error) {
        console.log("Something went wrong while connecting to database");
        console.log("error: " + error)
    }
}