import { describe, expect, it } from 'vitest';
import {
  CHART_CATEGORIES,
  getChartNodeAngle,
  getChartNodePosition,
  getFamilyArcGradient,
} from '@/data/circleChartCatalog';

describe('chart node geometry (centered in angular slots)', () => {
  const total = CHART_CATEGORIES.length;
  const step = 360 / total;

  it('centers each node inside its slot, not on the slot boundary', () => {
    // index*step is the boundary; the centered angle sits half a slot past it.
    expect(getChartNodeAngle(0, total)).toBeCloseTo(-90 + step / 2, 6);
    expect(getChartNodeAngle(1, total)).toBeCloseTo(-90 + step + step / 2, 6);
  });

  it('spaces nodes evenly by one slot', () => {
    for (let i = 1; i < total; i += 1) {
      const delta = getChartNodeAngle(i, total) - getChartNodeAngle(i - 1, total);
      expect(delta).toBeCloseTo(step, 6);
    }
  });

  it('keeps every node position inside the stage bounds (no offset/overflow)', () => {
    for (let i = 0; i < total; i += 1) {
      const { x, y } = getChartNodePosition(i, total);
      // radius 39% from center -> 11%..89%, comfortably within the 0..100 stage.
      expect(x).toBeGreaterThanOrEqual(10);
      expect(x).toBeLessThanOrEqual(90);
      expect(y).toBeGreaterThanOrEqual(10);
      expect(y).toBeLessThanOrEqual(90);
    }
  });
});

describe('family arc gradient (aligned to node slots)', () => {
  // CSS conic angles start at 12 o'clock and run clockwise — the same frame
  // as the node slots. `from 0deg` keeps slice 1's leading edge on node 1's
  // slot boundary; `from -90deg` would rotate slices a quarter turn off.
  it('starts from 0deg and cuts slices exactly at family slot boundaries', () => {
    // 16 slots of 22.5deg: PsychoPhysical 0–67.5, Characterization 67.5–135,
    // Emotional Life 135–225, Esthetics 225–292.5, Transformation 292.5–360.
    expect(getFamilyArcGradient()).toBe(
      'conic-gradient(from 0deg, ' +
        'rgba(139, 92, 246, 0.2) 0deg 67.5deg, ' +
        'rgba(37, 99, 235, 0.2) 67.5deg 135deg, ' +
        'rgba(217, 119, 6, 0.2) 135deg 225deg, ' +
        'rgba(15, 118, 110, 0.2) 225deg 292.5deg, ' +
        'rgba(190, 18, 60, 0.2) 292.5deg 360deg)',
    );
  });

  it('keeps each slice aligned with its family node slots', () => {
    const step = 360 / CHART_CATEGORIES.length;
    // Node i's slot spans css angles [i*step, (i+1)*step] measured from the
    // top; the gradient must place each family's slice on exactly that range.
    const gradient = getFamilyArcGradient();
    CHART_CATEGORIES.forEach((category, index) => {
      if (index === 0 || CHART_CATEGORIES[index - 1].family !== category.family) {
        expect(gradient).toContain(` ${index * step}deg`);
      }
    });
  });
});
