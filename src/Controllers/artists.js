import { Artists } from '../Models/Artists.js'

export const getAllArtists = async (req, res) => {
    const { page = 1, limit=20 } = req.query;
    try{
        var artists = await Artists.find().skip((page - 1)*limit).limit(limit);
        var totalArtists = await Artists.find().countDocuments();
        var totalPages = Math.ceil(totalArtists/limit);
        if(artists){
            res.status(200).json({
                current_page: page,
                total_pages: totalPages,
                limit:limit,
                message:`fetched all the artists`,
                success:true,
                artists,
            })
        }else{
            res.status(500).json({
                message:`Internal server error`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`Internal server error`,
            success:false,
        })
        console.log("Internal server error", error);
    }
}

export const getArtist = async (req, res) => {
    const { artistId } = req.params;
    try{
        var artist = await Artists.findById(artistId);
        if(artist){
            res.status(200).json({
                success:true,
                artist,
            })
        }else{
            res.status(404).json({
                success:false,
                message:`Artist Not Found!`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`Internal server error`,
            success:false,
        })
        console.log("internal server error", error);
    }
}

export const getArtistSongs = async (req, res) => {
    const { artistId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    try{
        var songs = await Artists.findById(artistId).select("songs").skip((page - 1)*limit).limit(limit);
        var totalSongs = await Artists.findById(artistId).select("songs").countDocuments();
        var totalPages = Math.ceil(totalSongs/limit);
        if( songs ){
            res.status(200).json({
                message:`Fetch all songs successfully!!`,
                songs,
                total_pages: totalPages,
                current_page: page,
                limit: limit,
            })
        }else{
            res.status(404).json({
                message:`artist Not Found`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`Internal server error`,
        })
        console.log(`Internal server error`, error);
    }
}

export const addNewArtist = async (req, res) => {
    const { name, cover_img = "" } = req.body;
    try{
        var artist = new Artists({
            name,
            cover_img,
        })
        var added = await artist.save();
        if(added){
            res.status(200).json({
                message:`Artist added successfully!`,
                artist,
            })
        }else{
            res.status(500).json({
                message:`Artist can not be added`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`internal server error`
        })
        console.log("Internal server error", error);
    }
}

export const addNewSong = async(req, res) => {
    const { artistId } = req.params;
    const song = req.body;
    try{
        var artist = await Artists.findById(artistId);
        artist.songs.push(song);

        var saved = await artist.save();
        if(saved){
            res.status(200).json({
                message:`New song Added`,
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

export const deleteArtist = async (req, res) => {
    const { artistId } = req.params;
    try{
        var deleted = await Artists.findByIdAndDelete(artistId);
        if(deleted){
            res.status(200).json({
                message:`Artist deleted successfully`,
                deleted,
            })
        }else{
            res.status(404).json({
                message:`Artist not found!`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`Internal server error`
        })
        console.log("internal server error ", error);
    }

}

export const updateArtist = async (req, res) => {
    const { artistId } = req.params;
    const { updates } = req.body;
    try{
        var updated = await Artists.findByIdAndUpdate(
            artistId,
            {$set: updatese},
            {new : true},
        )

        if(updated){
            res.status(200).json({
                message:`Artist updated successfully`,
                updated,
            })
        }else{
            res.status(404).json({
                message:`artist not found`,
            })
        }
    }catch(error){
        console.log('Internal server error');
        res.status(500).json({
            message:`Internal server error`,
        })
    }
}