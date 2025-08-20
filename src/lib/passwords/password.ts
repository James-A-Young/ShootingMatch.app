import BasicProtection from './schemes/BasicProtection';
import { ProtectedPassword } from './types/protectedPassword';
import { ProtectionScheme } from './types/ProtectionScheme';

const DEFAULT_PEPPER = 'c501c4b7-7bcb-48cc-8ace-2fa3b3ed8a97';
const schemes: ProtectionScheme[] = [
    new BasicProtection()
]
// hold current scheme with highest shceme id;
let bestScheme = schemes.sort((a, b) => b.scheme - a.scheme)[0];

export class PasswordUtils {
  static async protect(password: string): Promise<ProtectedPassword> {

  const res = await bestScheme.protect(password);
  return {
    scheme: bestScheme.scheme,
    hash: res.hash,
    salt: res.salt
  };
}

static async validate(candidatePassword: string, protectedPassword: ProtectedPassword | null | undefined): Promise<{valid:boolean, newProtectedPassword?:ProtectedPassword}> {

  const dummypwd = await this.protect('dummy');
  const toValidate = protectedPassword ?? dummypwd;
  const nullPassed = !protectedPassword;

  const scheme: ProtectionScheme | undefined = schemes.find(s => s.scheme == toValidate.scheme);
  if (!scheme) throw new Error(`Unsupported protection scheme: ${toValidate.scheme}. schemes: ${JSON.stringify(schemes)}`);

  const valid = await scheme.verify(candidatePassword, toValidate);

  const newProtectedPassword = await this.protect(candidatePassword);
  const needsUpgrade = toValidate.scheme !== bestScheme.scheme;

  return { valid: valid && !nullPassed, newProtectedPassword:  needsUpgrade ? newProtectedPassword : undefined};
  }

static addSchemes(scheme: ProtectionScheme): void {
    console.log('Adding schemes', scheme);
    schemes.push(scheme);
    bestScheme = schemes.sort((a, b) => b.scheme - a.scheme)[0];
  }
}


