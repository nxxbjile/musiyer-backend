import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/db.js"
import userRoutes from './Routes/users.js'
import songRoutes from './Routes/songs.js'
import artistRoutes from './Routes/artists.js'
import playlistRoutes from './Routes/playlists.js'
import { handleBadRoutes } from './fns/fns.js'

const corsOptions = {
    origin: '*', // Replace with the URL of your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow headers
};

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();                                // Connection function for MongoDB

app.use(express.json());
app.use(cors(corsOptions));

app.use("/users", userRoutes);              // User routes
app.use("/songs", songRoutes);              // Songs routes
app.use("/playlists", playlistRoutes);      // Playlist routes
app.use("/artists", artistRoutes);          // artist Routes

app.use(handleBadRoutes);                   // Handling the Bad routes 

app.listen(PORT, ()=> {
    console.log(`Server started on port : ${PORT}`);
})

