export interface Voucher {
  _id: string;
  title: string;
  codeName: string;
  value: number;
  maxValue: number;
  quantity: number;
  description: string;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
  status: boolean;
}
