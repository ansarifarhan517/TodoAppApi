import { NextFunction, Request, Response } from "express";
import { Subtask } from "../models/Subtask";
import { Todos } from "../models";
import { Status } from "../models/Status";
import mongoose from "mongoose";

export const addSubtask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { todoId, title, status } = req.body;
        if (!todoId || !title || !status) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        let statusId;

        if (status) {
            const result = await Status.findOne({ status: status });
            statusId = result?._id;
        }

        const subtask = await Subtask.create({
            userId: user._id,
            todoId,
            title,
            status: statusId,
        });

        const subtasks = await Subtask.find({ todoId });
        if (subtasks.every(s => s.status.toString() === '67cb402cc1e25b6319de21ea')) {
            await Todos.findByIdAndUpdate(todoId, { status: new mongoose.Types.ObjectId('67cb402cc1e25b6319de21ea') });
        }

        return res.status(201).json({ message: 'Subtask added successfully', subtask });
    } catch (error) {
        next(error);
    }
};

export const getSubtasksByTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { todoId } = req.query;
        if (!todoId) {
            return res.status(400).json({ message: 'todoId is required' });
        }
        const subtasks = await Subtask.find({ todoId }).populate('status');
        return res.status(200).json({ message: 'Subtasks fetched successfully', subtasks });
    } catch (error) {
        next(error);
    }
};

export const deleteSubtaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subtaskId = req.params.id;
        const deletedSubtask = await Subtask.findByIdAndDelete(subtaskId);
        if (!deletedSubtask) {
            return res.status(404).json({ message: 'Subtask not found' });
        }
        return res.status(200).json({ message: 'Subtask deleted successfully', subtask: deletedSubtask });
    } catch (error) {
        next(error);
    }
};

export const editSubtaskByTodoId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { subtaskId, title, status } = req.body;

        const subtask = await Subtask.findOne({ _id: subtaskId });
        if (!subtask) {
            return res.status(404).json({ message: 'Subtask not found for the specified todo' });
        }

        if (title) {
            subtask.title = title;
        }
        if (status) {
            subtask.status = new mongoose.Types.ObjectId(status);
        }

        const updatedSubtask = await subtask.save();

        return res.status(200).json({ message: 'Subtask updated successfully', subtask: updatedSubtask });
    } catch (error) {
        next(error);
    }
};

export const subtaskStatusUpdate = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "User not authorized" });
    }

    const { status, subtaskId } = req.body;

    const result = await Status.findOne({ status });
    if (!result) {
        return res.status(400).json({ message: "Invalid Status" });
    }
    let statusUpdate;
    try {
        if (subtaskId) {
            statusUpdate = await Subtask.findOneAndUpdate(
                {
                    _id: subtaskId,
                    userId: user._id
                },
                { status: result._id },
                { new: true }
            ).populate('status');

            const allsubtask = await Subtask.find({ todoId: statusUpdate?.todoId });

            if (allsubtask.every(s => s.status.toString() === '67cb402cc1e25b6319de21ea')) {
                await Todos.findByIdAndUpdate(statusUpdate?.todoId, { status: new mongoose.Types.ObjectId('67cb402cc1e25b6319de21ea') });
            }
        }
        if (!statusUpdate) {
            return res.status(500).json({ message: "Failed to update" });
        }

        return res.status(200).json({ message: "Subtask updated successfully", subtask: statusUpdate });
    } catch (error) {
        next(error);
    }
};
