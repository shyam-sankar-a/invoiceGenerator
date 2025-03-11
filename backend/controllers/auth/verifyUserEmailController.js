import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import VerifyResetToken from "../../models/verifyResetTokenModel.js";
import sendEmail from "../../utils/sendEmail.js";

/**
 * Verify token controller
 * GET method /api/v1/auth/verify/:emailToken/:userId
 */

const verifyUserEmail = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ _id: req.params.userId });
    const verifcationToken = await VerifyResetToken.findOne({ token: req.params.emailToken });

    if (!user) {
        res.status(400);
        throw new Error("We were unable to find a user for this token");
    }

    if (user.isEmailVerified) {
        res.status(400);
        throw new Error("This user is already verified. Please login");
    }

    if (!verifcationToken) {
        res.status(400);
        throw new Error("Unfortunately you took too much time to verify. We cannot verify you at this moment");
    }

    user.isEmailVerified = true;
    const emailVerified = await user.save();

    if (emailVerified) {
        await sendEmail(
            user.email,
            "Invoicegen - Email Verified",
            {
                name: `${user.firstname} ${user.lastname}`,
                link: `${process.env.DOMAIN}/login`,
                domain: process.env.DOMAIN
            },
            "./emails/templates/welcome.handlebars"
        )
    }
    res.redirect("/login");
});

export default verifyUserEmail