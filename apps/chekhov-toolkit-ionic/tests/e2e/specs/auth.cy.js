const MOBILE_VIEWPORT = {
  width: 390,
  height: 844,
};

const password = 'demo-pass-1234';

function uniqueEmail(prefix = 'tester') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}@example.com`;
}

function openAuthForm() {
  cy.get('.show-auth-form-button').click();
  cy.get('#auth-email').should('exist');
}

function createTester(email = uniqueEmail()) {
  openAuthForm();
  cy.get('#auth-email').clear().type(email);
  cy.get('#auth-password').clear().type(password);
  cy.get('.create-account-button').click();
  cy.get('.current-username', { timeout: 10000 }).should('have.text', email);
  return cy.wrap({ email, password }, { log: false });
}

function signInTester(email) {
  openAuthForm();
  cy.get('#auth-email').clear().type(email);
  cy.get('#auth-password').clear().type(password);
  cy.get('.sign-in-button').click();
  cy.get('.current-username', { timeout: 10000 }).should('have.text', email);
}

describe('Supabase Auth beta flow', () => {
  beforeEach(() => {
    cy.viewport(MOBILE_VIEWPORT.width, MOBILE_VIEWPORT.height);
    cy.visit('/home', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
  });

  it('signs up, persists practice/POA per user, restores session, and isolates another user', () => {
    const dailyAction = 'Tester A secure-beta POA note';

    cy.get('.auth-panel').should('contain.text', 'Supabase Auth');
    cy.contains('ion-button', 'Draw Random').should('have.attr', 'disabled');

    createTester(uniqueEmail('tester-a')).then(({ email: emailA }) => {
      cy.contains('ion-button', 'Draw Random').should('not.have.attr', 'disabled');
      cy.contains('ion-button', 'Draw Random').click();
      cy.contains('ion-button', 'Start Today’s Practice').click();
      cy.get('.tool-preview-card').should('contain.text', 'Today’s practice is started.');

      cy.get('textarea[aria-label="Daily Action / POA note"]').type(dailyAction);
      cy.contains('ion-button', 'Save Daily Action').click();
      cy.contains('Daily Action saved.').should('exist');

      cy.reload();
      cy.get('.current-username', { timeout: 10000 }).should('have.text', emailA);
      cy.get('.tool-preview-card').should('contain.text', 'Today’s practice is started.');
      cy.get('textarea[aria-label="Daily Action / POA note"]').should('have.value', dailyAction);

      cy.get('.sign-out-button').click();
      cy.get('.auth-panel').should('contain.text', 'Signed out');
      cy.get('.tool-preview-card').should('not.exist');
      cy.contains('ion-button', 'Draw Random').should('have.attr', 'disabled');

      createTester(uniqueEmail('tester-b'));
      cy.get('.tool-preview-card').should('not.exist');
      cy.contains('ion-button', 'Draw Random').should('not.have.attr', 'disabled');

      cy.get('.sign-out-button').click();
      signInTester(emailA);
      cy.get('.tool-preview-card').should('contain.text', 'Today’s practice is started.');
      cy.get('textarea[aria-label="Daily Action / POA note"]').should('have.value', dailyAction);
    });
  });

  it('rejects a wrong password with a Supabase auth error', () => {
    createTester(uniqueEmail('wrong-password')).then(({ email }) => {
      cy.get('.sign-out-button').click();
      openAuthForm();
      cy.get('#auth-email').type(email);
      cy.get('#auth-password').type('wrong-password-999');
      cy.get('.sign-in-button').click();
      cy.get('.auth-error').should('exist');
      cy.get('.auth-panel').should('not.contain.text', 'Signed in as');
    });
  });

  it('rejects invalid signup input with a validation message', () => {
    openAuthForm();
    cy.get('#auth-email').type(uniqueEmail('short-password'));
    cy.get('#auth-password').type('123');
    cy.get('.create-account-button').click();
    cy.get('.auth-error').should('exist');
  });
});
