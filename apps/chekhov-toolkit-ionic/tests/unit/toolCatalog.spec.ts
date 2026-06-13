import { describe, expect, test } from 'vitest'
import { CHART_CATEGORIES } from '@/data/circleChartCatalog'
import {
  WEEKEND_TOOL_CATALOG,
  createAllParentToolFilter,
  createRandomSelectionFromCategories,
  createSelectionForParentTool,
  getFilteredTools,
  getToolCatalogCategory,
} from '@/data/toolCatalog'

describe('parent-tool filter catalog helpers', () => {
  test('createAllParentToolFilter covers every chart category with all of its tools', () => {
    const filter = createAllParentToolFilter()

    for (const category of WEEKEND_TOOL_CATALOG) {
      expect(filter[category.categoryId]).toEqual(category.tools.map((tool) => tool.name))
    }
    for (const category of CHART_CATEGORIES) {
      expect(filter[category.id]).toBeDefined()
      expect(category.toolCount).toBe(getToolCatalogCategory(category.id)?.tools.length)
    }
  })

  test('getFilteredTools narrows a category to the selected parent tools', () => {
    const tools = getFilteredTools('archetypal-gestures', { 'archetypal-gestures': ['Push', 'Pull'] })

    expect(tools.map((tool) => tool.name)).toEqual(['Push', 'Pull'])
  })

  test('getFilteredTools returns the full category when no filter entry exists', () => {
    const catalogCategory = getToolCatalogCategory('four-brothers')
    const tools = getFilteredTools('four-brothers', {})

    expect(tools.map((tool) => tool.name)).toEqual(catalogCategory?.tools.map((tool) => tool.name))
  })

  test('createSelectionForParentTool returns the requested tool with one of its child labels', () => {
    const selection = createSelectionForParentTool('archetypal-gestures', 'Penetrate')

    expect(selection).not.toBeNull()
    expect(selection?.categoryName).toBe('Archetypal Gestures')
    expect(selection?.parentToolName).toBe('Penetrate')
    expect(['Pierce', 'Stab', 'Puncture', 'Bore', 'Drill', 'Probe', 'Enter', 'Infiltrate', 'Permeate', 'Cut Through', 'Impale', 'Insinuate', 'Seek', 'Illuminate']).toContain(selection?.childToolName)
  })

  test('catalog includes full child labels and Imaginary Body scope metadata', () => {
    const atmosphere = getToolCatalogCategory('atmosphere')
    const naturalAtmosphere = atmosphere?.tools.find((tool) => tool.name === 'Overall — Nature / Natural')
    const imaginaryBody = getToolCatalogCategory('imaginary-body')
    const bodyPart = imaginaryBody?.tools.find((tool) => tool.name === 'Body Part')
    const archetypalCharacters = imaginaryBody?.tools.find((tool) => tool.name === 'Archetypal Characters')

    expect(naturalAtmosphere?.children).toContain('Cemetery')
    expect(naturalAtmosphere?.children).toHaveLength(33)
    expect(bodyPart?.scope).toBe('both')
    expect(archetypalCharacters?.scope).toBe('full-body')
  })

  test('createSelectionForParentTool rejects names outside the taxonomy', () => {
    expect(createSelectionForParentTool('archetypal-gestures', 'Not A Real Tool')).toBeNull()
  })

  test('Draw Random honors the parent-tool filter across repeated draws', () => {
    const filter = {
      'archetypal-gestures': ['Push'],
      'tempo-rhythm': ['Stillness', 'Legato'],
    }
    const allowed = new Set(['Push', 'Stillness', 'Legato'])

    for (let draw = 0; draw < 60; draw += 1) {
      const selection = createRandomSelectionFromCategories(['archetypal-gestures', 'tempo-rhythm'], filter)
      expect(selection).not.toBeNull()
      expect(allowed.has(selection!.parentToolName)).toBe(true)
    }
  })

  test('Draw Random skips categories whose parent tools are all deselected', () => {
    const filter = {
      'archetypal-gestures': [],
      'four-brothers': ['Ease'],
    }

    for (let draw = 0; draw < 30; draw += 1) {
      const selection = createRandomSelectionFromCategories(['archetypal-gestures', 'four-brothers'], filter)
      expect(selection?.categoryId).toBe('four-brothers')
      expect(selection?.parentToolName).toBe('Ease')
    }
  })

  test('Draw Random returns null when every selected category is fully deselected', () => {
    const selection = createRandomSelectionFromCategories(['archetypal-gestures'], { 'archetypal-gestures': [] })

    expect(selection).toBeNull()
  })
})
