/// <reference types="cypress" />

function expectNoHorizontalOverflow() {
  cy.document().then((doc) => {
    expect(doc.documentElement.scrollWidth, 'no horizontal overflow').to.be.lte(doc.documentElement.clientWidth);
  });
}

describe('Connect group chat (signed out)', () => {
  beforeEach(() => {
    cy.viewport(390, 844);
  });

  it('opens group chat from the Connect tab entry card', () => {
    cy.visit('/map');
    cy.get('[data-testid="connect-chat-entry"]').should('exist').scrollIntoView();
    cy.get('[data-testid="connect-chat-entry"]').contains('Beta');
    expectNoHorizontalOverflow();

    cy.get('[data-testid="connect-chat-entry"]').click();
    cy.location('pathname').should('eq', '/connect/chat');
  });

  it('gates the room list behind tester access when signed out', () => {
    cy.visit('/connect/chat');
    cy.get('[data-testid="chat-tester-gate"]').should('exist');
    cy.contains('Tester access is required to join and read group rooms.').should('exist');
    // No room data affordances leak to signed-out visitors.
    cy.get('[data-testid="chat-room-list"]').should('not.exist');
    cy.get('[data-testid="chat-create-room"]').should('not.exist');
    expectNoHorizontalOverflow();
  });

  it('gates a direct room URL and keeps the composer hidden when signed out', () => {
    cy.visit('/connect/chat/00000000-0000-0000-0000-000000000000');
    cy.contains('Tester access is required to read this room.').should('exist');
    cy.get('[data-testid="chat-composer-input"]').should('not.exist');
    expectNoHorizontalOverflow();
  });

  it('keeps the chat pages overflow-free at 320px', () => {
    cy.viewport(320, 640);

    cy.visit('/map');
    expectNoHorizontalOverflow();

    cy.visit('/connect/chat');
    expectNoHorizontalOverflow();
  });
});
