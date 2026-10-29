# alento interativo

Abra o `index.html` no navegador (duplo clique). Não precisa de servidor nem de instalação.

## Onde mudar cada coisa

| Quero mudar...                                | Arquivo                        | O quê                                  |
| --------------------------------------------- | ------------------------------ | -------------------------------------- |
| Textos, títulos e desenhos das 12 páginas     | `js/config.js`                 | lista `conteudos`                      |
| Mensagem final, textos dos botões             | `js/config.js`                 | bloco `textos`                         |
| Quando aparecem os minijogos e a ordem deles  | `js/config.js`                 | bloco `sequencia`                      |
| Velocidade de crescimento das plantas         | `js/config.js`                 | `minijogos.jardim.segundosPorEstagio`  |
| Desenho das plantas (broto, botão, margarida) | `js/minigames/garden.js`       | funções `desenharEstagio0` a `3`       |
| Pistas e código da fechadura (opcional)       | `js/config.js`                 | `minijogos.fechadura`                  |
| Tamanho do labirinto / peças do quebra-cabeça | `js/config.js`                 | `minijogos.labirinto` e `quebraCabeca` |
| Velocidade da virada de página                | `js/config.js`                 | bloco `virada`                         |
| Intensidade do "tremido" de lápis             | `js/config.js`                 | `estilo.intensidadeRabisco`            |
| Formato do caminho de fundo                   | `js/config.js`                 | `fundo.semente` (troque o número)      |
| Cores                                         | `css/style.css`                | variáveis no topo (`:root`)            |
| Fontes                                        | `index.html` + `css/style.css` | link do Google Fonts e `--fonte-*`     |
| Tamanho da folha do alento                    | `css/style.css`                | `--folha-largura` e `--folha-altura`   |
| Criar um desenho novo                         | `js/doodles.js`                | adicione uma função em `desenhos`      |

## Usar suas próprias imagens

Em cada item de `conteudos` (config.js):

- `imagem: "assets/illustrations/foto1.webp"` troca o desenho da página pela sua imagem.
- `fundo: "assets/backgrounds/caminho-01.webp"` troca o caminho gerado pelo código.

Se a imagem não carregar, o desenho/caminho padrão aparece no lugar.

## Como a sequência funciona

1. Você abre uma porta. Com `primeiroConteudoEhDaPorta: true`, a porta 05 mostra o conteúdo 05.
2. Os outros 11 conteúdos saem embaralhados (Fisher–Yates), sem repetir.
3. Depois do 3º, 6º e 9º conteúdo vem um minijogo obrigatório.
4. O progresso é salvo no navegador; ao voltar, aparece "Continuar de onde parei".

## Estrutura

```text
index.html
css/   style.css · doors.css · page-turn.css · minigames.css
js/    config.js · utils.js · doodles.js · storage.js · sequence.js
       background.js · page-turn.js · main.js
       minigames/  maze.js · puzzle.js · garden.js · lock.js
assets/  (pastas vazias para as suas imagens)
```

## Minijogos incluídos

Labirinto, quebra-cabeça e jardim (regar 9 vasinhos até virarem margaridas). A fechadura continua disponível: para usá-la, coloque `"fechadura"` em `sequencia.minijogos`.

## Criar um minijogo novo

1. Crie `js/minigames/meujogo.js` com `Diario.minijogos.meujogo = { montar(raiz, ctx) { ... return { destruir() {} }; } }`.
2. Chame `ctx.aoVencer()` quando o jogador ganhar e use `ctx.ativo()` antes de aceitar comandos.
3. Adicione o `<script>` no `index.html` e o nome em `config.sequencia.minijogos`.
