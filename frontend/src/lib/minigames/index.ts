import { Grid3x3, Handshake, PiggyBank, type LucideIcon } from "lucide-react";
import type { KnowledgeItem } from "@aps/shared";
import { crosswordTopics } from "@/lib/minigames/crucigrama";

type Minigame = {
  /** Ruta: /minijuegos/<slug>. Crea la carpeta con el mismo nombre en app/(app)/minijuegos. */
  slug: string;
  title: string;
  description: string;
  topic: string;
  format: string;
  minutes: number;
  icon: LucideIcon;
  /** For games played per topic: the topics that count toward "completed". */
  topicIds?: (items: readonly KnowledgeItem[]) => string[];
};

export const MINIGAMES: readonly Minigame[] = [
  {
    slug: "crucigrama",
    title: "Crucigrama",
    description:
      "Lee la definición y escribe el nombre del servicio o concepto. Algunas letras vienen de pista.",
    topic: "Cualquier tema",
    format: "8 palabras",
    minutes: 6,
    icon: Grid3x3,
    topicIds: (items) => crosswordTopics(items).map((t) => t.category.id),
  },
  {
    slug: "quien-se-encarga",
    title: "¿Quién se encarga?",
    description:
      "Modelo de responsabilidad compartida: decide si cada tarea es de AWS o tuya.",
    topic: "Conceptos de la nube",
    format: "10 tareas",
    minutes: 4,
    icon: Handshake,
  },
  {
    slug: "cuanto-pagas",
    title: "¿Cuánto pagas?",
    description:
      "On-Demand, Reserved, Savings Plans, Spot o Dedicated Hosts: elige el modelo de precios para cada caso.",
    topic: "Precios",
    format: "10 casos",
    minutes: 5,
    icon: PiggyBank,
  },
];
