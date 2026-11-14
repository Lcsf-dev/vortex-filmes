/* 1. Estado da página: guarda o filtro atual e o filme aberto na janela. */
const categorias = ["Ação", "Aventura", "Ficção", "Terror", "Drama", "Romance", "Animação", "Infantil"];
let categoriaSelecionada = "Todos";
let filmeSelecionado = null;
let ultimoAcionador = null;

/* 2. Funções auxiliares: preparam textos e selecionam os filmes da busca. */
function normalizarTexto(texto) {
    // A decomposição separa os acentos; removê-los permite buscar "ficcao" e "Ficção".
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function filtrarFilmes(lista, termo, categoria) {
    const encontrados = [];
    const buscaNormalizada = normalizarTexto(termo);

    // O for percorre os dados e acrescenta somente os filmes que combinam com os filtros.
    for (let indice = 0; indice < lista.length; indice++) {
        const filme = lista[indice];
        const correspondeCategoria = categoria === "Todos" || filme.categoria === categoria;
        const correspondeBusca = normalizarTexto(filme.titulo + " " + filme.categoria).includes(buscaNormalizada);

        if (correspondeCategoria && correspondeBusca) {
            encontrados.push(filme);
        }
    }

    return encontrados;
}

// Centraliza a criação de elementos; textContent insere os textos sem interpretá-los como HTML.
function criarElemento(tipo, classe, texto) {
    const elemento = document.createElement(tipo);
    elemento.className = classe;

    if (texto !== undefined) {
        elemento.textContent = texto;
    }

    return elemento;
}

// Converte a duração dos dados, em segundos, para horas e minutos legíveis.
function formatarDuracao(segundos) {
    if (!segundos) {
        return "";
    }

    const minutosTotais = Math.floor(segundos / 60);
    const horas = Math.floor(minutosTotais / 60);
    const minutos = minutosTotais % 60;

    return horas > 0 ? horas + "h " + minutos + "min" : minutos + "min";
}

function obterTextoTrailer(filme) {
    // A edição e o idioma são verificados separadamente para não rotular um idioma incerto.
    if (!filme.trailerConfirmado) {
        if ((filme.trailer || filme.trailerExterno) && filme.trailerEdicaoConfirmada) {
            return "Ver trailer (idioma a confirmar)";
        }

        return "Trailer indisponível";
    }

    const variante = filme.trailerVariante === "pt-PT" ? " (Portugal)" : "";

    if (filme.trailerIdioma === "dublado") {
        if (filme.trailerDublagemAutomatica) {
            return "Trailer em português (dublagem automática)" + variante;
        }

        return "Trailer dublado" + variante;
    } else if (filme.trailerIdioma === "legendado") {
        return "Trailer legendado em português" + variante;
    } else {
        return "Trailer indisponível";
    }
}

// Distingue idioma confirmado de fala apenas detectada e mantém explícitas as pendências.
function obterTextoIdioma(filme) {
    if (!filme.videoConfirmado && filme.videoAudioDetectado === "pt") {
        return "Fala em português detectada · Versão completa ainda não confirmada";
    }

    if (!filme.videoConfirmado || filme.videoIdioma !== "pt") {
        return "Versão completa com áudio em português ainda não confirmada";
    }

    if (filme.videoVariante === "pt-PT") {
        return "Áudio em português de Portugal";
    }

    return filme.videoVariante === "pt-BR" ? "Áudio em português do Brasil" : "Áudio em português (variante não identificada)";
}

/* 3. Catálogo: cada registro de movies.js fornece os dados de um cartão e dos filtros. */
function criarCartaoFilme(filme) {
    const artigo = criarElemento("article", "");
    const botao = criarElemento("button", "cartao-filme");
    const capa = criarElemento("img", "");
    const informacoes = criarElemento("div", "informacoes-cartao");
    const icone = criarElemento("span", "abrir-cartao", "▶");

    botao.type = "button";
    botao.dataset.filme = filme.id;
    botao.setAttribute("aria-label", "Ver detalhes de " + filme.titulo);
    capa.src = filme.capa;
    capa.alt = "";
    capa.loading = "lazy";
    capa.width = 200;
    capa.height = 300;
    icone.setAttribute("aria-hidden", "true");
    informacoes.append(criarElemento("h4", "", filme.titulo), criarElemento("p", "", filme.categoria), icone);
    botao.append(capa, informacoes);
    artigo.append(botao);

    return artigo;
}

// Refaz a lista usando a busca e a categoria atuais, sem modificar os dados dos filmes.
function renderizarCatalogo() {
    const termo = document.getElementById("busca").value;
    const encontrados = filtrarFilmes(filmes, termo, categoriaSelecionada);
    const lista = document.getElementById("lista-filmes");
    const contador = document.getElementById("contador-filmes");
    lista.replaceChildren();

    for (let indiceCategoria = 0; indiceCategoria < categorias.length; indiceCategoria++) {
        const categoria = categorias[indiceCategoria];
        const filmesCategoria = filtrarFilmes(encontrados, "", categoria);

        if (filmesCategoria.length > 0) {
            const secao = criarElemento("section", "grupo-filmes");
            const titulo = criarElemento("h3", "titulo-grupo", categoria);
            const grade = criarElemento("div", "grade-filmes");
            titulo.id = "genero-" + indiceCategoria;
            secao.setAttribute("aria-labelledby", titulo.id);

            for (let indiceFilme = 0; indiceFilme < filmesCategoria.length; indiceFilme++) {
                grade.append(criarCartaoFilme(filmesCategoria[indiceFilme]));
            }

            secao.append(titulo, grade);
            lista.append(secao);
        }
    }

    if (encontrados.length === 1) {
        contador.textContent = "1 filme encontrado";
    } else {
        contador.textContent = encontrados.length + " filmes encontrados";
    }

    document.getElementById("nenhum-filme").hidden = encontrados.length > 0;
}

// aria-pressed informa qual filtro está selecionado, inclusive para leitores de tela.
function criarFiltrosGeneros() {
    const lista = document.getElementById("filtros-generos");
    const opcoes = ["Todos", ...categorias];

    for (let indice = 0; indice < opcoes.length; indice++) {
        const botao = criarElemento("button", "filtro-genero", opcoes[indice]);
        botao.type = "button";
        botao.dataset.categoria = opcoes[indice];
        botao.setAttribute("aria-pressed", String(indice === 0));
        lista.append(botao);
    }

    lista.addEventListener("click", function (evento) {
        const botao = evento.target.closest("[data-categoria]");

        if (botao) {
            categoriaSelecionada = botao.dataset.categoria;
            const botoes = lista.querySelectorAll("button");

            for (let indice = 0; indice < botoes.length; indice++) {
                botoes[indice].setAttribute("aria-pressed", String(botoes[indice] === botao));
            }

            renderizarCatalogo();
        }
    });
}

/* 4. Destaques sorteados, sem repetir a seleção anterior quando houver armazenamento. */
function sortearDestaques() {
    let anteriores = [];
    try {
        const salvos = JSON.parse(localStorage.getItem("vortex-ultimos-destaques") || "[]");
        anteriores = Array.isArray(salvos) ? salvos : [];
    } catch {
        // O sorteio também funciona quando o navegador bloqueia o armazenamento.
    }

    let candidatos = filmes.filter(function (filme) {
        return !anteriores.includes(filme.id);
    });
    if (candidatos.length < 3) {
        candidatos = [...filmes];
    }
    // Fisher-Yates embaralha uma cópia dos candidatos, preservando a ordem do catálogo.
    for (let indice = candidatos.length - 1; indice > 0; indice--) {
        const sorteado = Math.floor(Math.random() * (indice + 1));
        [candidatos[indice], candidatos[sorteado]] = [candidatos[sorteado], candidatos[indice]];
    }
    // Cada abertura usa três filmes únicos e salva apenas seus IDs para o próximo sorteio.
    const destaques = candidatos.slice(0, 3);
    try {
        localStorage.setItem("vortex-ultimos-destaques", JSON.stringify(destaques.map(function (filme) {
            return filme.id;
        })));
    } catch {
        // Não é necessário salvar dados para navegar no catálogo.
    }
    return destaques;
}

function criarDestaques() {
    const destaques = sortearDestaques();
    const lista = document.getElementById("lista-destaques");

    for (let indice = 0; indice < destaques.length; indice++) {
        const filme = destaques[indice];
        const diapositivo = criarElemento("div", "item-destaque");
        const conteudo = criarElemento("div", "destaque");
        const texto = criarElemento("div", "destaque-texto");
        const botao = criarElemento("button", "botao-primario", "Conhecer o filme →");
        const capa = criarElemento("img", "");
        const resumo = filme.sinopse.split(". ")[0];

        diapositivo.setAttribute("role", "group");
        diapositivo.setAttribute("aria-label", (indice + 1) + " de " + destaques.length);
        botao.type = "button";
        botao.dataset.filme = filme.id;
        capa.src = filme.capa;
        capa.alt = "Cartaz de " + filme.titulo;
        capa.width = 185;
        capa.height = 274;
        texto.append(criarElemento("p", "sobretitulo", "Em destaque · " + filme.categoria));
        texto.append(criarElemento("h2", "", filme.titulo));
        texto.append(criarElemento("p", "resumo-destaque", resumo), botao);
        conteudo.append(texto, capa);
        diapositivo.append(conteudo);
        lista.append(diapositivo);
    }

    const carrossel = document.getElementById("carrossel-destaques");
    const indicadores = carrossel.querySelectorAll("[data-destaque]");
    const pausa = document.getElementById("pausar-destaques");
    const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)");
    let atual = 0;
    let pausado = movimentoReduzido.matches;

    // A posição da rolagem define o indicador ativo; inert evita foco nos slides fora de vista.
    function atualizarIndicadores() {
        atual = Math.round(lista.scrollLeft / lista.clientWidth) || 0;
        indicadores.forEach(function (indicador, indice) {
            indicador.classList.toggle("ativo", indice === atual);
            if (indice === atual) {
                indicador.setAttribute("aria-current", "true");
            } else {
                indicador.removeAttribute("aria-current");
            }
            lista.children[indice].inert = indice !== atual;
        });
    }

    // O resto da divisão faz a navegação circular: depois do último vem o primeiro.
    function mostrarDestaque(indice) {
        atual = (indice + destaques.length) % destaques.length;
        lista.scrollTo({ left: atual * lista.clientWidth, behavior: movimentoReduzido.matches ? "instant" : "smooth" });
    }

    function atualizarPausa() {
        pausa.textContent = pausado ? "Retomar destaques" : "Pausar destaques";
        pausa.setAttribute("aria-pressed", String(pausado));
    }

    indicadores.forEach(function (indicador, indice) {
        indicador.addEventListener("click", function () {
            mostrarDestaque(indice);
        });
    });
    document.getElementById("destaque-anterior").addEventListener("click", function () {
        mostrarDestaque(atual - 1);
    });
    document.getElementById("destaque-proximo").addEventListener("click", function () {
        mostrarDestaque(atual + 1);
    });
    pausa.addEventListener("click", function () {
        pausado = !pausado;
        atualizarPausa();
    });
    lista.addEventListener("scroll", atualizarIndicadores, { passive: true });
    carrossel.addEventListener("keydown", function (evento) {
        if (evento.key === "ArrowLeft" || evento.key === "ArrowRight") {
            evento.preventDefault();
            mostrarDestaque(atual + (evento.key === "ArrowRight" ? 1 : -1));
        }
    });
    window.addEventListener("resize", function () {
        lista.scrollTo({ left: atual * lista.clientWidth, behavior: "instant" });
    });
    movimentoReduzido.addEventListener("change", function () {
        if (movimentoReduzido.matches) {
            pausado = true;
            atualizarPausa();
        }
    });
    // 6000 milissegundos = 6 segundos. A troca para durante a interação ou com os detalhes abertos.
    setInterval(function () {
        if (!pausado && !document.hidden && !document.getElementById("janela-filme").open && !carrossel.matches(":hover") && !carrossel.contains(document.activeElement)) {
            mostrarDestaque(atual + 1);
        }
    }, 6000);
    atualizarIndicadores();
    atualizarPausa();
}

