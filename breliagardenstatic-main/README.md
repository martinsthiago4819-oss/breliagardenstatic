# 🌸 Brelia Garden — Site Estático

Site institucional e catálogo de produtos da **Brelia Garden**, floricultura em Curitiba/PR.

Construído em HTML/CSS/JS puro, sem dependências de build. Pronto para deploy no **Vercel** em 1 clique.

---

## Estrutura do projeto

```
brelia-static/
├── index.html                    ← Home
├── produtos.html                 ← Catálogo completo
├── sobre.html                    ← Sobre a empresa
├── contato.html                  ← Página de contato
├── produto-box-rosas.html        ← Produto individual
├── produto-buque-misto.html
├── produto-orquidea.html
├── produto-cesta-romantica.html
├── vercel.json                   ← Rotas limpas + cache
├── README.md
├── css/
│   └── style.css                 ← Todos os estilos
├── js/
│   └── main.js                   ← Interatividade
└── images/                       ← Suas imagens aqui
```

---

## Antes de subir: personalize

### 1. Número de WhatsApp
Substitua **todos** os `5541999999999` pelo número real (com DDI 55 + DDD + número, sem espaços):
```bash
grep -r "5541999999999" . --include="*.html" -l
```
Abra cada arquivo listado e substitua o número.

### 2. Imagens reais
Coloque suas fotos na pasta `images/`. Nomes recomendados (sem espaços, minúsculas):
```
images/
├── hero.jpg            ← Foto principal do hero (1200×600px, ~400KB)
├── logo.png            ← Logo da floricultura (PNG transparente)
├── box-rosas.jpg
├── buque-misto.jpg
├── orquidea.jpg
├── cesta-romantica.jpg
└── favicon.ico
```

Substitua os `<div class="img-placeholder">` e `<div class="hero-img-ph">` pelas tags `<img>` correspondentes.

**Dica de otimização:**
```bash
npm install -g sharp-cli
for f in images/*.jpg; do
  sharp -i "$f" -o "${f%.jpg}.webp" --webp-quality 80
done
```

### 3. Logo no header
No `<head>` de cada página, troque o emoji pela tag de imagem:
```html
<!-- Antes -->
<span class="logo-text">🌸 Brelia Garden</span>

<!-- Depois (se tiver logo.png) -->
<img src="images/logo.png" alt="Brelia Garden" class="logo-img">
```

### 4. E-mail e endereço
Procure por `contato@breliagarden.com.br` e substitua pelo e-mail real.

### 5. Adicionar produtos novos
1. Copie qualquer `produto-xxx.html`
2. Renomeie (ex: `produto-buque-tropical.html`)
3. Substitua emoji, título, preço, descrição e link do WhatsApp
4. Adicione o `<a>` correspondente em `produtos.html` e `index.html`
5. Adicione a rota no `vercel.json`

---

## Deploy no Vercel

### Deploy inicial

```bash
# 1. Inicializar repositório Git
git init
git add -A
git commit -m "feat: site estático Brelia Garden"

# 2. Criar repositório no GitHub e conectar
git remote add origin https://github.com/SEU_USUARIO/brelia-static.git
git branch -M main
git push -u origin main
```

Depois:
1. Acesse [vercel.com](https://vercel.com) → **Add New Project**
2. Importe o repositório `brelia-static`
3. Configurações:
   - **Framework Preset:** `Other`
   - **Build Command:** *(deixe vazio)*
   - **Output Directory:** *(deixe vazio)*
4. Clique **Deploy** → pronto em ~30 segundos 🎉

### Domínio personalizado (opcional)

Em **Settings → Domains** no dashboard do Vercel, adicione seu domínio e crie os registros DNS:

| Tipo  | Nome  | Valor                  |
|-------|-------|------------------------|
| A     | `@`   | `76.76.21.21`          |
| CNAME | `www` | `cname.vercel-dns.com` |

HTTPS é ativado automaticamente em 5–30 minutos.

### Atualizar depois

```bash
git add -A
git commit -m "adiciona produto: buque-tropical"
git push origin main
# Vercel faz redeploy automático em ~20 segundos
```

---

## URLs limpas (sem .html)

O `vercel.json` já configura rotas limpas:

| URL digitada             | Arquivo servido              |
|--------------------------|------------------------------|
| `/`                      | `index.html`                 |
| `/produtos`              | `produtos.html`              |
| `/sobre`                 | `sobre.html`                 |
| `/contato`               | `contato.html`               |
| `/produto-box-rosas`     | `produto-box-rosas.html`     |

---

## Limites do plano gratuito Vercel

| Recurso            | Limite     | Suficiente para         |
|--------------------|------------|-------------------------|
| Banda/mês          | 100 GB     | ~500.000 visitas/mês    |
| Tamanho por deploy | 100 MB     | Centenas de imagens     |
| Domínios custom    | Ilimitado  | ✓                       |
| HTTPS              | Automático | ✓                       |
| Deploys/mês        | 100        | Mais que suficiente     |

---

## Tecnologias

- **HTML5** semântico com meta tags SEO
- **CSS3** com variáveis, Grid, Flexbox e animações suaves
- **Vanilla JS** (sem frameworks) — menu mobile, scroll, galeria, intersection observer
- **Google Fonts** — Cormorant Garamond + Jost
- **Vercel** — hospedagem estática gratuita com CDN global

---

## Dicas rápidas

**Link WhatsApp com mensagem pré-preenchida por produto:**
```
https://wa.me/5541999999999?text=Olá!%20Quero%20o%20Box%20de%20Rosas%20🌹
```
Use [urlencoder.org](https://urlencoder.org) para codificar o texto.

**Tamanho ideal das imagens:**
- Hero: 1200×600px, até 500KB
- Produto: 800×800px, até 250KB
- Categoria: 200×200px, até 80KB

---

*Feito com 🌸 para a Brelia Garden — Curitiba, PR*
