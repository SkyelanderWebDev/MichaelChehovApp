/// <reference types="cypress" />

describe('The Michael Chekhov Toolkit app shell', () => {
  beforeEach(() => {
    cy.viewport(390, 844)
    cy.visit('/')
  })

  it('redirects from root to the Today’s Practice experience', () => {
    cy.title().should('eq', 'The Michael Chekhov Toolkit')
    cy.location('pathname').should('eq', '/home')
    cy.contains('h1', 'Today’s Practice').should('exist')
    cy.contains('ion-button', 'Pick My Own').should('exist')
    cy.contains('ion-button', 'Draw Random').should('exist')
    cy.contains('ion-button', 'Daily Tool').should('exist')
  })
})
