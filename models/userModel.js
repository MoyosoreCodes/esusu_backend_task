import mongoose, { Schema } from 'mongoose';

const userObject = {
    fullname: {type: String,trim: true, required: [true,'please provide name']},
    username: {required: true, type: String, lowercase: true, index: {unique: true, dropDups: true}},
}

const userSchema = new Schema(userObject, {timestamps: true, toJSON: { getters: true } });
const User = mongoose.model('User', userSchema); 

export default User;