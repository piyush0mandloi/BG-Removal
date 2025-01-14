 import mongoose from "mongoose";
import payments from "razorpay/dist/types/payments";

 const transactionSchema = mongoose.Schema({
    clerkId: { type: String, required: true },
    amount: { type: Number, required: true },
    plan: { type: String, required: true },
    credits: { type: Number, required: true },
    paymentId: { type: Boolean, default: false },
    Date: { type: Number }
    });

const transactionModel = mongoose.model('transaction', transactionSchema) || mongoose.model.transaction ;

export default transactionModel;