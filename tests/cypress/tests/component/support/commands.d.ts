/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to mount a component with Vue plugins
     * @example cy.mount(MyComponent, { props: { title: 'Test' } })
     */
    mount(component: any, options?: {
      props?: Record<string, any>
      global?: {
        plugins?: any[]
        components?: Record<string, any>
        stubs?: Record<string, any>
      }
      slots?: Record<string, any>
    }): Chainable<any>
  }
}