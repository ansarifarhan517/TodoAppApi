import { NextFunction, Request, Response } from "express";
import { Category } from "../models/Category";
import { Todos } from "../models";

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({ message: 'Categories fetched successfully', categories });
    } catch (error) {
        next(error);
    }
};

export const addCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { categoryName, displayName } = req.body;
        if (!categoryName || !displayName) {
            return res.status(400).json({ message: 'categoryName and displayName are required' });
        }
        const newCategory = await Category.create({ categoryName, displayName });
        return res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        next(error);
    }
};

export const editCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryId = req.params.id;
        const { categoryName, displayName } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { categoryName, displayName },
            { new: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        return res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
        next(error);
    }
};

export const deleteCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryId = req.params.id;
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await Todos.updateMany(
            { categoryId: categoryId },
            { $unset: { categoryId: 1 } }
        );
        return res.status(200).json({
            message: 'Category deleted successfully and category removed from linked todos',
            category: deletedCategory
        });
    } catch (error) {
        next(error);
    }
};

export const deleteAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await Category.deleteMany({});
        return res.status(200).json({ message: 'All categories deleted successfully', result });
    } catch (error) {
        next(error);
    }
};
