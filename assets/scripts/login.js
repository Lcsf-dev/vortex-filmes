document.addEventListener("DOMContentLoaded", function() {
    const formulario = document.getElementById("form-login");

    formulario.addEventListener("submit", function(evento) {
        // 1. IMPEDE O ENVIO AUTOMÁTICO E O REDIRECIONAMENTO IMEDIATO
        evento.preventDefault();

        // Pega os valores digitados
        const campoEmail = document.querySelector("input[type='email']");
        const campoSenha = document.querySelector("input[type='password']");

        const email = campoEmail.value.trim();
        const senha = campoSenha.value;

        // 2. Validação do Email (precisa ter '@')
        if (!email.includes("@")) {
            alert("Por favor, insira um e-mail válido contendo '@'.");
            campoEmail.focus();
            return; // Para aqui e NÃO redireciona
        }

        // 3. Validação da Senha (6+ dígitos, 1 maiúscula, 1 caractere especial)
        const expressaoSenha = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

        if (!expressaoSenha.test(senha)) {
            alert("A senha deve conter:\n- Pelo menos 6 caracteres\n- Pelo menos 1 letra maiúscula\n- Pelo menos 1 caractere especial");
            campoSenha.focus();
            return; // Para aqui e NÃO redireciona
        }

        // 4. Se passou em TUDO, avisa e faz o redirecionamento manual
        alert("Login efetuado com sucesso!");
        window.location.href = "home.html";
    });
});
