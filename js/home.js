/* 1. Estado da página: guarda o filtro atual e o filme aberto na janela. */
const categorias = ["Ação", "Aventura", "Ficção", "Terror", "Drama", "Romance", "Animação", "Infantil"];
let categoriaSelecionada = "Todos";
let filmeSelecionado = null;
let ultimoAcionador = null;

/* 2. Funções auxiliares: preparam textos e selecionam os filmes da busca. */
function normalizarTexto(texto) {
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

function criarElemento(tipo, classe, texto) {
    const elemento = document.createElement(tipo);
    elemento.className = classe;

    if (texto !== undefined) {
        elemento.textContent = texto;
    }

    return elemento;
}

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
    if (filme.trailerIdioma === "dublado") {
        return "Trailer dublado";
    } else if (filme.trailerIdioma === "legendado") {
        return "Trailer legendado em português";
    } else {
        return "Buscar trailer no YouTube ↗";
    }
}

/* 3. Catálogo: cria os cartões e agrupa os resultados por gênero. */
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

/* 4. Destaques: o Bootstrap cuida da troca entre os três slides. */
function criarDestaques() {
    const destaques = ["filme-032", "filme-012", "filme-047"];
    const lista = document.getElementById("lista-destaques");

    for (let indice = 0; indice < destaques.length; indice++) {
        const filme = filmes.find(function (item) { return item.id === destaques[indice]; });
        const diapositivo = criarElemento("div", indice === 0 ? "carousel-item active" : "carousel-item");
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

    bootstrap.Carousel.getOrCreateInstance(document.getElementById("carrossel-destaques"), { interval: false, touch: true });
}

/* 5. Detalhes e reprodução: o vídeo só carrega após um clique do visitante. */
function montarEnderecoVideo(identificador, incorporar) {
    if (!/^[a-zA-Z0-9_-]{11}$/.test(identificador)) {
        return null;
    }

    if (incorporar) {
        return "https://www.youtube.com/embed/" + identificador + "?rel=0";
    } else {
        return "https://www.youtube.com/watch?v=" + identificador;
    }
}

function voltarParaDetalhes() {
    document.getElementById("player-filme").removeAttribute("src");
    document.getElementById("conteudo-player").hidden = true;
    document.getElementById("conteudo-detalhes").hidden = false;
    document.getElementById("voltar-detalhes").hidden = true;
    document.getElementById("assistir-filme").hidden = false;
    document.getElementById("ver-trailer").hidden = false;
}

function mostrarDetalhesFilme(identificador, acionador) {
    filmeSelecionado = filmes.find(function (filme) { return filme.id === identificador; });

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
    const informacoes = [filmeSelecionado.ano, formatarDuracao(filmeSelecionado.duracao), "Áudio em português"].filter(Boolean).join(" · ");
    document.getElementById("ano-filme").textContent = informacoes;
    document.getElementById("ano-filme").hidden = informacoes === "";
    document.getElementById("ver-trailer").textContent = obterTextoTrailer(filmeSelecionado);
    document.getElementById("assistir-filme").textContent = filmeSelecionado.videoIncorporavel === false ? "Assistir no YouTube ↗" : "▶ Assistir filme";
    bootstrap.Modal.getOrCreateInstance(document.getElementById("janela-filme")).show();
}

function reproduzirVideo(tipo) {
    if (!filmeSelecionado) {
        return;
    }

    const identificador = tipo === "trailer" ? filmeSelecionado.trailer : filmeSelecionado.video;
    const incorporavel = tipo === "trailer" ? filmeSelecionado.trailerIncorporavel : filmeSelecionado.videoIncorporavel;

    // Alguns canais permitem assistir no YouTube, mas bloqueiam o player em outros sites.
    if (incorporavel === false) {
        const enderecoYouTube = montarEnderecoVideo(identificador, false);

        if (enderecoYouTube) {
            window.open(enderecoYouTube, "_blank", "noopener,noreferrer");
        }

        return;
    }

    const enderecoBase = montarEnderecoVideo(identificador, true);
    const pedirLegendas = tipo === "trailer" && filmeSelecionado.trailerIdioma === "legendado";
    const endereco = enderecoBase && pedirLegendas ? enderecoBase + "&cc_load_policy=1&cc_lang_pref=pt&hl=pt-BR" : enderecoBase;

    if (endereco) {
        const reprodutor = document.getElementById("player-filme");
        document.getElementById("conteudo-detalhes").hidden = true;
        document.getElementById("conteudo-player").hidden = false;
        const textoTrailer = obterTextoTrailer(filmeSelecionado);
        document.getElementById("tipo-video").textContent = tipo === "trailer" ? textoTrailer : "Assistir filme";
        reprodutor.title = (tipo === "trailer" ? "Trailer de " : "Assistir ") + filmeSelecionado.titulo;
        reprodutor.src = endereco;
        document.getElementById("link-youtube").href = montarEnderecoVideo(identificador, false);
        document.getElementById("voltar-detalhes").hidden = false;
        document.getElementById("assistir-filme").hidden = true;
        document.getElementById("ver-trailer").hidden = true;
        document.getElementById("voltar-detalhes").focus();
    }
}

function abrirFilme() {
    if (filmeSelecionado && filmeSelecionado.videoConfirmado) {
        reproduzirVideo("filme");
    } else if (filmeSelecionado) {
        const consulta = encodeURIComponent(filmeSelecionado.titulo + " filme completo dublado");
        window.open("https://www.youtube.com/results?search_query=" + consulta, "_blank", "noopener,noreferrer");
    }
}

function abrirTrailer() {
    if (filmeSelecionado && filmeSelecionado.trailer && filmeSelecionado.trailerIdioma) {
        reproduzirVideo("trailer");
    } else if (filmeSelecionado) {
        // A busca é identificada como busca quando ainda não há um link confirmado.
        const consulta = encodeURIComponent(filmeSelecionado.titulo + " trailer dublado ou legendado português");
        window.open("https://www.youtube.com/results?search_query=" + consulta, "_blank", "noopener,noreferrer");
    }
}

function abrirFilmeClicado(evento) {
    const botao = evento.target.closest("[data-filme]");

    if (botao) {
        mostrarDetalhesFilme(botao.dataset.filme, botao);
    }
}

/* 6. Inicialização: conecta os eventos depois que o HTML foi carregado. */
function iniciarCatalogo() {
    criarFiltrosGeneros();
    criarDestaques();
    renderizarCatalogo();
    document.getElementById("busca").addEventListener("input", renderizarCatalogo);
    document.getElementById("formulario-busca").addEventListener("submit", function (evento) { evento.preventDefault(); });
    document.getElementById("lista-filmes").addEventListener("click", abrirFilmeClicado);
    document.getElementById("lista-destaques").addEventListener("click", abrirFilmeClicado);
    document.getElementById("assistir-filme").addEventListener("click", abrirFilme);
    document.getElementById("ver-trailer").addEventListener("click", abrirTrailer);
    document.getElementById("voltar-detalhes").addEventListener("click", function () {
        voltarParaDetalhes();
        document.getElementById("assistir-filme").focus();
    });
    document.getElementById("janela-filme").addEventListener("hidden.bs.modal", function () {
        voltarParaDetalhes();
        filmeSelecionado = null;

        if (ultimoAcionador && ultimoAcionador.isConnected) {
            ultimoAcionador.focus();
        }
    });
    console.log("Catálogo da Vortex Filmes carregado com " + filmes.length + " filmes.");
}

iniciarCatalogo();
