import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import morgan from "morgan";

const app = express();

if(process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

if(process.env.NODE_ENV === "production") {
    app.use(morgan("prod"));
}

app.use(express.json());

app.use(express.urlencoded({extended: false}));

app.use(cookieParser());

app.get("/api/v1/test", (req, res) => {
    res.json({message: "Test called successfully!!"});
});

const PORT = process.env.PORT || 1977;

app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.PORT}....`)
})