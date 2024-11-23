describe('Create Operation Request Modal', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/operationTypes', {
      statusCode: 200,
      body: [
        { id: 1, name: 'ACL Reconstruction Surgery' },
        { id: 2, name: 'Knee Replacement' }
      ]
    }).as('getOperationTypes');

    cy.intercept('GET', '**/api/staffs', {
      statusCode: 200,
      body: [
        { staffId: 'doc1', staffFullName: 'Dr. John Doe' },
        { staffId: 'doc2', staffFullName: 'Dr. Jane Smith' }
      ]
    }).as('getDoctors');

    cy.intercept('GET', '**/api/patients', {
      statusCode: 200,
      body: [
        { medicalRecordNumber: 'MRN001', fullName: 'John Patient' },
        { medicalRecordNumber: 'MRN002', fullName: 'Jane Patient' }
      ]
    }).as('getPatients');

    cy.intercept('POST', '**/api/operationRequests', (req) => {
      req.reply({
        statusCode: 201,
        body: {
          priority: 'Elective',
          operationTypeId: '00cc1f29-22bf-4113-963d-807b4d1813f3',
          status: 'OnSchedule',
          doctorId: 'D20240003',
          patientId: '202411000001',
          deadlineDate: '2024-12-01T00:00:00Z'
        }
      });
    }).as('createOperationRequest');

    cy.visit('/doctorDashboard/home');
  });

  it('should open modal from Operation Requests menu dropdown', () => {
    cy.get('app-menubar').contains('OperationRequests').click();
    cy.get('.p-menubar').then($submenu => {
      cy.log('Submenu items:', $submenu.text());
    });

    cy.get('.p-menubar').contains('CreateRequest').click({force:true});
    cy.get('.p-dialog').should('exist')
    cy.get('.p-dialog').should('be.visible');
    cy.get('.p-dialog .p-dialog-header').should('contain', 'Request Operation');
  });

  it('should show a warning toast when required fields are not filled', () => {
    cy.get('app-menubar').contains('OperationRequests').click();
    cy.get('.p-menubar').then($submenu => {
      cy.log('Submenu items:', $submenu.text());
    });

    cy.get('.p-menubar').contains('CreateRequest').click({force:true});  
  
      cy.get('button:contains("Save")').click({force:true});
  
      cy.get('.p-toast').should('contain', 'All required fields must be filled!');
    });


  it('should save operation request with valid data', () => {
    cy.get('app-menubar').contains('OperationRequests').click();
    cy.get('.p-menubar').contains('CreateRequest').click({ force: true });

    cy.wait('@getOperationTypes');
    cy.wait('@getDoctors');
    cy.wait('@getPatients');

    cy.get('#patientDropdown').click();
    cy.get('.p-dropdown-item').contains('John Patient').click();

    cy.get('#doctorDropdown').click();
    cy.get('.p-dropdown-item').contains('Dr. John Doe').click();

    cy.get('#operationTypeDropdown').click();
    cy.get('.p-dropdown-item').contains('ACL Reconstruction Surgery').click();

    cy.get('#priority1').click({ force: true });

    cy.get('#deadlineCalendar').type('1'); 
    cy.get('.p-datepicker').should('be.visible');
    cy.get('.p-datepicker-next').click({ force: true });
    cy.get('.p-datepicker-group').contains('30').click({ force: true }); 


    cy.get('p-button').contains('Save').click();

    cy.wait('@createOperationRequest').then((interception) => {
      expect(interception.response?.statusCode).to.eq(201);
      expect(interception.response?.body.patientId).to.eq('202411000001');
    });

    cy.get('.p-toast-message').should('contain', 'Operation Request Successfully Saved!');
    cy.get('.p-dialog-content').should('not.exist');
  });

  it('should close modal after successful save', () => {
    cy.get('app-menubar').contains('OperationRequests').click();
    cy.get('.p-menubar').contains('CreateRequest').click({ force: true });

    cy.wait('@getOperationTypes');
    cy.wait('@getDoctors');
    cy.wait('@getPatients');

    cy.get('#patientDropdown').click();
    cy.get('.p-dropdown-item').contains('John Patient').click();

    cy.get('#doctorDropdown').click();
    cy.get('.p-dropdown-item').contains('Dr. John Doe').click();

    cy.get('#operationTypeDropdown').click();
    cy.get('.p-dropdown-item').contains('ACL Reconstruction Surgery').click();
    
    cy.get('#priority1').click({ force: true });

    cy.get('#deadlineCalendar').type('1'); 
    cy.get('.p-datepicker').should('be.visible');
    cy.get('.p-datepicker-next').click({ force: true });
    cy.get('.p-datepicker-group').contains('30').click({ force: true }); 

    cy.get('p-button').contains('Save').click({ force: true });

    cy.get('.p-dialog-content').should('not.exist');
  });
});
