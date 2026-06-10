const MOBILE_VIEWPORT = {
  width: 390,
  height: 844,
};

function expectNoHorizontalOverflow() {
  cy.document().then((doc) => {
    expect(doc.documentElement.scrollWidth, 'no horizontal overflow').to.be.lte(doc.documentElement.clientWidth);
  });
}

describe('Category detail sheet and parent-tool filters', () => {
  beforeEach(() => {
    cy.viewport(MOBILE_VIEWPORT.width, MOBILE_VIEWPORT.height);
    cy.visit('/home', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
  });

  it('opens category detail from a chart node with family, parent tools, and child labels', () => {
    cy.get('.chart-node').first().click();
    cy.get('.category-detail-modal').should('be.visible');
    cy.get('.detail-title').should('contain.text', 'Expanding & Contracting');
    cy.get('.detail-family').should('contain.text', 'PsychoPhysical');
    cy.get('.parent-tool-row').should('have.length', 2);
    cy.contains('.parent-tool-row', 'Expanding').within(() => {
      cy.contains('.child-chip', 'Opening').should('be.visible');
      cy.contains('.child-chip', 'Blossoming').should('be.visible');
    });
    cy.get('.tool-count-pill').should('contain.text', '2 of 2 selected');

    expectNoHorizontalOverflow();
    cy.get('.close-detail').click();
    cy.get('.category-detail-modal').should('not.be.visible');
  });

  it('supports Select All / Deselect All with a live selected count', () => {
    cy.contains('.directory-row', 'Archetypal Gestures').find('.directory-details').click();
    cy.get('.category-detail-modal').should('be.visible');
    cy.get('.detail-title').should('contain.text', 'Archetypal Gestures');
    cy.get('.tool-count-pill').should('contain.text', '10 of 10 selected');

    cy.get('.deselect-all-tools').click();
    cy.get('.tool-count-pill').should('contain.text', '0 of 10 selected');
    cy.contains('excluded from Draw Random').should('be.visible');

    cy.get('.select-all-tools').click();
    cy.get('.tool-count-pill').should('contain.text', '10 of 10 selected');
  });

  it('Draw Random respects parent-tool filters', () => {
    // Narrow Archetypal Gestures to only "Push".
    cy.contains('.directory-row', 'Archetypal Gestures').find('.directory-details').click();
    cy.get('.category-detail-modal').should('be.visible');
    cy.get('.deselect-all-tools').click();
    cy.contains('.parent-tool-row', 'Push').find('ion-checkbox').click();
    cy.get('.tool-count-pill').should('contain.text', '1 of 10 selected');
    cy.get('.close-detail').click();
    cy.get('.category-detail-modal').should('not.be.visible');

    // Narrow the pool to that single chart area, then draw.
    cy.contains('ion-button', 'Clear').click();
    cy.contains('.directory-toggle', 'Archetypal Gestures').click();
    cy.get('.count-badge').should('contain.text', '1 / 15 areas · 1 tool');

    cy.contains('ion-button', 'Draw Random').click();
    cy.get('.tool-preview-card')
      .should('contain.text', 'Archetypal Gestures')
      .and('contain.text', 'Push');
  });

  it('disables Draw Random when every parent tool is deselected', () => {
    cy.contains('ion-button', 'Clear').click();
    cy.contains('.directory-toggle', 'Four Brothers of Art').click();
    cy.contains('.directory-row', 'Four Brothers of Art').find('.directory-details').click();
    cy.get('.deselect-all-tools').click();
    cy.get('.close-detail').click();
    cy.get('.category-detail-modal').should('not.be.visible');

    cy.get('ion-content.toolkit-page')
      .should('have.class', 'hydrated')
      .then(($content) => $content[0].scrollToBottom(0));
    cy.contains('All parent tools are deselected').should('be.visible');
    cy.contains('ion-button', 'Draw Random').should('have.attr', 'disabled');
  });

  it('Pick My Own intentionally previews a chosen parent tool from the open category', () => {
    cy.contains('.directory-row', 'Four Brothers of Art').find('.directory-details').click();
    cy.get('.category-detail-modal').should('be.visible');
    cy.contains('.parent-tool-row', 'Entirety').find('.preview-tool-button').click();
    cy.get('.category-detail-modal').should('not.be.visible');

    cy.get('.tool-preview-card')
      .should('contain.text', 'Pick My Own')
      .and('contain.text', 'Preview')
      .and('contain.text', 'Four Brothers of Art')
      .and('contain.text', 'Entirety');

    // The Pick My Own entry path re-opens the highlighted category for changes.
    cy.contains('ion-button', 'Pick My Own').click();
    cy.get('.category-detail-modal').should('be.visible');
    cy.get('.detail-title').should('contain.text', 'Four Brothers of Art');
    cy.get('.close-detail').click();
  });

  it('locks chart, directory, and filter controls after Start Today’s Practice', () => {
    cy.contains('ion-button', 'Draw Random').click();
    cy.contains('ion-button', 'Start Today’s Practice').click();
    cy.get('.tool-preview-card').should('contain.text', 'Today’s practice is started.');

    cy.get('.chart-node').first().should('be.disabled');
    cy.get('.directory-toggle').first().should('be.disabled');
    cy.get('.directory-details').first().should('be.disabled');
    cy.contains('ion-button', 'Select all').should('have.attr', 'disabled');
    cy.contains('ion-button', 'Clear').should('have.attr', 'disabled');
    cy.contains('ion-button', 'Draw Random').should('have.attr', 'disabled');
    cy.contains('ion-button', 'Pick My Own').should('have.attr', 'disabled');
    cy.contains('ion-button', 'Daily Tool').should('have.attr', 'disabled');

    expectNoHorizontalOverflow();
  });
});
