export interface taskFilter {
  userId: number;
  status?: number; // pending OR completed OR PAST DUE
  priority?: number;
  category?: number; // 0 - personal; 1- academic
  tags?: number; // the tags is depends on the task category
}

export interface subTaskTypes {
  id: number;
  data: string;
}
