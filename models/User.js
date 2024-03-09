/*###############
# This file used for the User model in the MongoDB database.
# The User model is made by mongoose
###############*/

import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
    },
    profileImagePath: {
        type: String,
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