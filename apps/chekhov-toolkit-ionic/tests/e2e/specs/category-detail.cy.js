const MOBILE_VIEWPORT = {
  width: 390,
  height: 844,
};

function expectNoHorizontalOverflow() {
  cy.document().then((doc) => {
    expect(doc.documentElement.scrollWidth, 'no horizontal overflow').to.be.lte(doc.documentElement.clientWidth);
  });
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

  it('opens category basics from the Chart without practice controls', () => {
    cy.contains('.chart-hub strong', 'Inspired Action').should('be.visible');
    cy.contains('Circle chart map').should('not.exist');
    cy.get('.chart-node').first().click({ force: true });

    cy.get('.category-detail-modal').should('be.visible');
    cy.get('.detail-title').should('contain.text', 'Expanding & Contracting');
    cy.get('.detail-family').should('contain.text', 'PsychoPhysical');
    cy.get('.detail-description').should('contain.text', 'Core PsychoPhysical movement');
    cy.get('.parent-tool-row').should('have.length', 2);
    cy.contains('.parent-tool-row', 'Expanding').within(() => {
      cy.contains('.child-chip', 'Opening').should('be.visible');
      cy.contains('.child-chip', 'Blossoming').should('be.visible');
      cy.contains('.child-chip', 'Ebbing').should('be.visible');
    });
    cy.contains('Source-backed taxonomy labels only').should('exist');
    cy.get('.select-all-tools').should('not.exist');
    cy.get('.preview-tool-button').should('not.exist');

    expectNoHorizontalOverflow();
  });

  it('links category depth from Chart to Library', () => {
    cy.contains('button', 'Library').first().click();
    cy.location('pathname').should('eq', '/library');
    cy.location('search').should('include', 'category=expanding-contracting');
    cy.contains('h1', 'Library').should('exist');
    cy.contains('Expanding & Contracting').should('exist');
    cy.contains('source-backed taxonomy only').should('exist');
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
