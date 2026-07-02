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

describe('CircleChart collapsible key', () => {
  function mountWithKey(collapsibleKey: boolean) {
    return mount(CircleChart, {
      props: {
        browse: true,
        showDirectory: false,
        collapsibleKey,
        selectedCategoryIds: ALL_IDS,
      },
    });
  }

  // v-show visibility is asserted via the inline style attribute; vue-test-utils
  // isVisible() reports stale values here once called before the toggle click.
  function isKeyShown(wrapper: ReturnType<typeof mountWithKey>): boolean {
    return !(wrapper.find('.key-groups').attributes('style') ?? '').includes('display: none');
  }

  it('keeps the key always visible with no toggle by default', () => {
    const wrapper = mountWithKey(false);
    expect(wrapper.find('[data-testid="chart-key-toggle"]').exists()).toBe(false);
    expect(isKeyShown(wrapper)).toBe(true);
  });

  it('starts collapsed and expands/collapses via the toggle', async () => {
    const wrapper = mountWithKey(true);
    const toggle = wrapper.find('[data-testid="chart-key-toggle"]');

    expect(toggle.exists()).toBe(true);
    expect(toggle.attributes('aria-expanded')).toBe('false');
    expect(isKeyShown(wrapper)).toBe(false);

    await toggle.trigger('click');
    expect(toggle.attributes('aria-expanded')).toBe('true');
    expect(isKeyShown(wrapper)).toBe(true);

    await toggle.trigger('click');
    expect(toggle.attributes('aria-expanded')).toBe('false');
    expect(isKeyShown(wrapper)).toBe(false);
  });

  it('lists all 16 numbered categories inside the expanded key', async () => {
    const wrapper = mountWithKey(true);
    await wrapper.find('[data-testid="chart-key-toggle"]').trigger('click');

    const items = wrapper.findAll('.key-item');
    expect(items).toHaveLength(CHART_CATEGORIES.length);
    expect(items[items.length - 1].text()).toContain('Psychological Gesture');
    expect(items[items.length - 1].text()).toContain('16');
  });
});
