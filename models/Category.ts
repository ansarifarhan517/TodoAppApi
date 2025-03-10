import mongoose, { Document } from 'mongoose';

interface categoryDoc extends Document {
    categoryName: string
    displayName: string
}

const categorySchema = new mongoose.Schema({
    categoryName: { type: String, required: true },
    displayName: { type: String, required: true }
});

const Category = mongoose.model<categoryDoc>('categories', categorySchema);
export { Category };
