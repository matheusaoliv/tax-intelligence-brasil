import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  const handler = () => undefined;
  const classRef = class TestController {};

  function createContext(role?: string) {
    return {
      getHandler: () => handler,
      getClass: () => classRef,
      switchToHttp: () => ({
        getRequest: () => role ? { user: { role } } : {},
      }),
    };
  }

  it('allows a role included in the route policy', () => {
    const reflector = { getAllAndOverride: () => ['OWNER', 'ADMIN'] } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    expect(guard.canActivate(createContext('ADMIN') as never)).toBe(true);
  });

  it('rejects roles outside the route policy', () => {
    const reflector = { getAllAndOverride: () => ['OWNER', 'ADMIN'] } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    expect(() => guard.canActivate(createContext('VIEWER') as never)).toThrow(ForbiddenException);
  });

  it('allows routes without a role policy after authentication', () => {
    const reflector = { getAllAndOverride: () => undefined } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    expect(guard.canActivate(createContext() as never)).toBe(true);
  });
});
