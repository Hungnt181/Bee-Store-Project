interface Voucher {
    id: String;
    title: Date;
    codeName: String;
    value: number; 
    quantity:  Number;
    description:  String;
    startTime: Date;
    endTime: Date;
    status: Boolean
}

export type VoucherInput = Omit<Voucher, "id">;