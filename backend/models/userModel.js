import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";
import validator from "validator";
import { USER } from "../constants/index.js";

const {Schema} = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function(userName) {
                return /^[A-z][A-z0-9-_]{3,23}$/.test(userName)
            },
            message: "username must be aplhanumeric, without special characters. Hyphens and underscores are allowed"
        }
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
        validate: [
            validator.isAlphanumeric, "First Name can only have alphanumeric values. No special characters allowed"
        ]
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        validate: [
            validator.isAlphanumeric, "Last Name can only have alphanumeric values. No special characters allowed"
        ]
    },
    password: {
        type: String,
        required: true,
        select: false,
        validate: [validator.isStrongPassword, "Password must be atleast 8 characters long, with 1 uppercase and lowercase letters and atleast 1 symbol"]
    },
    confirmPassword: {
        type: String,
        select: false,
        validate: {
            validator: function(value) {
                return this.password === value
            },
            message: "Passwords do not match"
        }
    },
    isEmailVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    provider: {
        type: String,
        default: "email"
    },
    googleID: String,
    avatar: String,
    businessName: String,
    phoneNumber: {
        type: String,
        validate: [
            validator.isMobilePhone, "Please enter phone number starting with '+' followed by country code and then actual number. eg; +91987654321"
        ]
    },
    address: String,
    city: String,
    country: String,
    roles: {
        type: [String],
        default: [USER]
    },
    active: {
        type: Boolean,
        defaut: true
    },
    refreshToken: [String],
},{
    timestamps: true
});

/**
 * Hook to enter user role before saving new entry
 */
userSchema.pre("save", async function(next) {
    if(this.roles.length === 0) {
        this.roles.push(USER);
        next();
    }
});

/**
 * Hook to encrypt password
 * If no change in password then skip
 */
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.confirmPassword = undefined;
    next();
});

/**
 * Adding a method to compare password to user model schema
 */
userSchema.methods.comparePasswords = async function(password) {
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", userSchema);

export default User;