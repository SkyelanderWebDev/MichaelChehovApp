import type { PracticeToolComponent, PracticeToolSelection } from '@/types/practice';
import { CHART_CATEGORIES, type ChartCategory } from './circleChartCatalog';

export interface WeekendTool {
  name: string;
  children: readonly string[];
  scope?: 'full-body' | 'parts' | 'both';
}

export interface WeekendToolCategory {
  categoryId: string;
  tools: readonly WeekendTool[];
  hasScale?: boolean;
}

// Full source-label taxonomy copied verbatim from client/src/lib/toolData.ts.
// Labels only; no generated embodied practice prompts.
export const WEEKEND_TOOL_CATALOG: readonly WeekendToolCategory[] = [
  {
    categoryId: 'expanding-contracting',
    tools: [
      { name: 'Expanding', children: ['Opening', 'Growing', 'Blossoming', 'Bigger', 'Oak', 'Encroaching', 'Amplifying', 'Widening', 'Increasing', 'Aggrandizing', 'Diffusing', 'Waxing', 'Ebbing'] },
      { name: 'Contracting', children: ['Closing', 'Shrinking', 'Wilting', 'Smaller', 'Seed', 'Withdrawing', 'Diminishing', 'Narrowing', 'Decreasing', 'Belittling', 'Distilling', 'Waning', 'Flowing'] },
    ],
  },
  {
    categoryId: 'qualities-of-movement',
    tools: [
      { name: 'Molding (Earth)', children: ['Diamond', 'Solid Rock', 'Granite', 'Packed Earth', 'Dirt', 'Clay', 'Wet Clay', 'Sand', 'Dust'] },
      { name: 'Flowing (Water)', children: ['Ocean Wave', 'Flood', 'River Current', 'Waterfall', 'Stream', 'Gentle Rain', 'Lily on a Pond', 'Morning Dew', 'Tide'] },
      { name: 'Flying (Air)', children: ['Heavy Pelican', 'Jet Plane', 'Eagle', 'Hawk', 'Kite', 'Autumn Leaf', 'Dandelion Seed', 'Feather', 'Smoke'] },
      { name: 'Radiating (Fire)', children: ['Wildfire', 'Bonfire', 'Campfire', 'Sacrificial Fire', 'Hearth', 'Torch', 'Ember', 'Warming', 'Flickering', 'Smoldering'] },
      { name: 'Radiating (Sunlight)', children: ['Blazing Noon', 'Golden Hour', 'Dawn Light', 'Morning Glow', 'Dappled Warmth', 'Luminous', 'Quickening', 'Enlivening', 'Radiant'] },
      { name: 'Radiating (Lightning)', children: ['Bolt', 'Thunderclap', 'Striking', 'Flashing', 'Splitting', 'Surge', 'Shocking', 'Crackling'] },
      { name: 'Radiating (Laser)', children: ['Piercing', 'Cutting', 'Precise', 'Unwavering', 'Focusing', 'Beaming', 'Targeting'] },
    ],
  },
  {
    categoryId: 'archetypal-gestures',
    tools: [
      { name: 'Push', children: ['Nudge', 'Shove', 'Press', 'Thrust', 'Propel', 'Drive', 'Heave', 'Assert', 'Repel', 'Expel', 'Brace', 'Ram', 'Insist', 'Command'] },
      { name: 'Pull', children: ['Tug', 'Yank', 'Draw', 'Haul', 'Drag', 'Attract', 'Reel', 'Coax', 'Beckon', 'Summon', 'Entice', 'Extract', 'Invite', 'Magnetize'] },
      { name: 'Lift', children: ['Raise', 'Hoist', 'Elevate', 'Uplift', 'Boost', 'Suspend', 'Exalt', 'Levitate', 'Offer Up', 'Ascend', 'Support', 'Bear', 'Transcend', 'Consecrate'] },
      { name: 'Smash', children: ['Crush', 'Shatter', 'Pound', 'Demolish', 'Break', 'Pulverize', 'Strike', 'Obliterate', 'Batter', 'Rupture', 'Destroy', 'Hammer', 'Burst', 'Eradicate'] },
      { name: 'Throw', children: ['Toss', 'Hurl', 'Fling', 'Lob', 'Launch', 'Cast', 'Pitch', 'Release', 'Dispatch', 'Send Forth', 'Catapult', 'Discharge', 'Project', 'Emit'] },
      { name: 'Gather', children: ['Collect', 'Assemble', 'Bundle', 'Harvest', 'Amass', 'Embrace', 'Consolidate', 'Unite', 'Draw Together', 'Weave', 'Absorb', 'Accumulate', 'Encompass', 'Receive'] },
      { name: 'Drag', children: ['Haul', 'Lug', 'Trail', 'Tow', 'Schlep', 'Bear', 'Carry', 'Trudge', 'Labor', 'Resist', 'Burden', 'Toil', 'Plod', 'Endure'] },
      { name: 'Tear', children: ['Rip', 'Shred', 'Rend', 'Split', 'Sever', 'Cleave', 'Rupture', 'Fracture', 'Divide', 'Separate', 'Lacerate', 'Wrench', 'Slash', 'Breach'] },
      { name: 'Penetrate', children: ['Pierce', 'Stab', 'Puncture', 'Bore', 'Drill', 'Probe', 'Enter', 'Infiltrate', 'Permeate', 'Cut Through', 'Impale', 'Insinuate', 'Seek', 'Illuminate'] },
      { name: 'Reach', children: ['Extend', 'Stretch', 'Grasp', 'Strain', 'Yearn', 'Grope', 'Aspire', 'Seek', 'Long', 'Strive', 'Attain', 'Touch', 'Bridge', 'Connect'] },
    ],
  },
  {
    categoryId: 'three-sisters',
    tools: [
      { name: 'Falling', children: ['Falling to Pieces', 'Falling for That Old Trick', 'Falling Asleep', 'Falling into Bed', 'Falling in/out of Line', 'Falling in Love', 'Falling out of Favor', 'Falling on Your Face', 'Falling into a Trap', 'Falling in Your Lap', 'Falling Within the Limits', 'Falling Behind/Below', 'Falling into Ruin', 'Falling Through the Cracks', 'The Bottom Fell Out', 'Fall Flat', 'Fall from Grace'] },
      { name: 'Floating', children: ['Head in the Clouds', 'Spaced Out', 'Airhead', 'Empty-Headed', 'Get a Rise out of You', 'The Rising Generation', 'Drifting in Sorrow', 'Floating in a Sea of Grief', 'Walking on Air', 'Riding High', 'Unmoored', 'Swept Away', 'Lost at Sea'] },
      { name: 'Balancing', children: ['Hanging in the Balance', 'On the Edge', 'Walking on Pins and Needles', 'Strike a Balance', 'The Scales Are Still in Motion', 'Balance of Power', 'Balancing Out', 'Teetering', 'On the Brink', 'Torn Between Two Choices', 'Waiting for the Other Shoe to Drop', 'Ready, Set...', 'Standing at the Threshold', 'In Limbo', 'Razor\'s Edge', 'Neck and Neck', 'Moment of Truth'] },
    ],
  },
  {
    categoryId: 'qualities-sensations',
    tools: [
      { name: 'Qualities (Colors)', children: ['Red', 'Orange', 'Yellow', 'Gold', 'Green', 'Blue', 'Violet', 'Indigo', 'Crimson', 'Scarlet', 'Black', 'White', 'Grey', 'Silver', 'Amber', 'Ochre', 'Turquoise', 'Rose', 'Copper', 'Midnight Blue'] },
      { name: 'Qualities (Textures)', children: ['Silky', 'Velvety', 'Rough', 'Coarse', 'Sticky', 'Slippery', 'Grainy', 'Bristly', 'Waxy', 'Chalky', 'Smooth', 'Rubbery', 'Leathery', 'Feathery', 'Spongy', 'Crystalline', 'Gritty', 'Gossamer'] },
      { name: 'Qualities (Animals)', children: ['Hawk', 'Serpent', 'Cat', 'Bear', 'Fox', 'Owl', 'Dolphin', 'Spider', 'Wolf', 'Hummingbird', 'Elephant', 'Mouse', 'Eagle', 'Panther', 'Crow', 'Deer', 'Octopus', 'Swan', 'Stallion', 'Tortoise'] },
      { name: 'Qualities (Nature)', children: ['Mist', 'Stone', 'Sand', 'Storm', 'Ice', 'Moss', 'Lava', 'Tide', 'Wind', 'Swamp', 'Crystal', 'Smoke', 'Thunder', 'Rain', 'Snow', 'River', 'Root', 'Thorn', 'Blossom', 'Drought'] },
      { name: 'Qualities (Temperature)', children: ['Freezing', 'Glacial', 'Cold', 'Cool', 'Tepid', 'Warm', 'Hot', 'Scorching', 'Feverish', 'Smoldering', 'Burning', 'Icy', 'Blistering', 'Crisp', 'Balmy'] },
      { name: 'Qualities (Tempo & Rhythm)', children: ['Urgent', 'Languid', 'Frenetic', 'Measured', 'Hesitant', 'Relentless', 'Stately', 'Erratic', 'Syncopated', 'Pulsing', 'Surging', 'Stuttering', 'Rolling', 'Driving', 'Hovering'] },
      { name: 'Qualities (Emotional Adverbs)', children: ['Angrily', 'Ragefully', 'Tenderly', 'Vivaciously', 'Enviously', 'Defeatedly', 'Melancholically', 'Joyfully', 'Fearfully', 'Longingly', 'Desperately', 'Playfully', 'Sorrowfully', 'Triumphantly', 'Timidly', 'Boldly', 'Mournfully', 'Ecstatically', 'Bitterly', 'Reverently'] },
      { name: 'Sensations', children: ['Danger', 'Unease', 'Exhilaration', 'Vertigo', 'Hunger', 'Dread', 'Safety', 'Constriction', 'Expansion', 'Tingling', 'Heaviness', 'Lightness', 'Nausea', 'Pleasure', 'Alertness', 'Calm', 'Agitation', 'Longing', 'Tenderness', 'Revulsion', 'Elation', 'Melancholy'] },
      { name: 'Feelings', children: ['Love / Joy / Happiness / Peace / Contentment', 'Awe / Wonder / Amazement / Surprise', 'Lust / Desire / Eroticism / Yearning / Excitation', 'Sadness / Grief / Remorse', 'Anger / Rage / Disgust', 'Apathy / Boredom / Exhaustion / Relief', 'Fear / Anxiety / Anticipation / Shame'] },
    ],
  },
  {
    categoryId: 'atmosphere',
    tools: [
      { name: 'Overall — Nature / Natural', children: ['Pre-Storm Stillness', 'Distant Thunder', 'Thunderstorm', 'Hard Driving Rain', 'Ominous Midnight Storm', 'Blizzard', 'Arctic Chill', 'Silent Snowy Peak', 'Bright Icicled Morning', 'Moonlit Winter Eve', 'Moonlit Summer Eve', 'Cloud-Masked Full Moon', 'Cloud-Clearing Full Moon', 'Warm Spring Day', 'Hot Flowery Meadow', 'Spring Day', 'Sunset', 'Sunrise', 'Beach', 'Ocean', 'Desert', 'Tiny Desert Island', 'Tropical Lagoon', 'Rain Forest', 'Steamy Volcanic Rim', 'Deep Forest', 'Cave', 'Garden', 'Meadow', 'Mountain', 'River', 'Wilderness', 'Cemetery'] },
      { name: 'Overall — Events & Occasions', children: ['Wedding', 'Rehearsal Dinner', 'Funeral', 'Birthday Party', 'Birth of a Baby', 'Graduation', 'High School Prom', 'Bar Mitzvah', 'Coronation', 'Academy Awards', 'Fashion Show', 'Play Performance', 'Luau', 'Renaissance Faire', 'Costume Party', 'Christmas Party', 'New Year\'s Eve Party', '4th of July Picnic', 'Backyard Barbeque', 'Sporting Event', 'Battle', 'Victory', 'Defeat', 'Trial', 'Festival', 'Ceremony', 'Reunion'] },
      { name: 'Overall — Architectural', children: ['Tomb', 'Cathedral', 'Chapel', 'Castle', 'Palace', 'Mansion', 'Elegant Hotel Suite', 'First Class Resort', 'Cruise Ship', 'Space Station', 'Planetarium', 'Concert Venue', 'Opera House', 'Museum', 'Sports Arena', 'Race Track', 'Skyscraper', 'War Memorial', 'Pyramid', 'Ancient Ruins', 'Zen Garden', 'Log Cabin', 'Ski Chalet', 'Beach House', 'Hospital', 'Courtroom', 'Prison', 'Cheap Motel', 'Shack', 'Hut', 'Outhouse', 'Factory', 'Mine', 'Circus Tent', 'Bridge', 'Zoo', 'Nursery', 'Theatre', 'Library'] },
      { name: 'Overall — Emotional', children: ['Joyous', 'Depressing', 'Grievous', 'Terrifying', 'Ambiguous', 'Calm', 'Angry', 'Trusting', 'Surprised', 'Friendly', 'Hateful', 'Confident', 'Shameful', 'Indignant', 'Envious', 'Wondering', 'Amused', 'Courageous', 'Proud', 'Humble', 'Detached', 'Painful', 'Pleasurable', 'Cautious', 'Bold', 'Patient', 'Relaxed', 'Stressed', 'Hopeful', 'Despairing', 'Ecstatic', 'Gloomy', 'Dread', 'Suffocating', 'Isolated', 'Abandoned', 'Lonely', 'Intimate', 'Oppressive', 'Mysterious'] },
      { name: 'Overall — Random Images & Idioms', children: ['Walking on Eggshells', 'Breaking the Ice', 'Under a Cloud', 'In the Spotlight', 'Tip of the Iceberg', 'Fish Out of Water', 'Calm Before the Storm', 'Storm Before the Calm', 'Light at the End', 'Champagne Bubbles', 'Popping Popcorn', 'Washing Machine', 'Meat Grinder', 'Snake Pit', 'Cotton', 'Silk', 'Velvet', 'Corduroy', 'Hemp', 'Blood Sucking'] },
      { name: 'Personal — The "-ness" Essences', children: ['Pretentiousness', 'Humbleness', 'Meekness', 'Kindness', 'Boldness', 'Bitterness', 'Tenderness', 'Fierceness', 'Stillness', 'Restlessness', 'Weariness', 'Eagerness', 'Sadness', 'Wildness', 'Listlessness'] },
      { name: 'Personal — The "-ion" Essences', children: ['Condescension', 'Depression', 'Erudition', 'Devotion', 'Desperation', 'Exaltation', 'Resignation', 'Determination', 'Adoration', 'Trepidation', 'Agitation', 'Elation', 'Obsession', 'Infatuation', 'Exasperation'] },
      { name: 'Personal — The "-ity" Essences', children: ['Humility', 'Futility', 'Authority', 'Gentility', 'Stupidity', 'Superiority', 'Causticity', 'Vitality', 'Serenity', 'Ferocity', 'Curiosity', 'Fragility', 'Volatility', 'Gravity', 'Levity', 'Audacity', 'Tenacity', 'Nobility'] },
      { name: 'Personal — The "-ism" Essences', children: ['Optimism', 'Pessimism', 'Hedonism', 'Narcissism', 'Opportunism', 'Perfectionism', 'Idealism', 'Cynicism', 'Stoicism', 'Romanticism', 'Mysticism', 'Heroism', 'Fatalism', 'Defeatism', 'Magnetism'] },
    ],
  },
  {
    categoryId: 'four-brothers',
    tools: [
      { name: 'Beauty', children: ['Elegance', 'Grace', 'Aesthetics', 'Harmony', 'Refinement'] },
      { name: 'Ease', children: ['Flow', 'Comfort', 'Naturalness', 'Effortlessness', 'Fluidity'] },
      { name: 'Entirety', children: ['Wholeness', 'Completeness', 'Totality', 'Unity', 'Integration'] },
      { name: 'Form', children: ['Structure', 'Shape', 'Design', 'Architecture', 'Composition'] },
    ],
  },
  {
    categoryId: 'ensemble',
    tools: [
      { name: 'Listening', children: ['Active Listening', 'Responding', 'Being Present', 'Tuning In', 'Awareness'] },
      { name: 'Supporting', children: ['Enabling', 'Uplifting', 'Backing', 'Assisting', 'Reinforcing'] },
      { name: 'Leading', children: ['Guiding', 'Initiating', 'Directing', 'Inspiring', 'Taking Charge'] },
      { name: 'Following', children: ['Yielding', 'Trusting', 'Joining', 'Adapting', 'Accepting'] },
      { name: 'Mirroring', children: ['Reflecting', 'Echoing', 'Matching', 'Synchronizing', 'Resonating'] },
      { name: 'Contrasting', children: ['Opposing', 'Balancing', 'Differentiating', 'Countering', 'Juxtaposing'] },
    ],
  },
  {
    categoryId: 'truth',
    tools: [
      { name: 'Stylistic Truth', children: ['Contemporary Realism', 'Classical Verse', 'Avant-Garde', 'Experimental', 'Story Theatre', 'Epic', 'Absurdist', 'Poetic Naturalism', 'Heightened Reality', 'Magical Realism'] },
      { name: 'Historical, Cultural & National Truth', children: ['Ancient Greek', 'Roman', 'Medieval European', 'Renaissance Italian', 'Elizabethan / Jacobean', 'Restoration', 'Georgian', 'Victorian', 'Edwardian', '1920s–30s', 'Post-War', 'Contemporary', 'Japanese', 'Indian Classical', 'West African', 'Latin American'] },
      { name: 'Truth of the Given Circumstances', children: ['Who am I?', 'Where am I?', 'What time is it?', 'What do I want?', 'Why do I want it?', 'What is my obstacle?', 'What just happened?', 'What are the stakes?'] },
      { name: 'Truth of the Character', children: ['Inner Life', 'Physical Life', 'Biography', 'Psychology', 'Desires', 'Fears', 'Secrets', 'Contradictions', 'Social Mask', 'True Self'] },
      { name: 'Truth of the Relationship', children: ['Status Dynamic', 'Shared History', 'Unspoken Desire', 'Power Balance', 'Attraction', 'Rivalry', 'Dependence', 'Betrayal', 'Trust', 'Need'] },
      { name: 'Truth of Reality vs. Pretend', children: ['The Magic If', 'As If', 'The Fourth Wall', 'Stage Reality', 'Character Reality', 'Theatrical Convention', 'Pretend Within Pretend', 'Real Emotion / Pretend Circumstance'] },
      { name: 'Truth of the Mise en Scène', children: ['The Space', 'Objects & Props', 'Light & Shadow', 'Sound & Music', 'Costume & Mask', 'Set Architecture', 'Blocking & Composition', 'Sight Lines', 'Levels', 'Proximity'] },
    ],
  },
  {
    categoryId: 'style',
    tools: [
      { name: 'Style — Genres', children: ['Naturalism', 'Realism', 'Expressionism', 'Absurdism', 'Epic Theatre', 'Documentary', 'Story Theatre', 'Musical Theatre', 'Opera', 'Dance Theatre', 'Physical Theatre', 'Devised Theatre', 'Immersive', 'Commedia dell\'Arte'] },
      { name: 'Style — Time Periods', children: ['Ancient Greek', 'Roman', 'Medieval', 'Renaissance', 'Elizabethan / Jacobean', 'Restoration', 'Georgian / Neo-Classical', 'Romantic', 'Victorian', 'Edwardian', '1920s–30s', 'Post-War', 'Contemporary'] },
      { name: 'Style — Physicality & Posture', children: ['Upright & Formal', 'Relaxed & Casual', 'Elevated & Grand', 'Compressed & Internal', 'Open & Expansive', 'Grounded & Heavy', 'Light & Lifted', 'Asymmetric', 'Rigid', 'Fluid'] },
      { name: 'Style — Mannerisms', children: ['Deliberate Gesture', 'Habitual Tic', 'Social Affectation', 'Class Marker', 'Period Convention', 'Comic Business', 'Tragic Weight', 'Rhythmic Pattern', 'Verbal Tic', 'Signature Walk'] },
    ],
  },
  {
    categoryId: 'movable-centers',
    tools: [
      { name: 'Location', children: ['Head', 'Crown', 'Forehead', 'Eyes', 'Throat', 'Heart', 'Sternum', 'Solar Plexus', 'Gut', 'Pelvis', 'Spine', 'Lower Back', 'Right Hand', 'Left Hand', 'Fingertips', 'Feet', 'Knees', 'Shoulders', 'Just Above the Head', 'In Front of the Face', 'Behind the Back', 'In Your Partner', 'Between You and Your Partner'] },
      { name: 'Quality', children: ['Warm', 'Cool', 'Buzzing', 'Heavy', 'Light', 'Sharp', 'Tingling', 'Glowing', 'Rough', 'Icy', 'Golden Ball', 'Crystal', 'Ember', 'Magnet', 'Soap Bubble', 'Diamond', 'Dark Void', 'Candle Flame', 'Hawk', 'Serpent', 'Hummingbird', 'Spider'] },
      { name: 'Mobility', children: ['Stationary', 'Rooted', 'Grounded', 'Anchored', 'Spinning', 'Pulsing', 'Shooting', 'Traveling', 'Drifting', 'Oscillating', 'Radiating', 'Expanding', 'Vibrating', 'Flickering', 'Hovering', 'Orbiting', 'Surging', 'Undulating'] },
    ],
  },
  {
    categoryId: 'imaginary-body',
    tools: [
      { name: 'Body Part', scope: 'both', children: ['Full Body', 'Head', 'Neck', 'Chest', 'Right Arm', 'Left Arm', 'Right Hand', 'Left Hand', 'Torso / Core', 'Spine', 'Hips', 'Right Leg', 'Left Leg', 'Right Foot', 'Left Foot'] },
      { name: 'Substances', scope: 'both', children: ['Jelly', 'Springs', 'Plastic', 'Metal', 'Rubber', 'Glass', 'Wood', 'Stone', 'Lead', 'Silk', 'Sponge', 'Honey', 'Ice', 'Smoke', 'Cotton', 'Liquid Mercury', 'Wet Sand', 'Rope', 'Wax', 'Foam', 'Concrete', 'Feathers'] },
      { name: 'Simple Forms', scope: 'both', children: ['Ball', 'Spiral', 'Cylinder', 'Pendulum', 'Pyramid', 'Ribbon', 'Cube', 'Wheel', 'Cone', 'Accordion', 'Hinge', 'Lever', 'Gyroscope', 'Lemniscate'] },
      { name: 'Mineral Kingdom', scope: 'both', children: ['Crystal', 'Diamond', 'Obsidian', 'Granite', 'Quartz', 'Lava Rock', 'Stalactite', 'Geode', 'Glacier', 'Marble', 'Flint', 'Copper', 'Iron Ore', 'Coal', 'Salt Flat'] },
      { name: 'Plant Kingdom', scope: 'both', children: ['Oak Tree', 'Weeping Willow', 'Vine', 'Rose', 'Grass', 'Root', 'Thorn', 'Seed', 'Fern', 'Kelp', 'Cactus', 'Bamboo', 'Sunflower', 'Moss', 'Mushroom', 'Lotus', 'Ivy', 'Blossom'] },
      { name: 'Animal Kingdom', scope: 'both', children: ['Hawk', 'Serpent', 'Cat', 'Bear', 'Spider', 'Dolphin', 'Elephant', 'Wolf', 'Crow', 'Deer', 'Octopus', 'Swan', 'Stallion', 'Tortoise', 'Hummingbird', 'Panther', 'Fox', 'Eagle', 'Owl', 'Jellyfish'] },
      { name: 'Archetypal Characters', scope: 'full-body', children: ['Parent', 'Healer', 'Teacher', 'Orphan', 'Lover', 'Thief', 'Warrior', 'Ruler', 'Fool / Jester', 'Sage', 'Mystic', 'Rebel', 'Child', 'Elder', 'Trickster', 'Creator', 'Outcast', 'Merchant', 'Priest / Priestess', 'Servant', 'Hero', 'Villain', 'Scholar', 'Guardian'] },
    ],
  },
  {
    categoryId: 'trinity-of-psychology',
    tools: [
      { name: 'Thinking', children: ['Analytic', 'Abstract', 'Divergent', 'Idealistic', 'Artistic', 'Reflective', 'Conceptual', 'Convergent', 'Symbolic', 'Musical', 'Distracted', 'Witty', 'Clever', 'Dumb / Stupid', 'Slow', 'Fast', 'Chaotic', 'Rhythmic', 'Big Picture', 'Detailed', 'Illogical', 'Erratic', 'Anxious', 'Phobic', 'Depressed', 'Spacey'] },
      { name: 'Feeling', children: ['Hypersensitive', 'Numb', 'Empathic', 'Thick-Skinned', 'Raw', 'Guarded', 'Expressive', 'Stoic', 'Repressed', 'Theatrical', 'Explosive', 'Understated', 'Contained', 'Effusive', 'Hair-Trigger', 'Reactive', 'Slow-Burning', 'Sledgehammer', 'Impulsive', 'Measured', 'Quick-Release', 'Lingering', 'Stewing', 'Cathartic', 'Festering'] },
      { name: 'Willing', children: ['Fierce', 'Faint', 'Steadfast', 'Mercurial', 'Relentless', 'Forward-Driving', 'Retreating', 'Staccato', 'Legato', 'Feeling-Led', 'Thinking-Led', 'Self-Willed', 'Principled', 'Ruthless', 'Swift', 'Glacial', 'Anticipatory', 'Unresponsive', 'Domineering', 'Laissez-faire', 'Magnanimous', 'Withholding', 'Laser-Focused', 'Dispersed'] },
    ],
  },
  {
    categoryId: 'tempo-rhythm',
    hasScale: true,
    tools: [
      { name: 'Stillness', children: ['Pausing', 'Freezing', 'Holding', 'Waiting', 'Suspending'] },
      { name: 'Legato', children: ['Smooth', 'Connected', 'Flowing', 'Continuous', 'Sustained'] },
      { name: 'Lyrical', children: ['Graceful', 'Melodic', 'Expressive', 'Poetic', 'Rhythmic'] },
      { name: 'Staccato', children: ['Sharp', 'Punctuated', 'Abrupt', 'Detached', 'Choppy'] },
      { name: 'Chaos', children: ['Erratic', 'Unpredictable', 'Wild', 'Frenzied', 'Turbulent'] },
    ],
  },
  {
    categoryId: 'focal-points',
    tools: [
      { name: '1 (Me)', children: ['Self-Focus', 'Inner Awareness', 'Personal Center', 'My Body', 'My Thoughts', 'My Feelings'] },
      { name: '2 (You/Partner)', children: ['Eye Contact', 'Connecting', 'Engaging', 'Responding', 'Listening', 'Observing Partner'] },
      { name: '3 (Here/Physical Environment)', children: ['Space', 'Objects', 'Surroundings', 'Physical Reality', 'Present Location', 'Immediate Area'] },
      { name: '4 (Not Here/Mental Screen)', children: ['Imagination', 'Memory', 'Visualization', 'Inner Vision', 'Mental Picture', 'Distant Place'] },
      { name: '5 (All/Nowhere/Void)', children: ['Everything', 'Nothing', 'Universe', 'Emptiness', 'Infinity', 'Totality', 'Beyond'] },
    ],
  },
];

