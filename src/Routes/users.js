import express from "express"
import { getAllUsers, addNewUser, deleteUser, updateUser, getUser, handleLogin, getUserSongs, addNewFavorite, getFavorites, deleteFavorite, getAllFavoriteSongs } from "../Controllers/users.js"

const router = express.Router();

router.get("/",getAllUsers);                                        // getAllUsers
router.get("/:userId", getUser);                                    // getUser
router.get("/:username/songs",getUserSongs);                        // get Users songs
router.post("/:username/favorites", addNewFavorite);                // add new favorite song 
router.get("/:username/favorites", getFavorites);                   // get all the favorite songs (ids);
router.delete("/:username/favorites/:songId", deleteFavorite);      // delete a song from favorites
router.get('/:username/favorites/songs', getAllFavoriteSongs);      // get all the favorate songs (song objects)
router.post("/",addNewUser);                                        // addNewUser
router.post("/login", handleLogin);                                 // handle login
router.delete("/:userId", deleteUser);                              // deleteUser
router.patch("/:userId", updateUser);                                 // updateUser

export default router;                              
