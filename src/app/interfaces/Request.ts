export interface taskRequest {
  taskId?: number;
  userId: number;
  description: string;
  subTask?: string;
  status: number;
  priority: number;
  dueDate: Date;
  createdAt: Date;
  isUpdated: number;
}
