import { Song } from '../Models/song.js';
import { userExists, verifyHashedPassword, verifyUser } from '../fns/fns.js';

export const getAllSongs = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try{
        var songs = await Song.find().skip((page - 1)* limit).limit(Number(limit));
        var totalSongs = await Song.find().countDocuments();
        var totalPages = totalSongs/limit < 1 ? 1 : Math.ceil(totalSongs/limit);
        if(songs){
            res.status(200).json({
                current_page:page,
                total_pages:totalPages,
                total_songs:totalSongs,
                message:`Fetched All songs successfuly!!!`,
                songs,
            })
        }else{
            res.status(500).json({
                message:`Unable to fetch the songs`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`Server Error `,
        })
        console.log("server error while fetching the songs", error);
    }
}

export const getSongById = async ( req, res) => {
    const { songId } = req.params;
    try{
        var song = await Song.findById(songId);
        if(song){
            res.status(200).json({
                message:`song fetched successfully`,
                song,
            })
        }else{
            res.status(404).json({
                message:`song not found with id : ${songId}`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`There was a problem fetching the song with songId : ${songId}`,
        })
    }
}

export const addNewSong = async ( req, res ) => {
    const { title, artist, genre = "", duration, file_url = "", username, password} = req.body;
    try{
        var verifiedUser = await verifyUser(username, password);
        if(verifiedUser){
            var song = new Song({
                title,
                artist,
                username,
                genre,
                duration,
                file_url
            });

            var savedSong = await song.save();
            if(savedSong){
                res.status(201).json({
                    message:`Song added successfully!!`,
                    song,
                })
            }else{
                res.status(500).json({
                    message:`Unable to add song`,
                })
            }
        }else{
            res.status(404).json({
                message:`User not found`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`Internal Server Error`,
        })
        console.log(`addNewSong error : `, error);
    }
}

export const deleteSong = async (req, res) => {
    const { songId } = req.params;
    try{
        var deletedSong = await Song.findByIdAndDelete(songId);
        if(deletedSong){
            res.status(200).json({
                message:`Song deleted successfully`,
                deletedSong,
            })
        }else{
            res.status(404).json({
                message:`Song with id : ${ songId} not found`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`Internal Server Error`,
        })
        console.log(`DeleteSong Error :`, error);
    }
}

export const updateSong = async (req, res) => {
    const { songId } = req.params;
    const updates = req.body;
    try{
        var updatedSong = await Song.findByIdAndUpdate(
            songId,
            {$set: updates},
            {new : true},
        );

        if(updatedSong){
            res.status(200).json({
                message:`song updated successfully with id : ${ songId }`,
                updatedSong,
            })
        }else{
            res.status(500).json({
                message:`song not updated`,
            })
        }
    }catch(error){
        res.status(500).json({
            message:`Internal server Error `,
        })
        console.log(`Interal server Error`, error);
    }
}