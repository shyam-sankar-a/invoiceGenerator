import nodemailer from "nodemailer";
import "dotenv/config";

let transporter;

if(process.env.NODE_ENV === "development") {
    transporter = nodemailer.createTransport({
        host: "mailhog",
        port: 1025
    });
} else {
    transporter = nodemailer.createTransport({
        //TODO: In production need to use mailgun
    });
}

export default transporter;