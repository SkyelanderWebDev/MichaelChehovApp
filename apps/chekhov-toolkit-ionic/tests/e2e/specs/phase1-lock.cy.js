const MOBILE_VIEWPORT = {
  width: 390,
  height: 844,
};

function expectNoHorizontalOverflow() {
  cy.document().then((doc) => {
    expect(doc.documentElement.scrollWidth, 'no horizontal overflow').to.be.lte(doc.documentElement.clientWidth);
  });
}

describe('Studio Ritual route polish', () => {
  beforeEach(() => {
    cy.viewport(MOBILE_VIEWPORT.width, MOBILE_VIEWPORT.height);
  });

  it('keeps Connect as a polished Coming Soon surface', () => {
    cy.visit('/map');
    cy.contains('h1', 'Connect').should('exist');
    cy.contains('Coming soon').should('exist');
    cy.contains('Studios & teachers near you').should('exist');
    cy.contains('Upcoming events & calendar').should('exist');
    cy.contains('Class & show group chat').should('exist');
    cy.contains('Nothing here uses your location today').should('exist');
    cy.contains('Today’s Practice lives in the Journal tab').should('exist');
    expectNoHorizontalOverflow();
  });

  it('keeps Journal as Today’s Practice / POA home', () => {
    cy.visit('/journal');
    cy.contains('h1', 'Journal').should('exist');
    cy.contains('Choose how to begin').should('exist');
    cy.contains('Pick My Own').should('exist');
    cy.contains('Draw Random').should('exist');
    cy.contains('Daily Tool').should('exist');
    cy.contains('Chart areas for Draw Random').should('exist');
    cy.contains('Browse the full Chart of Inspired Action on the Chart tab.').should('exist');
    expectNoHorizontalOverflow();
  });

  it('keeps attribution visible in Settings', () => {
    cy.visit('/settings');
    cy.contains('About & attribution').should('exist');
    cy.contains('Chart of Inspired Action © 2004 National Michael Chekhov Association').should('exist');
    cy.contains('Lisa Dalton, NMCA President and Master Teacher').should('exist');
    expectNoHorizontalOverflow();
  });
});
