import { ObjectId } from 'mongodb';

export interface Notification {
  _id: ObjectId;
  message: string;
  isRead: boolean;
  id_order: string;
  createdAt: string
}