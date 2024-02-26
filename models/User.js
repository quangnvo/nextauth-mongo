// User.js

import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'Username already exists'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already exists'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    profileImagePath: {
        type: String,
        required: [true, 'Profile image is required'],
    },
    wishlist: {
        type: Array,
        default: [],
    },
    cart: {
        type: Array,
        default: [],
    },
    order: {
        type: Array,
        default: [],
    },
    work: {
        type: Array,
        default: [],
    },
})

// This is first look at the models, if the model "User" already exists, it will not be created again. Otherwise, it will be created by using the UserSchema and named "User".
const User = models.User || model('User', UserSchema);

export default User;