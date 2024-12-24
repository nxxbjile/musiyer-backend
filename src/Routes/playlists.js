import express from 'express'
import { 
    addNewPlaylist, 
    addNewPlaylistSong, 
    deletePlaylist, 
    deletePlaylistSong, 
    getAllPlaylists, 
    getPlaylist, 
    getPlaylistKey, 
    getPlaylistSongs, 
    getUserPlaylists, 
    updatePlaylist
} from '../Controllers/playlists.js';
import { verifyMware } from '../middleware/verifyUser.js';

const router = express.Router();

router.get("/users/:username/",getUserPlaylists);

router.get("/", getAllPlaylists);                                   // get all playlists
router.get("/:playlistId/:key", getPlaylistKey);                    // get a key of the playlist
router.get("/:playlistId", getPlaylist);                            // get a single playlist
router.get("/:playlistId/songs", getPlaylistSongs);                 // get songs of the playlist

router.post("/:playlistId/songs", addNewPlaylistSong);              // add new song to the playlist
router.post("/", verifyMware, addNewPlaylist);                      // add new playlist

router.delete("/:playlistId/songs/:songId", deletePlaylistSong);    // remove a song from the playlist
router.delete("/:playlistId", deletePlaylist);                      // delete a playlist

router.patch("/:playlistId", updatePlaylist);                       // update a playlist

export default router;