/* A validação fica separada da interface para facilitar a leitura e os testes. */
function validarDadosEntrada(email, senha) {
    const expressaoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const expressaoSenha = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

    if (email.trim() === "") {
        return { valido: false, campo: "email", mensagem: "Preencha seu e-mail." };
    } else if (!expressaoEmail.test(email.trim())) {
        return { valido: false, campo: "email", mensagem: "Digite um e-mail válido, como nome@exemplo.com." };
    } else if (senha === "") {
        return { valido: false, campo: "senha", mensagem: "Preencha sua senha." };
    } else if (!expressaoSenha.test(senha)) {
        return { valido: false, campo: "senha", mensagem: "A senha precisa de 6 caracteres, uma letra maiúscula e um caractere especial." };
    } else {
        return { valido: true, campo: null, mensagem: "Tudo certo! Abrindo o catálogo…" };
    }
}

/* A página não armazena credenciais: o acesso é uma demonstração de validação. */
function enviarFormularioEntrada(evento) {
    evento.preventDefault();

    const campoEmail = document.getElementById("email");
    const campoSenha = document.getElementById("senha");
    const mensagem = document.getElementById("mensagem-login");
    const resultado = validarDadosEntrada(campoEmail.value, campoSenha.value);

    campoEmail.removeAttribute("aria-invalid");
    campoSenha.removeAttribute("aria-invalid");
    mensagem.textContent = resultado.mensagem;

    if (resultado.valido) {
        console.log("Formulário validado. Abrindo o catálogo da Vortex Filmes.");
        window.location.assign("home.html");
    } else {
        const campoInvalido = document.getElementById(resultado.campo);
        campoInvalido.setAttribute("aria-invalid", "true");
        campoInvalido.focus();
    }
}

function alternarVisibilidadeSenha() {
    const campoSenha = document.getElementById("senha");
    const botao = document.getElementById("alternar-senha");
    const senhaVisivel = campoSenha.type === "password";

    campoSenha.type = senhaVisivel ? "text" : "password";
    botao.textContent = senhaVisivel ? "Ocultar" : "Mostrar";
    botao.setAttribute("aria-label", senhaVisivel ? "Ocultar senha" : "Mostrar senha");
    botao.setAttribute("aria-pressed", String(senhaVisivel));
}

function iniciarPaginaEntrada() {
    const formulario = document.getElementById("formulario-login");
    formulario.addEventListener("submit", enviarFormularioEntrada);
    document.getElementById("alternar-senha").addEventListener("click", alternarVisibilidadeSenha);
    console.log("Página de entrada da Vortex Filmes carregada.");
}

// Os scripts usam defer, portanto os elementos HTML já existem neste momento.
iniciarPaginaEntrada();
