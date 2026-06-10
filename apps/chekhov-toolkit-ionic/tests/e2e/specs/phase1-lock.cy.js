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

describe('Chekhov Toolkit Phase 1 lock slice', () => {
  beforeEach(() => {
    cy.viewport(MOBILE_VIEWPORT.width, MOBILE_VIEWPORT.height);
    cy.visit('/home', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
  });

  it('locks and reloads a Draw Random practice at mobile width', () => {
    cy.title().should('eq', 'The Michael Chekhov Toolkit');
    cy.contains('h1', 'Today’s Practice').should('be.visible');
    cy.contains('ion-button', 'Pick My Own').should('be.visible');
    cy.contains('ion-button', 'Draw Random').should('be.visible').click();
    cy.get('.tool-preview-card').should('contain.text', 'Preview');
    cy.contains('ion-button', 'Start Today’s Practice').click();
    cy.get('.tool-preview-card').should('contain.text', 'Today’s practice is started.');
    cy.contains('ion-button', 'Draw Random').should('have.attr', 'disabled');

    cy.reload();
    cy.get('.tool-preview-card').should('contain.text', 'Today’s practice is started.');
    cy.window().then((win) => {
      const key = Object.keys(win.localStorage).find((storageKey) => storageKey.startsWith('mct-weekend-beta:daily-practice:'));
      expect(key, 'daily practice localStorage key').to.be.a('string');
      const practice = JSON.parse(win.localStorage.getItem(key));
      expect(practice.status).to.equal('started');
      expect(practice.selectedTool.categoryName).to.be.a('string').and.not.empty;
      expect(practice.selectedTool.parentToolName).to.be.a('string').and.not.empty;
    });

    cy.document().then((doc) => {
      expect(doc.documentElement.scrollWidth, 'no horizontal overflow').to.be.lte(doc.documentElement.clientWidth);
    });
    cy.screenshot('chekhov-phase1-lock-mobile');
  });

  it('previews Pick My Own and Daily Tool entry paths', () => {
    cy.contains('ion-button', 'Pick My Own').click();
    cy.get('.tool-preview-card').should('contain.text', 'Pick My Own').and('contain.text', 'Preview');

    cy.visit('/home', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
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

    cy.window().then((win) => {
      const practiceKey = Object.keys(win.localStorage).find((storageKey) => storageKey.startsWith('mct-weekend-beta:daily-practice:'));
      const poaKey = Object.keys(win.localStorage).find((storageKey) => storageKey.startsWith('mct-weekend-beta:poa:'));
      expect(practiceKey, 'daily practice localStorage key').to.be.a('string');
      expect(poaKey, 'POA localStorage key').to.be.a('string');

      const practice = JSON.parse(win.localStorage.getItem(practiceKey));
      const poa = JSON.parse(win.localStorage.getItem(poaKey));
      expect(practice.poaEntry.journalText).to.equal(dailyAction);
      expect(poa.journalText).to.equal(dailyAction);
      expect(poa.mode).to.equal('journal');
    });
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
