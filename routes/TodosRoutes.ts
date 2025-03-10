import { Router } from "express";
import { addTodo, getAllTodo, updateBookmark, deleteTodoById, todoStatusUpdate, getAllTodosPaginated, editTodoById } from "../controllers";
import { getAllCategories, addCategory, editCategoryById, deleteCategoryById, deleteAllCategories } from "../controllers";
import { addSubtask, getSubtasksByTodo, deleteSubtaskById, editSubtaskByTodoId, subtaskStatusUpdate } from "../controllers";
import { Authenticate } from "../middlewares";

const router = Router();

router.get('/getAllTodos', Authenticate, getAllTodo)
router.post('/addTodo', Authenticate, addTodo)
router.delete('/deleteTodoById/:id', Authenticate, deleteTodoById)
router.post('/todoStatusUpdate', Authenticate, todoStatusUpdate)
router.post('/subtaskStatusUpdate', Authenticate, subtaskStatusUpdate)
router.post('/updateBookmark', Authenticate, updateBookmark)
router.get('/getAllTodosPaginated', Authenticate, getAllTodosPaginated);
router.post('/editTodoById', Authenticate, editTodoById);
router.get('/getAllCategory', Authenticate, getAllCategories);
router.post('/addCategory', Authenticate, addCategory);
router.put('/editCategoryById/:id', Authenticate, editCategoryById);
router.delete('/deleteCategoryById/:id', Authenticate, deleteCategoryById);
router.delete('/deleteAllCategory', Authenticate, deleteAllCategories);
router.post('/addSubtask', Authenticate, addSubtask);
router.get('/getSubtasksByTodoId', Authenticate, getSubtasksByTodo);
router.delete('/deleteSubtaskById/:id', Authenticate, deleteSubtaskById);
router.put('/editSubtaskByTodoId/:id', Authenticate, editSubtaskByTodoId);




export { router as TodosRoutes };