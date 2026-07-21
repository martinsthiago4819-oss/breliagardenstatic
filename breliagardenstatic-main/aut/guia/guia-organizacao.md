# Guia de Execução — a partir de amanhã

## O modelo, pra não se perder de novo

**Trilha 1 — HTML seco (dentista, lojista, quem vier):**
- R$2.500 fixo na entrada = implementação. Até 30 dias, mexe no que a pessoa quiser.
- Depois do OK do cliente: contratinho, 10 alterações/mês. Ela usa ou não usa, você recebe igual.
- Valor da mensalidade recorrente pós-implementação: **ainda não travado — decidir esta semana.** Baseado no que já calculamos (mercado cobra R$300-800/mês em manutenção contínua), uma faixa segura é R$150-250/mês. Trave um número antes de vender de novo, senão cada cliente negocia um valor diferente e vira bagunça de contrato.

**Trilha 2 — SaaS:** anda em paralelo, sem prazo apertado, nas horas que sobrarem. Não compete com a trilha 1, ela é quem paga a conta enquanto o SaaS não fecha venda nenhuma.

---

## Amanhã — nessa ordem

- [ ] **1. Rodar o gerador de produtos com um produto real da florista** (não o de teste que te mandei). Pega uma foto de celular de verdade, sem tratar, roda o script, confere se o HTML e a foto saíram certos.
- [ ] **2. Abrir o `index-dentista.html` no navegador.** Ver se o embed de agendamento faz sentido pro caso ou se é melhor apagar e deixar só WhatsApp — decide isso olhando o site, não em teoria.
- [ ] **3. Travar o valor da mensalidade pós-implementação** (a lacuna do parágrafo acima). Escreve o número, não deixa em aberto.
- [ ] **4. Rascunhar o contratinho** (pontos abaixo) — não precisa ficar pronto amanhã, mas comece o rascunho enquanto está fresco.

---

## O que o "contratinho" precisa cobrir

Não sou advogado, isso aqui é a lista do que precisa estar escrito, não o texto jurídico final — vale revisar com um contador/advogado antes de usar pra valer, principalmente a parte de cancelamento e pagamento.

- **Escopo da implementação (os 30 dias):** o que está incluso (montar o site, subir produtos/serviços iniciais, ajustar textos e cores) e o que não está (ex: fotografia profissional, criação de logo do zero, integração de pagamento).
- **O que conta como "alteração"** depois do OK: trocar texto/preço/foto de item existente = 1 alteração. Adicionar produto novo = 1 alteração. Redesenhar seção inteira ou pedir funcionalidade nova = fora do pacote, orçado à parte.
- **O que acontece se passar de 10/mês:** alteração extra tem valor avulso definido (ex: R$40-60 cada), ou acumula pro mês seguinte — escolhe uma regra e deixa escrita.
- **Prazo de resposta:** até X dias úteis por alteração pedida (assim você não fica de plantão 24h no WhatsApp do cliente).
- **Pagamento:** quando entra o R$2.500 (à vista, ou metade na entrada e metade na entrega?), e quando começa a mensalidade (só depois do OK final, como você disse).
- **Cancelamento:** aviso de quantos dias, o que acontece com o site (ele leva o código? fica no ar até quando?).
- **Domínio e hospedagem:** no nome de quem fica registrado o domínio — isso evita dor de cabeça grande se o cliente sair depois.

---

## Sobre o agendamento do dentista (resolvido)

Site seco não tem backend pra construir calendário de verdade — isso exigiria banco de dados e lógica de agenda, que é escopo do SaaS, não de um HTML de R$2.500. A solução que não estoura o escopo: embed grátis de Calendly ou Cal.com (já está no `index-dentista.html`, comentado, pronto pra trocar o link). O cliente vê nome e horário de cada marcação direto no painel deles, você não constrói nada.

Decide amanhã, olhando o site: se o dentista tem pouco movimento e já resolve tudo por WhatsApp, apaga a seção — menos uma coisa pra manter. Se ele realmente recebe muita ligação pra agendar, mantém o embed e ele mesmo cria a conta grátis no Calendly/Cal.com com o link dele.

---

## Trilha SaaS — checklist paralelo, sem pressa

- [ ] Ver se `nome do site`, `whatsapp`, `cores`, `logo` já vêm de uma tabela `settings`/`clients`, ou ainda estão fixos no código — esse é o buraco mais importante antes de vender pra um segundo cliente no SaaS.
- [ ] Adicionar `client_id` nas tabelas (`admins`, `products`, `categories`, `settings`, `faqs`) — schema que já te passei.
- [ ] Subir o MariaDB no VPS, rodar `migrate.js` + `seed.js`.
- [ ] Rodar a checklist de caminho crítico: login → criar produto → aparece no site → editar → reflete → toggle destaque → reflete → trocar logo → reflete.
- [ ] Revisar o onclick que estava com bug (me manda o arquivo quando for mexer nisso).
- [ ] PIX/pagamento: **não mexe agora.** Só quando um cliente pedir e topar pagar por isso.

---

## Arquivos já entregues (não precisa pedir de novo)

- `index-dentista.html` — vitrine do dentista, com agendamento opcional (atualizado hoje)
- `gerador-produtos.zip` — script + template + exemplo funcionando (`gerar_produtos.py`)
- `auth.js` — middleware de login admin com `attachAdminClient`
- `resolveClient.js` — middleware que identifica o cliente nas rotas públicas do SaaS
