describe('Create Room Types Modal', () => {
    beforeEach(() => {
        // Intercepta a chamada de API para criar um Room Type
        cy.intercept('POST', '**/api/roomTypes', (req) => {
            req.reply({
                statusCode: 201,
                body: {
                    code: "OR-00007",
                    designation: 'designation',
                    description: 'description',
                    isSuitableForSurgery: true,
                }
            });
        }).as('saveRoomType');

        // Visita a página inicial do painel administrativo
        cy.visit('/adminDashboard/home');
    });

    it('should open the Create Room Type modal', () => {
        cy.get('app-menubar').should('exist').within(() => {
            cy.contains('Room Types').trigger('mouseover');
        });

        cy.get('.p-menubar').should('be.visible').contains('Create Room Type').click({ force: true });

        cy.get('.p-dialog-content').should('be.visible');
        cy.get('.p-dialog-header').should('contain', 'Create Room Type');
    });

    it('should show validation errors when trying to save with empty fields', () => {
        cy.get('app-menubar').contains('Room Types').click();
        cy.get('.p-menubar').contains('Create Room Type').click({ force: true });

        cy.get('p-button').contains('Save').click();

        cy.get('#Code').should('be.visible');
        cy.get('div.error-text').should('contain', 'Code is required.');

        cy.get('#Designation').should('be.visible');
        cy.get('div.error-text').should('contain', 'Designation is required.');
    });

    it('should save room type with valid data', () => {
        cy.get('app-menubar').contains('Room Types').click();
        cy.get('.p-menubar').contains('Create Room Type').click({ force: true });

        cy.get('#Code').type('OR-00007');
        cy.get('#Designation').type('designation');
        cy.get('#Description').type('description');
        cy.get('#IsSuitableForSurgery').click();
        cy.get('.p-dropdown-item').contains('Yes').click();

        cy.get('p-button').contains('Save').click();

        cy.wait('@saveRoomType').then((interception) => {
            expect(interception.response?.statusCode).to.eq(201);
            expect(interception.response?.body.code).to.eq('OR-00007');
        });

        cy.get('.p-toast-message').should('contain', 'Room Type Successfully Saved!');
        cy.get('.p-dialog-content').should('not.exist');
    });

    it('should close the modal after a successful save', () => {
        cy.get('app-menubar').contains('Room Types').click();
        cy.get('.p-menubar').contains('Create Room Type').click({ force: true });

        cy.get('#Code').type('OR-00007');
        cy.get('#Designation').type('designation');
        cy.get('#Description').type('description');
        cy.get('#IsSuitableForSurgery').click();
        cy.get('.p-dropdown-item').contains('Yes').click();

        cy.get('p-button').contains('Save').click();

        cy.get('.p-dialog-content').should('not.exist');
    });
});
