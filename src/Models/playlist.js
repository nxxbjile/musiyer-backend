import mongoose from 'mongoose'
import { songSchema } from './song.js'
export const playlistSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
    },
    songs:{
        type:[songSchema],
        default:[],
    },
    is_public:{
        type:Boolean,
        default:false,
    },
    cover_img:{
        type:String,
        default:"",
    },
})

export const Playlist = mongoose.model("playlists", playlistSchema);