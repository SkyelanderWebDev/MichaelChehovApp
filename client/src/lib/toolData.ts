import { ToolCategory } from "@shared/schema";
import { Sparkles, User, Music, Award, Feather, Eye, Zap } from "lucide-react";

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: "expansion-contraction",
    name: "Expansion & Contraction",
    description: "Core PsychoPhysical movement",
    tools: [
      "Expansion and Contraction",
    ],
  },
  {
    id: "qualities-of-movement",
    name: "Qualities of Movement",
    description: "Elemental and energetic qualities",
    tools: [
      "Molding (Earth)",
      "Flowing (Water)",
      "Flying (Air)",
      "Radiating (Campfire)",
      "Radiating (Bonfire)",
      "Radiating (Lightning)",
      "Radiating (Laser)",
    ],
  },
  {
    id: "archetypal-gestures",
    name: "Archetypal Gestures",
    description: "Fundamental physical actions",
    tools: [
      "Push",
      "Pull",
      "Lift",
      "Smash",
      "Throw",
      "Gather",
      "Drag",
      "Tear",
      "Penetrate",
      "Reach"
    ],
  },
  {
    id: "characterization",
    name: "Characterization",
    description: "Character development techniques",
    tools: [
      "Thinking",
      "Feeling",
      "Willing",
      "Imaginary Body",
      "Centers",
      "Disguises"
    ],
  },
  {
    id: "tempo-rhythm",
    name: "Tempo / Rhythm",
    description: "Rhythmic and temporal patterns",
    tools: [
      "Stillness",
      "Legato",
      "Lyrical",
      "Staccato",
      "Chaos"
    ],
    hasScale: true,
  },
  {
    id: "four-brothers",
    name: "Four Brothers of Art",
    description: "BEEF: Beauty, Ease, Entirety, and Form",
    tools: [
      "Beauty",
      "Ease",
      "Entirety",
      "Form"
    ],
  },
  {
    id: "three-sisters",
    name: "3 Sisters",
    description: "Physical states and movements",
    tools: [
      "Balancing",
      "Falling",
      "Floating"
    ],
  },
  {
    id: "qualities-sensations",
    name: "Qualities & Sensations",
    description: "Explore qualities and sensations",
    tools: [
      "Qualities & Sensations"
    ],
  },
  {
    id: "tpt",
    name: "TPT",
    description: "Triplicity, Polarity, and Transformation",
    tools: [
      "Triplicity",
      "Polarity",
      "Transformation"
    ],
  },
];

export const CATEGORY_ICONS: Record<string, any> = {
  "expansion-contraction": Sparkles,
  "qualities-of-movement": Sparkles,
  "archetypal-gestures": Sparkles,
  "characterization": User,
  "tempo-rhythm": Music,
  "four-brothers": Award,
  "three-sisters": Feather,
  "qualities-sensations": Eye,
  "tpt": Zap,
};
