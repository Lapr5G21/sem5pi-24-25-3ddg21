describe('Create Specialization Modal', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/api/specializations', (req) => {
      req.reply({
        statusCode: 201,
        body: {
          id: 1,
          name: 'Anaesthetist',
          code: '123',
          description: 'Specialization in anesthesia',
        }
      });
    }).as('createSpecialization');
  });
  
    it('should open modal from Create Specialization button', () => {
      cy.visit('/adminDashboard/home');
      cy.get('app-menubar').should('exist').within(() => {
        cy.contains('Specializations').click({ force: true });
      });
  
      cy.get('.p-menubar').should('be.visible').contains('Create Specialization').click({ force: true });
  
      cy.get('.p-dialog-content').should('be.visible');
      cy.get('.p-dialog .p-dialog-header').should('contain', 'Create Specialization');
    });
  

  it('should show validation errors when trying to save with empty form', () => {
    cy.visit('/adminDashboard/home');
    cy.get('app-menubar').should('exist').within(() => {
      cy.contains('Specializations').click({ force: true });
    });
    cy.get('.p-menubar').contains('Create Specialization').click({ force: true });
  
    cy.get('p-button').contains('Create').should('be.disabled');
  
    cy.get('#specializationName')
      .should('be.visible')
      .focus()
      .blur();
    cy.get('small.p-error.ng-star-inserted').should('exist').and('contain', 'Name is required.');
  
    cy.get('#specializationCode')
      .should('be.visible')
      .focus()
      .blur();
    cy.get('small.p-error.ng-star-inserted').should('exist').and('contain', 'Code is required.');
  });

  it('should save specialization with valid data', () => {
    cy.visit('/adminDashboard/home');
    cy.get('app-menubar').contains('Specializations').click();
    cy.get('.p-menubar').contains('Create Specialization').click({ force: true });
  
    cy.get('[id="specializationName"]').type('Anaesthetist');
    cy.get('[id="specializationCode"]').type('123');
    cy.get('[id="specializationDescription"]').type('Specialization in anesthesia');
  
    cy.get('p-button').contains('Create').click();
  
    cy.wait('@createSpecialization').then((interception) => {
      expect(interception.response?.statusCode).to.eq(201);
      expect(interception.response?.body.name).to.eq('Anaesthetist');
    });
  
    cy.get('.p-toast-message').should('contain', 'Specialization saved successfully!');
    cy.get('.p-dialog-content').should('not.exist');
  });

  it('should close modal after successful save', () => {
    cy.visit('/adminDashboard/home');
    cy.get('app-menubar').contains('Specializations').click();
    cy.get('.p-menubar').contains('Create Specialization').click({ force: true });
  
    cy.get('[id="specializationName"]').type('Anaesthetist');
    cy.get('[id="specializationCode"]').type('123');
    cy.get('[id="specializationDescription"]').type('Specialization in anesthesia');
  
    cy.get('p-button').contains('Create').click();
  
    cy.get('.p-dialog-content').should('not.exist');
  });

  it('should show error message if failed to save specialization', () => {
    cy.visit('/adminDashboard/home');
    cy.intercept('POST', '**/api/specializations', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('createSpecializationError');
  
    cy.get('app-menubar').contains('Specializations').click();
    cy.get('.p-menubar').contains('Create Specialization').click({ force: true });
  
    cy.get('[id="specializationName"]').type('Anaesthetist');
    cy.get('[id="specializationCode"]').type('123');
    cy.get('[id="specializationDescription"]').type('Specialization in anesthesia');
  
    cy.get('p-button').contains('Create').click();
  
    cy.wait('@createSpecializationError');
    cy.get('.p-toast-message').should('contain', 'Not possible to save operation.');
  });
})