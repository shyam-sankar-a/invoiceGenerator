import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import VerifyResetToken from "../../models/verifyResetTokenModel.js";
import { randomBytes } from "crypto";
import sendEmail from "../../utils/sendEmail.js";
import { systemLogs } from "../../utils/logger.js";

const resetPasswordRequest = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error("Please provide a valid email address");
    }

    const user = await User.findOne({ email }); 

    if (!user) {
        res.status(400);
        throw new Error("Cannot find a user with provided email. Please check email and try again");
    }

    const verificationToken = await VerifyResetToken.findOne({ _userId: user._id });

    if (verificationToken) {
        await verificationToken.deleteOne();
    }

    const newToken = randomBytes(32).toString('hex');

    const saveToken = await verificationToken.save({
        _userId: user._id,
        token: newToken,
        createdAt: Date.now()
    });

    if (user && user.isEmailVerified) {
        await sendEmail(
            email,
            "Reset Your Password - Invoicegen",
            {
                name: `${user.firstname} ${user.lastname}`,
                link: `${process.env.DOMAIN}/auth/reset_password?emailToken=${saveToken.toke}&userId=${user._id}`,
                domain: process.env.DOMAIN
            },
            "./emails/templates/passwordReset.handlebars"
        );
    }

    res.json({
        success: true,
        message: `Hello ${user.firstname}, an email has been sent to your account with the password reset link`
    });
});

const resetPassword = asyncHandler(async (res, req) => {
    const { password, confirmPassword, userId, emailToken } = req.body;

    if (!password) {
        res.status(400);
        throw new Error("Password should not be empty");
    }

    if (!confirmPassword) {
        res.status(400);
        throw new Error("Confirm password should not be empty");
    }

    if (password !== confirmPassword) {
        res.status(400);
        throw new Error("Password and Confirm password should match");
    }

    if (password.length < 8) {
        res.status(400);
        throw new Error("Password must be atleast 8 characters long");
    }

    const user = await User.findById({ _id: userId }).select("-passwordConfirm");
    const verificationToken = await VerifyResetToken.findOne({ _userId: userId });

    if (!user) {
        res.status(400);
        throw new Error("Cannot find a user with provided email. Please check email and try again");
    }

    if (!verificationToken) {
        res.status(400);
        throw new Error("Your token is expired. Try reseting your password once again");
    }

    if (user && verificationToken) {
        user.password = password;
        await user.save();

        await sendEmail(
            email,
            "Reset Password Success- Invoicegen",
            {
                name: `${user.firstname} ${user.lastname}`,
                link: `${process.env.DOMAIN}/auth/login`,
                domain: process.env.DOMAIN
            },
            "./emails/templates/passwordResetSuccess.handlebars"
        );

        res.json({
            success: true,
            message: `Hello ${user.firstname}, Password reset was successfull. An email has been sent to the same`
        });
    }

});

export {resetPasswordRequest, resetPassword}