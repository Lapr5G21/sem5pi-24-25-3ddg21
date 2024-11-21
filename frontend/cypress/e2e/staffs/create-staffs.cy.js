describe('Create Staffs Modal', () => {
    beforeEach(() => {
        cy.intercept('GET', '**/api/specializations', {
            statusCode: 200,
            body: [
                { id: '1', specializationName: 'Nursing' },
                { id: '2', specializationName: 'Surgery' },
                { id: '3', specializationName: 'Anesthesiology' }
            ]
        }).as('getSpecializations');

        cy.intercept('GET', '**/api/users', {
            statusCode: 200,
            body: [
                { username: 'john.doe', email: 'john.doe@example.com' },
                { username: 'jane.smith', email: 'jane.smith@example.com' }
            ]
        }).as('getUsers');

        cy.intercept('POST', '**/api/staffs', (req) => {
            req.reply({
                statusCode: 201,
                body: {
                    id: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                    fullName: 'John Doe',
                    licenseNumber: '12345',
                    email: 'john.doe@example.com',
                    phoneNumber: '912345678',
                    specializations: [{ specializationId: '1' }],
                    user: { username: 'john.doe', email: 'john.doe@example.com' }
                }
            });
        }).as('saveStaff');

        cy.visit('/adminDashboard/home');
    });

    it('should open modal from Staff menu dropdown', () => {
        cy.get('app-menubar').should('exist').within(() => {
            cy.contains('Staffs').trigger('mouseover');
        });

        cy.get('.p-menubar').should('be.visible').contains('Create');
        cy.get('.p-menubar').contains('Create Staff').click({ force: true });

        cy.get('.p-dialog-content').should('be.visible');
        cy.get('.p-dialog-header').should('contain', 'Add Staff');
    });

    it('should show validation errors after trying to save with empty form', () => {
        cy.get('app-menubar').contains('Staffs').click();
        cy.get('.p-menubar').contains('Create Staff').click({ force: true });
    
        cy.get('p-button').contains('Save').click();
    
        // Wait for the form fields to be rendered and validate First Name field
        cy.get('#staffFirstName').should('be.visible');
        cy.get('div.error-text').should('contain', 'First name is required.');
    
        // Validate Last Name field
        cy.get('#staffLastName').should('be.visible');
        cy.get('div.error-text').should('contain', 'Last name is required.');
    
        // Validate Full Name field
        cy.get('#staffFullName').should('be.visible');
        cy.get('div.error-text').should('contain', 'Full name is required.');
    
        // Validate License Number field
        cy.get('#staffLicenseNumber').should('be.visible');
        cy.get('div.error-text').should('contain', 'License number is required.');
    
        // Validate Specialization field
        cy.get('#specializations').should('be.visible');
        cy.get('div.error-text').should('contain', 'A specialization must be selected.');
    
        // Validate User field
        cy.get('#users').should('be.visible');
        cy.get('div.error-text').should('contain', 'A user must be selected.');
    
        // Validate Email field (Wait for the input field to be visible and valid)
        cy.get('#staffEmail').should('be.enabled')
        cy.get('div.error-text').should('contain', 'Please enter a valid email address.');
        
        // Validate Phone Number field
        cy.get('#staffPhoneNumber').should('be.enabled');
        cy.get('div.error-text').should('contain', 'The number must start with 91, 92, 93, or 96 and must have 9 digits.');
    });
    

    it('should save staff with valid data', () => {
        cy.get('app-menubar').contains('Staffs').click();
        cy.get('.p-menubar').contains('Create Staff').click({ force: true });

        cy.wait('@getSpecializations');
        cy.wait('@getUsers');

        cy.get('#staffFirstName').type('John');
        cy.get('#staffLastName').type('Doe');
        cy.get('#staffFullName').type('John Doe');
        cy.get('#staffLicenseNumber').type('12345');

        cy.get('#specializations').click();
        cy.get('.p-dropdown-item').contains('Nursing').click();
        cy.get('#specializations').click({ force: true });

        cy.get('#users').click();
        cy.get('.p-dropdown-item').contains('john.doe').click();
        cy.get('#users').click({ force: true });

        cy.get('#staffEmail').type('john.doe@example.com');
        cy.get('#staffPhoneNumber').type('912345678');

        cy.get('p-button').contains('Save').click();

        cy.wait('@saveStaff').then((interception) => {
            expect(interception.response?.statusCode).to.eq(201);
            expect(interception.response?.body.firstName).to.eq('John');
            expect(interception.response?.body.user.username).to.eq('john.doe');
        });

        cy.get('.p-toast-message').should('contain', 'Staff saved successfully!');
        cy.get('.p-dialog-content').should('not.exist');
    });

    it('should close modal after successful save', () => {
        cy.get('app-menubar').contains('Staffs').click();
        cy.get('.p-menubar').contains('Create Staff').click({ force: true });

        cy.wait('@getSpecializations');
        cy.wait('@getUsers');

        cy.get('#staffFirstName').type('John');
        cy.get('#staffLastName').type('Doe');
        cy.get('#staffFullName').type('John Doe');
        cy.get('#staffLicenseNumber').type('12345');

        cy.get('#specializations').click();
        cy.get('.p-dropdown-item').contains('Nursing').click();
        cy.get('#specializations').click({ force: true });

        cy.get('#users').click();
        cy.get('.p-dropdown-item').contains('john.doe').click();
        cy.get('#users').click({ force: true });

        cy.get('#staffEmail').type('john.doe@example.com');
        cy.get('#staffPhoneNumber').type('912345678');


        cy.get('p-button').contains('Save').click();

        cy.get('.p-dialog-content').should('not.exist');
    });
});
