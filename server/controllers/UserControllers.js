// Api controller function to manage clerk user with database
// http://localhost:8001/api/user/webhooks
const clerkWebhooks = async (req, res) => {
    try {
        const { body } = req;
        console.log(body);
        res.status(200).send('Webhook received');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
} 