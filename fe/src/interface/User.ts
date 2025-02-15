import { ObjectId } from "mongoose";

interface User {
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    tel?: string;
    address?: string;
    role: 'user' | 'admin';
    status: {
        type: boolean;
        default: true;
    };
    createdAt: Date;
    updatedAt: Date;
}

export default User;