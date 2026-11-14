# 🎬 Vortex Filmes

Catálogo de **96 filmes em oito categorias**, com busca, destaques e detalhes. Desenvolvido com **HTML, CSS e JavaScript**, sem bibliotecas externas ou instalação de dependências.

## 🌐 Acesse o projeto

- **Site:** [Vortex Filmes na Netlify](https://vortex-filmes.netlify.app)
- **Código:** [Repositório no GitHub](https://github.com/Lcsf-dev/vortex-filmes)
- **Hospedagem:** site estático, publicado diretamente na Netlify, sem compilação ou arquivo de configuração adicional.

## ✨ Funcionalidades

- Busca por título ou gênero, combinada com filtros e sem diferenciar acentos.
- Três destaques sorteados a cada abertura, evitando a seleção anterior quando o armazenamento do navegador está disponível.
- Carrossel com troca a cada **6 segundos**, setas, indicadores e pausa; respeita a preferência por movimento reduzido.
- Janela de detalhes com capa, sinopse, ano, duração e player interno para filmes e trailers, sem abrir outras abas.
- Layout adaptado para celular, tablet e desktop, nas orientações vertical e horizontal; menu móvel e navegação por teclado.
- Favicon próprio com símbolo de reprodução e as cores da marca.

## 🚀 Como executar

Abra `index.html`. Para testar vídeos, prefira um servidor local, pois o YouTube pode restringir páginas abertas por `file://`:

```powershell
python -m http.server 5500 --bind 127.0.0.1
```

Acesse [localhost:5500](http://127.0.0.1:5500). Encerre com `Ctrl+C`. Os vídeos exigem internet. Você também pode desenvolver e apresentar o projeto localmente.

## 📁 Organização dos arquivos

```text
index.html                          Estrutura da página
css/styles.css                      Aparência e responsividade
js/movies.js                        Dados dos 96 filmes
js/catalog.js                       Busca, filtros e interações
images/posters/movie-001.jpg         Capas identificadas pelo número do filme
images/backgrounds/catalog-background.png
                                    Fundo do carrossel
images/brand/logo.png                Logotipo do site
.gitignore                          Arquivos que o Git deve ignorar
```

Nomes de arquivos e pastas seguem o padrão em inglês; conteúdo e comentários permanecem em português.

## 🧩 Como explicar o código

1. **HTML:** define as seções e os espaços que o JavaScript preenche. `defer` carrega os dados antes das funções, após a leitura do HTML.
2. **Dados:** `movies.js` guarda títulos, capas, sinopses, links e informações de idioma.
3. **Interações:** `catalog.js` monta os cartões, aplica os filtros, sorteia os destaques e controla o carrossel e a janela nativa `<dialog>`.
4. **Visual:** `styles.css` usa Flexbox, Grid, Scroll Snap e regras por tamanho de tela para organizar os elementos.

## ✅ Conferência dos vídeos — 14/11/2026

- **96 sinopses** revisadas; **72 filmes** com português confirmado e **24** com confirmação integral pendente.
- **81 trailers em português:** 40 dublados (seis com dublagem automática identificada) e 41 legendados. Outros **15 botões estão ocultos** por falta de português comprovado.
- **96 filmes têm link cadastrado com incorporação permitida nos metadados.** Os quatro registros indisponíveis foram substituídos por Arthur e os Minimoys, Uma Aventura no Gelo, Pororo: Aventuras no Castelo do Dragão e A Loja Mágica de Brinquedos, preservando suas categorias e atualizando capas e sinopses.
- Os 96 filmes e os 81 trailers visíveis usam o player interno. Confirmação de idioma é independente do destino de reprodução. Os trailers de Conduzido para Matar e Arthur e os Minimoys utilizam o player oficial do Dailymotion.
- CAPTCHA e limitações do YouTube impediram validar toda a reprodução. Idioma documentado e link disponível **não garantem reprodução atual**; disponibilidade pode mudar.
