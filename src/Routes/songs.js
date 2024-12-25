import express from 'express';
import { verifyMware } from '../middleware/verifyUser.js';
import { addNewSong, deleteSong, getAllSongs, getSongById, updateSong } from '../Controllers/songs.js';

const router = express.Router();

router.get("/", getAllSongs);                               // get all songs
router.get("/:songId", getSongById);                        // get a single song by id
router.post("/", addNewSong);                               // add a new song
router.delete("/:songId",verifyMware, deleteSong);          // delete a song
router.patch("/:songId", verifyMware, updateSong);            // update a song

export default router;