/* 5. Detalhes e reprodução: o vídeo só carrega após um clique do visitante. */
// O player recebe apenas IDs válidos do YouTube; os links nunca abrem outra aba.
function montarEnderecoVideo(identificador) {
    if (!/^[a-zA-Z0-9_-]{11}$/.test(identificador)) {
        return null;
    }

    return "https://www.youtube.com/embed/" + identificador + "?rel=0";
}

// Remover src interrompe o vídeo; hidden alterna a sinopse, o player e os botões.
function voltarParaDetalhes() {
    document.getElementById("reprodutor-filme").removeAttribute("src");
    document.getElementById("conteudo-video").hidden = true;
    document.getElementById("conteudo-detalhes").hidden = false;
    document.getElementById("voltar-detalhes").hidden = true;
    document.getElementById("assistir-filme").hidden = false;
    document.getElementById("ver-trailer").hidden = Boolean(filmeSelecionado && filmeSelecionado.trailerOculto);
}

function mostrarDetalhesFilme(identificador, acionador) {
    filmeSelecionado = filmes.find(function (filme) {
        return filme.id === identificador;
    });

    if (!filmeSelecionado) {
        return;
    }

    ultimoAcionador = acionador;
    voltarParaDetalhes();
    document.getElementById("titulo-filme").textContent = filmeSelecionado.titulo;
    document.getElementById("sinopse-filme").textContent = filmeSelecionado.sinopse;
    document.getElementById("categoria-filme").textContent = filmeSelecionado.categoria;
    document.getElementById("capa-filme").src = filmeSelecionado.capa;
    document.getElementById("capa-filme").alt = "Cartaz de " + filmeSelecionado.titulo;
    const informacoes = [filmeSelecionado.ano, formatarDuracao(filmeSelecionado.duracao), obterTextoIdioma(filmeSelecionado)].filter(Boolean).join(" · ");
    document.getElementById("ano-filme").textContent = informacoes;
    document.getElementById("ano-filme").hidden = informacoes === "";
    document.getElementById("ver-trailer").textContent = obterTextoTrailer(filmeSelecionado);
    const botaoFilme = document.getElementById("assistir-filme");

    const possuiVideo = Boolean(montarEnderecoVideo(filmeSelecionado.video));
    const bloqueado = filmeSelecionado.videoIncorporavel === false;
    botaoFilme.disabled = !possuiVideo || bloqueado;
    botaoFilme.textContent = bloqueado ? "Reprodução bloqueada no site" : possuiVideo ? "▶ Assistir filme" : "Filme indisponível";
    botaoFilme.title = bloqueado ? "O canal não permite reproduzir este vídeo em outros sites." : possuiVideo ? "" : "Ainda não há um vídeo válido cadastrado.";

    // O dialog nativo mantém o foco na janela e permite fechar com Escape.
    document.getElementById("janela-filme").showModal();
    document.body.classList.add("detalhes-abertos");
}

