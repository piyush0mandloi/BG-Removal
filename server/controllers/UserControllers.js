import { Webhook } from "svix";
import userModel from "../models/userModel.js";
import razorpay from "razorpay";
import transactionModel from "../models/transactionModel.js";

// Api controller function to manage clerk user with database
// http://localhost:8001/api/user/webhooks
const clerkWebhooks = async (req, res) => {
    try {
        // creat a Svix instance with clerk
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        await whook.verify(JSON.stringify(req.body),{
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        });

        const {data, type} = req.body;

        switch(type){
            case 'user.created':
                // Save the user to the database
                console.log('Creating user:', data); // Debug log
                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    firstname: data.first_name,
                    lastname: data.last_name,
                    photo: data.image_url,
                }
                const newUser = await userModel.create(userData);
                console.log('User created:', newUser);                res.json({message: 'User created successfully'});
                break;
            case 'user.updated':
                // Update the user in the database
                const updateUserData = {
                    email: data.email_addresses[0].email_addresses,
                    firstname: data.first_name,
                    lastname: data.last_name,
                    photo: data.image_url,
                }
                const updatedUser = await userModel.findOneAndUpdate(
                    { clerkId: data.id },
                    updateUserData,
                    { new: true }
                );
                console.log('User updated:', updatedUser); // Debug log
                res.json({ message: 'User updated successfully' });
                break;
            case 'user.deleted':
                // Delete the user from the database
                await userModel.findOneAndDelete({clerkId: data.id});
                res.json({ message: 'User deleted successfully' });                
                break;
            default:
                console.log('Unhandled event type:', type);
                res.status(400).send('Unhandled event type');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}


const userCredits=async(req,res)=>{
    try {
        const {clerkId} = req.body;
        const userData = await userModel.findOne({ clerkId })
        if (!userData) {
            return res.json({ success: false, message: 'User not found' });
        }
        res.json({ success:true, credits: userData.creditBalance });
    }catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}

// Gateway for the Razorpay payment
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});  

// Api controller function to manage user credits with database
const paymentRazorpay = async (req, res) => {
    try {
        const { clerkId, planId } = req.body;
        const userData = await userModel.findOne({ clerkId });
 
        if (!userData || !planId) {
            return res.json({ success: false, message: 'Invalid Credentials' });
        }

        let credits, plan, amount, data;

        switch (planId) {
            case "Basic":
                plan: 'Basic'
                credits: 100
                amount: 10
                break;
            
            case "Advanced":
                plan: 'Advanced'
                credits: 500
                amount: 50
                break;
            
            case "Business":
                plan: 'Business'
                credits: 5000
                amount: 100
                break;
        
            default:
                break;
        }

        date= new Date();

        // Creating transaction
        const transactionData = {
            clerkId,
            amount,
            plan,
            credits,
            date
        }

        const newTransaction = await transactionModel.create(transactionData);

        const options={
            amount: amount*100,
            currency: process.env.CURRENCY,
            receipt: newTransaction._id,
        }
        await razorpayInstance.create(options, (err, order) => {
            if (err) {
                console.error(err);
                return res.json({ success: false, message: err.message });
            }
            res.json({ success: true, order });
        }
        
    }catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}

export {userCredits,clerkWebhooks, paymentRazorpay};
