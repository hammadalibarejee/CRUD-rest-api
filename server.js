const app = require('./app');
// const dotenv=require(dotenv);
require('dotenv').config('config.env');

console.log(process.env);

const PORT = 3000 || process.env.PORT;


const server = app.listen(PORT, () => {
    console.log(`The example app is listening on http://localhost:${PORT}`)
});


// Handling global asynschronus unhandeled errors 
process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION! Shutting down');
    server.close(() => {
        process.exit(1);
    })
})

