import { ProtectedPassword } from './protectedPassword';

export interface ProtectionScheme{ 
    scheme: number 
    protect(password: string): Promise<{ hash: Buffer, salt: Buffer }>
    verify(candidatePassword: string, protectedPassword: ProtectedPassword): Promise<boolean>
}

