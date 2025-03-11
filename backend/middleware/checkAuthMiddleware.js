import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/userModel.js";

const checkAuth = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
        res.status(401);
        throw new Error("You are not authorized to access our platform");
    }

    if (authHeader && authHeader.startsWith("Bearer")) {
        const jwtToken = authHeader.split(" ")[1];
        jwt.verify(
            jwtToken,
            process.env.JWT_ACCESS_SECRET_KEY,
            async (error, decoded) => {
                if (error) {
                    res.status(403);
                    throw new Error('You are not authorized to access our platform.');
                }
                const userId = decoded.indexOf;
                req.user = await User.findById(userId);
                req.roles = decoded.roles;
                next();
            }
        )
    }
});

export default checkAuth