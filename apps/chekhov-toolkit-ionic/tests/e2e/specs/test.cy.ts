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

  it('renders exactly the five bottom tabs in Dawson’s order with Chart selected', () => {
    cy.visit('/chart');

    cy.get('ion-tab-bar ion-tab-button').then(($tabs) => {
      expect([...$tabs].map((tab) => tab.textContent?.trim())).to.deep.equal([
        'Library',
        'Journal',
        'Chart',
        'Connect',
        'Settings',
      ]);
    });

    cy.contains('ion-tab-button', 'Chart').should('have.class', 'tab-selected');
    cy.get('.chart-orb').should('be.visible');
    expectNoHorizontalOverflow();
  });

  it('shows Chart Quick Draw, its draw history, and the Library resource skeleton', () => {
    cy.visit('/chart');
    cy.get('[data-testid="button-quick-draw"]').click();
    cy.get('.quick-result').should('be.visible');
    cy.get('.quick-result strong').invoke('text').should('not.be.empty');

    // The drawn roll is logged to the Chart's own Quick-Draw history.
    cy.get('[data-testid="quick-draw-tab-history"]').click();
    cy.get('[data-testid="quick-draw-history-list"] li').should('have.length.greaterThan', 0);
    expectNoHorizontalOverflow();

    cy.visit('/library');
    cy.contains('Dive Deeper into the Tools').should('exist');
    cy.contains('Videos & Demonstrations').should('exist');
    cy.contains('Chekhov Lectures & Writings').should('exist');
    cy.contains('Lisa Dalton / NMCA Books & Excerpts').should('exist');
    cy.contains('Windsor University’s Michael Chekhov Archive').should('exist');
    cy.contains('Lisa’s YouTube').should('exist');
    cy.contains('More demonstrations and class clips coming soon.').should('exist');
    // Wave 1: Common Struggles is an empty coming-soon placeholder in Library.
    cy.contains('Common Struggles').should('exist');
  });

  it('exposes the Journal Today/History segment', () => {
    cy.visit('/journal');
    cy.get('[data-testid="journal-tab-today"]').should('exist');
    cy.get('[data-testid="journal-tab-history"]').click();
    cy.contains('Tester access').should('exist');
    expectNoHorizontalOverflow();
  });

  it('keeps the “Chart areas for Draw Random” pool card within phone width', () => {
    cy.visit('/journal');
    cy.get('[data-testid="journal-tab-today"]').should('exist');

    // The pool card and its global examples toggle render even when signed out.
    cy.contains('.pool-panel h2', 'Chart areas for Draw Random').should('exist');
    cy.get('[data-testid="journal-examples-toggle"]').should('exist');

    cy.get('.pool-panel').then(($panel) => {
      const el = $panel[0];
      expect(el.scrollWidth, 'pool card has no horizontal overflow').to.be.lte(el.clientWidth);
    });
    expectNoHorizontalOverflow();
  });

  it('shows the Connect group-chat planned card', () => {
    cy.visit('/map');
    cy.contains('h1', 'Connect').should('be.visible');
    // Ionic fixed tab chrome confuses Cypress visibility on lower cards; assert
    // existence plus real geometry instead of naive visibility.
    cy.contains('h2', 'Class & show group chat')
      .should('exist')
      .then(($heading) => {
        const rect = $heading[0].getBoundingClientRect();
        expect(rect.height, 'chat card heading has real geometry').to.be.greaterThan(0);
      });
    expectNoHorizontalOverflow();
  });

  it('routes removed tabs and unknown paths to NotFound without horizontal overflow', () => {
    for (const path of ['/struggles', '/quiz', '/history', '/route-that-does-not-exist']) {
      cy.visit(path);
      cy.contains('Page not found').should('be.visible');
      expectNoHorizontalOverflow();
    }
  });
});
