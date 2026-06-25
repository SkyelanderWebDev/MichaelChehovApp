import { describe, expect, it } from 'vitest';
import {
  CHART_CATEGORIES,
  getChartNodeAngle,
  getChartNodePosition,
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
