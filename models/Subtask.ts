import mongoose, { Document } from 'mongoose';

interface subtaskDoc extends Document {
    userId: mongoose.Types.ObjectId;
    todoId: mongoose.Types.ObjectId;
    title: string;
    status: mongoose.Types.ObjectId;
}

const subTaskSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
        todoId: { type: mongoose.Schema.Types.ObjectId, ref: 'todos', required: true },
        title: { type: String, required: true },
        status: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'status',
            required: true
        },
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


const Subtask = mongoose.model<subtaskDoc>('subtask', subTaskSchema);
export { Subtask };
