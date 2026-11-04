import { Grid3x3, type LucideIcon } from "lucide-react";
import type { KnowledgeItem } from "@aps/shared";
import { crosswordTopics } from "@/lib/minigames/crucigrama";

type Minigame = {
  /** Ruta: /minijuegos/<slug>. */
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
      "La pista dice qué es. Escribe el nombre. Si son dos palabras, el guion ya está.",
    topic: "Cualquier tema",
    format: "8 palabras",
    minutes: 6,
    icon: Grid3x3,
    topicIds: (items) => crosswordTopics(items).map((t) => t.category.id),
  },
];