function reproduzirVideo(tipo) {
    if (!filmeSelecionado) {
        return;
    }

    const trailer = tipo === "trailer";
    if (!trailer && filmeSelecionado.videoIncorporavel === false) {
        return;
    }

    let endereco = montarEnderecoVideo(trailer ? filmeSelecionado.trailer : filmeSelecionado.video);
    // O trailer externo usa o endereço oficial de incorporação, sem abrir sua página em outra aba.
    if (trailer && filmeSelecionado.trailerEmbed) {
        const embed = filmeSelecionado.trailerEmbed;
        endereco = /^https:\/\/www\.dailymotion\.com\/embed\/video\/[a-zA-Z0-9]+$/.test(embed) ? embed : null;
    } else if (endereco && trailer && filmeSelecionado.trailerIdioma === "legendado") {
        endereco += "&cc_load_policy=1&cc_lang_pref=pt&hl=pt-BR";
    }

    if (!endereco) {
        return;
    }

    const reprodutor = document.getElementById("reprodutor-filme");
    document.getElementById("conteudo-detalhes").hidden = true;
    document.getElementById("conteudo-video").hidden = false;
    document.getElementById("tipo-video").textContent = trailer ? obterTextoTrailer(filmeSelecionado) : "Assistir filme";
    reprodutor.title = (trailer ? "Trailer de " : "Assistir ") + filmeSelecionado.titulo;
    reprodutor.src = endereco;
    document.getElementById("voltar-detalhes").hidden = false;
    document.getElementById("assistir-filme").hidden = true;
    document.getElementById("ver-trailer").hidden = true;
    document.getElementById("voltar-detalhes").focus();
}