// Map of categoryId -> parent tool names currently included in the draw pool.
export type ParentToolFilter = Record<string, string[]>;
export type ChildToolFilter = Record<string, Record<string, string[]>>;

interface SelectionOptions {
  includeUnveiling?: boolean;
  deterministicSeed?: string;
}

interface DrawableTool {
  tool: WeekendTool;
  children: string[];
}

export function getToolCatalogCategory(categoryId: string): WeekendToolCategory | undefined {
  return WEEKEND_TOOL_CATALOG.find((category) => category.categoryId === categoryId);
}

export function getCategoriesWithToolSeeds(categoryIds: readonly string[]): ChartCategory[] {
  const categoryIdSet = new Set(categoryIds);

  return CHART_CATEGORIES.filter(
    (category) => categoryIdSet.has(category.id) && Boolean(getToolCatalogCategory(category.id)),
  );
}

export function createAllParentToolFilter(): ParentToolFilter {
  const filter: ParentToolFilter = {};
  for (const category of WEEKEND_TOOL_CATALOG) {
    filter[category.categoryId] = category.tools.map((tool) => tool.name);
  }
  return filter;
}

export function createAllChildToolFilter(): ChildToolFilter {
  const filter: ChildToolFilter = {};
  for (const category of WEEKEND_TOOL_CATALOG) {
    filter[category.categoryId] = {};
    for (const tool of category.tools) {
      filter[category.categoryId][tool.name] = [...tool.children];
    }
  }
  return filter;
}

