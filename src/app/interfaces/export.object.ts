export interface confirmModal {
  imgPath: string;
  title: string;
  text?: string;
  isUpdate?: boolean;
}

/* TOAST MODAL */
export interface toastModal {
  type: string;
  status: boolean;
}
