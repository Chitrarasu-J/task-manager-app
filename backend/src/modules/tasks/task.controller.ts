import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { createTask } from "./task.service";
import { getTasks } from "./task.service";
import { updateTask } from "./task.service";
import { deleteTask } from "./task.service";
import { patchTask, toggleTaskStatus } from "./task.service";

export const createTaskHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const task = await createTask({
      title,
      description,
      userId,
    });

    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Task creation failed",
    });
  }
};
export const getTasksHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const status = req.query.status as
      | "PENDING"
      | "COMPLETED"
      | undefined;

    const result = await getTasks({
      userId,
      page,
      limit,
      search,
      status,
    });

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Failed to fetch tasks",
    });
  }
};

export const updateTaskHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const id = req.params.id as string;
    const { title, description, status } = req.body;

    const updatedTask = await updateTask({
      taskId: id,
      userId,
      title,
      description,
      status,
    });

    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Task update failed",
    });
  }
};
export const deleteTaskHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const id = req.params.id as string;

    await deleteTask({
      taskId: id,
      userId,
    });

    return res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Task deletion failed",
    });
  }
};
export const patchTaskHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const id = req.params.id as string;
    const { title, description, status } = req.body;

    const updatedTask = await patchTask({
      taskId: id,
      userId,
      title,
      description,
      status,
    });

    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Task update failed",
    });
  }
};
export const toggleTaskHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const id = req.params.id as string;

    const updatedTask = await toggleTaskStatus(id, userId);

    return res.status(200).json({
      message: "Task status toggled",
      task: updatedTask,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Toggle failed",
    });
  }
};
