const MOBILE_VIEWPORT = {
  width: 390,
  height: 844,
};

function expectNoHorizontalOverflow() {
  cy.document().then((doc) => {
    expect(doc.documentElement.scrollWidth, 'no horizontal overflow').to.be.lte(doc.documentElement.clientWidth);
  });
}

describe('Tester access beta gate', () => {
  beforeEach(() => {
    cy.viewport(MOBILE_VIEWPORT.width, MOBILE_VIEWPORT.height);
    cy.visit('/journal', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
  });

  it('keeps Today’s Practice in Journal and disables saving when tester access is unavailable', () => {
    cy.contains('h1', 'Journal').should('exist');
    cy.contains('Tester access is required to save today’s practice and POA.').should('exist');
    cy.contains('Tester access isn’t available in this build yet. Details are in Settings').should('exist');

    cy.contains('button', 'Pick My Own').should('be.disabled');
    cy.contains('button', 'Draw Random').should('be.disabled');
    cy.contains('button', 'Daily Tool').should('be.disabled');
    cy.contains('ion-button', 'Select all').should('have.attr', 'disabled');
    cy.contains('ion-button', 'Clear').should('have.attr', 'disabled');
    expectNoHorizontalOverflow();
  });

  it('puts technical Supabase details in Settings, not the Journal first viewport', () => {
    cy.contains('button', 'Have beta feedback? Share it in Settings').click();
    cy.location('pathname').should('eq', '/settings');

    cy.contains('h1', 'Settings').should('exist');
    cy.contains('Beta data & security').should('exist');
    cy.contains('summary', 'Technical details').click();
    cy.contains('VITE_SUPABASE_URL').should('exist');
    cy.contains('VITE_SUPABASE_ANON_KEY').should('exist');
    cy.contains('service-role keys must never be placed').should('exist');
  });

  it('shows appearance choices in Settings', () => {
    cy.visit('/settings');
    cy.contains('h2', 'Theme').should('exist');
    cy.contains('System').should('exist');
    cy.contains('Light').should('exist');
    cy.contains('Dark').should('exist');
  });
});
