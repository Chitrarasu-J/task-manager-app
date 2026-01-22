import prisma from "../../config/prisma";

interface CreateTaskInput {
  title: string;
  description?: string;
  userId: string;
}

export const createTask = async (data: CreateTaskInput) => {
  const { title, description, userId } = data;

  const task = await prisma.task.create({
    data: {
      title,
      description,
      userId,
    },
  });

  return task;
};
interface GetTasksInput {
  userId: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: "PENDING" | "COMPLETED";
}

export const getTasks = async (data: GetTasksInput) => {
  const {
    userId,
    page = 1,
    limit = 10,
    search,
    status,
  } = data;

  const skip = (page - 1) * limit;

  const whereCondition: any = {
    userId,
  };

  if (search) {
    whereCondition.title = {
      contains: search,
      mode: "insensitive",
    };
  }

  if (status) {
    whereCondition.status = status;
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.task.count({
      where: whereCondition,
    }),
  ]);

  return {
    tasks,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

interface UpdateTaskInput {
  taskId: string;
  userId: string;
  title?: string;
  description?: string;
  status?: "PENDING" | "COMPLETED";
}

export const updateTask = async (data: UpdateTaskInput) => {
  const { taskId, userId, title, description, status } = data;

  // Ensure task belongs to user
  const existingTask = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!existingTask) {
    throw new Error("Task not found or unauthorized");
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      title,
      description,
      status,
    },
  });

  return updatedTask;
};
interface DeleteTaskInput {
  taskId: string;
  userId: string;
}

export const deleteTask = async (data: DeleteTaskInput) => {
  const { taskId, userId } = data;

  const existingTask = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!existingTask) {
    throw new Error("Task not found or unauthorized");
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  return;
};
interface PatchTaskInput {
  taskId: string;
  userId: string;
  title?: string;
  description?: string;
  status?: "PENDING" | "COMPLETED";
}

export const patchTask = async (data: PatchTaskInput) => {
  const { taskId, userId, title, description, status } = data;

  const existingTask = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!existingTask) {
    throw new Error("Task not found or unauthorized");
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
    },
  });

  return updatedTask;
};
export const toggleTaskStatus = async (
  taskId: string,
  userId: string
) => {
  const existingTask = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!existingTask) {
    throw new Error("Task not found or unauthorized");
  }

  const newStatus =
    existingTask.status === "PENDING"
      ? "COMPLETED"
      : "PENDING";

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus },
  });

  return updatedTask;
};
