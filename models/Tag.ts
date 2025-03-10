import mongoose, { Schema, Document } from "mongoose";

interface TagDoc extends Document {
    tagName: string;
}

const TagSchema = new Schema<TagDoc>(
    {
        tagName: { type: String, required: true, unique: true },
    },
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.updatedAt;
                delete ret.createdAt;
                delete ret.__v;
            },
        },
        timestamps: true,
    }
);

const Tag = mongoose.model<TagDoc>("tag", TagSchema);
export { Tag };
