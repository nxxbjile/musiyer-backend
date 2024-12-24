import mongoose from 'mongoose'
import { songSchema } from './song.js';

export const artistSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    cover_img:{
        type:String,
        required:false,
        default:"",
    },
    songs:{
        type:[songSchema],
        required:false,
        default:[],
    },
})

export const Artists = mongoose.model("artists",artistSchema);