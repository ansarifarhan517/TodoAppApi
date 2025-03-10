import { Router } from "express";
import { UserSignUp, UserLogin } from "../controllers";


const router = Router();

// -----------------------> SignUp User
router.post('/signup', UserSignUp)

// -----------------------> Login User
router.post('/login', UserLogin);
export { router as UserRoutes };