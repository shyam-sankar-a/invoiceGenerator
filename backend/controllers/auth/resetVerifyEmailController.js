import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import VerifyResetToken from "../../models/verifyResetTokenModel.js";
import sendEmail from "../../utils/sendEmail.js";

const { randomBytes } = await import("crypto");

const resendVerifyEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error("Please provide a valid email address");
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
        res.status(400);
        throw new Error("Cannot find a user with provided email");
    }

    const existingToken = await VerifyResetToken.findOne({ _userId: existingUser._id });

    if (existingToken) {
        await existingToken.deleteOne();
    }

    const newVerificationToken = randomBytes(32).toString("hex");
    new VerifyResetToken({
        _userId: existingUser._id,
        token: newVerificationToken
    }).save();

    const emailLink = `${process.env.DOMAIN}/api/v1/auth/verify/${newVerificationToken}/${existingUser._id}`;

    const payload = {
        name: `${existingUser.firstname} ${existingUser.lastname}`,
        link: emailLink,
        domain: process.env.DOMAIN
    };

    await sendEmail(existingUser.email,
        'Invoicegen - Account Verification',
        payload,
        "./emails/templates/accountVerification.handlebars");
    
    res.json({
        success: true,
        message: `${registerdUser.firstname} ${registerdUser.lastname}, a verification email has been sent to registered email address. Please note that the verification link will expire in next 15 mins.`
    })

});

export default resendVerifyEmail