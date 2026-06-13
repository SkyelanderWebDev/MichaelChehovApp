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
    cy.contains('.chart-hub strong', 'Inspired Action').should('be.visible');
    cy.contains('Circle chart map').should('not.exist');

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

  it('shows Chart Quick Draw and the Library resource skeleton', () => {
    cy.visit('/chart');
    cy.get('[data-testid="button-quick-draw"]').click();
    cy.get('.quick-result').should('be.visible');
    cy.get('.quick-result strong').invoke('text').should('not.be.empty');

    cy.visit('/library');
    cy.contains('Dive Deeper into the Tools').should('exist');
    cy.contains('Videos & Demonstrations').should('exist');
    cy.contains('Chekhov Lectures & Writings').should('exist');
    cy.contains('Lisa Dalton / NMCA Books & Excerpts').should('exist');
    cy.contains('Windsor University’s Michael Chekhov Archive').should('exist');
    cy.contains('Lisa’s YouTube').should('exist');
    cy.contains('More demonstrations and class clips coming soon.').should('exist');
  });
});
