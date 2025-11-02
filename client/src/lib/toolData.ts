import { ToolCategory } from "@shared/schema";
import { Sparkles, User, Music, Award, Feather, Eye, Zap, Cloud, Focus, Palette, Hand } from "lucide-react";

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: "expansion-contraction",
    name: "Expansion & Contraction",
    description: "Core PsychoPhysical movement",
    tools: [
      { 
        name: "Expansion",
        children: ["Opening", "Widening", "Swelling", "Blooming", "Growing", "Spreading", "Enlarging", "Inflating"]
      },
      { 
        name: "Contraction",
        children: ["Closing", "Narrowing", "Deflating", "Wilting", "Shrinking", "Condensing", "Compressing", "Withdrawing"]
      },
    ],
  },
  {
    id: "qualities-of-movement",
    name: "Qualities of Movement",
    description: "Elemental and energetic qualities",
    tools: [
      { name: "Molding (Earth)", children: ["Sculpting", "Shaping", "Forming", "Compacting", "Grounding", "Settling"] },
      { name: "Flowing (Water)", children: ["Streaming", "Cascading", "Rippling", "Surging", "Dripping", "Trickling", "Pouring"] },
      { name: "Flying (Air)", children: ["Floating", "Gliding", "Soaring", "Drifting", "Swooping", "Hovering", "Fluttering"] },
      { name: "Radiating (Campfire)", children: ["Warming", "Glowing", "Flickering", "Crackling", "Pulsing"] },
      { name: "Radiating (Sunlight)", children: ["Blazing", "Roaring", "Consuming", "Spreading"] },
      { name: "Radiating (Lightning)", children: ["Striking", "Flashing", "Splitting", "Shocking", "Crackling"] },
      { name: "Radiating (Laser)", children: ["Piercing", "Cutting", "Focusing", "Beaming", "Targeting"] },
    ],
  },
  {
    id: "archetypal-gestures",
    name: "Archetypal Gestures",
    description: "Fundamental physical actions",
    tools: [
      { name: "Push", children: ["Nudge", "Shove", "Press", "Thrust", "Propel", "Drive", "Heave"] },
      { name: "Pull", children: ["Tug", "Yank", "Draw", "Haul", "Drag", "Attract", "Reel"] },
      { name: "Lift", children: ["Raise", "Hoist", "Elevate", "Uplift", "Boost", "Heave", "Suspend"] },
      { name: "Smash", children: ["Crush", "Shatter", "Pound", "Demolish", "Break", "Pulverize", "Strike"] },
      { name: "Throw", children: ["Toss", "Hurl", "Fling", "Lob", "Launch", "Cast", "Pitch"] },
      { name: "Gather", children: ["Collect", "Assemble", "Bundle", "Group", "Compile", "Harvest", "Amass"] },
      { name: "Drag", children: ["Haul", "Lug", "Trail", "Tow", "Schlep", "Pull"] },
      { name: "Tear", children: ["Rip", "Shred", "Rend", "Split", "Sever", "Cleave"] },
      { name: "Penetrate", children: ["Pierce", "Stab", "Puncture", "Bore", "Drill", "Probe"] },
      { name: "Reach", children: ["Extend", "Stretch", "Grasp", "Strain", "Yearn", "Grope"] }
    ],
  },
  {
    id: "characterization",
    name: "Characterization",
    description: "Character development techniques",
    tools: [
      { name: "Thinking", children: ["Analyzing", "Pondering", "Calculating", "Reasoning", "Deducing", "Contemplating"] },
      { name: "Feeling", children: ["Sensing", "Emoting", "Empathizing", "Reacting", "Experiencing", "Responding"] },
      { name: "Willing", children: ["Deciding", "Choosing", "Commanding", "Directing", "Initiating", "Asserting"] },
      { name: "Imaginary Body", children: ["Transforming", "Embodying", "Morphing", "Inhabiting", "Becoming"] },
      { name: "Centers", children: ["Head", "Heart", "Gut", "Groin", "Chest", "Solar Plexus"] },
      { name: "Disguises", children: ["Masking", "Concealing", "Pretending", "Adopting", "Veiling", "Assuming"] }
    ],
  },
  {
    id: "tempo-rhythm",
    name: "Tempo / Rhythm",
    description: "Rhythmic and temporal patterns",
    tools: [
      { name: "Stillness", children: ["Pausing", "Freezing", "Holding", "Waiting", "Suspending"] },
      { name: "Legato", children: ["Smooth", "Connected", "Flowing", "Continuous", "Sustained"] },
      { name: "Lyrical", children: ["Graceful", "Melodic", "Expressive", "Poetic", "Rhythmic"] },
      { name: "Staccato", children: ["Sharp", "Punctuated", "Abrupt", "Detached", "Choppy"] },
      { name: "Chaos", children: ["Erratic", "Unpredictable", "Wild", "Frenzied", "Turbulent"] }
    ],
    hasScale: true,
  },
  {
    id: "four-brothers",
    name: "Four Brothers of Art",
    description: "BEEF: Beauty, Ease, Entirety, and Form",
    tools: [
      { name: "Beauty", children: ["Elegance", "Grace", "Aesthetics", "Harmony", "Refinement"] },
      { name: "Ease", children: ["Flow", "Comfort", "Naturalness", "Effortlessness", "Fluidity"] },
      { name: "Entirety", children: ["Wholeness", "Completeness", "Totality", "Unity", "Integration"] },
      { name: "Form", children: ["Structure", "Shape", "Design", "Architecture", "Composition"] }
    ],
  },
  {
    id: "three-sisters",
    name: "3 Sisters",
    description: "Physical states and movements",
    tools: [
      { name: "Balancing", children: ["Equilibrium", "Steadying", "Centering", "Stabilizing", "Poise"] },
      { name: "Falling", children: ["Dropping", "Collapsing", "Tumbling", "Descending", "Sinking"] },
      { name: "Floating", children: ["Drifting", "Hovering", "Suspending", "Gliding", "Weightlessness"] }
    ],
  },
  {
    id: "qualities-sensations",
    name: "Qualities & Sensations",
    description: "Explore qualities and sensations",
    tools: [
      { 
        name: "Qualities", 
        children: ["Texture", "Weight", "Density", "Smoothness", "Roughness", "Hardness", "Softness", "Thickness"] 
      },
      { 
        name: "Sensations", 
        children: ["Temperature", "Vibration", "Pressure", "Tingling", "Pulsing", "Warmth", "Coolness", "Heaviness"] 
      }
    ],
  },
  {
    id: "tpt",
    name: "TPT",
    description: "Triplicity, Polarity, and Transformation",
    tools: [
      { name: "Triplicity", children: ["Beginning", "Middle", "End", "Thesis", "Antithesis", "Synthesis"] },
      { name: "Polarity", children: ["Opposition", "Duality", "Contrast", "Tension", "Balance"] },
      { name: "Transformation", children: ["Change", "Metamorphosis", "Evolution", "Conversion", "Shift"] }
    ],
  },
  {
    id: "atmosphere",
    name: "Atmosphere",
    description: "Environmental and mood qualities",
    tools: [
      { name: "Time of Day", children: ["Dawn", "Morning", "Midday", "Afternoon", "Dusk", "Night", "Midnight"] },
      { name: "Weather", children: ["Sunny", "Cloudy", "Rainy", "Stormy", "Foggy", "Windy", "Snowy"] },
      { name: "Season", children: ["Spring", "Summer", "Autumn", "Winter"] },
      { name: "Location", children: ["Indoor", "Outdoor", "Urban", "Rural", "Confined", "Expansive", "Intimate", "Public"] },
      { name: "Temperature", children: ["Hot", "Warm", "Cool", "Cold", "Freezing", "Sweltering"] }
    ],
  },
  {
    id: "focal-points",
    name: "Focal Points",
    description: "Centers of attention and energy",
    tools: [
      { name: "Eyes", children: ["Gazing", "Scanning", "Focusing", "Peripheral", "Darting", "Steady"] },
      { name: "Hands", children: ["Gesturing", "Grasping", "Touching", "Pointing", "Releasing", "Holding"] },
      { name: "Voice", children: ["Speaking", "Whispering", "Shouting", "Singing", "Humming", "Silence"] },
      { name: "Center of Gravity", children: ["High", "Middle", "Low", "Shifting", "Grounded", "Elevated"] },
      { name: "Breath", children: ["Deep", "Shallow", "Rapid", "Slow", "Held", "Released", "Panting"] }
    ],
  },
  {
    id: "style",
    name: "Style",
    description: "Performance styles and approaches",
    tools: [
      { name: "Naturalism", children: ["Realistic", "Subtle", "Everyday", "Conversational", "Understated"] },
      { name: "Expressionism", children: ["Exaggerated", "Heightened", "Emotional", "Stylized", "Symbolic"] },
      { name: "Classical", children: ["Formal", "Elevated", "Poetic", "Declamatory", "Grand"] },
      { name: "Contemporary", children: ["Modern", "Relatable", "Current", "Accessible", "Immediate"] },
      { name: "Physical Theatre", children: ["Movement-based", "Visual", "Non-verbal", "Gestural", "Kinetic"] },
      { name: "Comedy", children: ["Timing", "Playful", "Light", "Witty", "Absurd"] },
      { name: "Tragedy", children: ["Serious", "Weighty", "Profound", "Somber", "Cathartic"] }
    ],
  },
  {
    id: "psychological-gesture",
    name: "Psychological Gesture",
    description: "Internal gestures informing external action",
    tools: [
      { name: "Opening", children: ["Welcoming", "Receiving", "Embracing", "Accepting", "Inviting"] },
      { name: "Closing", children: ["Protecting", "Withdrawing", "Refusing", "Shielding", "Rejecting"] },
      { name: "Reaching", children: ["Yearning", "Desiring", "Seeking", "Striving", "Extending"] },
      { name: "Retreating", children: ["Shrinking", "Avoiding", "Escaping", "Recoiling", "Backing Away"] },
      { name: "Rising", children: ["Ascending", "Elevating", "Uplifting", "Soaring", "Transcending"] },
      { name: "Sinking", children: ["Descending", "Lowering", "Submitting", "Surrendering", "Dropping"] },
      { name: "Throwing", children: ["Casting Off", "Releasing", "Projecting", "Hurling", "Sending"] },
      { name: "Gathering", children: ["Collecting", "Accumulating", "Drawing In", "Consolidating", "Unifying"] }
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
  "atmosphere": Cloud,
  "focal-points": Focus,
  "style": Palette,
  "psychological-gesture": Hand,
};
