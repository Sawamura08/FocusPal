export interface confirmModal {
  imgPath: string;
  title: string;
  text?: string;
  isUpdate?: boolean;
  isConfirm?: boolean;
}

/* TOAST MODAL */
export interface toastModal {
  type: string;
  status: boolean;
}

export enum taskCompletion {
  PENDING = 0,
  COMPLETE = 1,
  PAST_DUE = 2,
}

export const confirm: confirmModal = {
  imgPath: '/extra/warning.png',
  title: 'Are you sure?',
  text: 'This action cannot be undone.',
  isConfirm: true,
};

/* CATEGORY CHOICES */
export const categories = {
  PERSONAL: 0,
  ACADEMIC: 1,
};

export enum TASK_TAGS_PERSONAL {
  Health = 0,
  Finance = 1,
  Errands = 2,
  Fitness = 3,
  Social = 4,
  Organization = 5,
  Others = 6,
}

export enum TASK_TAGS_ACADEMIC {
  Homework = 0,
  Exams = 1,
  Projects = 2,
  Reading = 3,
  Research = 4,
  Organization = 5,
  Others = 6,
}
