# Biblioteca Volt e Meia

Resumos e curadoria de vídeos de Engenharia Mecatrônica, organizados por matéria. Site feito com [Zensical](https://zensical.org/) e publicado no GitHub Pages.

## Estrutura

```
biblioteca-volt-e-meia/
├── zensical.toml          ← configuração do site (nome, cores, menu)
├── docs/                  ← todo o conteúdo do site fica aqui
│   ├── index.md           ← página inicial
│   ├── materias/          ← uma pasta por área
│   │   └── controle/                  ← área
│   │       ├── index.md               ← página da área
│   │       └── controle-de-sistemas-dinamicos/   ← matéria
│   │           ├── index.md           ← página da matéria (lista de assuntos)
│   │           └── primeira-ordem.md  ← um assunto
│   ├── videos/
│   │   ├── index.md       ← página do catálogo
│   │   ├── catalogo.json  ← A LISTA DE VÍDEOS (é aqui que você adiciona)
│   │   └── materias.json  ← lista de áreas e matérias usada pelos filtros
│   ├── javascripts/videos.js  ← monta o catálogo e os filtros
│   ├── sobre.md
│   └── contribuir.md
├── notebooks/             ← notebooks do Google Colab, mesma organização das matérias
│   └── controle/controle-de-sistemas-dinamicos/primeira-ordem.ipynb
├── modelos/
│   ├── modelo-assunto.md      ← copie para criar um assunto novo
│   └── modelo-notebook.ipynb  ← copie para criar um notebook novo
├── scripts/
│   └── conferir_catalogo.py   ← confere o catalogo.json antes de publicar
└── .github/
    ├── workflows/docs.yml     ← publica o site sozinho a cada push
    └── ISSUE_TEMPLATE/        ← formulários de "Sugerir um vídeo" e "Apontar um erro"
```

## Como colocar no ar (uma vez só)

1. Crie um repositório público no GitHub chamado `biblioteca-volt-e-meia`.
2. Envie estes arquivos para ele (pelo GitHub Desktop, pelo terminal com `git push` ou arrastando na página do repositório).
3. No repositório, vá em **Settings → Pages** e, em **Source**, escolha **GitHub Actions**.
4. Abra a aba **Actions** e espere o "Publicar site" ficar verde.
5. O site estará em `https://arthurhac99.github.io/biblioteca-volt-e-meia/`.

## Como ver o site no seu computador

Precisa de Python 3.11 ou mais novo.

```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

pip install zensical
zensical serve
```

Abra `http://localhost:8000` no navegador. A página atualiza sozinha cada vez que você salva um arquivo.

## Como adicionar um assunto novo

1. Copie `modelos/modelo-assunto.md` para a pasta da matéria, por exemplo `docs/materias/controle/controle-de-sistemas-dinamicos/segunda-ordem.md`.
2. Escreva o conteúdo.
3. Adicione a página no `nav` do `zensical.toml`, dentro da matéria.
4. Na tabela de assuntos do `index.md` da matéria, transforme o nome em link e mude o status.
5. Faça commit e push. Em um ou dois minutos o site atualiza.

## Como adicionar um vídeo ao catálogo

Abra `docs/videos/catalogo.json` e acrescente um bloco dentro da lista `"videos"`:

```json
{
  "videos": [
    {
      "titulo": "Curso de Controle Clássico",
      "canal": "Nome do canal",
      "url": "https://www.youtube.com/playlist?list=...",
      "tipo": "playlist",
      "materia": "controle-de-sistemas-dinamicos",
      "nivel": "iniciante",
      "idioma": "PT",
      "descricao": "Uma ou duas frases dizendo por que vale assistir."
    }
  ]
}
```

| Campo | O que colocar |
|---|---|
| `titulo` | Nome do vídeo, playlist ou canal (obrigatório) |
| `canal` | Nome do canal |
| `url` | Link começando com `https://` (obrigatório) |
| `tipo` | `video`, `playlist` ou `canal` |
| `materia` | Nome da **pasta** da matéria, por exemplo `poo` ou `circuitos-eletricos` (obrigatório). A lista completa está em `docs/videos/materias.json` |
| `nivel` | `iniciante`, `intermediario` ou `avancado` (obrigatório, sem acento) |
| `idioma` | `PT`, `EN` ou `ES` |
| `descricao` | Por que vale assistir |

Para mais de um vídeo, separe os blocos `{ ... }` com vírgula, e não deixe vírgula depois do último.

O vídeo aparece sozinho em três lugares: no catálogo, na página da matéria e na página da área. Se algum campo estiver errado, a publicação para e a aba **Actions** mostra qual vídeo e qual campo corrigir.

Sugestões que chegam pelo formulário ficam na aba **Issues** do repositório. Depois de assistir e aprovar, copie os dados para o `catalogo.json` e feche a issue.

## Notebooks do Google Colab

Os notebooks ficam em `notebooks/`, com a mesma organização das matérias. O Colab abre qualquer notebook deste repositório pelo endereço:

```
https://colab.research.google.com/github/Arthurhac99/biblioteca-volt-e-meia/blob/main/notebooks/CAMINHO/DO/ARQUIVO.ipynb
```

Para criar um novo:

1. Copie `modelos/modelo-notebook.ipynb` para a pasta certa dentro de `notebooks/`.
2. Abra no Colab pelo endereço acima, escreva e teste.
3. No Colab, use **Arquivo → Salvar uma cópia no GitHub** e escolha este repositório e o mesmo caminho. Isso já faz o commit.
4. Na página do assunto, coloque o botão "Abrir no Colab" (o modelo `modelo-assunto.md` já tem a linha pronta).

Quem abre o notebook pelo site recebe uma cópia: pode mexer à vontade que o original não muda.
