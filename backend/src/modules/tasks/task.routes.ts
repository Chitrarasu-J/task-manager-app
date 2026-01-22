import { Router } from "express";
import {
  createTaskHandler,
  getTasksHandler,
  updateTaskHandler,
  deleteTaskHandler,
  patchTaskHandler,
  toggleTaskHandler,
} from "./task.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createTaskHandler);
router.get("/", authMiddleware, getTasksHandler);

router.put("/:id", authMiddleware, updateTaskHandler); // optional
router.patch("/:id", authMiddleware, patchTaskHandler); // required
router.patch("/:id/toggle", authMiddleware, toggleTaskHandler); // required
router.delete("/:id", authMiddleware, deleteTaskHandler);

export default router;
