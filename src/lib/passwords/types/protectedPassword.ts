import { BinaryLike } from "crypto";

export interface ProtectedPassword {
    hash: Buffer;
    salt: Buffer;
    scheme: number;
}