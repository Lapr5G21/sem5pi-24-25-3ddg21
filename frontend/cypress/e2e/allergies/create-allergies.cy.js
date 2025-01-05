describe('Create Allergy Modal', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/api/allergies', (req) => {
        req.reply({
          statusCode: 201,
          body: {
            id: 1,
            name: 'Pollen Allergy',
            code: '123456',
            description: 'Allergy to pollen',
          }
        });
      }).as('createAllergy');
    });
  
    it('should open modal from Create Allergy button', () => {
      cy.visit('/adminDashboard/home');
      cy.get('app-menubar').should('exist').within(() => {
        cy.contains('Allergies').click({ force: true });
      });
  
      cy.get('.p-menubar').should('be.visible').contains('Create Allergy').click({ force: true });
  
      cy.get('.p-dialog-content').should('be.visible');
      cy.get('.p-dialog .p-dialog-header').should('contain', 'Create Allergy');
    });
  
    it('should show validation errors when trying to save with empty form', () => {
      cy.visit('/adminDashboard/home');
      cy.get('app-menubar').should('exist').within(() => {
        cy.contains('Allergies').click({ force: true });
      });
      cy.get('.p-menubar').contains('Create Allergy').click({ force: true });
  
      cy.get('p-button').contains('Create').should('be.disabled');
  
      cy.get('#allergyName')
        .should('be.visible')
        .focus()
        .blur();
      cy.get('small.p-error.ng-star-inserted').should('exist').and('contain', 'Name is required.');
  
      cy.get('#allergyCode')
        .should('be.visible')
        .focus()
        .blur();
      cy.get('small.p-error.ng-star-inserted').should('exist').and('contain', 'Code is required.');
  
      cy.get('#allergyDescription')
        .should('be.visible')
        .focus()
        .blur();
      cy.get('small.p-error.ng-star-inserted').should('exist').and('contain', 'Description is required.');
    });
  
    it('should save allergy with valid data', () => {
      cy.visit('/adminDashboard/home');
      cy.get('app-menubar').contains('Allergies').click();
      cy.get('.p-menubar').contains('Create Allergy').click({ force: true });
  
      cy.get('[id="allergyName"]').type('Pollen Allergy');
      cy.get('[id="allergyCode"]').type('123456');
      cy.get('[id="allergyDescription"]').type('Allergy to pollen');
  
      cy.get('p-button').contains('Create').click();
  
      cy.wait('@createAllergy').then((interception) => {
        expect(interception.response?.statusCode).to.eq(201);
        expect(interception.response?.body.name).to.eq('Pollen Allergy');
      });
  
      cy.get('.p-toast-message').should('contain', 'Allergy saved successfully!');
      cy.get('.p-dialog-content').should('not.exist');
    });
  
    it('should close modal after successful save', () => {
      cy.visit('/adminDashboard/home');
      cy.get('app-menubar').contains('Allergies').click();
      cy.get('.p-menubar').contains('Create Allergy').click({ force: true });
  
      cy.get('[id="allergyName"]').type('Pollen Allergy');
      cy.get('[id="allergyCode"]').type('123456');
      cy.get('[id="allergyDescription"]').type('Allergy to pollen');
  
      cy.get('p-button').contains('Create').click();
  
      cy.get('.p-dialog-content').should('not.exist');
    });
  
    it('should show error message if failed to save allergy', () => {
      cy.visit('/adminDashboard/home');
      cy.intercept('POST', '**/api/allergies', {
        statusCode: 500,
        body: { error: 'Internal Server Error' }
      }).as('createAllergyError');
  
      cy.get('app-menubar').contains('Allergies').click();
      cy.get('.p-menubar').contains('Create Allergy').click({ force: true });
  
      cy.get('[id="allergyName"]').type('Pollen Allergy');
      cy.get('[id="allergyCode"]').type('123456');
      cy.get('[id="allergyDescription"]').type('Allergy to pollen');
  
      cy.get('p-button').contains('Create').click();
  
      cy.wait('@createAllergyError');
      cy.get('.p-toast-message').should('contain', 'Not possible to save allergy.');
    });
  });
  