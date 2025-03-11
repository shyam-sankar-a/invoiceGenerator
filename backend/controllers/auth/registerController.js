import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import VerifyResetToken from "../../models/verifyResetTokenModel.js";
import sendEmail from "../../utils/sendEmail.js";

/**
 * Register user controller
 * POST method /api/v1/auth/register
 * Req.params: username, password, firstname, lastname, email, password confirm, etc.
 * Once register send email verification
 */

const {randomBytes} = await import("crypto");

const registerUser = asyncHandler(async(req, res, next) => {
    const {email, username, firstname, lastname, password, passwordConfirm} = req.body;

    if(!email) {
        res.status(400);
        throw new Error("Email address is required");
    }

    if(!username) {
        res.status(400);
        throw new Error("Username is required");
    }
    
    if(!firstname) {
        res.status(400);
        throw new Error("Firstname is required");
    }

    if(!lastname) {
        res.status(400);
        throw new Error("Lastname is required");
    }

    if(!password) {
        res.status(400);
        throw new Error("Password is required");
    }

    if(!passwordConfirm) {
        res.status(400);
        throw new Error("Password confirm is required");
    }

    if(password !== passwordConfirm) {
        res.status(400);
        throw new Error("Password and confirm password should match");
    }

    const userExists = await User.findOne({email});

    if(userExists) {
        res.status(400);
        throw new Error("This user is already exists. Please login");
    }

    const newUser = new User({
        email, username, firstname, lastname, password, passwordConfirm
    });

    const registerdUser = await newUser.save();

    if(!registerdUser) {
        res.status(400);
        throw new Error("User could not be registered");
    }

    const verificationToken = randomBytes(32).toString("hex");

    new VerifyResetToken({
        _userId: registerdUser._id,
        token: verificationToken
    }).save();

    const emailLink = `${process.env.DOMAIN}/api/v1/auth/verify/${verificationToken}/${registerdUser._id}`;

    const payload = {
        name: `${registerdUser.firstname} ${registerdUser.lastname}`,
        link: emailLink,
        domain: process.env.DOMAIN
    };

    await sendEmail(registerdUser.email,
        'Invoicegen - Account Verification',
        payload,
        "./emails/templates/accountVerification.handlebars");
    
    res.json({
        success: true,
        message: `Successfully created user, ${registerdUser.firstname} ${registerdUser.lastname}, and a verification email has been sent to registered email address. Please note that the verification link will expire in next 15 mins.`
    })

});

export default registerUser