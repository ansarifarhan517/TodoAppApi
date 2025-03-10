import mongoose, { Document } from 'mongoose';

interface todosDoc extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  desc?: string;
  status: mongoose.Types.ObjectId;
  isActive: boolean;
  bookMarked: boolean;
}

const todosSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'categories', required: true },
    title: { type: String, required: true },
    desc: { type: String },
    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'status',
      required: true,
    },
    isActive: { type: Boolean, default: true },
    bookMarked: { type: Boolean, default: false },
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

const Todos = mongoose.model<todosDoc>('todos', todosSchema);
export { Todos };
