import { NextFunction, Request, Response } from "express";
import { Todos } from "../models";
import { Status } from "../models/Status";
import { Category } from "../models/Category";
import { Tag } from "../models/Tag";
import { TodoTag } from "../models/TodoTag";

export const addTodo = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "User not authorized" });
    }
    try {
      const { title, desc, status, categoryName, tags } = req.body;
      let statusId, categoryId;
      if (status) {
        const result = await Status.findOne({ status: status });
        statusId = result?._id;
      }
      if (categoryName) {
        const result = await Category.findOne({ categoryName: categoryName });
        categoryId = result?._id;
      }
      if (!title) {
        return res.status(400).json({ message: "Title is required" });
      }
      const newTodo = await Todos.create({
        userId: user._id,
        categoryId,
        title,
        desc,
        status: statusId,
        isActive: true,
        bookMarked: false,
      });
  
      if (tags && Array.isArray(tags)) {
        for (const tagName of tags) {
          let tag = await Tag.findOne({ tagName });
          if (!tag) {
            tag = await Tag.create({ tagName });
          }
          
          await TodoTag.create({
            todoId: newTodo._id,
            tagName: tag.tagName,
          });
        }
      }
      return res.status(201).json({ message: "Todo created successfully", todo: newTodo });
    } catch (error) {
      next(error);
    }
};

export const getAllTodo = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "User Not Authorized" });
    }
    try {
        const todos = await Todos.find({ isActive: true, userId: user._id }).populate('status');
        return res.status(200).json({ message: "Todos Fetched Successfully", todos });
    } catch (error) {
        next(error);
    }
};

export const getTodoById = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "User not authorized" });
    }
    const todoId = req.params.id;
    try {
        const todo = await Todos.findOne({ _id: todoId, userId: user._id, isActive: true });
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        return res.status(200).json({ message: "Todo fetched successfully", todo });
    } catch (error) {
        next(error);
    }
};

export const updateBookmark = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "User not authorized" });
    }
    const { todoId, bookMarked } = req.body;
    try {
        const updatedTodo = await Todos.findOneAndUpdate(
            { _id: todoId, userId: user._id },
            { bookMarked },
            { new: true }
        );
        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        return res.status(200).json({ message: "Todo bookmark updated successfully", todo: updatedTodo });
    } catch (error) {
        next(error);
    }
};

export const deleteTodoById = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "User not authorized" });
    }
    const todoId = req.params.id;
    try {
        const deletedTodo = await Todos.findOneAndUpdate(
            {
                _id: todoId,
                userId: user._id
            },
            { isActive: false },
            { new: true }
        );
        if (!deletedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        return res.status(200).json({ message: "Todo deleted successfully", todo: deletedTodo });
    } catch (error) {
        next(error);
    }
};

export const todoStatusUpdate = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "User not authorized" });
    }

    const { status, todoId } = req.body;

    const result = await Status.findOne({ status });
    if (!result) {
        return res.status(400).json({ message: "Invalid Status" });
    }
    let statusUpdate;
    try {
        if (todoId) {
            statusUpdate = await Todos.findOneAndUpdate(
                {
                    _id: todoId,
                    userId: user._id
                },
                { status: result._id },
                { new: true }
            ).populate('status');
        } else {
            await Todos.updateMany({ userId: user._id }, { status: result._id });
            statusUpdate = await Todos.find({ userId: user._id }).populate('status');
        }
        if (!statusUpdate) {
            return res.status(500).json({ message: "Failed to update" });
        }

        return res.status(200).json({ message: "Todo updated successfully", todo: statusUpdate });
    } catch (error) {
        next(error);
    }
};

export const getAllTodosPaginated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;

        const skip = (page - 1) * limit;

        let query: any = { userId: user._id, isActive: true };
        const search = req.query.search as string | undefined;
        if (search && search.trim().length > 0) {
            query.title = { $regex: search.trim(), $options: 'i' };
        }
        const totalCount = await Todos.countDocuments(query);

        const todos = await Todos.find(query)
            .populate('status')
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            message: 'Todos fetched successfully',
            todos,
            totalCount,
            page,
            limit,
        });
    } catch (error) {
        next(error);
    }
};

export const editTodoById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        const { todoId, todoTitle } = req.body;
        const updatedTodo = await Todos.findOneAndUpdate(
            { userId: user._id, _id: todoId },
            { title: todoTitle },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found or could not be updated' });
        }

        return res.status(200).json({ message: 'Todo updated successfully', todo: updatedTodo });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error });
    }
};
