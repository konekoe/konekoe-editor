describe("Opening the editor page", function () {
  beforeEach(function() {
    cy.visit("/");
  })

  it("Displays a wait screen", function () {
    cy.contains("Just a moment");
  });
});