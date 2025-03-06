import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import connectionToDB from "./config/connectDB.js";
import { systemLogs, morganMiddleware } from "./utils/logger.js";

// Handle unhandled promise rejections globally
process.on("unhandledRejection", (error) => {
    console.error("Unhandled promise rejection:", error);
    process.exit(1); // Exit the app gracefully
});

const app = express();

const initializeServer = async () => {
    try {
        // Attempt to connect to the database
        await connectionToDB();

        // Proceed to set up the app if DB connection is successful
        if (process.env.NODE_ENV === "development") {
            app.use(morgan("dev"));
        }

        if (process.env.NODE_ENV === "production") {
            app.use(morgan("prod"));
        }

        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(mongoSanitize())
        app.use(morganMiddleware);

        app.get("/api/v1/test", (req, res) => {
            res.json({ message: "Test called successfully!!!!" });
        });

        const PORT = process.env.PORT || 1977;

        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}....`);
            systemLogs.info(`Server is running on ${PORT}....`);
        });
    } catch (error) {
        console.error("Server initialization failed:", error);
        systemLogs.error("Server initialization failed: " + error.message);
        process.exit(1); // Exit if DB connection or other errors occur
    }
};

// Call the function to initialize the server
initializeServer();
