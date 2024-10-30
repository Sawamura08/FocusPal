export interface confirmModal {
  imgPath: string;
  title: string;
  text?: string;
  isUpdate?: boolean;
}

export const confirm: confirmModal = {
  imgPath: '/extra/warning.png',
  title: 'Are you sure?',
  text: 'This action cannot be undone.',
};

/* TOAST MODAL */
export interface toastModal {
  type: string;
  status: boolean;
}
