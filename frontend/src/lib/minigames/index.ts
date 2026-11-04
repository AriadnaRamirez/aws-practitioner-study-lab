import { Network, type LucideIcon } from "lucide-react";

type Minigame = {
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
      "Lección corta: repasa las capas, ordena OSI, relaciónalo con TCP/IP y ubica tarjetas de funciones, piezas de red y servicios de AWS.",
    topic: "Redes",
    format: "Lección guiada en 4 pasos",
    minutes: 6,
    icon: Network,
  },
];
