import { IsEmail, Length, IsNotEmpty } from "class-validator";

export interface UserPayload {
    _id: string;
    email: string;
    userName: string;
}

export class UserLoginInputs {
    @IsEmail()
    email: string;

    @Length(6, 12, { message: 'Password must be between 6 and 12 characters' })
    password: string;
}

export class UserSignupInputs {
    @IsNotEmpty({ message: "Username is required" })
    userName: string;

    @IsEmail()
    email: string;

    @Length(6, 12, { message: 'Password must be between 6 and 12 characters' })
    password: string;
}

