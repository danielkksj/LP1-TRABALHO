const endpoint = "http://localhost:3001/categorias";
const form = document.getElementById("formCadastro");
const listaDiv = document.getElementById("listaDados");

function carregarDados() {
  fetch(endpoint)
    .then(res => res.json())
    .then(dados => {
      if (dados.length === 0) {
        listaDiv.innerHTML = "<p class='text-muted'>Nenhuma categoria cadastrada.</p>";
      } else {
        let html = "<ul class='list-group'>";
        dados.forEach(d => {
          html += `<li class='list-group-item'><strong>NOME:</strong> ${d.nome}</li>`;
        });
        html += "</ul>";
        listaDiv.innerHTML = html;
      }
    })
    .catch(() => {
      listaDiv.innerHTML = "<p class='text-danger'>Erro ao carregar categorias.</p>";
    });
}

form.onsubmit = function(e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();

  if (nome === "") {
    alert("Preencha o campo de nome.");
    return;
  }

  fetch(`${endpoint}?nome_like=^${nome}$`)
    .then(res => res.json())
    .then(dados => {
      const existe = dados.some(d => d.nome.toLowerCase() === nome.toLowerCase());

      if (existe) {
        alert("Já existe uma categoria com esse nome.");
      } else {
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome })
        })
        .then(() => {
          form.reset();
          carregarDados();
        });
      }
    });
};

carregarDados();
