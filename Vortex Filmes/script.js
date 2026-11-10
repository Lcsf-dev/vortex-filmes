document.addEventListener("DOMContentLoaded", function() {
    const formulario = document.getElementById("form-login");

    formulario.addEventListener("submit", function(event) {
        // 1. IMPEDE O ENVIO AUTOMÁTICO E O REDIRECIONAMENTO IMEDIATO
        event.preventDefault();

        // Pega os valores digitados
        const inputEmail = document.querySelector("input[type='email']");
        const inputSenha = document.querySelector("input[type='password']");

        const email = inputEmail.value.trim();
        const senha = inputSenha.value;

        // 2. Validação do Email (precisa ter '@')
        if (!email.includes("@")) {
            alert("Por favor, insira um e-mail válido contendo '@'.");
            inputEmail.focus();
            return; // Para aqui e NÃO redireciona
        }

        // 3. Validação da Senha (6+ dígitos, 1 maiúscula, 1 caractere especial)
        const senhaRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

        if (!senhaRegex.test(senha)) {
            alert("A senha deve conter:\n- Pelo menos 6 dígitos\n- Pelo menos 1 letra maiúscula\n- Pelo menos 1 caractere especial");
            inputSenha.focus();
            return; // Para aqui e NÃO redireciona
        }

        // 4. Se passou em TUDO, avisa e faz o redirecionamento manual
        alert("Login efetuado com sucesso!");
        window.location.href = "paginainicial.html";
    });
});