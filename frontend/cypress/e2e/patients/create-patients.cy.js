describe('Create Patients Modal', () => {
    beforeEach(() => {
        cy.intercept('POST', '**/api/patients', (req) => {
            req.reply({
                statusCode: 201,
                body: {
                    id: 202411000003,
                    firstName: 'John',
                    lastName: 'Doe',
                    fullName: 'John Doe',
                    birthDate: '2004-06-27',
                    gender: 'Male',
                    email: 'john.doe@example.com',
                    phoneNumber: '912345678',
                    address: '123 Main St, Lisbon, Portugal',
                    emergencyContact: '912345678'
                }
            });
        }).as('savePatient');

        cy.visit('/adminDashboard/home');
    });

    it('should open modal from Patients menu dropdown', () => {
        cy.get('app-menubar').should('exist').within(() => {
            cy.contains('Patients').trigger('mouseover');
        });

        cy.get('.p-menubar').should('be.visible').contains('Create');
        cy.get('.p-menubar').contains('Create Patient').click({ force: true });

        cy.get('.p-dialog-content').should('be.visible');
        cy.get('.p-dialog-header').should('contain', 'Create Patient');
    });

    it('should show validation errors after trying to save with empty form', () => {
        cy.get('app-menubar').contains('Patients').click();
        cy.get('.p-menubar').contains('Create Patient').click({ force: true });

        cy.get('p-button').contains('Save').click();

        // Wait for the form fields to be rendered and validate First Name field
        cy.get('#FirstName').should('be.visible');
        cy.get('div.error-text').should('contain', 'First name is required.');

        // Validate Last Name field
        cy.get('#LastName').should('be.visible');
        cy.get('div.error-text').should('contain', 'Last name is required.');

        // Validate Full Name field
        cy.get('#FullName').should('be.visible');
        cy.get('div.error-text').should('contain', 'Full name is required.');

        cy.get('#auxBirthDate').should('be.visible');

        // Validate Gender field
        cy.get('#Gender').should('be.visible');
        //cy.get('div.error-text').should('contain', 'Gender is required.');

        // Validate Email field
        cy.get('#Email').should('be.enabled');
        cy.get('div.error-text').should('contain', 'Email is required.');

        // Validate Phone Number field
        cy.get('#PhoneNumber').should('be.enabled');
        cy.get('div.error-text').should('contain', 'Phone number is required.');

        // Validate Address field
        cy.get('#Address').should('be.enabled');
        cy.get('div.error-text').should('contain', 'Address is required.');

        // Validate Emergency Contact Phone
        cy.get('#EmergencyContact').should('be.enabled');
        cy.get('div.error-text').should('contain', 'Emergency Contact is required.');
    });

    it('should save patient with valid data', () => {
        cy.get('app-menubar').contains('Patients').click();
        cy.get('.p-menubar').contains('Create Patient').click({ force: true });

        cy.get('#FirstName').type('John');
        cy.get('#LastName').type('Doe');
        cy.get('#FullName').type('John Doe');

        cy.get('#auxBirthDate').click(); // Abre o calendário
        cy.get('.p-datepicker').should('be.visible');
        cy.get('.p-datepicker-next').click({ force: true });
        cy.get('.p-datepicker-group').contains('30').click({ force: true }); 
        
        cy.get('#Gender').click({});
        cy.get('.p-dropdown-panel');
        cy.get('.p-dropdown-item').contains('Male').click({ force: true });
        

        cy.get('#Email').type('john.doe@example.com');
        cy.get('#PhoneNumber').type('912345678');
        cy.get('#Address').type('123 Main St, Lisbon, Portugal');

        
        cy.get('#EmergencyContact').type('923456789');

        cy.get('p-button').contains('Save').click();

        cy.wait('@savePatient').then((interception) => {
            expect(interception.response?.statusCode).to.eq(201);
            expect(interception.response?.body.firstName).to.eq('John');
            expect(interception.response?.body.email).to.eq('john.doe@example.com');
        });

        cy.get('.p-toast-message').should('contain', 'Patient Successfully Saved!');
        cy.get('.p-dialog-content').should('not.exist');
    });

    it('should close modal after successful save', () => {
        cy.get('app-menubar').contains('Patients').click();
        cy.get('.p-menubar').contains('Create Patient').click({ force: true });

        cy.get('#FirstName').type('John');
        cy.get('#LastName').type('Doe');
        cy.get('#FullName').type('John Doe');
        cy.get('#auxBirthDate').click(); // Abre o calendário
        cy.get('.p-datepicker').should('be.visible');
        cy.get('.p-datepicker-next').click({ force: true });
        cy.get('.p-datepicker-group').contains('30').click({ force: true });         


        
        cy.get('#Gender').click({});
        cy.get('.p-dropdown-panel'); 
        cy.get('.p-dropdown-item').contains('Male').click({ force: true });
        
        

        cy.get('#Email').type('john.doe@example.com');
        cy.get('#PhoneNumber').type('912345678');
        cy.get('#Address').type('123 Main St, Lisbon, Portugal');

        cy.get('#EmergencyContact').type('923456789');

        cy.get('p-button').contains('Save').click();

        cy.get('.p-dialog-content').should('not.exist');
    });
});
