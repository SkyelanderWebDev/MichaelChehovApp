import { describe, expect, test } from 'vitest'
import { CHART_CATEGORIES } from '@/data/circleChartCatalog'
import {
  WEEKEND_TOOL_CATALOG,
  createAllChildToolFilter,
  createAllParentToolFilter,
  createRandomSelectionFromCategories,
  createSelectionForParentTool,
  getFilteredChildren,
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

  test('createAllChildToolFilter covers every parent tool with all child labels', () => {
    const filter = createAllChildToolFilter()

    for (const category of WEEKEND_TOOL_CATALOG) {
      for (const tool of category.tools) {
        expect(filter[category.categoryId][tool.name]).toEqual([...tool.children])
      }
    }
  })

  test('getFilteredChildren narrows a parent tool to selected child labels', () => {
    const children = getFilteredChildren('expanding-contracting', 'Expanding', {
      'expanding-contracting': {
        Expanding: ['Opening', 'Blossoming'],
      },
    })

    expect(children).toEqual(['Opening', 'Blossoming'])
  })

  test('getFilteredChildren returns full children when child filter is absent or missing', () => {
    const catalogCategory = getToolCatalogCategory('expanding-contracting')
    const expanding = catalogCategory?.tools.find((tool) => tool.name === 'Expanding')

    expect(getFilteredChildren('expanding-contracting', 'Expanding')).toEqual(expanding?.children)
    expect(getFilteredChildren('expanding-contracting', 'Expanding', {})).toEqual(expanding?.children)
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

  test('Draw Random honors selected child labels across repeated draws', () => {
    const parentFilter = {
      'expanding-contracting': ['Expanding'],
    }
    const childFilter = {
      'expanding-contracting': {
        Expanding: ['Opening'],
      },
    }

    for (let draw = 0; draw < 40; draw += 1) {
      const selection = createRandomSelectionFromCategories(['expanding-contracting'], parentFilter, childFilter)
      expect(selection).toMatchObject({
        categoryId: 'expanding-contracting',
        parentToolName: 'Expanding',
        childToolName: 'Opening',
      })
    }
  })

  test('Draw Random stays backward compatible when no child filter is passed', () => {
    const selection = createRandomSelectionFromCategories(['expanding-contracting'], {
      'expanding-contracting': ['Expanding'],
    })
    const expandingChildren = getToolCatalogCategory('expanding-contracting')?.tools.find(
      (tool) => tool.name === 'Expanding',
    )?.children

    expect(selection?.categoryId).toBe('expanding-contracting')
    expect(selection?.parentToolName).toBe('Expanding')
    expect(expandingChildren).toContain(selection?.childToolName)
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

  test('Draw Random skips parents with no selected children', () => {
    const parentFilter = {
      'expanding-contracting': ['Expanding', 'Contracting'],
    }
    const childFilter = {
      'expanding-contracting': {
        Expanding: [],
        Contracting: ['Closing'],
      },
    }

    for (let draw = 0; draw < 30; draw += 1) {
      const selection = createRandomSelectionFromCategories(['expanding-contracting'], parentFilter, childFilter)
      expect(selection).toMatchObject({
        parentToolName: 'Contracting',
        childToolName: 'Closing',
      })
    }
  })

  test('Draw Random skips categories whose selected parents have no selected children', () => {
    const parentFilter = {
      'expanding-contracting': ['Expanding'],
      'four-brothers': ['Ease'],
    }
    const childFilter = {
      'expanding-contracting': {
        Expanding: [],
      },
      'four-brothers': {
        Ease: ['Flow'],
      },
    }

    for (let draw = 0; draw < 30; draw += 1) {
      const selection = createRandomSelectionFromCategories(
        ['expanding-contracting', 'four-brothers'],
        parentFilter,
        childFilter,
      )
      expect(selection).toMatchObject({
        categoryId: 'four-brothers',
        parentToolName: 'Ease',
        childToolName: 'Flow',
      })
    }
  })

  test('Draw Random returns null when every selected category is fully deselected', () => {
    const selection = createRandomSelectionFromCategories(['archetypal-gestures'], { 'archetypal-gestures': [] })

    expect(selection).toBeNull()
  })

  test('Draw Random returns null when every selected child is deselected', () => {
    const selection = createRandomSelectionFromCategories(
      ['expanding-contracting'],
      { 'expanding-contracting': ['Expanding'] },
      { 'expanding-contracting': { Expanding: [] } },
    )

    expect(selection).toBeNull()
  })
})
