import { describe, expect, test } from 'vitest'
import { CHART_CATEGORIES } from '@/data/circleChartCatalog'
import {
  WEEKEND_TOOL_CATALOG,
  createAllChildToolFilter,
  createAllParentToolFilter,
  createDailyToolSelection,
  createRandomSelectionFromCategories,
  createSelectionForParentTool,
  getDrawableSelectionCount,
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
    const naturalAtmosphere = atmosphere?.tools.find((tool) => tool.name === 'Overall: Nature / Natural')
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

  test('Draw Random draws a selected parent with no selected children at the parent level', () => {
    const parentFilter = {
      'expanding-contracting': ['Expanding', 'Contracting'],
    }
    const childFilter = {
      'expanding-contracting': {
        Expanding: [],
        Contracting: ['Closing'],
      },
    }

    let drewExpandingParentOnly = false
    let drewContractingChild = false

    for (let draw = 0; draw < 60; draw += 1) {
      const selection = createRandomSelectionFromCategories(['expanding-contracting'], parentFilter, childFilter)
      expect(selection).not.toBeNull()
      expect(['Expanding', 'Contracting']).toContain(selection!.parentToolName)

      if (selection!.parentToolName === 'Expanding') {
        // No children selected → parent-level draw, childToolName null.
        expect(selection!.childToolName).toBeNull()
        drewExpandingParentOnly = true
      } else {
        expect(selection!.childToolName).toBe('Closing')
        drewContractingChild = true
      }
    }

    // Both branches are reachable now that an example-less parent stays drawable.
    expect(drewExpandingParentOnly).toBe(true)
    expect(drewContractingChild).toBe(true)
  })

  test('Draw Random does not let default child selections re-include deselected parents', () => {
    const parentFilter = {
      'expanding-contracting': [],
    }
    const childFilter = createAllChildToolFilter()

    const selection = createRandomSelectionFromCategories(['expanding-contracting'], parentFilter, childFilter)

    expect(selection).toBeNull()
  })

  test('Movable Centers drawability count requires all three components', () => {
    const parentFilter = {
      'movable-centers': ['Location', 'Quality'],
    }
    const childFilter = createAllChildToolFilter()

    expect(getDrawableSelectionCount('movable-centers', parentFilter, childFilter)).toBe(0)
    expect(createRandomSelectionFromCategories(['movable-centers'], parentFilter, childFilter)).toBeNull()

    expect(getDrawableSelectionCount('movable-centers')).toBe(1)
  })

  test('Movable Centers draws Location, Movement, and Quality as a component result', () => {
    const selection = createRandomSelectionFromCategories(['movable-centers'])

    expect(selection).toMatchObject({
      categoryId: 'movable-centers',
      categoryName: 'Movable Centers',
      parentToolName: 'Location',
    })
    expect(selection?.components).toHaveLength(3)
    expect(selection?.components?.map((component) => component.label)).toEqual(['Location', 'Movement', 'Quality'])
  })

  test('Tempo / Rhythm uses a 1-10 scale for random and daily selections', () => {
    for (let draw = 0; draw < 30; draw += 1) {
      const selection = createRandomSelectionFromCategories(['tempo-rhythm'])

      expect(selection?.scaleValue).toBeGreaterThanOrEqual(1)
      expect(selection?.scaleValue).toBeLessThanOrEqual(10)
    }

    const tempoDailySelection = Array.from({ length: 80 }, (_, index) =>
      createDailyToolSelection(`2026-07-${String(index + 1).padStart(2, '0')}`),
    ).find((selection) => selection.categoryId === 'tempo-rhythm')

    expect(tempoDailySelection?.scaleValue).toBeGreaterThanOrEqual(1)
    expect(tempoDailySelection?.scaleValue).toBeLessThanOrEqual(10)
  })

  test('Quick Draw can include an optional 1-10 veiling value', () => {
    const selection = createRandomSelectionFromCategories(['expanding-contracting'], undefined, undefined, {
      includeUnveiling: true,
    })

    expect(selection?.unveiledValue).toBeGreaterThanOrEqual(1)
    expect(selection?.unveiledValue).toBeLessThanOrEqual(10)
  })

  test('Draw Random keeps an example-less selected parent in the pool alongside a child-level parent', () => {
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

    let drewExpandingParentOnly = false
    let drewEaseChild = false

    for (let draw = 0; draw < 80; draw += 1) {
      const selection = createRandomSelectionFromCategories(
        ['expanding-contracting', 'four-brothers'],
        parentFilter,
        childFilter,
      )
      expect(selection).not.toBeNull()

      if (selection!.categoryId === 'expanding-contracting') {
        expect(selection!.parentToolName).toBe('Expanding')
        expect(selection!.childToolName).toBeNull()
        drewExpandingParentOnly = true
      } else {
        expect(selection).toMatchObject({
          categoryId: 'four-brothers',
          parentToolName: 'Ease',
          childToolName: 'Flow',
        })
        drewEaseChild = true
      }
    }

    expect(drewExpandingParentOnly).toBe(true)
    expect(drewEaseChild).toBe(true)
  })

  test('Draw Random returns null when every selected category is fully deselected', () => {
    const selection = createRandomSelectionFromCategories(['archetypal-gestures'], { 'archetypal-gestures': [] })

    expect(selection).toBeNull()
  })

  test('Draw Random draws at the parent level when a selected parent has every example deselected', () => {
    for (let draw = 0; draw < 30; draw += 1) {
      const selection = createRandomSelectionFromCategories(
        ['expanding-contracting'],
        { 'expanding-contracting': ['Expanding'] },
        { 'expanding-contracting': { Expanding: [] } },
      )

      expect(selection).not.toBeNull()
      expect(selection).toMatchObject({
        categoryId: 'expanding-contracting',
        parentToolName: 'Expanding',
      })
      // Parent-level draw: no child/example is chosen.
      expect(selection!.childToolName).toBeNull()
    }
  })

  // --- Flexible-combination Quick Draw: category / parent / child levels ---

  test('Flexible draw: category-level (all parents, all children) draws a random parent + child', () => {
    const parentFilter = createAllParentToolFilter()
    const childFilter = createAllChildToolFilter()
    const fourBrothers = getToolCatalogCategory('four-brothers')!
    const parentNames = new Set(fourBrothers.tools.map((tool) => tool.name))
    const drawnParents = new Set<string>()

    for (let draw = 0; draw < 60; draw += 1) {
      const selection = createRandomSelectionFromCategories(['four-brothers'], parentFilter, childFilter)
      expect(selection).not.toBeNull()
      expect(parentNames.has(selection!.parentToolName)).toBe(true)

      const parentChildren = fourBrothers.tools.find((tool) => tool.name === selection!.parentToolName)!.children
      expect(parentChildren).toContain(selection!.childToolName)
      drawnParents.add(selection!.parentToolName)
    }

    // Category-level draw should reach more than one parent across repeated draws.
    expect(drawnParents.size).toBeGreaterThan(1)
  })

  test('Flexible draw: parent-only Four Brothers (examples deselected) draws one of the four brothers, never null', () => {
    const parentFilter = {
      'four-brothers': ['Beauty', 'Ease', 'Entirety', 'Form'],
    }
    const childFilter = {
      'four-brothers': {
        Beauty: [],
        Ease: [],
        Entirety: [],
        Form: [],
      },
    }
    const brothers = new Set(['Beauty', 'Ease', 'Entirety', 'Form'])
    const drawn = new Set<string>()

    expect(getDrawableSelectionCount('four-brothers', parentFilter, childFilter)).toBe(4)

    for (let draw = 0; draw < 80; draw += 1) {
      const selection = createRandomSelectionFromCategories(['four-brothers'], parentFilter, childFilter)
      expect(selection).not.toBeNull()
      expect(brothers.has(selection!.parentToolName)).toBe(true)
      // Parent-only draw: no example selected.
      expect(selection!.childToolName).toBeNull()
      drawn.add(selection!.parentToolName)
    }

    // Every brother is reachable from the parent-only pool.
    expect(drawn.size).toBe(4)
  })

  test('Flexible draw: child-level draw still honors the single selected example', () => {
    const parentFilter = {
      'four-brothers': ['Form'],
    }
    const childFilter = {
      'four-brothers': {
        Form: ['Structure'],
      },
    }

    for (let draw = 0; draw < 40; draw += 1) {
      const selection = createRandomSelectionFromCategories(['four-brothers'], parentFilter, childFilter)
      expect(selection).toMatchObject({
        categoryId: 'four-brothers',
        parentToolName: 'Form',
        childToolName: 'Structure',
      })
    }
  })

  test('Flexible draw: Movable Centers still requires all three components and stays a 3-part result', () => {
    // Full selection draws all three components.
    const full = createRandomSelectionFromCategories(['movable-centers'])
    expect(full?.components).toHaveLength(3)
    expect(full?.components?.map((component) => component.label)).toEqual(['Location', 'Movement', 'Quality'])

    // Dropping one component parent makes the category non-drawable (no partial Movable Centers draw).
    const partialParentFilter = {
      'movable-centers': ['Location', 'Quality'],
    }
    const childFilter = createAllChildToolFilter()
    expect(getDrawableSelectionCount('movable-centers', partialParentFilter, childFilter)).toBe(0)
    expect(createRandomSelectionFromCategories(['movable-centers'], partialParentFilter, childFilter)).toBeNull()
  })
})
