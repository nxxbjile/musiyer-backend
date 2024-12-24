import { Playlist, playlistSchema } from "../Models/playlist.js"
import { Song } from "../Models/song.js";
import { User } from "../Models/user.js";

export const getAllPlaylists = async (req, res) => {
    try{
        const { page = 1, limit = 10 } = req.query;
        var playlists = await Playlist.find();
        var totalPlaylists = await Playlist.find().countDocuments();
        var totalPages = Math.ceil(totalPlaylists/limit);

        if(playlists){
            res.status(200).json({
                message:`Fetched all the playlists successfully`,
                current_page: page,
                total_pages:totalPages,
                limit: limit,
                total_playlists: totalPlaylists,
                playlists,
            })
        }else{
            res.status(400).json({
                message:`Playlists cannot be fetched`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`Internal Server Error`,
        })
        console.log(`getAllPlaylists Error :`, error);
    }
}

export const getPlaylist = async (req, res) => {
    try{
        const { playlistId } = req.params;
        var playlist = await Playlist.findById( playlistId );
        if(playlist){
            res.status(200).json({
                playlist,
            })
        }else{
            res.status(404).json({
                message:`playlist not found with id : ${playlistId}`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`Internal server error`,
        })
        console.log(`getPlaylist Error :`, error);
    }
}

export const getPlaylistSongs = async ( req, res ) => {
    try{
        const { playlistId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        var songs = await Playlist.findById(playlistId).select("songs").skip((page - 1)*limit).limit(Number(limit));
        var totalSongs = await Playlist.findById(playlistId).select('songs').countDocuments();
        var totalPages = totalSongs/limit < 1 ? 1 : totalSongs/limit;
        if(songs){
            res.status(200).json({
                message:`fetched all the songs of playlist : ${ playlistId }`,
                current_page:page,
                total_pages:totalPages,
                limit,
                total_songs:totalSongs,
                songs,

            })
        }else{
            res.status(404).json({
                message:`playlist not found with id : ${ playlistId }`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`Inter server Error`,
        })
        console.log("getPlaylistSongs Error :", error);
    }
}

export const addNewPlaylistSong = async ( req, res ) => {
    try{
        const { playlistId } = req.params;
        const songData = req.body;
        const newSong = new Song(songData);
        var playlist = await Playlist.findById(playlistId);
        playlist.songs.push(newSong);

        var saved = await playlist.save();
        if(saved){
            res.status(200).json({
                message:`New song Added to the playlist`,
                playlist,
            })
        }else{
            res.status(500).json({
                message:`Internal server error`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`internal server error`,
        })
        console.log(`Internal server error :`, error);
    }
}

export const deletePlaylistSong = async ( req, res ) => {
    const { playlistId, songId } = req.params;
    try{
        var playlist = await Playlist.findById(playlistId);

        if(!playlist){
            res.status(404).json({
                message:`playlist not found with id : ${playlistId}`,
            })
        }

        var newSongs = playlist.songs.filter(song => song.toString() !== songId);
        playlist.songs = newSongs;
        var saved = playlist.save();

        if(saved){
            res.status(200).json({
                message:`song deleted with id : ${ songId }`,
            })
        }else{
            res.status(500).json({
                message:`Something went wrong`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:"internal server error",
        })
        console.log("internal server error",error);
    }
}


export const getPlaylistKey = async ( req, res ) => {
    try{
        const { playlistId, key } = req.params;
        var playlistKey = await Playlist.findById(playlistId).select(key);
        if(playlistKey){
            res.status(200).json({
                message:`playlist field fetched successfully`,
                playlistKey,
                key,
            })
        }else{
            res.status(404).json({
                message:`key not found for playlist : ${playlistId}`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`Internal Server Error`,
        })
        console.log(`Internal server error :`, error);
    }
}

export const getUserPlaylists = async (req, res) => {
    const { username } = req.params;
    const { page = 1, limit = 20 } = req.query;
    try{
        var user = await User.findOne({username});
        var playlists = await Playlist.find({ username }).skip((page - 1)*limit).limit(limit);
        var total_playlists = await Playlist.countDocuments({username});
        var total_pages = Math.ceil(total_playlists/limit);

        if(user && playlists){
            res.status(200).json({
                message:`fetched playlists successfully`,
                playlists,
                total_playlists,
                total_pages,
                limit,
                page,

            })
        }else{
            res.status(404).json({
                message:`user not found with this Username : ${username}`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`Internal server error`,
            error,
        })
        console.log("Internal server error getUserPlaylists", error);
    }
}

export const addNewPlaylist = async ( req, res ) => {
    try{
        const { name, description, username, cover_img = "" } = req.body;
        var playlist = new Playlist({
            name,
            description,
            username,
            cover_img,
        });
        var saved = await playlist.save();
        if(saved){
            res.status(201).json({
                message:`New playlist created`,
                playlist,
            })
        }else{
            res.status(400).json({
                message:`Check the field carefully`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`Internal server error`,
        })
        console.log(`Internal Server error`, error);
    }
}

export const deletePlaylist = async (req, res) => {
    try{
        const { playlistId } = req.params;
        var deleted = await Playlist.findByIdAndDelete(playlistId);
        if(deleted){
            res.status(200).json({
                message:`playlist deleted with id : ${ playlistId }`,
                deleted,
            })
        }else{
            res.status(404).json({
                message:`playlist not found with id : ${playlistId}`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`Internal Server Error `,
        })
        console.log("Internal server error", error);
    }
}

export const updatePlaylist = async (req, res) => {
    try{
        const { playlistId } = req.params;
        const updates = req.body;
        var updated = await Playlist.findByIdAndUpdate(
            playlistId,
            {$set: updates},
            {new: true},
        );

        if(updated){
            res.status(200).json({
                message:`playlist with id : ${playlistId} updated successfully`,
                updated,
            })
        }else{
            res.status(404).json({
                message:`playlist with id : ${ playlistId } not found`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`Internal server error`,
        })
        console.log(`Internal Server error`);
    }
}