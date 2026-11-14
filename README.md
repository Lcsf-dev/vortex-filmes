# 🎬 Vortex Filmes

Catálogo de **144 filmes em 12 categorias**, com busca, destaques e detalhes. Desenvolvido com **HTML, CSS e JavaScript**, sem bibliotecas externas ou instalação de dependências.

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
js/movies.js                        Dados dos 144 filmes
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

- **144 títulos e sinopses**, com 12 em cada categoria. Adicionadas **Comédia, Suspense, Fantasia e Documentário**, preservando os 96 registros anteriores.
- **48 novos vídeos completos com áudio em português**, publicados por NetMovies, Film Plus e DW Brasil. Incorporação e disponibilidade no Brasil constam nos metadados; reprodução integral não foi testada.
- Os 12 documentários são produções estrangeiras da DW com narração e tradução de falas em português, com duração entre 25 e 43 minutos. O ano exibido nesses registros é o da publicação da versão em português; nas ficções novas, os anos vão de 2016 a 2024.
- **120 filmes com português confirmado**; as 24 pendências de confirmação integral dos registros antigos permanecem documentadas.
- **113 trailers em português:** 55 dublados e 58 legendados. As versões automáticas permanecem identificadas nos dados e na interface.
- Foram adicionados **32 trailers confirmados**. Os 12 documentários não tiveram trailer separado localizado. Melhores A(m)igos: Volume 1 e A Pequena Bruxa retornaram outras obras ou versões sem português comprovado; Apanhador de Pesadelos não teve português confirmado; Entre Mundos teve versões em português com incorporação bloqueada. Os 16 botões correspondentes ficam ocultos, junto dos 15 já ocultos no catálogo anterior. Os motivos constam em `trailerVerificacao` de cada registro.
- Filmes e trailers disponíveis usam o player interno. Os trailers de Conduzido para Matar e Arthur e os Minimoys utilizam o player oficial do Dailymotion.
- CAPTCHA e limitações do YouTube impedem garantir a reprodução integral de todos os vídeos. Idioma documentado e link disponível não garantem reprodução atual; a disponibilidade pode mudar.
