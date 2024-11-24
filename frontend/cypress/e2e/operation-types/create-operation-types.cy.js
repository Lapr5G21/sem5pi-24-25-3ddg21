describe('Create Operation Types Modal', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/specializations', {
      statusCode: 200,
      body: [
        { id: 1, specializationName: 'Anaesthetist' },
        { id: 2, specializationName: 'Circulating Nurse' },
        { id: 3, specializationName: 'Orthopedics' }
      ]
    }).as('getSpecializations');

    cy.intercept('POST', '**/api/operationtypes', (req) => {
      req.reply({
        statusCode: 201,
        body: {
          id: 1,
          name: 'ACL Reconstruction Surgery',
          estimatedDuration: 180,
          anesthesiaTime: 30,
          surgeryTime: 120,
          cleaningTime: 30,
          staffSpecializations: [
            { specializationId: 1, numberOfStaff: 2 }
          ]
        }
      });
    }).as('createOperationType');

    cy.visit('/adminDashboard/home');
  });

  it('should open modal from Operation Types menu dropdown', () => {
    cy.get('app-menubar').should('exist').within(() => {
      cy.contains('OperationTypes').click({ force: true });
    });

    cy.get('.p-menubar').should('be.visible').contains('Create');
    cy.get('.p-menubar').contains('Create Operation Type').click({ force: true });

    cy.get('.p-dialog-content').should('be.visible');
    cy.get('.p-dialog .p-dialog-header').should('contain', 'Add Operation Type');
  });

  it('should show validation errors when trying to save with empty form', () => {
    cy.get('app-menubar').contains('OperationTypes').click();
    cy.get('.p-menubar').contains('Create').click({ force: true });
  
    cy.get('p-button').contains('Save').should('be.disabled');

    cy.get('#operationTypeName')
        .should('be.visible') 
        .focus()
        .blur(); 

    cy.get('small.p-error.ng-star-inserted').should('exist').and('contain', 'Name is required.');

    cy.get('#estimatedDuration')
        .should('have.class', 'ng-invalid')
        .focus()
        .blur(); 
    cy.get('small.p-error.ng-star-inserted').should('exist').and('contain', 'Estimated Duration is required and must be at least 1 minute.');

    cy.get('#anesthesiaTime')
        .should('have.class', 'ng-invalid')
        .focus()
        .blur(); 
    cy.get('small.p-error.ng-star-inserted').should('exist').and('contain', 'Anesthesia Time is required and must be at least 1 minute.');

    cy.get('#surgeryTime')
        .should('have.class', 'ng-invalid')
        .focus()
        .blur(); 
    cy.get('small.p-error.ng-star-inserted').should('exist').and('contain', 'Surgery Time is required and must be at least 1 minute.');

    cy.get('#cleaningTime')
        .should('have.class', 'ng-invalid')
        .focus()
        .blur();
    cy.get('small.p-error.ng-star-inserted').should('exist').and('contain', 'Cleaning Time is required and must be at least 1 minute.');
});


  it('should save operation type with valid data', () => {
    cy.get('app-menubar').contains('OperationTypes').click();
    cy.get('.p-menubar').contains('Create').click({ force: true });

    cy.wait('@getSpecializations');

    cy.get('[id="operationTypeName"]').type('ACL Reconstruction Surgery');
    cy.get('[id="estimatedDuration"]').type('180');
    cy.get('[id="anesthesiaTime"]').type('30');
    cy.get('[id="surgeryTime"]').type('120');
    cy.get('[id="cleaningTime"]').type('30');

    cy.get('p-multiselect').click();
    cy.get('.p-multiselect-item').contains('Anaesthetist').click();
    cy.get('p-multiselect').click({force: true});

    cy.get('body').click();

    cy.get('p-table tbody tr').eq(0) 
    .find('input[type="number"]') 
    .type('2');

    cy.get('p-button').contains('Save').click();

    cy.wait('@createOperationType').then((interception) => {
      expect(interception.response?.statusCode).to.eq(201);
      expect(interception.response?.body.name).to.eq('ACL Reconstruction Surgery');
    });

    cy.get('.p-toast-message').should('contain', 'Tipo de operação salvo com sucesso!');
    cy.get('.p-dialog-content').should('not.exist');
  });

  it('should close modal after successful save', () => {
    cy.get('app-menubar').contains('OperationTypes').click();
    cy.get('.p-menubar').contains('Create').click({ force: true });

    cy.wait('@getSpecializations');

    cy.get('[id="operationTypeName"]').type('ACL Reconstruction Surgery');
    cy.get('[id="estimatedDuration"]').type('180');
    cy.get('[id="anesthesiaTime"]').type('30');
    cy.get('[id="surgeryTime"]').type('120');
    cy.get('[id="cleaningTime"]').type('30');

    cy.get('p-multiselect').click();
    cy.get('.p-multiselect-item').contains('Anaesthetist').click();
    cy.get('p-multiselect').click({force:true});

    cy.get('p-table tbody tr').eq(0) 
    .find('input[type="number"]') 
    .type('2');

    
    cy.get('p-button').contains('Save').click();

    cy.get('.p-dialog-content').should('not.exist');
  });
});