export function getFilteredTools(categoryId: string, filter?: ParentToolFilter): WeekendTool[] {
  const catalogCategory = getToolCatalogCategory(categoryId);
  if (!catalogCategory) return [];
  if (!filter || !(categoryId in filter)) return [...catalogCategory.tools];

  const allowed = new Set(filter[categoryId]);
  return catalogCategory.tools.filter((tool) => allowed.has(tool.name));
}

export function getFilteredChildren(
  categoryId: string,
  parentToolName: string,
  childFilter?: ChildToolFilter,
): string[] {
  const tool = getToolCatalogCategory(categoryId)?.tools.find((candidate) => candidate.name === parentToolName);
  if (!tool) return [];
  if (!childFilter || !(categoryId in childFilter) || !(parentToolName in childFilter[categoryId])) {
    return [...tool.children];
  }

  const allowed = new Set(childFilter[categoryId][parentToolName]);
  return tool.children.filter((child) => allowed.has(child));
}

export function getDrawableTools(
  categoryId: string,
  filter?: ParentToolFilter,
  childFilter?: ChildToolFilter,
): DrawableTool[] {
  const catalogCategory = getToolCatalogCategory(categoryId);
  if (!catalogCategory) return [];

  const selectedParents = filter && categoryId in filter ? new Set(filter[categoryId]) : null;

  return catalogCategory.tools
    .map((tool) => {
      const selectedChildren = getFilteredChildren(categoryId, tool.name, childFilter);
      const parentIncluded = !selectedParents || selectedParents.has(tool.name);

      // Flexible combination draw: a selected parent is drawable on its own.
      // When no child/example is selected under it, the parent draws at the
      // parent level (childToolName resolves to null downstream). Categories
      // with NO parent selected (empty parent array) stay non-drawable.
      return parentIncluded ? { tool, children: selectedChildren } : null;
    })
    .filter((candidate): candidate is DrawableTool => Boolean(candidate));
}

