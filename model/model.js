const mongoose = require('mongoose');

try {
    mongoose.connect('mongodb+srv://hammadali:hammad123@cluster0.ga4fb.mongodb.net/users?retryWrites=true&w=majority');
    console.log('Database has been connected');

}
catch (err) {
    console.log(err);

}

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'The user must have the name ']
    },
    email: {
        type: String,
        required: [true, 'The user must have the email ']
    },
    address: {
        type: String,
        required: [true, 'The user must have the address']
    }
});

const users = mongoose.model('users', usersSchema);

module.exports = users;



