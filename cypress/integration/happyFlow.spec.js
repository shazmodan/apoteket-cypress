describe('Happy flow genom apoteket.se', () => {
	it('should work', () => {
		cy.visit('https://www.apoteket.se')

		// Cookie policy disable
		cy.get('.cookie-info')
			.find('#accept-cookie-info')
			.should('be.visible')
			.click()
			.should('not.exist')

		cy.get('.mega-menu-link').click()

		cy.get('#main')
			.contains('Huvudvärk')
			.click()

		// Grab the first product returned by search result
		cy.get('.product-hits .unit.search-item.product')
			.eq(0)
			.should('be.visible')
			.contains('Köp')
			.click()

		cy.get('body')
			.contains('Till kassan')
			.click()

		cy.get('#productSummary .cart-list .cart-item')
			.should('have.lengthOf', 1)

		// Type postal number
		cy.get('#delivery').within(() => {
			cy.get('input[name="postalCode"]')
				.type(18551)
				.blur()
			
			cy.get('button[type="submit"]').click()
		})

		// Handle auto fetch of address
		cy.get('#payment').within(() => {
			cy.get('input[name="personnummer"]')
				.type(198602220054)
				.blur()
			
			cy.get('button[type="submit"]').click()
		})

		// Check that checkout button is still disabled
		cy.get('button.button--checkout')
			.should('have.class', 'button--disabled')

		// During demo: Attempt to do the get(payment) first and discover that the spinner is in the way.
		cy.get('.loader-spinner')
			.should('not.exist')
			.then(() => {
				cy.get('#payment').within(() => { 
					cy.get('input[type="email"]')
						.type('some-email@apoteket.se')
						.blur()

					cy.get('button[type="submit"]').click()
				})
			})
		
		cy.get('button.button--checkout')
			.should('not.have.class', 'button--disabled')
	})
})