function abrirFilme() {
    // A confirmação de idioma não decide onde o vídeo abre: o destino é sempre o player interno.
    reproduzirVideo("filme");
}

function abrirTrailer() {
    if (filmeSelecionado && !filmeSelecionado.trailerOculto && filmeSelecionado.trailerConfirmado) {
        reproduzirVideo("trailer");
    }
}

function abrirFilmeClicado(evento) {
    // O mesmo evento atende aos cartões e destaques, inclusive quando recriados pela busca.
    const botao = evento.target.closest("[data-filme]");

    if (botao) {
        mostrarDetalhesFilme(botao.dataset.filme, botao);
    }
}

/* 6. Inicialização: conecta os eventos depois que o HTML foi carregado. */
function iniciarCatalogo() {
    // Primeiro monta os elementos; depois associa cada evento à sua função.
    criarFiltrosGeneros();
    criarDestaques();
    renderizarCatalogo();
    document.getElementById("busca").addEventListener("input", renderizarCatalogo);
    document.getElementById("formulario-busca").addEventListener("submit", function (evento) {
        evento.preventDefault();
    });
    document.getElementById("lista-filmes").addEventListener("click", abrirFilmeClicado);
    document.getElementById("lista-destaques").addEventListener("click", abrirFilmeClicado);
    document.getElementById("assistir-filme").addEventListener("click", abrirFilme);
    document.getElementById("ver-trailer").addEventListener("click", abrirTrailer);
    document.getElementById("voltar-detalhes").addEventListener("click", function () {
        voltarParaDetalhes();
        document.getElementById("assistir-filme").focus();
    });
    const janela = document.getElementById("janela-filme");
    document.getElementById("fechar-detalhes").addEventListener("click", function () {
        janela.close();
    });
    janela.addEventListener("click", function (evento) {
        const limites = janela.getBoundingClientRect();
        // Fecha somente se o clique estiver fora dos limites da janela.
        if (evento.target === janela && (evento.clientX < limites.left || evento.clientX > limites.right || evento.clientY < limites.top || evento.clientY > limites.bottom)) {
            janela.close();
        }
    });
    // Limpa o player e devolve o foco ao cartão que abriu a janela.
    janela.addEventListener("close", function () {
        document.body.classList.remove("detalhes-abertos");
        voltarParaDetalhes();
        filmeSelecionado = null;

        if (ultimoAcionador && ultimoAcionador.isConnected) {
            ultimoAcionador.focus();
        }
    });
    // A classe controla o CSS do menu; aria-expanded comunica seu estado.
    const botaoMenu = document.getElementById("alternar-menu");
    botaoMenu.addEventListener("click", function () {
        const aberto = document.getElementById("menu-principal").classList.toggle("aberto");
        botaoMenu.setAttribute("aria-expanded", String(aberto));
        botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    });
    console.log("Catálogo da Vortex Filmes carregado com " + filmes.length + " filmes.");
}

iniciarCatalogo();
