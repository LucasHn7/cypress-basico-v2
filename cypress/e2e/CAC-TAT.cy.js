/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {

  const waiting_time_3_seconds_in_ms = 3000

  beforeEach(function(){
    cy.visit('./src/index.html')
  })

  // ---= AULA 02 =---

  it('verifica o título da aplicação', function() {
    cy.title().should('eq', 'Central de Atendimento ao Cliente TAT')
  })

  it('preenche os campos obrigatórios e envia o formulário', function(){
    cy.clock()

    cy.get('#firstName').type('Lucas')
    cy.get('#lastName').type('Henrique')
    cy.get('#email').type('email@email.com')
    cy.get('#open-text-area').type('Exercício 1', {delay: 0})    // Delay em milisegundos
    cy.get('button[type="submit"]').click()      // get pega um button que possui type="submit"
    
    cy.get('.success').should('be.visible')

    cy.tick(waiting_time_3_seconds_in_ms)

    cy.get('.success').should('not.be.visible')
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
    cy.clock()

    cy.get('#firstName').type('Lucas')
    cy.get('#lastName').type('Henrique')
    cy.get('#email').type('email-email.com')
    cy.get('#open-text-area').type('Exercício 2')
    cy.get('button[type="submit"]').click()

    cy.get('.error').should('be.visible')

    cy.tick(waiting_time_3_seconds_in_ms)

    cy.get('.error').should('not.be.visible')
  })

  it('verificar uso de caracteres não numéricos no campo telefone', function(){
    cy.get('#phone').type('Exercício 3').should('be.empty')     // Também poderia ser usado .should('have.value', '')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
    cy.clock()

    cy.get('#firstName').type('Lucas')
    cy.get('#lastName').type('Henrique')
    cy.get('#email').type('email@email.com')
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type('Exercício 4')
    cy.get('button[type="submit"]').click()

    cy.get('.error').should('be.visible')

    cy.tick(waiting_time_3_seconds_in_ms)

    cy.get('.error').should('not.be.visible')
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', function(){
    cy.get('#firstName')
      .type('Lucas')
      .should('have.value', 'Lucas')
      .clear()
      .should('have.value', '')
    cy.get('#lastName')
      .type('Henrique')
      .should('have.value', 'Henrique')
      .clear()
      .should('be.empty')
    cy.get('#email')
      .type('email@email.com')
      .should('have.value', 'email@email.com')
      .clear()
      .should('have.value', '')
    cy.get('#phone')
    .type('11912345678')
    .should('have.value', '11912345678')
    .clear()
    .should('have.value', '')
  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
    cy.clock()

    cy.get('button[type="submit"]').click()

    cy.get('.error').should('be.visible')

    cy.tick(waiting_time_3_seconds_in_ms)

    cy.get('.error').should('not.be.visible')
  })

  it('envia o formuário com sucesso usando um comando customizado', function(){
    cy.fillMandatoryFieldsAndSubmit()       // Comando criado em /cypress/support/commands.js e importado em /cypress/support/e2e.js
  })

  it('identificar elemento com cy.contains', function(){
    cy.clock()

    cy.get('#firstName').type('Lucas')
    cy.get('#lastName').type('Henrique')
    cy.get('#email').type('email@email.com')
    cy.get('#open-text-area').type('Exercício 8')
    cy.contains('button', 'Enviar').click()         // Encontra um elemento button que contenha o texto 'Enviar' e clica nele.
    
    cy.get('.success').should('be.visible')

    cy.tick(waiting_time_3_seconds_in_ms)

    cy.get('.success').should('not.be.visible')
  })

  // ---= AULA 03 =---
  it('seleciona um produto (YouTube) por seu texto', function() {
    cy.get('#product')          // Como nessa aplicação há apenas um elemento de seleção suspensa, o comando poderia ser cy.get('select')...
      .select('YouTube')
      .should('have.value', 'youtube')
  })

  it('seleciona um produto (Mentoria) por seu valor (value)', function() {
    cy.get('select')
      .select('mentoria')
      .should('have.value', 'mentoria')
  })

  it('seleciona um produto (Blog) por seu índice', function() {
    cy.get('select')
      .select(1)          // Nesse caso, a índice 0 é a opção "Selecione" que é exibida por padrão e não é possível selecionar
      .should('have.value', 'blog')
  })

  // ---= AULA 04 =---
  it('marca o tipo de atendimento "Feedback"', function(){
    cy.get('input[type="radio"]')         // Pega os inputs com tipo "radio", no caso da aplicação exitem 3
      .check('feedback')                  // Marca o que possui o valor "feedback"
      .should('have.value', 'feedback')
  })

  it('marca cada tipo de atendimento', function() {
    cy.get('input[type="radio"]')         // Pega os inputs com tipo "radio", no caso da aplicação exitem 3
      .should('have.length', 3)           // Verifica se realmente possuem 3 opção de radio
      .each(function($radio) {            // each = pega cada um. Recebe uma função. Funciona como um laço de repetição, rodará os comandos abaixo para cada uma das opções
        cy.wrap($radio).check()           // cy.wrap empacota os valores de $radio e o .check() faz com que sejam marcados
        cy.wrap($radio).should('be.checked')
    })
  })

   // ---= AULA 05 =---

  Cypress._.times(5, function() {                     // Primeiro parâmetro e a quantidade de vezes que será repetido e o segundo parâmetro é uma função de callback.
    it('marca ambos checkboxes, depois desmarca o último', function() {
      cy.get('#check input[type="checkbox"]')         // Na div de id "check", pega todos os checkboxes
        .check()                                      // Marca todos os resultados encontrados
        .last()                                       // Selecionar o último
        .uncheck()                                    // Desmarca ele
        .should('not.be.checked')
    })
  })
   

   // ---= AULA 06 =---
  it('seleciona um arquivo da pasta fixtures', function() {
    cy.get('input[type="file"]#file-upload')
      .selectFile('cypress/fixtures/example.json')
      .should(function($input) {                                      // Função recebe na variável $input o retorno de 'cy.get('input[type="file"]#file-upload')'
        console.log($input)                                           // Comando usado para visualizar os parâmetros desse input no console do inspecionar. Possui um jquery com um índice 0 que possui a propriedade 'files' que tem as informações do arquivo no índice 0.
        expect($input[0].files[0].name).to.equal('example.json')      // Espera que o elemento de índice 0 do input, no índice 0 da propriedade 'files', no parâmetro 'nome', seja igual à 'example.json'.
      })
  })

  it('seleciona um arquivo simulando um drag-and-drop', function() {
    cy.get('input[type="file"]#file-upload')
      .selectFile('cypress/fixtures/example.json', {action: 'drag-drop'})       // selectFiles recebe, além do arquivo, um objeto com a propridade 'action' com o valor 'drag-drop'
      .should(function($input) {                                      
        console.log($input)                                           
        expect($input[0].files[0].name).to.equal('example.json')      
      })
  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function() {
    cy.fixture('example.json').as('sampleFile')                  // cy.fixture faz referência à pasta fixture.

    cy.get('input[type="file"]#file-upload')
      .selectFile('@sampleFile')                                 // @ é usado para referenciar o alias.
      .should(function($input) {
        console.log($input)
        expect($input[0].files[0].name).to.equal('example.json')
      })
  })

   // ---= AULA 07 =---
  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function() {
    cy.get('#privacy a')                          // cy.get pega um elemento que possui o id 'privacy' contenha uma tag 'a'. Nesse caso a div possui esse id.
      .should('have.attr', 'target', '_blank')    // 'have.attr' verifica se tem o atributo 'target' com o valor '_blank'.
  })

  it('acessa a página da política de privacidade removendo o target e então clicando no link', function() {
    cy.get('#privacy a')
      .invoke('removeAttr', 'target')                               //invoke remove o atributo 'target', dessa forma a página não será aberta em outra guia.
      .click()
      .url()
      .should('contains', '/src/privacy.html')
  })

  // ---= AULA 08 =---

  // Scripts criados no arquivo package.json ("cy:open:mobile" e "test:mobile")

  // ---= AULA 09 =---

  // Documentação da automação feito no arquivo 'README.md'.

  // ---= AULA 10 =---

  // Integração contínua feita na pasta .github/workflows no arquivo ci.yml

  // ---= AULA 11 =---

  // Atualizado os testes de verificação de tempo de exibição de mensagens com os comandos cy.clock para congelar o tempo e cy.tick para avançar o tempo.

  // Utilizada a funcionadade 'Cypress._.times()' para repetir um determinado teste mais de uma vez.

  it('exibe e esconde as mensagens de sucesso e erro usando o .invoke()', function() {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })

  it.only('preenche a area de texto usando o comando invoke', function() {
    const longText = Cypress._.repeat('0123456789', 20)

    cy.get('#open-text-area')
    .invoke('val', longText)                // Invoca o valor do #open-text-area e seta ele com o valor de longText
    .should('have.value', longText)
  })
})
