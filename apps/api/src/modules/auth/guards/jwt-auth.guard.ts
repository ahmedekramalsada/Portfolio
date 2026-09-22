import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { timingSafeEqual } from 'node:crypto';
import { PrismaService } from '../../../prisma/prisma.service';

/**
 * Admin guard for every write endpoint.
 *
 * Two ways in:
 *   1. A machine token: `Authorization: Bearer <CONTENT_API_TOKEN>` — a long-lived
 *      token kept in the server environment, used to drive the site from scripts
 *      and tools without logging in. It acts as the owner account.
 *   2. A normal user login token (JWT), handled by the passport 'jwt' strategy.
 *
 * If CONTENT_API_TOKEN is not set, machine access is simply disabled.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const expected = process.env.CONTENT_API_TOKEN;
    const provided = this.bearerToken(request);

    if (expected && provided && this.isSameToken(provided, expected)) {
      const owner = await this.ownerAccount();
      if (!owner) {
        throw new UnauthorizedException(
          'CONTENT_API_TOKEN is set but no usable owner account exists',
        );
      }
      request.user = { id: owner.id, email: owner.email, role: owner.role };
      return true;
    }

    return (await super.canActivate(context)) as boolean;
  }

  /** Reads the bearer token from the Authorization header. */
  private bearerToken(request: any): string | null {
    const header = request?.headers?.authorization;
    if (typeof header !== 'string') return null;
    const [scheme, value] = header.split(' ');
    if (!value || scheme.toLowerCase() !== 'bearer') return null;
    return value.trim();
  }

  /** Constant-time comparison, so the token cannot be guessed by timing. */
  private isSameToken(a: string, b: string): boolean {
    const left = Buffer.from(a);
    const right = Buffer.from(b);
    if (left.length !== right.length) return false;
    return timingSafeEqual(left, right);
  }

  /**
   * The account the machine token acts as: CONTENT_API_USER_EMAIL when set,
   * otherwise the first active user. Content created with the token is
   * attributed to this account.
   */
  private async ownerAccount() {
    const email = process.env.CONTENT_API_USER_EMAIL;
    if (email) {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (user) return user;
    }
    return this.prisma.user.findFirst({
      where: { status: 'active' },
      orderBy: { createdAt: 'asc' },
    });
  }
}
