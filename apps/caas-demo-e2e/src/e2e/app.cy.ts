import { getHeader } from '../support/app.po';

describe('caas-demo', () => {
  beforeEach(() => cy.visit('/'));

  it('should have sandbox header', () => {
    getHeader().should((header) =>
      expect(header.text()).equal('Chess as a Service Sandbox')
    );
  });
});
