describe('Chekhov Toolkit Phase 1 lock slice', () => {
  beforeEach(() => {
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

  it('keeps attribution visible', () => {
    cy.contains('Chart of Inspired Action © 2004 National Michael Chekhov Association').should('be.visible');
    cy.contains('Lisa Dalton, NMCA President and Master Teacher').should('be.visible');
  });
});
