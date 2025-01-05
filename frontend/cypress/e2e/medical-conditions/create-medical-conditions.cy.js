describe('Create Medical Condition Modal', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/api/medicalConditions', (req) => {
      req.reply({
        statusCode: 201,
        body: {
          id: 1,
          name: 'Hypertension',
          code: 'D12345',
          description: 'A condition in which the blood pressure in the arteries is consistently high, which can lead to serious health issues like heart disease or stroke if left untreated.',
          symptoms: 'Headaches, Shortness of breath, Dizziness, Chest pain, Fatigue',
        }
      });
    }).as('createMedicalCondition');
  });

  it('should open modal from Create Medical Condition button', () => {
    cy.visit('/adminDashboard/home');
    cy.get('app-menubar').should('exist').within(() => {
      cy.contains('Medical Conditions').click({ force: true });
    });

    cy.get('.p-menubar').should('be.visible').contains('Create Medical Condition').click({ force: true });

    cy.get('.p-dialog-content').should('be.visible');
    cy.get('.p-dialog .p-dialog-header').should('contain', 'Create Medical Condition');
  });

  it('should show validation errors when trying to save with empty form', () => {
    cy.visit('/adminDashboard/home');
    cy.get('app-menubar').should('exist').within(() => {
      cy.contains('Medical Conditions').click({ force: true });
    });
    cy.get('.p-menubar').contains('Create Medical Condition').click({ force: true });

    cy.get('p-button').contains('Create').should('be.disabled');

    cy.get('#name')
      .should('be.visible')
      .focus()
      .blur();
    cy.get('small.p-error.ng-star-inserted').should('exist').and('contain', 'Name is required.');

    cy.get('#code')
      .should('be.visible')
      .focus()
      .blur();
    cy.get('small.p-error.ng-star-inserted').should('exist').and('contain', 'Code is required.');

    cy.get('#description')
      .should('be.visible')
      .focus()
      .blur();
    cy.get('small.p-error.ng-star-inserted').should('exist').and('contain', 'Description is required.');

    cy.get('#symptoms')
      .should('be.visible')
      .focus()
      .blur();
    cy.get('small.p-error.ng-star-inserted').should('exist').and('contain', 'Symptoms are required.');
  });

  it('should save medical condition with valid data', () => {
    cy.visit('/adminDashboard/home');
    cy.get('app-menubar').contains('Medical Conditions').click();
    cy.get('.p-menubar').contains('Create Medical Condition').click({ force: true });
  
    cy.get('[id="name"]').type('Hypertension');
    cy.get('[id="code"]').type('D12345');
    cy.get('[id="description"]').type('A condition in which the blood pressure in the arteries is consistently high, which can lead to serious health issues like heart disease or stroke if left untreated.');
    cy.get('[id="symptoms"]').type('Headaches, Shortness of breath, Dizziness, Chest pain, Fatigue');
  
    cy.get('p-button').contains('Create').should('not.be.disabled');
  
    cy.get('p-button').contains('Create').click();
  
    cy.wait('@createMedicalCondition').then((interception) => {
      expect(interception.response?.statusCode).to.eq(201);
      expect(interception.response?.body.name).to.eq('Hypertension');
    });
  
    cy.get('.p-toast-message').should('contain', 'Medical condition saved successfully!');
    cy.get('.p-dialog-content').should('not.exist');
  });
  

  it('should close modal after successful save', () => {
    cy.visit('/adminDashboard/home');
    cy.get('app-menubar').contains('Medical Conditions').click();
    cy.get('.p-menubar').contains('Create Medical Condition').click({ force: true });

    cy.get('[id="name"]').type('Hypertension');
    cy.get('[id="code"]').type('D12345');
    cy.get('[id="description"]').type('A condition in which the blood pressure in the arteries is consistently high, which can lead to serious health issues like heart disease or stroke if left untreated.');
    cy.get('[id="symptoms"]').type('Headaches, Shortness of breath, Dizziness, Chest pain, Fatigue');

    cy.get('p-button').contains('Create').click();

    cy.get('.p-dialog-content').should('not.exist');
  });

  it('should show error message if failed to save medical condition', () => {
    cy.intercept('POST', '**/api/medicalConditions', {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
    }).as('createMedicalConditionError');
  
    cy.visit('/adminDashboard/home');
    cy.get('app-menubar').contains('Medical Conditions').click();
    cy.get('.p-menubar').contains('Create Medical Condition').click({ force: true });
  
    cy.get('[id="name"]').type('Hypertension');
    cy.get('[id="code"]').type('D12345');
    cy.get('[id="description"]').type('A condition in which the blood pressure in the arteries is consistently high, which can lead to serious health issues like heart disease or stroke if left untreated.');
    cy.get('[id="symptoms"]').type('Headaches, Shortness of breath, Dizziness, Chest pain, Fatigue');
  
    cy.get('p-button').contains('Create').click();
  
    cy.wait('@createMedicalConditionError');
  
    cy.get('.p-toast-message').should('contain', 'Not possible to save medical condition.');
  });
});
