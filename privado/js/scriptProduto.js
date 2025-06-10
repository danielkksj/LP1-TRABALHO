const endpoint = "http://localhost:3001/produtos";
const form = document.getElementById("formCadastro");
const listaDiv = document.getElementById("listaDados");

function carregarDados() {
  fetch(endpoint)
    .then(res => res.json())
    .then(dados => {
      if (dados.length === 0) {
        listaDiv.innerHTML = "<p class='text-muted'>Nenhum produto cadastrado.</p>";
      } else {
        let html = "<ul class='list-group'>";
        dados.forEach(d => {
          html += `<li class='list-group-item'>
            <strong>NOME:</strong> ${d.nome} |
            <strong>QUANTIDADE:</strong> ${d.quantidade}
          </li>`;
        });
        html += "</ul>";
        listaDiv.innerHTML = html;
      }
    });
}

form.onsubmit = function(e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim().toLowerCase();
  const quantidade = document.getElementById("quantidade").value.trim();

  if (nome && quantidade) {
    fetch(`${endpoint}?nome_like=^${nome}$`)
      .then(res => res.json())
      .then(dados => {
        const jaExiste = dados.some(d => d.nome.toLowerCase() === nome);
        if (jaExiste) {
          alert("Já existe um produto com este nome.");
        } else {
          fetch(endpoint, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ nome, quantidade })
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
