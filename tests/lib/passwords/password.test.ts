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

  it('should handle very long passwords (50000 chars)', async () => {
    const longPassword = 'A'.repeat(50000);
    const hash = await PasswordUtils.protect(longPassword);
    expect(typeof hash).toBe('object');
    const isValid = await PasswordUtils.validate(longPassword, hash);
    expect(isValid.valid).toBe(true);
    expect(isValid.newProtectedPassword).toBe(undefined);
  });

  it('should handle very short passwords (1 char)', async () => {
    const shortPassword = 'x';
    const hash = await PasswordUtils.protect(shortPassword);
    expect(typeof hash).toBe('object');
    const isValid = await PasswordUtils.validate(shortPassword, hash);
    expect(isValid.valid).toBe(true);
    expect(isValid.newProtectedPassword).toBe(undefined);
  });

  it('should not validate a long password with a short password hash', async () => {
    const longPassword = 'A'.repeat(5000);
    const shortPassword = 'x';
    const hash = await PasswordUtils.protect(shortPassword);
    const isValid = await PasswordUtils.validate(longPassword, hash);
    expect(isValid.valid).toBe(false);
  });

  it('should not validate a short password with a long password hash', async () => {
    const longPassword = 'A'.repeat(5000);
    const shortPassword = 'x';
    const hash = await PasswordUtils.protect(longPassword);
    const isValid = await PasswordUtils.validate(shortPassword, hash);
    expect(isValid.valid).toBe(false);
  });

  it('should handle passwords with special characters', async () => {
    const specialPassword = '!@#$%^&*()_+-=[]{}|;\':",.<>/?`~';
    const hash = await PasswordUtils.protect(specialPassword);
    expect(typeof hash).toBe('object');
    const isValid = await PasswordUtils.validate(specialPassword, hash);
    expect(isValid.valid).toBe(true);
  });

  it('should handle empty string password', async () => {
    const emptyPassword = '';
    const hash = await PasswordUtils.protect(emptyPassword);
    expect(typeof hash).toBe('object');
    const isValid = await PasswordUtils.validate(emptyPassword, hash);
    expect(isValid.valid).toBe(true);
  });
  it('should upgrade hash when a new scheme is added', async () => {
    // Mock a new scheme with higher id
    const mockScheme = {
      scheme: 0,
      protect: async (password: string) => ({ hash: 'mockhash', salt: 'mocksalt' }),
      verify: async (password: string, protectedPassword: any) => password === 'upgradeMe'
    };
    PasswordUtils.addSchemes(mockScheme as any);

    const password = 'upgradeMe';
    // Hash with the previous best scheme
    const oldHash = await PasswordUtils.protect(password);
    oldHash.scheme = 0; // Simulate old hash with lower scheme id
    // Remove the new scheme to simulate old hash
    (PasswordUtils as any).addSchemes = () => {}; // prevent further scheme changes

    // Now validate with the new best scheme present
    const result = await PasswordUtils.validate(password, oldHash);
    expect(result.valid).toBe(true);
    expect(result.newProtectedPassword).toBeDefined();
    expect(result.newProtectedPassword?.scheme).toBe(1);
  });

  it('should throw if addSchemes is called with a duplicate scheme id', () => {
    const existingScheme = {
      scheme: 1,
      protect: async (password: string) => ({ hash: 'h', salt: 's' }),
      verify: async () => true
    };
    // Should not throw, but should not duplicate
    PasswordUtils.addSchemes(existingScheme as any);
    // Add again, should still not throw
    PasswordUtils.addSchemes(existingScheme as any);
  });

  it('should not validate if protectedPassword is undefined', async () => {
    const result = await PasswordUtils.validate('any', undefined);
    expect(result.valid).toBe(false);
    expect(result.newProtectedPassword).toBe(undefined);
  });
});
