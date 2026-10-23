# Validação da entrega — 22/10/2026

Base: commit `18b3652` de `opgmoraes/pedrodev`, coincidente com o ZIP enviado.

## Evidências obtidas

| Verificação                             | Resultado                                                                                                                     |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| TypeScript (`npm run check`)            | Passou                                                                                                                        |
| Produção (`npm run build`)              | Passou; na revisão V2, o bundle principal foi separado do Firebase e passou para aproximadamente 192 kB, sem o aviso anterior |
| Regras Firestore (`npm run test:rules`) | 6 testes passaram no emulador local com projeto demo                                                                          |
| Home no navegador                       | Renderização visual inspecionada, foto e navegação carregadas                                                                 |
| Galeria                                 | BITTO aberto; seleção Celular e avanço para tela 2/4 confirmados                                                              |
| FAQ                                     | Resposta expandida e conteúdo visível                                                                                         |
| Login sem configuração                  | Mensagem explícita; botões de autenticação desabilitados                                                                      |
| Painel sem autenticação                 | Redirecionamento ao login confirmado                                                                                          |
| Área do cliente sem configuração        | Erro legível em vez de carregamento infinito                                                                                  |
| PDF longo                               | Proposta com 100 itens gerou 7 páginas A4; contrato gerou 6; texto final e numeração presentes                                |
| Whitespace (`git diff --check`)         | Sem erros                                                                                                                     |

## Casos das regras de acesso

1. Visitante não lê dados privados nem lista links; consegue abrir um link conhecido.
2. Usuário autenticado comum não lê cadastro, não cria administrador e não escreve financeiro.
3. Administrador cadastrado lê cliente e grava recebimento.
4. Decisão pública preserva valor e só pode ocorrer uma vez.
5. Aceite preserva o contrato e não permite reversão pública.
6. Briefing válido é enviado sem liberar leitura; link inexistente e campo extra são rejeitados.

Os avisos `PERMISSION_DENIED` nos casos de rejeição são esperados: comprovam as negativas.

## Limites da verificação

- O ambiente recebido não trouxe as variáveis de configuração do Firebase nem uma conta administrativa autorizada. Login real, recuperação por e-mail, Google, CRUD em produção e integração completa com o banco do proprietário não foram executados.
- Painel autenticado e documentos com dados reais não foram inspecionados visualmente no navegador. Os componentes compilam e as permissões foram testadas em dados fictícios no emulador.
- Na revisão V2 foram inspecionadas renderizações em iframes com larguras de 390 e 768 px, sem overflow horizontal. Menu mobile, links sociais e navegação ao portfólio foram conferidos. Não foi feito teste em aparelhos físicos.
- Não houve deploy, push ou alteração das regras no Firebase do proprietário. O acesso GitHub fornecido é somente leitura.

## Conferência após configurar

1. Registrar seu UID em `admins` e publicar as regras.
2. Entrar pelo login; confirmar que outra conta não acessa o painel.
3. Preparar links antigos se houver dados.
4. Criar um cliente fictício e projeto; abrir a área do cliente em janela anônima; enviar briefing e conferir no painel.
5. Criar proposta e aprovar em janela anônima; recarregar contratos e gerar contrato a partir da proposta aprovada; conferir o aceite e o PDF.
6. Criar duas parcelas, dar baixa em uma e conferir totais/atrasos no financeiro e dashboard.
7. Editar conteúdo do portfólio e conferir na home e em `/portifolio`.

## Revisão V3

Hero e transição de nuvens inspecionadas em desktop; versões em 390 e 768 px sem overflow horizontal. Menu mobile, rota de portfólio, abertura da galeria BITTO e avanço de telas mobile confirmados. O build e a checagem TypeScript passaram. As regras de segurança não foram modificadas nesta revisão; permanecem os testes já executados. Detalhes em `AJUSTES_V3.md`.


## Revisão V4

Build aprovado. Camiseta lisa e cinco camadas de nuvens inspecionadas no navegador; as cinco imagens carregaram e a cena foi confirmada como visível. Mudanças restritas a imagem e apresentação.


## Revisão V5

Build aprovado. Retrato com moletom preto e quatro ícones vetoriais da hero conferidos no navegador. Sem alterações de dados ou regras.
