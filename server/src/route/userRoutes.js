import { Router } from "express";
import userController, {  deleteUserController, getAllUser, getUserByIdController, registerUserController, updateUserController } from "../controller/user.controller.js";


const router = Router();

router.post('/register', registerUserController);
router.post('/login',  userController.login);
router.delete('/delete/:id',deleteUserController);
router.get('/:id', getUserByIdController);
router.get('/getAll/all',getAllUser);
router.put('/update/:id', updateUserController)

export default router;