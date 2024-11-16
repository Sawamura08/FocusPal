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
  HEALTH = 0,
  FINANCE = 1,
  ERRANDS = 2,
  FITNESS = 3,
  SOCIAL = 4,
  ORGANIZATION = 5,
  OTHERS = 6,
}

export enum TASK_TAGS_ACADEMIC {
  HOMEWORK = 0,
  EXAMS = 1,
  PROJECTS = 2,
  READING = 3,
  RESEARCH = 4,
  ORGANIZATION = 5,
  OTHERS = 6,
}
