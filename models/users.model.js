const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    //single field - username, with 5 validations
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
}, {
    timestamps: true,
});

const Users = mongoose.model('User', userSchema);

module.exports = Users;