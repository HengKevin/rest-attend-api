import { Admin } from '@prisma/client';
import { Exclude } from "class-transformer";
export class AdminEntity implements Admin {
    id: number;
    username: string;
    email: string;

    @Exclude()
    password: string;

    createBy: string;
    createdAt: Date;
    constructor(partial: Partial<AdminEntity>) {
        Object.assign(this, partial);
    }
}