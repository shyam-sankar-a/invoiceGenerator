import mongoose from "mongoose";

const verifyResetTokenSchema = mongoose.Schema({
    _userId: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 900
    }
});

const verifyResetToken = mongoose.model("verifyResetToken", verifyResetTokenSchema);

export default verifyResetToken;