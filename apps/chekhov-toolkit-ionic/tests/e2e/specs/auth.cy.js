// Local demo auth flow. These tests need the root Express/SQLite server
// running behind the Vite proxy: from the repo root,
//   PORT=5055 HOST=127.0.0.1 npm run dev
// (or set MCT_API_PROXY_TARGET before starting the Ionic dev server).

const MOBILE_VIEWPORT = {
  width: 390,
  height: 844,
};

const username = `demo_${Date.now()}`;
const password = 'demo-pass-1234';

function openAuthForm() {
  // Cypress treats below-fold elements inside Ionic's absolutely-positioned
  // scroll container as hidden, so rely on action auto-scrolling instead of
  // explicit visibility assertions here.
  cy.get('.show-auth-form-button').click();
  cy.get('#auth-username').should('exist');
}

describe('Local demo auth', () => {
  beforeEach(() => {
    cy.viewport(MOBILE_VIEWPORT.width, MOBILE_VIEWPORT.height);
    cy.visit('/home', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
  });

  it('signs up, scopes practice per user, and restores the session on reload', () => {
    // Guest starts a practice first so cross-user scoping is observable.
    cy.contains('ion-button', 'Draw Random').should('be.visible').click();
    cy.contains('ion-button', 'Start Today’s Practice').click();
    cy.get('.tool-preview-card').should('contain.text', 'Today’s practice is started.');

    // Create a local demo account.
    cy.get('.auth-panel').should('contain.text', 'Local demo auth');
    openAuthForm();
    cy.get('#auth-username').type(username);
    cy.get('#auth-password').type(password);
    cy.get('.create-account-button').click();
    cy.get('.current-username').should('have.text', username);

    // The fresh account has no started practice; the guest day stays separate.
    cy.get('.tool-preview-card').should('not.exist');
    cy.contains('ion-button', 'Draw Random').should('not.have.attr', 'disabled');

    // Start and lock a practice as the signed-in user.
    cy.contains('ion-button', 'Draw Random').click();
    cy.contains('ion-button', 'Start Today’s Practice').click();
    cy.get('.tool-preview-card').should('contain.text', 'Today’s practice is started.');
    cy.window().then((win) => {
      const scopedKey = Object.keys(win.localStorage).find((key) => key.startsWith('mct-weekend-beta:u:'));
      expect(scopedKey, 'user-scoped daily practice key').to.be.a('string');
    });

    // Signing out returns to the guest-scoped practice.
    cy.get('.sign-out-button').click();
    cy.get('.auth-panel').should('contain.text', 'Guest');
    cy.get('.tool-preview-card').should('contain.text', 'Today’s practice is started.');

    // Signing back in restores the user's own locked day.
    openAuthForm();
    cy.get('#auth-username').type(username);
    cy.get('#auth-password').type(password);
    cy.get('.sign-in-button').click();
    cy.get('.current-username').should('have.text', username);
    cy.get('.tool-preview-card').should('contain.text', 'Today’s practice is started.');

    // The httpOnly session cookie survives a reload.
    cy.reload();
    cy.get('.current-username').should('have.text', username);
    cy.get('.tool-preview-card').should('contain.text', 'Today’s practice is started.');
  });

  it('rejects a wrong password with a neutral error', () => {
    openAuthForm();
    cy.get('#auth-username').type(username);
    cy.get('#auth-password').type('wrong-password-999');
    cy.get('.sign-in-button').click();
    cy.get('.auth-error').should('contain.text', 'Invalid username or password');
    cy.get('.auth-panel').should('not.contain.text', 'Signed in as');
  });

  it('rejects invalid signup input with a validation message', () => {
    openAuthForm();
    cy.get('#auth-username').type('ab');
    cy.get('#auth-password').type('demo-pass-1234');
    cy.get('.create-account-button').click();
    cy.get('.auth-error').should('contain.text', 'Username must be at least 3 characters');
  });
});
