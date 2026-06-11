/// <reference types="cypress" />

function expectNoHorizontalOverflow() {
  cy.document().then((doc) => {
    expect(doc.documentElement.scrollWidth, 'no horizontal overflow').to.be.lte(doc.documentElement.clientWidth);
  });
}

describe('The Michael Chekhov Toolkit app shell', () => {
  beforeEach(() => {
    cy.viewport(390, 844);
  });

  it('redirects from root and /home to the Chart tab', () => {
    cy.visit('/');
    cy.title().should('eq', 'The Michael Chekhov Toolkit');
    cy.location('pathname').should('eq', '/chart');
    cy.contains('h1', 'Chart').should('exist');
    cy.contains('Quick access to the chart').should('exist');

    cy.visit('/home');
    cy.location('pathname').should('eq', '/chart');
  });

  it('renders the bottom tabs in Dawson’s order with Chart selected', () => {
    cy.visit('/chart');

    cy.get('ion-tab-bar ion-tab-button').then(($tabs) => {
      expect([...$tabs].map((tab) => tab.textContent?.trim())).to.deep.equal([
        'Library',
        'Journal',
        'Chart',
        'Map',
        'Settings',
      ]);
    });

    cy.contains('ion-tab-button', 'Chart').should('have.class', 'tab-selected');
    cy.get('.chart-orb').should('be.visible');
    expectNoHorizontalOverflow();
  });
});
