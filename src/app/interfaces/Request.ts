export interface taskFilter {
  userId: number;
  status?: number; // pending OR completed OR PAST DUE
  priority?: number;
  taskCategory?: number; // 0 - personal; 1- academic
  tags?: number; // the tags is depends on the task category
}