export function getDrawableSelectionCount(
  categoryId: string,
  filter?: ParentToolFilter,
  childFilter?: ChildToolFilter,
): number {
  if (categoryId === 'movable-centers') {
    return getMovableCenterComponents(categoryId, filter, childFilter).length === 3 ? 1 : 0;
  }

  return getDrawableTools(categoryId, filter, childFilter).length;
}

export function createFirstSelectionForCategory(categoryId: string): PracticeToolSelection | null {
  const chartCategory = getChartCategory(categoryId);
  const catalogCategory = getToolCatalogCategory(categoryId);
  const firstTool = catalogCategory?.tools[0];

  if (!chartCategory || !firstTool) return null;

  return makeSelection(chartCategory, catalogCategory, firstTool, firstTool.children[0] ?? null);
}

export function createSelectionForParentTool(categoryId: string, parentToolName: string): PracticeToolSelection | null {
  const chartCategory = getChartCategory(categoryId);
  const catalogCategory = getToolCatalogCategory(categoryId);
  const tool = catalogCategory?.tools.find((candidate) => candidate.name === parentToolName);

  if (!chartCategory || !catalogCategory || !tool) return null;

  return makeSelection(chartCategory, catalogCategory, tool, pickOne(tool.children) ?? null);
}

export function createRandomSelectionFromCategories(
  categoryIds: readonly string[],
  filter?: ParentToolFilter,
  childFilter?: ChildToolFilter,
  options: SelectionOptions = {},
): PracticeToolSelection | null {
  const categories = getCategoriesWithToolSeeds(categoryIds).filter((category) => {
    if (category.id === 'movable-centers') {
      return getMovableCenterComponents(category.id, filter, childFilter).length === 3;
    }

    return getDrawableTools(category.id, filter, childFilter).length > 0;
  });
  const chartCategory = pickOne(categories);
  if (!chartCategory) return null;

  const catalogCategory = getToolCatalogCategory(chartCategory.id);
  if (!catalogCategory) return null;

  if (chartCategory.id === 'movable-centers') {
    const components = getMovableCenterComponents(chartCategory.id, filter, childFilter);
    if (components.length !== 3) return null;

    return makeComponentSelection(chartCategory, components, options);
  }

  const drawableTools = getDrawableTools(chartCategory.id, filter, childFilter);
  const tool = pickOne(drawableTools);
  if (!tool) return null;

  return makeSelection(
    chartCategory,
    catalogCategory,
    tool.tool,
    pickOne(tool.children) ?? null,
    options,
  );
}

