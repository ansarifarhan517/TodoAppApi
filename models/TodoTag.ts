import mongoose, { Schema, Document } from "mongoose";

interface TodoTagDoc extends Document {
    todoId: mongoose.Schema.Types.ObjectId;
    tagName: string;
}

const TodoTagSchema = new Schema<TodoTagDoc>(
    {
        todoId: { type: Schema.Types.ObjectId, ref: "Todo", required: true },
        tagName: { type: String, ref: "Tag", required: true },
    },
    {
        timestamps: true,
    }
);

const TodoTag = mongoose.model<TodoTagDoc>("TodoTag", TodoTagSchema);
export { TodoTag };
