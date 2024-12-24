import { verifyUser } from "../fns/fns.js";
import { Playlist } from "../Models/playlist.js";

export const verifyPlaylistOwner = async (req, res, next) => {
    try{
        const { username, password } = req.body;
        const { playlistId } = req.params;

        var verifiedUser = await verifyUser(username, password);
        if(verifiedUser){
            var playlist = await Playlist.findById(playlistId);
            if(playlist.user_id === verifiedUser._id){
                next();
            }else{
                res.status(401).json({
                    message:`${username} is NOT the OWNER`,
                })
            }
        }else{
            res.status(404).json({
                message:`User not Found`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`Internal Server Error`,
        })
        console.log("Internal Server error");
    }
}