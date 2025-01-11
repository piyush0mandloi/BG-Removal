import { Webhook } from "svix";
import userModel from "../models/userModel.js";
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
                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses[0].email_addresses,
                    firstname: data.first_name,
                    lastname: data.last_name,
                    photo: data.image_url,
                }
                await userModel.create(userData);
                res.json({message: 'User created successfully'});
                break;
            case 'user.updated':
                // Update the user in the database
                const updateUserData = {
                    email: data.email_addresses[0].email_addresses,
                    firstname: data.first_name,
                    lastname: data.last_name,
                    photo: data.image_url,
                }
                await userModel.findOneAndUpdate({clerkId: data.id}, updateUserData);
                res.json({ message: 'User updated successfully' }); // Added response message
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

export {clerkWebhooks}