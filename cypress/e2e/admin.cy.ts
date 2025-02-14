describe('Admin Dashboard', () => {
  beforeEach(() => {
    cy.loginAdmin();
  });

  it('Manages content', () => {
    cy.visit('/admin/content');
    cy.contains('Content Management');
    cy.get('[data-testid="new-content"]').click();
    cy.get('#title').type('Test Content');
    cy.get('#slug').type('test-content');
    cy.get('[data-testid="save-content"]').click();
    cy.contains('Test Content');
  });
}); 