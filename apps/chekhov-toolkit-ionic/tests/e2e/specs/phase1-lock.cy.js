const MOBILE_VIEWPORT = {
  width: 390,
  height: 844,
};

function scrollToolkitContentToBottom() {
  cy.get('ion-content.toolkit-page')
    .should('have.class', 'hydrated')
    .then(($content) => $content[0].scrollToBottom(0));
}

function expectInViewport($element, label) {
  const rect = $element[0].getBoundingClientRect();
  const viewportHeight = $element[0].ownerDocument.defaultView.innerHeight;
  const viewportWidth = $element[0].ownerDocument.defaultView.innerWidth;

  expect(rect.height, `${label} height`).to.be.greaterThan(0);
  expect(rect.width, `${label} width`).to.be.greaterThan(0);
  expect(rect.top, `${label} top`).to.be.at.least(0);
  expect(rect.right, `${label} right`).to.be.at.most(viewportWidth);
  expect(rect.bottom, `${label} bottom`).to.be.at.most(viewportHeight);
}

function expectRendered($element, label) {
  const rect = $element[0].getBoundingClientRect();

  expect($element.css('display'), `${label} display`).not.to.equal('none');
  expect($element.css('visibility'), `${label} visibility`).not.to.equal('hidden');
  expect(rect.height, `${label} height`).to.be.greaterThan(0);
  expect(rect.width, `${label} width`).to.be.greaterThan(0);
}

const testEmailDomain = Cypress.env('TEST_EMAIL_DOMAIN') || 'skyelandersolutions.com';

function uniqueEmail(prefix = 'phase1') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}@${testEmailDomain}`;
}

function signUpForPractice() {
  cy.get('.show-auth-form-button').click();
  cy.get('#auth-email').type(uniqueEmail());
  cy.get('#auth-password').type('demo-pass-1234');
  cy.get('.create-account-button').click();
  cy.get('.current-username', { timeout: 10000 }).should('contain.text', `@${testEmailDomain}`);
}

describe('Chekhov Toolkit Phase 1 lock slice', () => {
  beforeEach(() => {
    cy.viewport(MOBILE_VIEWPORT.width, MOBILE_VIEWPORT.height);
    cy.visit('/home', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
    signUpForPractice();
  });

  it('locks and reloads a Draw Random practice at mobile width', () => {
    cy.title().should('eq', 'The Michael Chekhov Toolkit');
    cy.contains('h1', 'Today’s Practice').should('exist');
    cy.contains('ion-button', 'Pick My Own').should('exist');
    cy.contains('ion-button', 'Draw Random').should('exist').click();
    cy.get('.tool-preview-card').should('contain.text', 'Preview');
    cy.contains('ion-button', 'Start Today’s Practice').click();
    cy.get('.tool-preview-card').should('contain.text', 'Today’s practice is started.');
    cy.contains('ion-button', 'Draw Random').should('have.attr', 'disabled');

    cy.reload();
    cy.get('.tool-preview-card').should('contain.text', 'Today’s practice is started.');
    cy.document().then((doc) => {
      expect(doc.documentElement.scrollWidth, 'no horizontal overflow').to.be.lte(doc.documentElement.clientWidth);
    });
    cy.screenshot('chekhov-phase1-lock-mobile');
  });

  it('previews Pick My Own and Daily Tool entry paths', () => {
    cy.contains('ion-button', 'Pick My Own').click();
    cy.get('.category-detail-modal').should('be.visible');
    cy.contains('.parent-tool-row', 'Expanding').find('.preview-tool-button').click();
    cy.get('.tool-preview-card')
      .should('contain.text', 'Pick My Own')
      .and('contain.text', 'Preview')
      .and('contain.text', 'Expanding');

    cy.visit('/home', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
    signUpForPractice();
    cy.contains('ion-button', 'Daily Tool').click();
    cy.get('.tool-preview-card').should('contain.text', 'Daily Tool').and('contain.text', 'Preview');
  });

  it('saves and restores a Daily Action / POA note after starting practice', () => {
    const dailyAction = 'Carry the Atmosphere into the first rehearsal entrance.';

    cy.contains('ion-button', 'Draw Random').should('be.visible').click();
    cy.contains('ion-button', 'Start Today’s Practice').click();
    cy.contains('h2', 'Daily Action / POA').should('be.visible');

    cy.get('textarea[aria-label="Daily Action / POA note"]')
      .should('be.visible')
      .type(dailyAction);
    cy.contains('ion-button', 'Save Daily Action').click();
    cy.contains('Daily Action saved.').should(($note) => expectRendered($note, 'saved note'));

    cy.reload();
    cy.get('.tool-preview-card').should('contain.text', 'Today’s practice is started.');
    cy.get('textarea[aria-label="Daily Action / POA note"]').should('have.value', dailyAction);
    cy.contains('Daily Action saved.').should(($note) => expectRendered($note, 'saved note'));

  });

  it('keeps attribution visible', () => {
    scrollToolkitContentToBottom();

    cy.get('.attribution-card')
      .should('contain.text', 'Chart of Inspired Action © 2004 National Michael Chekhov Association')
      .and('contain.text', 'Lisa Dalton, NMCA President and Master Teacher')
      .and(($card) => {
        expect($card.css('display'), 'attribution display').not.to.equal('none');
        expect($card.css('visibility'), 'attribution visibility').not.to.equal('hidden');
        expectInViewport($card, 'attribution card');
      });
  });
});
