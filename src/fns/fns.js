import { User } from "../Models/user.js"

import bcrypt from "bcryptjs"

export const hashPassword = async (pass) => {
    var password = await bcrypt.hash(pass, 10);
    return password;
}

export const verifyHashedPassword = async (pass, hashedPass) => {
    const isMatch = await bcrypt.compare(pass, hashedPass);
    if(isMatch){
        return true;
    }else{
        return false;
    }
}

export const userExists = async ( userId ) => {
    try{
        var exists = User.findById(userId);
        if(exists){
            return true;
        }else{
            return false;
        }
    }catch(error){
        console.log(`userExists : something went wrong : `, error);
        return false;
    }
}

export const verifyUser = async (username, password) => {
    try{
        var user = await User.findOne({ username });
        if(user){
            var isMatch = await verifyHashedPassword(password, user.password);
            if(isMatch){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }catch(error){
        console.log(`verifyUser failed : `,error);
        return false;
    }
}

export const handleBadRoutes = async (req, res)=>{
    res.status(405).json({
        message:`Check requested Route and Method`,
    })
}