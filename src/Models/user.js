import mongoose from "mongoose"

export const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        default:null,
    },
    favorites:{
        type:[String],
        default:[],
    },
    playlists:{
        type:[String],
        default:null,
    },
    songs:{
        type:[String],
        default:[],
    },
})

export const User = mongoose.model("users", userSchema);