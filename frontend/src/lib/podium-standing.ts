import type { PodiumResponse } from "@aps/shared";

export function conceptos(n: number): string {
  return n === 1 ? "1 concepto" : `${n} conceptos`;
}

/** "de 7 jugadores" — the tail after "#6". */
export function ofPlayers(total: number): string {
  return `de ${total} ${total === 1 ? "jugador" : "jugadores"}`;
}

/** One friendly line about where the viewer stands and who is next. */
export function standingLine(data: PodiumResponse): string {
  const { me, entries } = data;
  if (me.podiumHidden) {
    return "Tu perfil está oculto del podio. Puedes mostrarlo desde Cuenta.";
  }
  if (me.rank === null) {
    return "Domina tu primer concepto para entrar al podio.";
  }
  if (me.rank === 1) {
    const second = entries.find((e) => e.rank === 2);
    if (!second) return "Vas en primer lugar.";
    const lead = me.score - second.score;
    return lead > 0
      ? `Vas en primer lugar, ${conceptos(lead)} arriba de @${second.username}.`
      : `Vas en primer lugar, empatado con @${second.username}.`;
  }
  const ahead = entries.find((e) => e.rank === (me.rank ?? 0) - 1);
  if (!ahead) return `Vas en el lugar ${me.rank}.`;
  const gap = Math.max(ahead.score - me.score + 1, 1);
  return `Domina ${conceptos(gap)} más para pasar a @${ahead.username}.`;
}
