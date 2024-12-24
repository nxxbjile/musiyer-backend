import mongoose from 'mongoose'

export const songSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    artist:{
        type:String,
        default:null,
    },
    username:{
        type:String,
        required:true,
    },
    genre:{
        type:String,
        default:null,
    },
    duration:{
        type:String,
        default:null,
    },
    file_url:{
        type:String,
        default:null,
    },
    cover_img:{
        type:String,
        default:null,
    },
    back_drop:{
        type:String,
        default:null,
    },
})

export const Song = mongoose.model("songs", songSchema);

