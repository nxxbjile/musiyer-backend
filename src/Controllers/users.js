import { hashPassword, userExists, verifyUser } from "../fns/fns.js"
import { Song } from "../Models/song.js";
import { User } from "../Models/user.js"

export const getAllUsers = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try{

        var users = await User.find().skip((page - 1)*limit).limit(Number(limit));
        var totalUsers = await User.find().countDocuments();
        var totalPages = totalUsers/limit;
        //check if we got the respnose
        if(users){
            res.status(200).json({
                users,
                total_users:totalUsers,
                current_page:page,
                total_pages:totalPages < 1 ? 1 : totalPages,
                message:`users fetched successfully`,
            })
        }else{
            res.status(500).json({
                message:"There was a problem fetching the requested data",
            })
        }
    }catch(error){
        res.status(500).json({
            message:"There was a problem fetching the requested data"
        });
        console.log(`getAllUsers Error :`, error);
    }
}

export const getUserSongs = async (req, res) => {
    const { username } = req.params;
    const { page = 1, limit = 20 } = req.query;
    try{
        var songs = await Song.find({username}).skip((page - 1)*limit).limit(limit); 
        var total_songs = await Song.find({username}).countDocuments();
        var total_pages = Math.ceil(total_songs/limit);

        if(songs){
            res.status(200).json({
                message:`fetch songs of ${username}`,
                songs,
                page,
                total_songs,
                total_pages,
                limit,
            })
        }else{
            res.status(404).json({
                message:`User not found`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`internal server error`,
        })
        console.log("Internal server error", error);
    }
}

export const addNewFavorite = async (req, res) => {
    const { username } = req.params;
    const { songId } = req.body;
  
    try {
      // Find the user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({
          message: `User not found: ${username}`,
        });
      }
  
      // Ensure the songId is unique in favorites
      if (user.favorites.includes(songId)) {
        return res.status(400).json({
          message: `Song already in favorites: ${songId}`,
        });
      }
  
      // Add the songId to the favorites
      user.favorites.push(songId);
      await user.save();
  
      return res.status(200).json({
        message: `Song added to favorites: ${songId}`,
        favorites: user.favorites, // Return updated favorites
      });
    } catch (error) {
      console.error("Internal server error: ", error);
      return res.status(500).json({
        message: `Internal server error`,
      });
    }
};

export const getAllFavoriteSongs = async (req, res) => {
    const { username } = req.params;
    const { page = 1, limit = 20 } = req.query;
    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({
                message: `User not found`,
            });
        }

        // Get all song IDs from favorites
        const songIds = user.favorites;

        // If no favorites, return an empty array
        if (songIds.length === 0) {
            return res.status(200).json({
                message: `No favorites found`,
                songs: [],
            });
        }

        // Fetch all the songs by their IDs
        const songs = await Song.find({
            '_id': { $in: songIds }
        }).skip((page - 1)*limit).limit(limit);

        const total_songs = await Song.find({
            '_id': { $in: songIds }
        }).countDocuments();

        var total_pages = Math.ceil(total_songs/limit); 

        if (songs.length === 0) {
            return res.status(404).json({
                message: `No songs found for the given favorites`,
            });
        }

        res.status(200).json({
            message: `Favorites fetched successfully!`,
            songs,
            total_songs,
            total_pages,
            page,
            limit,
        });
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({
            message: `Internal server error`,
        });
    }
};

export const getFavorites = async (req, res) => {
    const { username } = req.params;
    const { page = 1, limit = 20 } = req.query;
    try{
        var songs = await User.findOne({username}).select("favorites").skip((page - 1)*limit).limit(limit);
        var total_songs = await User.findOne({username}).select("favorites").countDocuments();
        var total_pages = Math.ceil(total_songs/limit);

        if(!total_songs){
            res.status(500).json({
                message:`something went wrong`,
            })
        }
        if(songs){
            res.status(200).json({
                message:`favorites fetched successfully!!!`,
                songs,
                total_songs,
                total_pages,
                page,
                limit,
            })
        }else{
            res.status(404).json({
                message:`User not found`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`Internal server error`,
        })
        console.log("Internal server error : ", error);
    }
}

export const deleteFavorite = async (req, res) => {
    const { username, songId } = req.params;
    try{
        var user = await User.findOne({username});
        user.favorites = user.favorites.filter((song)=> song != songId);
        var saved = user.save();
        if(saved){
            res.status(200).json({
                message:`song deleted : ${songId}`,
            })
        }else{
            res.status(404).json({
                message:`Song not found`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`Internal server error`,
        })
        console.log("Internal server error : ",error);
    }
}

export const getUser = async ( req, res) => {
    const { userId } = req.params;
    try{
        var user = await User.findById(userId);
        if(user){
            res.status(200).json({
                message:`user fetched successfully`,
                user,
            })
        }else{
            res.status(404).json({
                message:`user not found with id : ${userId}`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`There was a problem fetching the user with userId : ${userId}`,
        })
    }
}

export const addNewUser = async (req, res) => {
    const { name, username, email, password, avatar = "",} = req.body;
    try{
        //hash the password before storing
        const hashedPassword = await hashPassword(password);
        var user = new User({
            name,
            username,
            email,
            password: hashedPassword,
            avatar
        })
        //save the user to the collection
        var savedUser = await user.save();

        if(savedUser){
            res.status(200).json({
                message:`User created successfully`,
                user,
            })
        }else{
            res.status(500).json({
                message:`There was a problem while creating new user`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`Internal Server Error`,
        })
    }
}

export const deleteUser = async (req, res) => {
    const { userId } = req.params;
    try{
        // first check if this userId even exists
        var userExists = await User.findById(userId);
        if(userExists){
            var deletedUser = await User.findByIdAndDelete(userId);
            if(deletedUser){
                res.status(200).json({
                    message:`user deleted successfully! : ${ deletedUser.username}`,
                })
            }else{
                res.status(500).json({
                    message:`Internal Server Error`,
                })
            }
        }else{ 
            res.status(404).json({
                message:`user with this userId : ${userId} does not exist`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`Internal server error`,
        })
    }
}

export const updateUser = async (req, res) => {
    const { userId } = req.params;
    const updates = req.body;
    try{
        var exists = await userExists(userId);
        if(exists){
            var updatedUser = await User.findByIdAndUpdate(
                userId,
                {$set: updates},
                {new: true},
            );

            if(updatedUser){
                res.status(200).json({
                    message:`user updated successfull`,
                })
            }else{
                res.status(404).json({
                    message:`user not found with id : ${ userId }`,
                })
            }
        }else{
            res.status(404).json({
                message:`User not found with userId : ${ userId }`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`Internal server error while updating the user`,
        })
    }
}

export const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    try{
        var exists = await User.findOne({ username });
        if(!exists){
            res.json({
                message:`User doesn't exist sign up first`,
                success:false,
            })

            return;
        }
        var verified = await verifyUser(username, password);
        if(verified){
            res.status(200).json({
                message:`User verified`,
                success:true,
            })
        }else{
            res.status(404).json({
                message:`user not found`,
                success:false,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`internal server error`,
            success:false,
        })
        console.log(`inernal server error :`, error);
    }
}