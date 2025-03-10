import { plainToClass } from "class-transformer"
import { validate } from "class-validator"
import { User } from "../models";
import { GenerateSignature } from "../utility";
import { UserLoginInputs, UserSignupInputs } from "../dto/Users.dto";
import { NextFunction, Request, Response } from "express";

export const UserSignUp = async (req: Request, res: Response, next: NextFunction) => {
    const userInputs = plainToClass(UserSignupInputs, req.body)
    const inputErrors = await validate(userInputs, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, userName, password } = req.body;

    const isExistingUser = await User.findOne({ email });

    if (isExistingUser) {
        return res.status(400).json({ "message": "Email Id already Exist" })
    }

    const user = await User.create({
        userName,
        email,
        password,
        salt: "temp",
    })

    if (!user) {
        return res.status(401).json({ "message": "Not Created" })
    }

    const signature = await GenerateSignature({
        _id: String(user._id),
        email: user.email,
        userName: user.userName
    })

    return res.status(201).json({
        "message": "User Creted SuccesFully", signature, email: user.email, userId: user._id, userName: user.userName
    })

}

export const UserLogin = async (req: Request, res: Response, next: NextFunction) => {
    const loginInputs = plainToClass(UserLoginInputs, req.body)
    const inputErrors = await validate(loginInputs, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email })

    if (!user) {
        return res.status(401).json({ "message": "Invalid email" })
    }
    const isAuthentic: any = await User.matchPassword(email, password);
    if (!isAuthentic.success) {
        return res.status(400).json({ "message": "Invalid Password" })
    }

    const signature = await GenerateSignature({
        _id: String(user._id),
        email: user.email,
        userName: user.userName
    })

    return res.status(200).json({
        "message": "User Fetched SuccesFully", signature, email: user.email, userId: user._id,
        userName: user.userName
    })

}