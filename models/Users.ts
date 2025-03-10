import mongoose, { Document, Model } from 'mongoose'
import { createHmac, randomBytes } from 'node:crypto'
import { GenerateSignature } from '../utility';

interface UsersDoc extends Document {
    userName: string;
    email: string;
    password: string;
    salt: string;

}

interface MatchPasswordResponse {
    success: boolean;
    signature?: string;
}

interface UsersModel extends Model<UsersDoc> {
    matchPassword(email: string, password: string): Promise<boolean>;
}

const UsersSchema = new mongoose.Schema( {
    userName: { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },

  },{

    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.salt;
            delete ret.createdAt;
            delete ret.updatedAt;
            delete ret.__v;
        },
    },
    timestamps: true
})


UsersSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    const salt = randomBytes(16).toString();

    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest("hex")

    this.salt = salt;
    this.password = hashedPassword;
    next();
})

//Creating Mongoose Static Functions
UsersSchema.static('matchPassword', async function (email, password) {
    const user = await this.findOne({ email })
    const response: MatchPasswordResponse = { success: false }

    if (user === null) {
        return response.success = false;
    }
    const salt = user.salt;
    const hashedPassword = createHmac('sha256', salt)
        .update(password)
        .digest("hex");
    if (hashedPassword === user.password) {

        response.success = true;
        response.signature = await GenerateSignature({
            _id: user.id,
            email: user.email,
            userName: user.userName,
        })
    }
    else {
        response.success = false;
    }
    return response;


})

const User = mongoose.model<UsersDoc, UsersModel>('users', UsersSchema)
export { User }