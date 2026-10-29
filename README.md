# alento interativo

Abra o `index.html` no navegador (duplo clique). Não precisa de servidor nem de instalação.

O diário contém 12 páginas com poemas e lembranças, usando as fotografias da pasta `assets/illustrations/`.

Memories in the Rain:

Se eu fosse a chuva, poderia unir meu coração ao seu?
Assim como ela une os eternamente distantes céu e terra.

Night of Wijnruit:

Os raios de sol que aos poucos brilham
Os raios de sol que aos poucos banham a Terra apagam as pegadas deixadas na fina camada de neve.
Não tema ser iludida, pois, mesmo que o mundo esteja repleto de decepções, ainda existem aqueles que desejam proteger seu sorriso.

Sem nome:

Se minhas palavras tomassem forma,
seria como se meu fracasso chegasse até você, parado na escuridão.

My Last Words

A menos que eu agarre a espada, eu não poderei proteger você.
Enquanto agarro a espada, eu não posso abraçar você.

Nós
Como um: estamos entrelaçados.
Como dois: não compartilhamos uma mesma forma.
Como três: não temos olhos.
Como quatro: temos esperança.
No quinto: é onde está o coração.

My last words

As palavras são a melhor forma de comunicação.
“Te amo”, “te quero”, “te adoro”.
De que me serve tudo isso... se não te tenho ao meu lado?

Memories in the Rain

A distância pode separar dois mundos, mas o coração sempre procura uma maneira de se aproximar de quem é especial.

Night of Wijnruit

Mesmo que o mundo traga decepções, ainda existem pessoas que desejam cuidar de você e preservar o seu sorriso.

Sem título

Às vezes, o medo de falhar torna difícil expressar aquilo que realmente sentimos.

My Last Words

A força não está apenas em empunhar uma espada para proteger alguém, mas também em saber quando baixá-la para oferecer um abraço.

Nós

Duas pessoas podem ser diferentes e viver em mundos distintos, mas ainda encontrar esperança e conexão uma na outra.

My Last Words

As palavras podem expressar o que sentimos, mas nada substitui a felicidade de poder estar ao lado de quem queremos.

[2:37 PM, 10/29/2026] Lobão Subzero: Significado
[2:42 PM, 10/29/2026] Lobão Subzero: Antes de você se tornar quem é hoje...

Existiu uma menina que regava seu pequeno jardim, aprendia com a avó, observava a neve, procurava o céu nos telhados e transformava parquinhos em mundos inteiros.

Cada lugar guardou uma pequena parte de quem você é. E cada um deles estará para sempre guardado em sua memória.
[2:42 PM, 10/29/2026] Lobão Subzero: Pro final ai
[2:42 PM, 10/29/2026] Lobão Subzero: Quando ela zerar todos os minigames
[2:44 PM, 10/29/2026] Lobão Subzero: A neve caía lentamente, cobrindo as ruas, os telhados e os jardins de branco. A paisagem se transformava diante dos seus olhos, e o inverno trazia uma beleza diferente aos lugares que você conhecia. 04. Entre os telhados e o céu
Você subia nos telhados para observar o céu, encontrando um lugar de onde podia olhar o mundo de outra perspectiva. Entre as casas e as nuvens, aqueles momentos faziam parte das suas aventuras de infância. 05. O parquinho
No parquinho, as tardes eram preenchidas por brincadeiras, balanços e descobertas. Cada brinquedo oferecia uma nova aventura, e aquele espaço se tornava um mundo inteiro para explorar, correr e se divertir.

## Onde mudar cada coisa

| Quero mudar...                                | Arquivo                        | O quê                                  |
| --------------------------------------------- | ------------------------------ | -------------------------------------- |
| Textos, títulos, notas e imagens das 12 páginas | `js/config.js`               | lista `conteudos`                      |
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

Em cada item de `conteudos` (`js/config.js`):

- `imagem: "assets/illustrations/memoria-01.jpg"` define a fotografia exibida naquela página. As 12 imagens atuais já estão associadas aos cards.
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
assets/illustrations/  memoria-01.jpg a memoria-12.jpg
```

## Minijogos incluídos

Labirinto, quebra-cabeça e jardim (regar 9 vasinhos até virarem margaridas). A fechadura continua disponível: para usá-la, coloque `"fechadura"` em `sequencia.minijogos`.

## Criar um minijogo novo

1. Crie `js/minigames/meujogo.js` com `Diario.minijogos.meujogo = { montar(raiz, ctx) { ... return { destruir() {} }; } }`.
2. Chame `ctx.aoVencer()` quando o jogador ganhar e use `ctx.ativo()` antes de aceitar comandos.
3. Adicione o `<script>` no `index.html` e o nome em `config.sequencia.minijogos`.
