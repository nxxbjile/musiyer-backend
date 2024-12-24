import express from 'express'
import { addNewArtist, addNewSong, deleteArtist, getAllArtists, getArtist, getArtistSongs, updateArtist } from '../Controllers/artists.js';

const router = express.Router();

//get all artists
router.get("/", getAllArtists);

//get single artist by id,
router.get("/:artistId", getArtist);

//get single artist song by id
router.get("/:artistId/songs", getArtistSongs);

// add new artist 
router.post("/", addNewArtist);

//add new song
router.post("/:artistId/addsong", addNewSong);
//delete an artist
router.delete("/:artistId", deleteArtist);

// update artist
router.patch("/:artistId", updateArtist);

export default router;