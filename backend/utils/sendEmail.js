import "dotenv/config";
import fs from "fs";
import handlebars from "handlebars";
import path from "path";
import { fileURLToPath } from "url";
import transporter from "../helpers/emailTransport.js";
import { systemLogs } from "./logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname =  path.dirname(__filename);

const sendEmail = async(email, subject, payload, templatePath) => {
    try {
        const sourceDirectory = fs.readFileSync(path.join(__dirname, templatePath), "utf-8");
        const compiledTemplates = handlebars.compile(sourceDirectory);
        const emailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: subject,
            html: compiledTemplates(payload)
        };
        await transporter.sendMail(emailOptions);
    } catch (error) {
        systemLogs.error(`Email could not send: ${error}`)
    }
}

export default sendEmail;