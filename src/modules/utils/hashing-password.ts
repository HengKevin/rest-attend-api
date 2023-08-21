import { Injectable } from '@nestjs/common'
import * as  bcrypt from 'bcrypt'
import * as crypto from 'crypto';


@Injectable()
export class HashPasswordService {
    hashToken(token: string) {
        return crypto.createHash('sha256').update(token).digest('hex')
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = process.env.saltOrRounds || 12; // Number of salt rounds
        const salt = await bcrypt.genSalt(+saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }

    async comparePassword(password: string, hashPassword: string) {
        const isMatch = await bcrypt.compare(password, hashPassword);
        return isMatch
    }


}





