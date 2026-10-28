import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GUEST_MAX_SESSIONS, type GuestProbe } from '@aps/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GuestService {
  constructor(private readonly prisma: PrismaService) {}

  async createProbe(): Promise<GuestProbe> {
    const probe = await this.prisma.guestProbe.create({ data: {} });
    return this.toPublic(probe);
  }

  async getProbe(id: string): Promise<GuestProbe> {
    const probe = await this.prisma.guestProbe.findUnique({ where: { id } });
    if (!probe) {
      throw new NotFoundException('Prueba de invitado no encontrada');
    }
    return this.toPublic(probe);
  }

  /**
   * Record one completed marketing session for a guest.
   * Soft-capped at GUEST_MAX_SESSIONS (still returns the probe when at cap).
   */
  async recordSession(id: string): Promise<GuestProbe> {
    const probe = await this.prisma.guestProbe.findUnique({ where: { id } });
    if (!probe) {
      throw new NotFoundException('Prueba de invitado no encontrada');
    }
    if (probe.convertedUserId) {
      throw new BadRequestException(
        'Esta prueba ya se convirtió en cuenta; entra con tu usuario',
      );
    }
    if (probe.sessionsCount >= GUEST_MAX_SESSIONS) {
      return this.toPublic(probe);
    }

    const updated = await this.prisma.guestProbe.update({
      where: { id },
      data: { sessionsCount: { increment: 1 } },
    });
    return this.toPublic(updated);
  }

  /**
   * Link a guest probe to a newly registered user (idempotent if already linked
   * to the same user; ignores missing / already-converted probes).
   */
  async markConverted(probeId: string, userId: string): Promise<void> {
    const probe = await this.prisma.guestProbe.findUnique({
      where: { id: probeId },
    });
    if (!probe) return;
    if (probe.convertedUserId) return;

    const already = await this.prisma.guestProbe.findUnique({
      where: { convertedUserId: userId },
    });
    if (already) return;

    await this.prisma.guestProbe.update({
      where: { id: probeId },
      data: { convertedUserId: userId },
    });
  }

  toPublic(probe: {
    id: string;
    createdAt: Date;
    sessionsCount: number;
    convertedUserId: string | null;
  }): GuestProbe {
    return {
      id: probe.id,
      createdAt: probe.createdAt.toISOString(),
      sessionsCount: probe.sessionsCount,
      convertedUserId: probe.convertedUserId,
      sessionsRemaining: Math.max(
        0,
        GUEST_MAX_SESSIONS - probe.sessionsCount,
      ),
    };
  }
}
