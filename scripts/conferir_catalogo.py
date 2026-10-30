"""Confere o catálogo de vídeos antes de publicar o site.

Roda sozinho no GitHub a cada envio. Se algum vídeo estiver com campo errado,
a publicação para e o erro aparece explicado na aba Actions.
Para rodar no seu computador:  python scripts/conferir_catalogo.py
"""
import json
import sys

CATALOGO = "docs/videos/catalogo.json"
MATERIAS = "docs/videos/materias.json"
NIVEIS = {"iniciante", "intermediario", "avancado"}
TIPOS = {"video", "playlist", "canal"}
OBRIGATORIOS = ["titulo", "url", "materia", "nivel"]

erros = []

try:
    catalogo = json.load(open(CATALOGO, encoding="utf-8"))
except json.JSONDecodeError as e:
    sys.exit(f"ERRO: {CATALOGO} não é um JSON válido (linha {e.lineno}, coluna {e.colno}): {e.msg}\n"
             "Dica: confira vírgulas entre os vídeos e se não sobrou vírgula depois do último.")

taxonomia = json.load(open(MATERIAS, encoding="utf-8"))
materias = {m["slug"] for a in taxonomia["areas"] for m in a["materias"]}

for i, v in enumerate(catalogo.get("videos", []), start=1):
    nome = v.get("titulo") or f"vídeo nº {i}"
    for campo in OBRIGATORIOS:
        if not v.get(campo):
            erros.append(f"'{nome}': falta o campo '{campo}'")
    if v.get("materia") and v["materia"] not in materias:
        erros.append(f"'{nome}': matéria '{v['materia']}' não existe. Use um destes: {', '.join(sorted(materias))}")
    if v.get("nivel") and v["nivel"] not in NIVEIS:
        erros.append(f"'{nome}': nível '{v['nivel']}' inválido. Use: {', '.join(sorted(NIVEIS))}")
    if v.get("tipo") and v["tipo"] not in TIPOS:
        erros.append(f"'{nome}': tipo '{v['tipo']}' inválido. Use: {', '.join(sorted(TIPOS))}")
    if v.get("url") and not v["url"].startswith("https://"):
        erros.append(f"'{nome}': o link precisa começar com https://")

if erros:
    print("Encontrei problemas no catálogo de vídeos:\n")
    print("\n".join("- " + e for e in erros))
    sys.exit(1)

print(f"Catálogo OK: {len(catalogo.get('videos', []))} vídeo(s).")
