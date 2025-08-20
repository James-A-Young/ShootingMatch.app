
import { scryptSync, timingSafeEqual, randomBytes } from 'crypto';
import { ProtectionScheme } from '../types/ProtectionScheme';
import { ProtectedPassword } from '../types/protectedPassword';

const pepper = process.env.AUTH_BASIC_PEPPER ?? 'c501c4b7-7bcb-48cc-8ace-2fa3b3ed8a97';
const N = 2 ** 17
const R = 8
const p = 1
const scryptSettings = {N:N, r:R, p, maxmem: 250 * N * R + 1}
const keylen = 64

export default class BasicProtection implements ProtectionScheme{
    scheme: number=1;

    async protect(password: string): Promise<{ hash: Buffer, salt: Buffer }> 
    {
        const salt = randomBytes(64);
        return this.protectSalted(password, salt);
    }

    async protectSalted(password: string, salt: Buffer): Promise<{ hash: Buffer, salt: Buffer }> {
     const hashedPassword = scryptSync(password + pepper, salt, keylen, scryptSettings)
     return { hash: hashedPassword, salt: salt };
    }

    async verify(candidatePassword: string, protectedPassword: ProtectedPassword): Promise<boolean> {
        if(protectedPassword.scheme !== this.scheme) throw new Error(`Invalid protection scheme called, expected ${this.scheme}, protected by ${protectedPassword.scheme}`);
        const candidate = await this.protectSalted(candidatePassword, protectedPassword.salt);
        return timingSafeEqual(protectedPassword.hash, candidate.hash);
    }
}