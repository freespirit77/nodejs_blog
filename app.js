const express = require("express");
const connect = require("./schemas");
connect();

const app = express();
const port = 3010;

const postsRouter = require ("./routes/posts");

const requestMiddleware = (req, res, next)=> {
    console.log("Request URL:", req.originalUrl, " - ", new Date());
    next();
}

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(requestMiddleware);

app.use("/api", [postsRouter]);

app.get('/', (req, res) => {
    res.send("This is main page");
});

app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌어요!");
});