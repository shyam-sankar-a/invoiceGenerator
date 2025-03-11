import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../../models/userModel.js";
import { systemLogs } from "../../utils/logger.js";

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        res.status(400);
        throw new Error('Please provide email address');
    }

    if (!password) {
        res.status(400);
        throw new Error('Please provide password');
    }

    const existingUser = User.findOne({ email }).select("+password");

    if (!existingUser) {
        res.status(400);
        throw new Error("User not exists. Please check the credentials and try again");
    }

    if (!await existingUser.comparePasswords(password)) {
        res.status(400);
        throw new Error("Password you provided is not matching. Please check and try again");
    }

    if (!existingUser.isEmailVerified) {
        res.status(400);
        throw new Error("You are not verified. Please check your inbox, we have send you an email with verification link at the time of register");
    }

    if (!existingUser.active) {
        res.status(400);
        throw new Error("You were removed by the admin. Can't login this time. Please contact us for further enquires");
    }

    if (existingUser && await existingUser.comparePasswords(password)) {
        const accessToken = jwt.sign({
            id: existingUser._id,
            roles: existingUser.roles
        }, process.env.JWT_ACCESS_SECRET_KEY, { expiresIn: "1hr" });
        
        const newRefreshToken = jwt.sign({
            id: existingUser._id
        }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: "1d" });

        const cookie = req.cookies;

        let newRefreshTokenArray = !cookie?.jwt ? existingUser.refreshToken : existingUser.refreshToken.filter(refT => refT !== cookie.jwt);

        if (cookie?.jwt) {
            const refreshToken = cookie.jwt;
            const existingRefreshToken = await User.findOne({ refreshToken }).exec();

            if (!existingRefreshToken) {
                newRefreshTokenArray = [];
            }

            const options = {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                secure: true,
                sameSite: "None"
            }

            res.clearCookie("jwt", options);
        }

        existingUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        await existingUser.save()

        const options = {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: true,
            sameSite: "None"
        }
        res.cookie("jwt", newRefreshToken, options);

        res.json({
            success: true,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            username: existingUser.username,
            provider: existingUser.provider,
            avatar: existingUser.avatar,
            accessToken
        });
    } else {
        res.status(400);
        throw new Error("Invalid credentials");
    }
});

export default loginUser