export function createDailyToolSelection(localDate: string): PracticeToolSelection {
  const categories = CHART_CATEGORIES.filter((category) => Boolean(getToolCatalogCategory(category.id)));
  const categoryIndex = seededIndex(localDate, categories.length);
  const chartCategory = categories[categoryIndex] ?? categories[0];
  const catalogCategory = getToolCatalogCategory(chartCategory.id) ?? WEEKEND_TOOL_CATALOG[0];

  if (chartCategory.id === 'movable-centers') {
    const components = getMovableCenterComponents(chartCategory.id, undefined, undefined, localDate);
    return makeComponentSelection(chartCategory, components, { deterministicSeed: localDate });
  }

  const toolIndex = seededIndex(`${localDate}:${chartCategory.id}`, catalogCategory.tools.length);
  const tool = catalogCategory.tools[toolIndex] ?? catalogCategory.tools[0];
  const childIndex = seededIndex(`${localDate}:${chartCategory.id}:${tool.name}`, tool.children.length);

  return makeSelection(chartCategory, catalogCategory, tool, tool.children[childIndex] ?? null, {
    deterministicSeed: localDate,
  });
}

// Re-roll a Movable Centers result while PRESERVING locked component slots.
// Fresh values are drawn for every slot from the same filter, then each locked
// label (Location / Movement / Quality) is restored from the previous draw.
// Used by the Chart tab's device-local Quick Draw lock; no Supabase, no history.
export function createMovableCenterRedraw(
  previousComponents: readonly PracticeToolComponent[],
  lockedLabels: ReadonlySet<string>,
  filter?: ParentToolFilter,
  childFilter?: ChildToolFilter,
  options: SelectionOptions = {},
): PracticeToolSelection | null {
  const chartCategory = getChartCategory('movable-centers');
  if (!chartCategory) return null;

  const fresh = getMovableCenterComponents('movable-centers', filter, childFilter);
  if (fresh.length !== 3) return null;

  const merged = fresh.map((component) => {
    if (!lockedLabels.has(component.label)) return component;
    const prior = previousComponents.find((candidate) => candidate.label === component.label);
    return prior ?? component;
  });

  return makeComponentSelection(chartCategory, merged, options);
}

