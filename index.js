import express from 'express';
import session from 'express-session';


const app = express();
const host = '0.0.0.0';
const porta = 3000;
const jsonServerUrl = 'http://localhost:3001/usuarios';

app.use(session({
  secret: "M1nH4Ch4v3S3cR3t4",
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 15, httpOnly: true }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./publico"));

function verificarAutenticacao(req, res, next) {
  if (req.session.autenticado) {
    next();
  } else {
    res.redirect("/login.html");
  }
}

app.post("/cadastroinicial", (req, res) => {
  const { nome, senha, cpf, telefone } = req.body;
  const novoUsuario = { nome, senha, cpf, telefone };

  fetch(jsonServerUrl)
    .then(resp => resp.json())
    .then(usuarios => {
      const existente = usuarios.find(u => u.nome === nome && u.cpf === cpf);
      if (existente) {
        res.send("<script>alert('Usuário já existe.'); window.location.href='/cadastroInicial.html';</script>");
      } else {
        fetch(jsonServerUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(novoUsuario)
        })
        .then(() => res.redirect("/login.html"))
        .catch(() => res.send("<script>alert('Erro ao cadastrar.'); window.location.href='/cadastroInicial.html';</script>"));
      }
    })
    .catch(() => {
      res.send("<script>alert('Erro ao verificar usuários.'); window.location.href='/cadastroInicial.html';</script>");
    });
});

app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;

  fetch(jsonServerUrl)
    .then(resp => resp.json())
    .then(usuarios => {
      const valido = usuarios.find(u => u.nome === usuario && u.senha === senha);
      if (valido) {
        req.session.autenticado = true;
        res.redirect("/menu.html");
      } else {
        res.send("<script>alert('Usuário ou senha inválidos.'); window.location.href='/login.html';</script>");
      }
    })
    .catch(erro => {
      console.error("Erro no login:", erro.message || erro);
      res.send("<script>alert('Erro no login.'); window.location.href='/login.html';</script>");
    });
});


app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login.html");
  });
});

app.use(verificarAutenticacao, express.static("./privado"));


app.listen(porta, host, () => {
  console.log(`Servidor rodando em http://localhost:${porta}`);
});
