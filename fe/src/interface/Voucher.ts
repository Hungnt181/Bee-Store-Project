interface Voucher {
    id: String;
    title: string;
    codeName: String;
    value: number; 
    quantity:  Number;
    description:  String;
    startTime: Date;
    endTime: Date;
    status: Boolean
}

export type VoucherInput = Omit<Voucher, "id">;