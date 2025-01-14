import jwt from 'jsonwebtoken';

// middleware function to decode jwt token to get clerkID
const authUser=async(req,res,next)=>{
    try{
        const {token} = req.headers.authorization?.split(' ')[1];
        if(!token){
            return res.json({success:false,message:"Not Authorized Login again"}); 
        }
        const token_decode=jwt.verify(token, process.env.JWT_SECRET);
        req.body.clerkId=token_decode.clerkId;
        next();

    }catch(error){
        console.error(error.message);
        res.json({success:false,message:error.message}); 
    }
}

export default authUser; 