import mongoose from "mongoose";
import { systemLogs } from "../utils/logger.js";

const connectionToDB = async () => {
    try {
        const params = {
            dbName: process.env.DB_NAME
        };
        const connect = await mongoose.connect(process.env.MONGO_URI, params);
        systemLogs.info(`Database connection established, ${connect.connection.host}`);
    } catch(error) {
        systemLogs.error(`Database connection failed: ${error.message}`);
        process.exit(1);
    }
}
export default connectionToDB;