function getChartCategory(categoryId: string): ChartCategory | undefined {
  return CHART_CATEGORIES.find((category) => category.id === categoryId);
}

function makeSelection(
  chartCategory: ChartCategory,
  catalogCategory: WeekendToolCategory,
  tool: WeekendTool,
  childToolName: string | null,
  options: SelectionOptions = {},
): PracticeToolSelection {
  return {
    categoryId: chartCategory.id,
    categoryName: chartCategory.name,
    parentToolName: tool.name,
    childToolName,
    scaleValue: catalogCategory.hasScale ? pickScaleValue(`${options.deterministicSeed ?? ''}:${chartCategory.id}:${tool.name}`, options) : null,
    unveiledValue: options.includeUnveiling ? pickScaleValue(`${options.deterministicSeed ?? ''}:${chartCategory.id}:unveiling`, options) : null,
  };
}

function makeComponentSelection(
  chartCategory: ChartCategory,
  components: PracticeToolComponent[],
  options: SelectionOptions = {},
): PracticeToolSelection {
  const primary = components[0] ?? null;

  return {
    categoryId: chartCategory.id,
    categoryName: chartCategory.name,
    parentToolName: primary?.label ?? chartCategory.name,
    childToolName: primary?.value ?? null,
    components,
    scaleValue: null,
    unveiledValue: options.includeUnveiling ? pickScaleValue(`${options.deterministicSeed ?? ''}:${chartCategory.id}:unveiling`, options) : null,
  };
}

