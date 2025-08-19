import { PasswordUtils } from '../../../src/lib/passwords/password';

describe('password library', () => {
  it('should generate a password hash and verify it correctly', async () => {
    const password = 'TestPassword123!';
    const hash = await PasswordUtils.protect(password);
    expect(typeof hash).toBe('object');
    const isValid = await PasswordUtils.validate(password, hash);
    expect(isValid.valid).toBe(true);
    expect(isValid.newProtectedPassword).toBe(undefined);
  });

  it('should not verify an incorrect password', async () => {
    const password = 'TestPassword123!';
    const wrongPassword = 'WrongPassword!';
    const hash = await PasswordUtils.protect(password);
    const isValid = await PasswordUtils.validate(wrongPassword, hash);
    expect(isValid.valid).toBe(false);
    expect(isValid.newProtectedPassword).toBe(undefined);
  });

    it('should not verify a password when no hash is provided', async () => {
    const wrongPassword = 'WrongPassword!';
    const isValid = await PasswordUtils.validate(wrongPassword, null);
    expect(isValid.valid).toBe(false);
    expect(isValid.newProtectedPassword).toBe(undefined);
  });

  it('should error when a hash for an unsupported shceme is provided', async () => {
    const password = 'TestPassword123!';
    const hash = await PasswordUtils.protect(password);
    const unsupportedHash = { ...hash, scheme: 999 };
    await expect(PasswordUtils.validate(password, unsupportedHash)).rejects.toThrow('Unsupported protection scheme: 999');
  });

  it('should return an upgraded scheme version when the provided hash is protected by a lower scheme', async () => {
    const password = 'TestPassword123!';
    // Inject a test scheme with id 0 into passworduitls schemes
    const mockScheme = {
  scheme: 0,
  protect: async (password: string) => ({
    hash: Buffer.from('mock'),
    salt: Buffer.from('mock')
  }),
  verify: async () => true,
};

    PasswordUtils.addSchemes(mockScheme);

    const hash = await PasswordUtils.protect(password);
    const oldHash = { ...hash, scheme: 0 };
    const isValid = await PasswordUtils.validate(password, oldHash);
    expect(isValid.valid).toBe(true);
    expect(isValid.newProtectedPassword).toBeDefined();
  });


});
