export interface confirmModal {
  imgPath: string;
  title: string;
  text?: string;
  isUpdate?: boolean;
  isConfirm?: boolean;
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

/* TOAST MODAL */
export interface toastModal {
  type: string;
  status: boolean;
}
