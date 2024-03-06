/*###############
# This file used for the User model in the MongoDB database.
# The User model is made by mongoose
###############*/

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
    // IMPORTANT: The password is "not required" here because we will use Google to sign in, and Google will not provide the password
    password: {
        type: String,
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
    orders: {
        type: Array,
        default: [],
    },
    work: {
        type: Array,
        default: [],
    },
})

// If the model "User" already exists, it will not be created again. Otherwise, it will be created by using the UserSchema and named "User".
const User = models.User || model('User', UserSchema);

export default User;