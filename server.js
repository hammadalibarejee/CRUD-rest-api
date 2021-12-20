const app = require('./app');
// const dotenv=require(dotenv);

const PORT = 3000 || process.env.PORT;


app.listen(PORT, () => {
    console.log(`The example app is listening on http://localhost:${PORT}`)
});

