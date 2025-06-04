const endpoint = "http://localhost:3001/fornecedores";
const form = document.getElementById("formCadastro");
const listaDiv = document.getElementById("listaDados");

function carregarDados() {
  fetch(endpoint)
    .then(res => res.json())
    .then(dados => {
      if (dados.length === 0) {
        listaDiv.innerHTML = "<p class='text-muted'>Nenhum fornecedor cadastrado.</p>";
      } else {
        let html = "<ul class='list-group'>";
        dados.forEach(d => {
          html += `<li class='list-group-item'>
            <strong>NOME:</strong> ${d.nome} |
            <strong>TELEFONE:</strong> ${d.telefone} |
            <strong>CPF:</strong> ${d.cpf}
          </li>`;
        });
        html += "</ul>";
        listaDiv.innerHTML = html;
      }
    });
}

form.onsubmit = function(e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const cpf = document.getElementById("cpf").value.trim();

  if (nome && telefone && cpf) {
    fetch(`${endpoint}?cpf=${encodeURIComponent(cpf)}`)
      .then(res => res.json())
      .then(dados => {
        if (dados.length > 0) {
          alert("Já existe um fornecedor cadastrado com este CPF.");
        } else {

          fetch(endpoint, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ nome, telefone, cpf })
          }).then(() => {
            form.reset();
            carregarDados();
          });
        }
      });
  } else {
    alert("Preencha todos os campos obrigatórios.");
  }
};

carregarDados();
