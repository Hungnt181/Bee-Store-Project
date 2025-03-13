export interface Comment {
  _id: string;
  id_product: { name: string };
  id_user: { name: string };
  noidung_bl: string;
  ngay_bl: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}
