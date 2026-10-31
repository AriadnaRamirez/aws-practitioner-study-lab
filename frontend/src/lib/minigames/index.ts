import { Network, type LucideIcon } from "lucide-react";

export type Minigame = {
  /** Ruta: /minijuegos/<slug>. Crea la carpeta con el mismo nombre en app/(app)/minijuegos. */
  slug: string;
  title: string;
  description: string;
  topic: string;
  format: string;
  minutes: number;
  icon: LucideIcon;
};

export const MINIGAMES: readonly Minigame[] = [
  {
    slug: "osi-vs-tcp-ip",
    title: "OSI vs TCP/IP",
    description:
      "Lección paso a paso: aprende las capas, ordénalas, relaciona OSI con TCP/IP y ubica qué hace cada una, su pieza física y su servicio de AWS.",
    topic: "Redes",
    format: "Lección guiada en 7 pasos",
    minutes: 12,
    icon: Network,
  },
];

export function minigameBySlug(slug: string): Minigame | undefined {
  return MINIGAMES.find((g) => g.slug === slug);
}
