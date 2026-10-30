# Biblioteca Volt e Meia

Resumos e curadoria de vídeos de Engenharia Mecatrônica, organizados por matéria. Site feito com [Zensical](https://zensical.org/) e publicado no GitHub Pages.

## Estrutura

```
biblioteca-volt-e-meia/
├── zensical.toml          ← configuração do site (nome, cores, menu)
├── docs/                  ← todo o conteúdo do site fica aqui
│   ├── index.md           ← página inicial
│   ├── materias/          ← uma pasta por matéria
│   │   └── controle/
│   │       ├── index.md           ← página da matéria
│   │       └── primeira-ordem.md  ← um assunto
│   ├── videos/index.md    ← curadoria de canais e playlists
│   ├── sobre.md
│   └── contribuir.md
├── modelos/
│   └── modelo-assunto.md  ← copie este arquivo para criar um assunto novo
└── .github/workflows/
    └── docs.yml           ← publica o site sozinho a cada push
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

1. Copie `modelos/modelo-assunto.md` para a pasta da matéria, por exemplo `docs/materias/controle/segunda-ordem.md`.
2. Escreva o conteúdo.
3. Adicione a página no `nav` do `zensical.toml`.
4. Atualize a tabela de assuntos no `index.md` da matéria.
5. Faça commit e push. Em um ou dois minutos o site atualiza.
