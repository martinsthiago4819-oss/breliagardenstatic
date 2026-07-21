#!/usr/bin/env python3
"""
Gerador de páginas de produto — UM script pra TODOS os clientes.

O que muda entre florista, dentista, etc. fica só nos arquivos de dados
(clientes/<nome>/config.json e produtos.json), nunca no código.

USO:
    python3 gerar_produtos.py clientes/brelia-garden
    python3 gerar_produtos.py clientes/brelia-garden --forcar-fotos

O QUE ELE FAZ:
  1. Lê clientes/<cliente>/config.json  (nome do site, whatsapp, cores etc.)
  2. Lê clientes/<cliente>/produtos.json (lista de produtos)
  3. Pra cada produto ativo:
     - Redimensiona as fotos de fotos-brutas/ pra site/images/
       (só reprocessa se a foto final ainda não existir, ou com --forcar-fotos)
     - Gera site/produto-<slug>.html a partir do template (sempre recria —
       é rápido e evita HTML desatualizado)
  4. Gera site/produtos.html com a vitrine de todos os produtos ativos

Dependências:  pip install Pillow Jinja2 --break-system-packages
"""
import json
import sys
import shutil
from pathlib import Path
from datetime import datetime
from argparse import ArgumentParser

from jinja2 import Environment, FileSystemLoader
from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
TEMPLATES_DIR = RAIZ / "templates"

# Dimensões padrão de saída — ajuste aqui uma vez, vale pra todo cliente
TAMANHO_PRINCIPAL = (800, 800)   # foto grande do produto
TAMANHO_EXTRA = (800, 800)       # thumbs da galeria
QUALIDADE_JPEG = 82


def carregar_json(caminho: Path):
    if not caminho.exists():
        sys.exit(f"❌ Arquivo não encontrado: {caminho}")
    with open(caminho, "r", encoding="utf-8") as f:
        return json.load(f)


def processar_foto(origem: Path, destino: Path, tamanho: tuple, forcar: bool):
    """Redimensiona/corta a foto pro tamanho padrão. Pula se já existir e não for forçado."""
    if destino.exists() and not forcar:
        return  # já processada — não gasta tempo de novo

    if not origem.exists():
        print(f"  ⚠️  Foto não encontrada em fotos-brutas: {origem.name} — pulando")
        return

    destino.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(origem) as img:
        img = ImageOps.exif_transpose(img)  # corrige fotos de celular giradas
        img = img.convert("RGB")

        # corta pro centro mantendo proporção (estilo "cover", igual object-fit:cover do CSS)
        img_ratio = img.width / img.height
        alvo_ratio = tamanho[0] / tamanho[1]

        if img_ratio > alvo_ratio:
            nova_largura = int(img.height * alvo_ratio)
            corte = (img.width - nova_largura) // 2
            img = img.crop((corte, 0, corte + nova_largura, img.height))
        else:
            nova_altura = int(img.width / alvo_ratio)
            corte = (img.height - nova_altura) // 2
            img = img.crop((0, corte, img.width, corte + nova_altura))

        img = img.resize(tamanho, Image.LANCZOS)
        img.save(destino, "JPEG", quality=QUALIDADE_JPEG, optimize=True)

    print(f"  🖼️  {origem.name} → {destino.name} ({tamanho[0]}x{tamanho[1]})")


def montar_relacionados(produto: dict, todos: list) -> list:
    slugs = produto.get("relacionados", [])
    por_slug = {p["slug"]: p for p in todos}
    return [por_slug[s] for s in slugs if s in por_slug]


def gerar(cliente_dir: Path, forcar_fotos: bool):
    config = carregar_json(cliente_dir / "config.json")
    produtos = carregar_json(cliente_dir / "produtos.json")

    fotos_brutas = cliente_dir / "fotos-brutas"
    site_dir = cliente_dir / "site"
    images_dir = site_dir / "images"

    env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))
    tpl_produto = env.get_template("produto.html.j2")

    ativos = [p for p in produtos if p.get("ativo", True)]

    for produto in ativos:
        print(f"\n▶ {produto['nome']}")

        # --- fotos ---
        processar_foto(
            fotos_brutas / produto["foto_principal"],
            images_dir / produto["foto_principal"],
            TAMANHO_PRINCIPAL,
            forcar_fotos,
        )
        for foto in produto.get("fotos_extra", []):
            processar_foto(fotos_brutas / foto, images_dir / foto, TAMANHO_EXTRA, forcar_fotos)

        # --- html ---
        html = tpl_produto.render(
            produto=produto,
            config=config,
            relacionados=montar_relacionados(produto, ativos),
            ano=datetime.now().year,
        )
        destino_html = site_dir / f"produto-{produto['slug']}.html"
        destino_html.parent.mkdir(parents=True, exist_ok=True)
        destino_html.write_text(html, encoding="utf-8")
        print(f"  ✅ {destino_html.name}")

    print(f"\n✅ {len(ativos)} produto(s) gerado(s) em {site_dir}\n")


def main():
    parser = ArgumentParser(description="Gera páginas de produto a partir de produtos.json")
    parser.add_argument("cliente_dir", help="Pasta do cliente, ex: clientes/brelia-garden")
    parser.add_argument(
        "--forcar-fotos",
        action="store_true",
        help="Reprocessa TODAS as fotos mesmo que já existam (use se mudou o recorte/tamanho padrão)",
    )
    args = parser.parse_args()
    gerar(Path(args.cliente_dir), args.forcar_fotos)


if __name__ == "__main__":
    main()
