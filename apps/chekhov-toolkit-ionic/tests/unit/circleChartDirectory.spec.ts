import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CircleChart from '@/components/CircleChart.vue';
import { CHART_CATEGORIES } from '@/data/circleChartCatalog';

const ALL_IDS = CHART_CATEGORIES.map((category) => category.id);

function mountChart(showDirectory: boolean) {
  return mount(CircleChart, {
    props: {
      browse: true,
      showDirectory,
      selectedCategoryIds: ALL_IDS,
    },
  });
}

describe('CircleChart directory rendering', () => {
  it('renders the radial chart nodes', () => {
    const wrapper = mountChart(false);
    expect(wrapper.findAll('.chart-node')).toHaveLength(CHART_CATEGORIES.length);
  });

  it('does NOT render its internal category directory when show-directory is false', () => {
    // Wave 1: the Chart page owns the single category list; CircleChart must not
    // render a second duplicate directory.
    const wrapper = mountChart(false);
    expect(wrapper.find('.category-directory').exists()).toBe(false);
  });

  it('still renders the internal directory when explicitly enabled', () => {
    const wrapper = mountChart(true);
    expect(wrapper.find('.category-directory').exists()).toBe(true);
  });
});
