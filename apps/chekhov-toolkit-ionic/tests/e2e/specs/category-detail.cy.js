const MOBILE_VIEWPORT = {
  width: 390,
  height: 844,
};

function expectNoHorizontalOverflow() {
  cy.document().then((doc) => {
    expect(doc.documentElement.scrollWidth, 'no horizontal overflow').to.be.lte(doc.documentElement.clientWidth);
  });
}

function selectOnlyOpening() {
  cy.get('[data-testid="chart-deselect-all"]').click();
  cy.get('[data-testid="category-toggle-expanding-contracting"]').click();
  cy.contains('.category-card', 'Expanding & Contracting').within(() => {
    cy.contains('button', 'Details').click();
  });

  cy.get('.category-detail-modal').should('be.visible');
  cy.contains('.parent-tool-row', 'Expanding').within(() => {
    cy.contains('ion-checkbox', 'Expanding').click({ force: true });
    cy.get('[data-testid="child-selector"][data-child-name="Opening"]').click({ force: true });
  });
  cy.get('.detail-footer-bar').contains('ion-button', 'Done').click();
}

describe('Chart browse and Library depth', () => {
  beforeEach(() => {
    cy.viewport(MOBILE_VIEWPORT.width, MOBILE_VIEWPORT.height);
    cy.visit('/chart', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
  });

  it('opens category selectors from the Chart with child labels', () => {
    cy.contains('.chart-hub strong', 'Inspired Action').should('be.visible');
    cy.contains('Circle chart map').should('not.exist');
    cy.contains('.category-card', 'Expanding & Contracting').within(() => {
      cy.contains('button', 'Details').click();
    });

    cy.get('.category-detail-modal').should('be.visible');
    cy.get('.detail-title').should('contain.text', 'Expanding & Contracting');
    cy.get('.detail-family').should('contain.text', 'PsychoPhysical Exercises');
    cy.get('.detail-description').should('contain.text', 'Core PsychoPhysical Exercises');
    cy.get('.parent-tool-row').should('have.length', 2);
    cy.contains('.parent-tool-row', 'Expanding').within(() => {
      cy.get('[data-testid="child-selector"][data-child-name="Opening"]').should('be.visible');
      cy.get('[data-testid="child-selector"][data-child-name="Blossoming"]').should('be.visible');
      cy.get('[data-testid="child-selector"][data-child-name="Ebbing"]').should('be.visible');
    });
    cy.contains('Include in Quick Draw pool').should('exist');
    cy.get('.select-all-tools').should('exist');
    cy.get('.preview-tool-button').should('not.exist');

    expectNoHorizontalOverflow();
  });

  it('links category depth from Chart to Library', () => {
    cy.contains('button', 'Library').first().click();
    cy.location('pathname').should('eq', '/library');
    cy.location('search').should('include', 'category=expanding-contracting');
    cy.contains('h1', 'Library').should('exist');
    cy.contains('Expanding & Contracting').should('exist');
    cy.contains('Browse the Chart of Inspired Action').should('exist');
    expectNoHorizontalOverflow();
  });

  it('shows an empty Quick Draw state after master deselect all', () => {
    cy.get('[data-testid="chart-deselect-all"]').click();
    cy.get('[data-testid="button-quick-draw"]').click();

    cy.contains('Nothing is available for Quick Draw').should('be.visible');
    cy.get('.quick-result').should('not.exist');
    expectNoHorizontalOverflow();
  });

  it('draws from one selected category, parent tool, and child label', () => {
    selectOnlyOpening();

    cy.get('[data-testid="button-quick-draw"]').click();
    cy.get('.quick-result').should('be.visible');
    cy.get('[data-testid="quick-draw-result"]').should('contain.text', 'Expanding & Contracting');
    cy.get('[data-testid="quick-draw-result"]').should('contain.text', 'Expanding');
    cy.get('[data-testid="quick-draw-result"]').should('contain.text', 'Opening');
    expectNoHorizontalOverflow();
  });

  it('opens and highlights the Quick Draw result detail', () => {
    selectOnlyOpening();

    cy.get('[data-testid="button-quick-draw"]').click();
    cy.get('[data-testid="quick-draw-result"]').click();

    cy.get('.category-detail-modal').should('be.visible');
    cy.get('.detail-title').should('contain.text', 'Expanding & Contracting');
    cy.get('.parent-tool-row.highlighted').should('contain.text', 'Expanding');
    cy.get('[data-testid="child-selector"][data-child-name="Opening"]').should('have.class', 'highlighted');
    expectNoHorizontalOverflow();
  });

  it('centers Quick Draw result text', () => {
    selectOnlyOpening();

    cy.get('[data-testid="button-quick-draw"]').click();
    cy.get('[data-testid="quick-draw-result"]').then(($result) => {
      expect(getComputedStyle($result[0]).textAlign).to.eq('center');
    });
    expectNoHorizontalOverflow();
  });

  it('surfaces full Atmosphere labels in Library', () => {
    cy.visit('/library?category=atmosphere');
    cy.contains('Dive Deeper into the Tools').should('exist');
    cy.contains('Atmosphere').should('exist');
    cy.contains('Cemetery').should('exist');
    cy.contains('Lisa’s YouTube').should('exist');
    expectNoHorizontalOverflow();
  });
});