function getMovableCenterComponents(
  categoryId: string,
  filter?: ParentToolFilter,
  childFilter?: ChildToolFilter,
  deterministicSeed?: string,
): PracticeToolComponent[] {
  const componentOrder = [
    { sourceName: 'Location', displayName: 'Location' },
    { sourceName: 'Mobility', displayName: 'Movement' },
    { sourceName: 'Quality', displayName: 'Quality' },
  ];

  return componentOrder.flatMap(({ sourceName, displayName }) => {
    const drawable = getDrawableTools(categoryId, filter, childFilter).find(
      (candidate) => candidate.tool.name === sourceName,
    );
    if (!drawable) return [];

    const value = deterministicSeed
      ? drawable.children[seededIndex(`${deterministicSeed}:${categoryId}:${sourceName}`, drawable.children.length)]
      : pickOne(drawable.children);

    return value ? [{ label: displayName, value }] : [];
  });
}

function pickScaleValue(seed: string, options: SelectionOptions): number {
  if (options.deterministicSeed) return seededIndex(seed, 10) + 1;

  return Math.floor(Math.random() * 10) + 1;
}

function pickOne<T>(items: readonly T[]): T | undefined {
  if (items.length === 0) return undefined;

  return items[Math.floor(Math.random() * items.length)];
}

function seededIndex(seed: string, modulo: number): number {
  if (modulo <= 1) return 0;

  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return hash % modulo;
}
