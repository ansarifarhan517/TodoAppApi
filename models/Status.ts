import mongoose, { Document } from 'mongoose';

interface statusDoc extends Document {
    status: string;
}

const statusSchema = new mongoose.Schema({
    status: { type: String, required: true }
});

const Status = mongoose.model<statusDoc>('status', statusSchema);
export { Status };
