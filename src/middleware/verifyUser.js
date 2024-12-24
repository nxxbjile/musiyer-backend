import { verifyUser } from "../fns/fns.js";
import { User } from "../Models/user.js";

export const verifyMware = async (req, res, next) => {
    const { username , password } = req.body;
    try{
        
        var isMatch = await verifyUser(username, password);
        if(isMatch){
            next();
        }else{
            res.status(400).json({
                message:`Wrong password`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`Internal server error`,
        })
    }
}