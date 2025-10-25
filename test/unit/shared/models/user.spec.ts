import { describe, it, expect } from 'vitest'
import { toPublicUser, initialLoginState, initialRegisterState } from '@@/shared/models/user'

describe('User Model', () => {
  describe('toPublicUser', () => {
    it('should remove password from user object', () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword123',
        name: 'Test User',
        emailVerified: true,
        emailVerifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const publicUser = toPublicUser(user)

      expect(publicUser).not.toHaveProperty('password')
      expect(publicUser.email).toBe('test@example.com')
      expect(publicUser.name).toBe('Test User')
      expect(publicUser.id).toBe('1')
    })

    it('should keep all other user properties', () => {
      const now = new Date()
      const user = {
        id: '2',
        email: 'user@test.com',
        password: 'secret',
        name: 'John Doe',
        emailVerified: false,
        emailVerifiedAt: null,
        createdAt: now,
        updatedAt: now
      }

      const publicUser = toPublicUser(user)

      expect(publicUser.emailVerified).toBe(false)
      expect(publicUser.emailVerifiedAt).toBe(null)
      expect(publicUser.createdAt).toBe(now)
      expect(publicUser.updatedAt).toBe(now)
    })
  })

  describe('Initial States', () => {
    it('should have correct initial login state', () => {
      expect(initialLoginState).toEqual({
        email: '',
        password: ''
      })
    })

    it('should have correct initial register state', () => {
      expect(initialRegisterState).toEqual({
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
      })
    })
  })
})
