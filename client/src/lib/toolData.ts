import { ToolCategory } from "@shared/schema";
import { Sparkles, User, Music, Award, Feather, Eye, Zap, Cloud, Focus, Palette, Hand } from "lucide-react";

export const TOOL_CATEGORIES: ToolCategory[] = [
  // --- PSYCHO-PHYSICAL FAMILY ---
  {
    id: "expanding-contracting",
    name: "Expanding & Contracting",
    description: "Core PsychoPhysical movement",
    family: "psycho-physical",
    energyFlow: "what",
    tools: [
      { 
        name: "Expanding",
        children: ["Opening", "Growing", "Blossoming", "Bigger", "Oak", "Encroaching", "Amplifying", "Widening", "Increasing", "Aggrandizing", "Diffusing", "Waxing", "Ebbing"]
      },
      { 
        name: "Contracting",
        children: ["Closing", "Shrinking", "Wilting", "Smaller", "Seed", "Withdrawing", "Diminishing", "Narrowing", "Decreasing", "Belittling", "Distilling", "Waning", "Flowing"]
      },
    ],
  },
  {
    id: "qualities-of-movement",
    name: "Qualities of Movement",
    description: "The degree of resistance the movement meets",
    family: "psycho-physical",
    energyFlow: "how",
    tools: [
      { name: "Molding (Earth)", children: ["Diamond", "Solid Rock", "Granite", "Packed Earth", "Dirt", "Clay", "Wet Clay", "Sand", "Dust"] },
      { name: "Flowing (Water)", children: ["Ocean Wave", "Flood", "River Current", "Waterfall", "Stream", "Gentle Rain", "Lily on a Pond", "Morning Dew", "Tide"] },
      { name: "Flying (Air)", children: ["Heavy Pelican", "Jet Plane", "Eagle", "Hawk", "Kite", "Autumn Leaf", "Dandelion Seed", "Feather", "Smoke"] },
      { name: "Radiating (Fire)", children: ["Wildfire", "Bonfire", "Campfire", "Sacrificial Fire", "Hearth", "Torch", "Ember", "Warming", "Flickering", "Smoldering"] },
      { name: "Radiating (Sunlight)", children: ["Blazing Noon", "Golden Hour", "Dawn Light", "Morning Glow", "Dappled Warmth", "Luminous", "Quickening", "Enlivening", "Radiant"] },
      { name: "Radiating (Lightning)", children: ["Bolt", "Thunderclap", "Striking", "Flashing", "Splitting", "Surge", "Shocking", "Crackling"] },
      { name: "Radiating (Laser)", children: ["Piercing", "Cutting", "Precise", "Unwavering", "Focusing", "Beaming", "Targeting"] },
    ],
  },
  {
    id: "archetypal-gestures",
    name: "Archetypal Gestures",
    description: "Pure will — Movement + Intent = Gesture",
    family: "psycho-physical",
    energyFlow: "why",
    tools: [
      { name: "Push", children: ["Nudge", "Shove", "Press", "Thrust", "Propel", "Drive", "Heave", "Assert", "Repel", "Expel", "Brace", "Ram", "Insist", "Command"] },
      { name: "Pull", children: ["Tug", "Yank", "Draw", "Haul", "Drag", "Attract", "Reel", "Coax", "Beckon", "Summon", "Entice", "Extract", "Invite", "Magnetize"] },
      { name: "Lift", children: ["Raise", "Hoist", "Elevate", "Uplift", "Boost", "Suspend", "Exalt", "Levitate", "Offer Up", "Ascend", "Support", "Bear", "Transcend", "Consecrate"] },
      { name: "Smash", children: ["Crush", "Shatter", "Pound", "Demolish", "Break", "Pulverize", "Strike", "Obliterate", "Batter", "Rupture", "Destroy", "Hammer", "Burst", "Eradicate"] },
      { name: "Throw", children: ["Toss", "Hurl", "Fling", "Lob", "Launch", "Cast", "Pitch", "Release", "Dispatch", "Send Forth", "Catapult", "Discharge", "Project", "Emit"] },
      { name: "Gather", children: ["Collect", "Assemble", "Bundle", "Harvest", "Amass", "Embrace", "Consolidate", "Unite", "Draw Together", "Weave", "Absorb", "Accumulate", "Encompass", "Receive"] },
      { name: "Drag", children: ["Haul", "Lug", "Trail", "Tow", "Schlep", "Bear", "Carry", "Trudge", "Labor", "Resist", "Burden", "Toil", "Plod", "Endure"] },
      { name: "Tear", children: ["Rip", "Shred", "Rend", "Split", "Sever", "Cleave", "Rupture", "Fracture", "Divide", "Separate", "Lacerate", "Wrench", "Slash", "Breach"] },
      { name: "Penetrate", children: ["Pierce", "Stab", "Puncture", "Bore", "Drill", "Probe", "Enter", "Infiltrate", "Permeate", "Cut Through", "Impale", "Insinuate", "Seek", "Illuminate"] },
      { name: "Reach", children: ["Extend", "Stretch", "Grasp", "Strain", "Yearn", "Grope", "Aspire", "Seek", "Long", "Strive", "Attain", "Touch", "Bridge", "Connect"] }
    ],
  },
  // --- END PSYCHO-PHYSICAL FAMILY ---

  // --- EMOTIONAL LIFE FAMILY ---
  {
    id: "three-sisters",
    name: "Three Sister Sensations of Equilibrium",
    description: "How the body's felt relationship with gravity lives inside our emotions and language",
    family: "emotional-life",
    tools: [
      { name: "Falling", children: ["Falling to Pieces", "Falling for That Old Trick", "Falling Asleep", "Falling into Bed", "Falling in/out of Line", "Falling in Love", "Falling out of Favor", "Falling on Your Face", "Falling into a Trap", "Falling in Your Lap", "Falling Within the Limits", "Falling Behind/Below", "Falling into Ruin", "Falling Through the Cracks", "The Bottom Fell Out", "Fall Flat", "Fall from Grace"] },
      { name: "Floating", children: ["Head in the Clouds", "Spaced Out", "Airhead", "Empty-Headed", "Get a Rise out of You", "The Rising Generation", "Drifting in Sorrow", "Floating in a Sea of Grief", "Walking on Air", "Riding High", "Unmoored", "Swept Away", "Lost at Sea"] },
      { name: "Balancing", children: ["Hanging in the Balance", "On the Edge", "Walking on Pins and Needles", "Strike a Balance", "The Scales Are Still in Motion", "Balance of Power", "Balancing Out", "Teetering", "On the Brink", "Torn Between Two Choices", "Waiting for the Other Shoe to Drop", "Ready, Set...", "Standing at the Threshold", "In Limbo", "Razor's Edge", "Neck and Neck", "Moment of Truth"] }
    ],
  },
  {
    id: "qualities-sensations",
    name: "Qualities & Sensations",
    description: "Move with a Quality to awaken a Sensation that may lead to a Feeling — the body as doorway into emotional life",
    family: "emotional-life",
    tools: [
      { name: "Qualities (Colors)", children: ["Red", "Orange", "Yellow", "Gold", "Green", "Blue", "Violet", "Indigo", "Crimson", "Scarlet", "Black", "White", "Grey", "Silver", "Amber", "Ochre", "Turquoise", "Rose", "Copper", "Midnight Blue"] },
      { name: "Qualities (Textures)", children: ["Silky", "Velvety", "Rough", "Coarse", "Sticky", "Slippery", "Grainy", "Bristly", "Waxy", "Chalky", "Smooth", "Rubbery", "Leathery", "Feathery", "Spongy", "Crystalline", "Gritty", "Gossamer"] },
      { name: "Qualities (Animals)", children: ["Hawk", "Serpent", "Cat", "Bear", "Fox", "Owl", "Dolphin", "Spider", "Wolf", "Hummingbird", "Elephant", "Mouse", "Eagle", "Panther", "Crow", "Deer", "Octopus", "Swan", "Stallion", "Tortoise"] },
      { name: "Qualities (Nature)", children: ["Mist", "Stone", "Sand", "Storm", "Ice", "Moss", "Lava", "Tide", "Wind", "Swamp", "Crystal", "Smoke", "Thunder", "Rain", "Snow", "River", "Root", "Thorn", "Blossom", "Drought"] },
      { name: "Qualities (Temperature)", children: ["Freezing", "Glacial", "Cold", "Cool", "Tepid", "Warm", "Hot", "Scorching", "Feverish", "Smoldering", "Burning", "Icy", "Blistering", "Crisp", "Balmy"] },
      { name: "Qualities (Tempo & Rhythm)", children: ["Urgent", "Languid", "Frenetic", "Measured", "Hesitant", "Relentless", "Stately", "Erratic", "Syncopated", "Pulsing", "Surging", "Stuttering", "Rolling", "Driving", "Hovering"] },
      { name: "Qualities (Emotional Adverbs)", children: ["Angrily", "Ragefully", "Tenderly", "Vivaciously", "Enviously", "Defeatedly", "Melancholically", "Joyfully", "Fearfully", "Longingly", "Desperately", "Playfully", "Sorrowfully", "Triumphantly", "Timidly", "Boldly", "Mournfully", "Ecstatically", "Bitterly", "Reverently"] },
      { name: "Sensations", children: ["Danger", "Unease", "Exhilaration", "Vertigo", "Hunger", "Dread", "Safety", "Constriction", "Expansion", "Tingling", "Heaviness", "Lightness", "Nausea", "Pleasure", "Alertness", "Calm", "Agitation", "Longing", "Tenderness", "Revulsion", "Elation", "Melancholy"] },
      { name: "Feelings", children: ["Love / Joy / Happiness / Peace / Contentment", "Awe / Wonder / Amazement / Surprise", "Lust / Desire / Eroticism / Yearning / Excitation", "Sadness / Grief / Remorse", "Anger / Rage / Disgust", "Apathy / Boredom / Exhaustion / Relief", "Fear / Anxiety / Anticipation / Shame"] },
    ],
  },
  {
    id: "atmosphere",
    name: "Atmosphere",
    description: "Place + Event = Overall Atmosphere — only one OA exists at any given moment, baptize it to awaken shared sensation in the ensemble. The fish is the PA; the water is the OA. A Personal Atmosphere is the 'air' or 'essence' a character carries through any world they inhabit",
    family: "emotional-life",
    tools: [
      { name: "Overall — Nature / Natural", children: ["Pre-Storm Stillness", "Distant Thunder", "Thunderstorm", "Hard Driving Rain", "Ominous Midnight Storm", "Blizzard", "Arctic Chill", "Silent Snowy Peak", "Bright Icicled Morning", "Moonlit Winter Eve", "Moonlit Summer Eve", "Cloud-Masked Full Moon", "Cloud-Clearing Full Moon", "Warm Spring Day", "Hot Flowery Meadow", "Spring Day", "Sunset", "Sunrise", "Beach", "Ocean", "Desert", "Tiny Desert Island", "Tropical Lagoon", "Rain Forest", "Steamy Volcanic Rim", "Deep Forest", "Cave", "Garden", "Meadow", "Mountain", "River", "Wilderness", "Cemetery"] },
      { name: "Overall — Events & Occasions", children: ["Wedding", "Rehearsal Dinner", "Funeral", "Birthday Party", "Birth of a Baby", "Graduation", "High School Prom", "Bar Mitzvah", "Coronation", "Academy Awards", "Fashion Show", "Play Performance", "Luau", "Renaissance Faire", "Costume Party", "Christmas Party", "New Year's Eve Party", "4th of July Picnic", "Backyard Barbeque", "Sporting Event", "Battle", "Victory", "Defeat", "Trial", "Festival", "Ceremony", "Reunion"] },
      { name: "Overall — Architectural", children: ["Tomb", "Cathedral", "Chapel", "Castle", "Palace", "Mansion", "Elegant Hotel Suite", "First Class Resort", "Cruise Ship", "Space Station", "Planetarium", "Concert Venue", "Opera House", "Museum", "Sports Arena", "Race Track", "Skyscraper", "War Memorial", "Pyramid", "Ancient Ruins", "Zen Garden", "Log Cabin", "Ski Chalet", "Beach House", "Hospital", "Courtroom", "Prison", "Cheap Motel", "Shack", "Hut", "Outhouse", "Factory", "Mine", "Circus Tent", "Bridge", "Zoo", "Nursery", "Theatre", "Library"] },
      { name: "Overall — Emotional", children: ["Joyous", "Depressing", "Grievous", "Terrifying", "Ambiguous", "Calm", "Angry", "Trusting", "Surprised", "Friendly", "Hateful", "Confident", "Shameful", "Indignant", "Envious", "Wondering", "Amused", "Courageous", "Proud", "Humble", "Detached", "Painful", "Pleasurable", "Cautious", "Bold", "Patient", "Relaxed", "Stressed", "Hopeful", "Despairing", "Ecstatic", "Gloomy", "Dread", "Suffocating", "Isolated", "Abandoned", "Lonely", "Intimate", "Oppressive", "Mysterious"] },
      { name: "Overall — Random Images & Idioms", children: ["Walking on Eggshells", "Breaking the Ice", "Under a Cloud", "In the Spotlight", "Tip of the Iceberg", "Fish Out of Water", "Calm Before the Storm", "Storm Before the Calm", "Light at the End", "Champagne Bubbles", "Popping Popcorn", "Washing Machine", "Meat Grinder", "Snake Pit", "Cotton", "Silk", "Velvet", "Corduroy", "Hemp", "Blood Sucking"] },
      { name: "Personal — The \"-ness\" Essences", children: ["Pretentiousness", "Humbleness", "Meekness", "Kindness", "Boldness", "Bitterness", "Tenderness", "Fierceness", "Stillness", "Restlessness", "Weariness", "Eagerness", "Sadness", "Wildness", "Listlessness"] },
      { name: "Personal — The \"-ion\" Essences", children: ["Condescension", "Depression", "Erudition", "Devotion", "Desperation", "Exaltation", "Resignation", "Determination", "Adoration", "Trepidation", "Agitation", "Elation", "Obsession", "Infatuation", "Exasperation"] },
      { name: "Personal — The \"-ity\" Essences", children: ["Humility", "Futility", "Authority", "Gentility", "Stupidity", "Superiority", "Causticity", "Vitality", "Serenity", "Ferocity", "Curiosity", "Fragility", "Volatility", "Gravity", "Levity", "Audacity", "Tenacity", "Nobility"] },
      { name: "Personal — The \"-ism\" Essences", children: ["Optimism", "Pessimism", "Hedonism", "Narcissism", "Opportunism", "Perfectionism", "Idealism", "Cynicism", "Stoicism", "Romanticism", "Mysticism", "Heroism", "Fatalism", "Defeatism", "Magnetism"] },
    ],
  },
  {
    id: "four-brothers",
    name: "Four Brothers of Art",
    description: "BEEF: Beauty, Ease, Entirety, and Form",
    family: "emotional-life",
    tools: [
      { name: "Beauty", children: ["Elegance", "Grace", "Aesthetics", "Harmony", "Refinement"] },
      { name: "Ease", children: ["Flow", "Comfort", "Naturalness", "Effortlessness", "Fluidity"] },
      { name: "Entirety", children: ["Wholeness", "Completeness", "Totality", "Unity", "Integration"] },
      { name: "Form", children: ["Structure", "Shape", "Design", "Architecture", "Composition"] }
    ],
  },
  // --- END EMOTIONAL LIFE FAMILY ---

  // --- ESTHETICS FAMILY ---
  // NOTE: Ensemble, Truth, and Style also support a "Creative Question" mode
  // (1-3 coaching questions instead of a random draw) — deferred to Phase 2.
  // Diamond of Truth facets 6 (Individual Truth) and 7 (Personal Truth) are also
  // deferred to Creative Question mode — they require reflection, not random draw.
  {
    id: "ensemble",
    name: "Ensemble",
    description: "The art of group creation — listening, yielding, leading, and playing as one organism",
    family: "esthetics",
    tools: [
      { name: "Listening", children: ["Active Listening", "Responding", "Being Present", "Tuning In", "Awareness"] },
      { name: "Supporting", children: ["Enabling", "Uplifting", "Backing", "Assisting", "Reinforcing"] },
      { name: "Leading", children: ["Guiding", "Initiating", "Directing", "Inspiring", "Taking Charge"] },
      { name: "Following", children: ["Yielding", "Trusting", "Joining", "Adapting", "Accepting"] },
      { name: "Mirroring", children: ["Reflecting", "Echoing", "Matching", "Synchronizing", "Resonating"] },
      { name: "Contrasting", children: ["Opposing", "Balancing", "Differentiating", "Countering", "Juxtaposing"] }
    ],
  },
  {
    id: "truth",
    name: "Truth",
    description: "The Diamond of Truth — nine interlocking facets of theatrical reality an actor must honor simultaneously",
    family: "esthetics",
    tools: [
      { name: "Stylistic Truth", children: ["Contemporary Realism", "Classical Verse", "Avant-Garde", "Experimental", "Story Theatre", "Epic", "Absurdist", "Poetic Naturalism", "Heightened Reality", "Magical Realism"] },
      { name: "Historical, Cultural & National Truth", children: ["Ancient Greek", "Roman", "Medieval European", "Renaissance Italian", "Elizabethan / Jacobean", "Restoration", "Georgian", "Victorian", "Edwardian", "1920s–30s", "Post-War", "Contemporary", "Japanese", "Indian Classical", "West African", "Latin American"] },
      { name: "Truth of the Given Circumstances", children: ["Who am I?", "Where am I?", "What time is it?", "What do I want?", "Why do I want it?", "What is my obstacle?", "What just happened?", "What are the stakes?"] },
      { name: "Truth of the Character", children: ["Inner Life", "Physical Life", "Biography", "Psychology", "Desires", "Fears", "Secrets", "Contradictions", "Social Mask", "True Self"] },
      { name: "Truth of the Relationship", children: ["Status Dynamic", "Shared History", "Unspoken Desire", "Power Balance", "Attraction", "Rivalry", "Dependence", "Betrayal", "Trust", "Need"] },
      // Facet 6 — Individual Truth: deferred to Creative Question mode (Phase 2)
      // Facet 7 — Personal Truth: deferred to Creative Question mode (Phase 2)
      { name: "Truth of Reality vs. Pretend", children: ["The Magic If", "As If", "The Fourth Wall", "Stage Reality", "Character Reality", "Theatrical Convention", "Pretend Within Pretend", "Real Emotion / Pretend Circumstance"] },
      { name: "Truth of the Mise en Scène", children: ["The Space", "Objects & Props", "Light & Shadow", "Sound & Music", "Costume & Mask", "Set Architecture", "Blocking & Composition", "Sight Lines", "Levels", "Proximity"] },
    ],
  },
  {
    id: "style",
    name: "Style",
    description: "The esthetic form the work inhabits — genre, period, physicality, and mannerism",
    family: "esthetics",
    tools: [
      { name: "Style — Genres", children: ["Naturalism", "Realism", "Expressionism", "Absurdism", "Epic Theatre", "Documentary", "Story Theatre", "Musical Theatre", "Opera", "Dance Theatre", "Physical Theatre", "Devised Theatre", "Immersive", "Commedia dell'Arte"] },
      { name: "Style — Time Periods", children: ["Ancient Greek", "Roman", "Medieval", "Renaissance", "Elizabethan / Jacobean", "Restoration", "Georgian / Neo-Classical", "Romantic", "Victorian", "Edwardian", "1920s–30s", "Post-War", "Contemporary"] },
      { name: "Style — Physicality & Posture", children: ["Upright & Formal", "Relaxed & Casual", "Elevated & Grand", "Compressed & Internal", "Open & Expansive", "Grounded & Heavy", "Light & Lifted", "Asymmetric", "Rigid", "Fluid"] },
      { name: "Style — Mannerisms", children: ["Deliberate Gesture", "Habitual Tic", "Social Affectation", "Class Marker", "Period Convention", "Comic Business", "Tragic Weight", "Rhythmic Pattern", "Verbal Tic", "Signature Walk"] },
    ],
  },
  // --- END ESTHETICS FAMILY ---

  // --- CHARACTERIZATION FAMILY ---
  {
    id: "movable-centers",
    name: "Movable Centers",
    description: "A psycho-physical focal point whose Location, Quality, and Mobility shape the entire character's way of being",
    family: "characterization",
    tools: [
      { name: "Location", children: ["Head", "Crown", "Forehead", "Eyes", "Throat", "Heart", "Sternum", "Solar Plexus", "Gut", "Pelvis", "Spine", "Lower Back", "Right Hand", "Left Hand", "Fingertips", "Feet", "Knees", "Shoulders", "Just Above the Head", "In Front of the Face", "Behind the Back", "In Your Partner", "Between You and Your Partner"] },
      { name: "Quality", children: ["Warm", "Cool", "Buzzing", "Heavy", "Light", "Sharp", "Tingling", "Glowing", "Rough", "Icy", "Golden Ball", "Crystal", "Ember", "Magnet", "Soap Bubble", "Diamond", "Dark Void", "Candle Flame", "Hawk", "Serpent", "Hummingbird", "Spider"] },
      { name: "Mobility", children: ["Stationary", "Rooted", "Grounded", "Anchored", "Spinning", "Pulsing", "Shooting", "Traveling", "Drifting", "Oscillating", "Radiating", "Expanding", "Vibrating", "Flickering", "Hovering", "Orbiting", "Surging", "Undulating"] },
    ],
  },
  {
    id: "imaginary-body",
    name: "Imaginary Body",
    description: "Step into any body you can imagine — draw a Body Part scope, then a Substance, Form, or Kingdom. Archetypal Characters are always full body.",
    family: "characterization",
    tools: [
      { name: "Body Part", scope: "both", children: ["Full Body", "Head", "Neck", "Chest", "Right Arm", "Left Arm", "Right Hand", "Left Hand", "Torso / Core", "Spine", "Hips", "Right Leg", "Left Leg", "Right Foot", "Left Foot"] },
      { name: "Substances", scope: "both", children: ["Jelly", "Springs", "Plastic", "Metal", "Rubber", "Glass", "Wood", "Stone", "Lead", "Silk", "Sponge", "Honey", "Ice", "Smoke", "Cotton", "Liquid Mercury", "Wet Sand", "Rope", "Wax", "Foam", "Concrete", "Feathers"] },
      { name: "Simple Forms", scope: "both", children: ["Ball", "Spiral", "Cylinder", "Pendulum", "Pyramid", "Ribbon", "Cube", "Wheel", "Cone", "Accordion", "Hinge", "Lever", "Gyroscope", "Lemniscate"] },
      { name: "Mineral Kingdom", scope: "both", children: ["Crystal", "Diamond", "Obsidian", "Granite", "Quartz", "Lava Rock", "Stalactite", "Geode", "Glacier", "Marble", "Flint", "Copper", "Iron Ore", "Coal", "Salt Flat"] },
      { name: "Plant Kingdom", scope: "both", children: ["Oak Tree", "Weeping Willow", "Vine", "Rose", "Grass", "Root", "Thorn", "Seed", "Fern", "Kelp", "Cactus", "Bamboo", "Sunflower", "Moss", "Mushroom", "Lotus", "Ivy", "Blossom"] },
      { name: "Animal Kingdom", scope: "both", children: ["Hawk", "Serpent", "Cat", "Bear", "Spider", "Dolphin", "Elephant", "Wolf", "Crow", "Deer", "Octopus", "Swan", "Stallion", "Tortoise", "Hummingbird", "Panther", "Fox", "Eagle", "Owl", "Jellyfish"] },
      { name: "Archetypal Characters", scope: "full-body", children: ["Parent", "Healer", "Teacher", "Orphan", "Lover", "Thief", "Warrior", "Ruler", "Fool / Jester", "Sage", "Mystic", "Rebel", "Child", "Elder", "Trickster", "Creator", "Outcast", "Merchant", "Priest / Priestess", "Servant", "Hero", "Villain", "Scholar", "Guardian"] },
    ],
  },
  {
    id: "trinity-of-psychology",
    name: "Trinity of Psychology",
    description: "The three faculties of the human soul — Thinking, Feeling, and Willing",
    family: "characterization",
    tools: [
      { name: "Thinking", children: ["Analytic", "Abstract", "Divergent", "Idealistic", "Artistic", "Reflective", "Conceptual", "Convergent", "Symbolic", "Musical", "Distracted", "Witty", "Clever", "Dumb / Stupid", "Slow", "Fast", "Chaotic", "Rhythmic", "Big Picture", "Detailed", "Illogical", "Erratic", "Anxious", "Phobic", "Depressed", "Spacey"] },
      { name: "Feeling", children: ["Hypersensitive", "Numb", "Empathic", "Thick-Skinned", "Raw", "Guarded", "Expressive", "Stoic", "Repressed", "Theatrical", "Explosive", "Understated", "Contained", "Effusive", "Hair-Trigger", "Reactive", "Slow-Burning", "Sledgehammer", "Impulsive", "Measured", "Quick-Release", "Lingering", "Stewing", "Cathartic", "Festering"] },
      { name: "Willing", children: ["Fierce", "Faint", "Steadfast", "Mercurial", "Relentless", "Forward-Driving", "Retreating", "Staccato", "Legato", "Feeling-Led", "Thinking-Led", "Self-Willed", "Principled", "Ruthless", "Swift", "Glacial", "Anticipatory", "Unresponsive", "Domineering", "Laissez-faire", "Magnanimous", "Withholding", "Laser-Focused", "Dispersed"] },
    ],
  },
  // --- END CHARACTERIZATION FAMILY ---

  // --- TRANSFORMATION FAMILY ---
  {
    id: "tempo-rhythm",
    name: "Tempo / Rhythm",
    description: "Rhythmic and temporal patterns",
    family: "transformation",
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
    id: "focal-points",
    name: "Focal Points of Concentration",
    description: "Where attention lives determines what is real",
    family: "transformation",
    tools: [
      { name: "1 (Me)", children: ["Self-Focus", "Inner Awareness", "Personal Center", "My Body", "My Thoughts", "My Feelings"] },
      { name: "2 (You/Partner)", children: ["Eye Contact", "Connecting", "Engaging", "Responding", "Listening", "Observing Partner"] },
      { name: "3 (Here/Physical Environment)", children: ["Space", "Objects", "Surroundings", "Physical Reality", "Present Location", "Immediate Area"] },
      { name: "4 (Not Here/Mental Screen)", children: ["Imagination", "Memory", "Visualization", "Inner Vision", "Mental Picture", "Distant Place"] },
      { name: "5 (All/Nowhere/Void)", children: ["Everything", "Nothing", "Universe", "Emptiness", "Infinity", "Totality", "Beyond"] }
    ],
  },
  // Phase 2 stub — Radiating & Receiving is a Creative Question category (see note below)
  // --- END TRANSFORMATION FAMILY ---

  // ================================================================
  // PHASE 2 — CREATIVE QUESTIONS (NOT FOR THE FRIDAY SPRINT)
  // ================================================================
  // The following categories require the "Creative Question" interaction
  // mode — a series of 1-3 coaching prompts instead of a random draw.
  // Do NOT build these into the draw system for the Friday prototype.
  //
  // Deferred categories:
  //   - Radiating & Receiving (Transformation family)
  //   - Psychological Gesture (PG)
  //   - Objectives ("What for?")
  //   - Improvisation / Jewelry
  //   - TPT (Triplicity, Polarity, Transformation)
  //   - Disguises & Masks (Characterization family)
  //   - Feeling / Trinity of Psychology (rife for Creative Questions — sensitivity,
  //     expressiveness, trigger speed, release speed, emotional PA)
  //   - Diamond of Truth: Facet 6 — Individual Truth
  //   - Diamond of Truth: Facet 7 — Personal Truth
  // ================================================================
];

export const CATEGORY_ICONS: Record<string, any> = {
  "expanding-contracting": Sparkles,
  "qualities-of-movement": Sparkles,
  "archetypal-gestures": Sparkles,
  "trinity-of-psychology": User,
  "movable-centers": User,
  "imaginary-body": User,
  "tempo-rhythm": Music,
  "four-brothers": Award,
  "three-sisters": Feather,
  "qualities-sensations": Eye,
  "atmosphere": Cloud,
  "focal-points": Focus,
  "style": Palette,
  "ensemble": User,
  "truth": Sparkles,
};
