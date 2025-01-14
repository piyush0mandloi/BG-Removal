import mongoose from "mongoose";


const connectDB = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected successfully");
        });
        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
        });

        await mongoose.connect(`${process.env.MONGODB_URI}/bg-removal`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        throw error; // Re-throw error to propagate it up
    }
};

export default connectDB;


// const connectDB = async () => {
//     try {
//         mongoose.connection.on("connected", () => {
//             console.log("MongoDB connected successfully No Error");
//         });
//         await mongoose.connect(`${process.env.MONGODB_URI}/bg-removal`, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error.message);
//     }
// };
// export default connectDB;




// const connectDB = async () => {
//     mongoose.connection.on("connected", () => {
//         console.log("MongoDB connected successfully");
//     });
//     await mongoose.connect(`${process.env.MONGODB_URI}/bg-removal`)
// }

// export default connectDB;