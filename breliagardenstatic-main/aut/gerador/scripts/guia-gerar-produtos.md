# Guia rápido: como cadastrar um produto novo

Fluxo pensado pro dia a dia: cliente manda foto + descrição no WhatsApp → você joga nos arquivos certos → roda o script.

## 1. A estrutura de pastas que o script espera

```
clientes/
  brelia-garden/              ← uma pasta por cliente
    config.json                ← dados fixos do site (nome, whatsapp, cores)
    produtos.json               ← lista de produtos (você edita este)
    fotos-brutas/                ← fotos originais, sem tratamento
      rosa-vermelha.jpg
      rosa-vermelha-2.jpg
    site/                        ← gerado pelo script, não mexe na mão
      images/
      produto-rosa-vermelha.html
templates/
  produto.html.j2
```

Se o cliente ainda não existe, crie a pasta `clientes/<nome-do-cliente>/` com `config.json`, `produtos.json` (pode começar com `[]`) e `fotos-brutas/`.

## 2. Quando chega uma foto + descrição pelo WhatsApp

**Passo 1 — salvar a foto**
Baixe a(s) foto(s) do WhatsApp e jogue direto em:
```
clientes/<cliente>/fotos-brutas/
```
Dica de nome: use algo parecido com o slug do produto, tipo `orquidea-branca.jpg`, `orquidea-branca-2.jpg`. Facilita achar depois. Não precisa redimensionar nada — o script faz isso.

**Passo 2 — adicionar a entrada no `produtos.json`**
Abra `clientes/<cliente>/produtos.json` e adicione um bloco assim na lista:

```json
{
  "slug": "orquidea-branca",
  "nome": "Orquídea Branca",
  "descricao": "Texto que o cliente mandou no WhatsApp, ajustado.",
  "preco": "89,90",
  "foto_principal": "orquidea-branca.jpg",
  "fotos_extra": ["orquidea-branca-2.jpg"],
  "relacionados": ["rosa-vermelha"],
  "ativo": true
}
```

Campos que você provavelmente vai usar sempre:
- `slug`: identificador único, sem espaço/acento — vira o nome do arquivo HTML (`produto-<slug>.html`) e é usado em `relacionados`.
- `foto_principal` / `fotos_extra`: precisam bater exatamente com o nome do arquivo que você salvou em `fotos-brutas/`.
- `ativo`: `false` esconde o produto sem precisar apagar nada.

> Se o template (`produto.html.j2`) usa outros campos além desses (preço, categoria etc.), confira lá quais chaves ele espera — o script só repassa o que estiver no JSON.

**Passo 3 — rodar o script**
No terminal, na raiz do projeto:
```bash
python3 scripts/gerar_produtos.py clientes/<cliente>
```
(ajuste o caminho do script se ele estiver em outro lugar — pelo cabeçalho, ele espera rodar de dentro de uma pasta tipo `scripts/`, já que sobe um nível pra achar `templates/`)

Isso vai:
- redimensionar as fotos novas e salvar em `site/images/`
- gerar `site/produto-orquidea-branca.html`
- regenerar `site/produtos.html` com a vitrine atualizada

## 3. Casos do dia a dia

**Troquei a foto de um produto que já existia**
O script só reprocessa a foto se o arquivo de destino ainda não existir. Se você só substituir o arquivo em `fotos-brutas/` com o mesmo nome, a versão antiga em `site/images/` continua lá. Rode com:
```bash
python3 scripts/gerar_produtos.py clientes/<cliente> --forcar-fotos
```
Isso reprocessa **todas** as fotos do cliente — mais lento, mas garante que nada ficou desatualizado.

**Só mudei a descrição/preço no `produtos.json`**
Não precisa de `--forcar-fotos`. O HTML é sempre recriado do zero a cada execução, então basta rodar o comando normal.

**Quero tirar um produto do site sem apagar nada**
Troque `"ativo": true` para `"ativo": false` no `produtos.json` e rode o script de novo.

## 4. Checklist rápido pra cada pedido do WhatsApp

1. [ ] Salvar foto(s) em `clientes/<cliente>/fotos-brutas/`
2. [ ] Copiar/colar bloco novo em `produtos.json` (ou editar o existente)
3. [ ] Conferir que `foto_principal` e `fotos_extra` batem com os nomes dos arquivos
4. [ ] Rodar `python3 scripts/gerar_produtos.py clientes/<cliente>`
5. [ ] Abrir `site/produto-<slug>.html` no navegador pra conferir
