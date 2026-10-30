// =============================================================
//  Catálogo de vídeos da Biblioteca Volt e Meia
//
//  Lê a lista de vídeos (videos/catalogo.json) e a lista de matérias
//  (videos/materias.json) e monta:
//    - o catálogo completo com filtros:   <div class="vem-catalogo"></div>
//    - a lista de uma matéria:            <div class="vem-videos" data-materia="poo"></div>
//    - a lista de uma área inteira:       <div class="vem-videos" data-area="controle"></div>
//
//  Para adicionar vídeos você NÃO precisa mexer aqui: edite o catalogo.json.
// =============================================================

(function () {
  "use strict";

  const URL_SUGERIR =
    "https://github.com/Arthurhac99/biblioteca-volt-e-meia/issues/new?template=sugerir-video.yml";

  const NIVEIS = { iniciante: "Iniciante", intermediario: "Intermediário", avancado: "Avançado" };
  const ORDEM_NIVEL = { iniciante: 0, intermediario: 1, avancado: 2 };
  const TIPOS = { video: "Vídeo", playlist: "Playlist", canal: "Canal" };

  // Endereço base do site, descoberto a partir do endereço deste próprio arquivo.
  // Assim funciona em qualquer página, não importa a profundidade da pasta.
  const meuScript = document.querySelector('script[src*="javascripts/videos.js"]');
  const BASE = meuScript ? meuScript.src.replace(/javascripts\/videos\.js.*$/, "") : "/";

  // ---------- Carregar os dados (uma vez só) ----------

  let promessaDados = null;

  function carregarDados() {
    if (!promessaDados) {
      const buscar = (arquivo) =>
        fetch(BASE + "videos/" + arquivo).then((r) => {
          if (!r.ok) throw new Error(arquivo + ": " + r.status);
          return r.json();
        });

      promessaDados = Promise.all([buscar("catalogo.json"), buscar("materias.json")])
        .then(([catalogo, taxonomia]) => montarIndices(catalogo, taxonomia))
        .catch((erro) => {
          promessaDados = null; // permite tentar de novo na próxima página
          throw erro;
        });
    }
    return promessaDados;
  }

  // Organiza os dados para ficar fácil filtrar
  function montarIndices(catalogo, taxonomia) {
    const areas = taxonomia.areas;           // [{slug, nome, materias: [{slug, nome}]}]
    const materiaInfo = {};                  // "poo" -> {nome, area, areaNome}
    const areaNome = {};
    areas.forEach((a) => {
      areaNome[a.slug] = a.nome;
      a.materias.forEach((m) => {
        materiaInfo[m.slug] = { nome: m.nome, area: a.slug, areaNome: a.nome };
      });
    });

    const videos = (catalogo.videos || []).map((v) => {
      const info = materiaInfo[v.materia] || {};
      return Object.assign({}, v, {
        area: info.area || v.area || "",
        areaNome: info.areaNome || areaNome[v.area] || "",
        materiaNome: info.nome || "",
        // texto usado na busca, sem acentos e em minúsculas
        _busca: semAcento([v.titulo, v.canal, v.descricao, info.nome, info.areaNome].join(" ")),
      });
    });

    videos.sort(
      (a, b) =>
        (ORDEM_NIVEL[a.nivel] ?? 9) - (ORDEM_NIVEL[b.nivel] ?? 9) ||
        String(a.titulo).localeCompare(String(b.titulo), "pt-BR")
    );

    return { areas, materiaInfo, videos };
  }

  // ---------- Ajudantes ----------

  function semAcento(texto) {
    return String(texto || "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase();
  }

  // Cria um elemento HTML com atributos e filhos (texto é sempre tratado como texto,
  // nunca como HTML, o que evita problemas se um título tiver < ou >)
  function el(tag, atributos, ...filhos) {
    const e = document.createElement(tag);
    Object.entries(atributos || {}).forEach(([k, v]) => {
      if (v === null || v === undefined || v === false) return;
      if (k === "texto") e.textContent = v;
      else e.setAttribute(k, v);
    });
    filhos.flat().forEach((f) => {
      if (f === null || f === undefined || f === false) return;
      e.append(f instanceof Node ? f : document.createTextNode(String(f)));
    });
    return e;
  }

  function linkSugerir(nomeMateria) {
    let url = URL_SUGERIR;
    if (nomeMateria) url += "&materia=" + encodeURIComponent(nomeMateria);
    return el("a", { href: url, target: "_blank", rel: "noopener", class: "vem-sugerir" }, "Sugerir um vídeo");
  }

  // ---------- Card de um vídeo ----------

  function card(v) {
    const etiquetas = el(
      "div",
      { class: "vem-card-etiquetas" },
      v.nivel && el("span", { class: "nivel" }, NIVEIS[v.nivel] || v.nivel),
      v.tipo && el("span", { class: "vem-etiqueta" }, TIPOS[v.tipo] || v.tipo),
      v.idioma && el("span", { class: "vem-etiqueta" }, v.idioma)
    );

    return el(
      "article",
      { class: "vem-card" },
      etiquetas,
      el("h3", { class: "vem-card-titulo" },
        el("a", { href: v.url, target: "_blank", rel: "noopener" }, v.titulo || "Sem título")),
      v.canal && el("p", { class: "vem-card-canal" }, v.canal),
      v.descricao && el("p", { class: "vem-card-descricao" }, v.descricao),
      v.materiaNome && el("p", { class: "vem-card-materia" }, v.areaNome + " › " + v.materiaNome)
    );
  }

  function grade(videos) {
    return el("div", { class: "vem-grade" }, videos.map(card));
  }

  // ---------- Lista de uma matéria ou área ----------

  function montarLista(alvo, dados) {
    const materia = alvo.dataset.materia;
    const area = alvo.dataset.area;
    const lista = dados.videos.filter((v) =>
      materia ? v.materia === materia : area ? v.area === area : true
    );
    const nomeMateria = materia && dados.materiaInfo[materia] ? dados.materiaInfo[materia].nome : "";
    const filtro = materia ? "materia=" + materia : area ? "area=" + area : "";

    alvo.replaceChildren();
    if (lista.length === 0) {
      alvo.append(
        el("p", { class: "vem-vazio" },
          "Ainda não há vídeos selecionados aqui. Conhece um bom? ", linkSugerir(nomeMateria))
      );
      return;
    }
    alvo.append(
      grade(lista),
      el("p", { class: "vem-rodape" },
        el("a", { href: BASE + "videos/" + (filtro ? "?" + filtro : "") }, "Ver no catálogo completo"),
        " · ",
        linkSugerir(nomeMateria))
    );
  }

  // ---------- Catálogo completo com filtros ----------

  function montarCatalogo(alvo, dados) {
    const params = new URLSearchParams(location.search);

    const opcao = (valor, texto) => el("option", { value: valor }, texto);

    const busca = el("input", {
      type: "search", class: "vem-campo vem-busca",
      placeholder: "Buscar por título, canal ou assunto", "aria-label": "Buscar",
    });
    const selArea = el("select", { class: "vem-campo", "aria-label": "Área" },
      opcao("", "Todas as áreas"), dados.areas.map((a) => opcao(a.slug, a.nome)));
    const selMateria = el("select", { class: "vem-campo", "aria-label": "Matéria" });
    const selNivel = el("select", { class: "vem-campo", "aria-label": "Nível" },
      opcao("", "Todos os níveis"), Object.entries(NIVEIS).map(([k, t]) => opcao(k, t)));
    const idiomas = [...new Set(dados.videos.map((v) => v.idioma).filter(Boolean))].sort();
    const selIdioma = el("select", { class: "vem-campo", "aria-label": "Idioma" },
      opcao("", "Todos os idiomas"), idiomas.map((i) => opcao(i, i)));

    const contador = el("p", { class: "vem-contador" });
    const resultado = el("div");

    // A lista de matérias depende da área escolhida
    function preencherMaterias() {
      const area = dados.areas.find((a) => a.slug === selArea.value);
      const materias = area ? area.materias : dados.areas.flatMap((a) => a.materias);
      const atual = selMateria.value;
      selMateria.replaceChildren(opcao("", "Todas as matérias"), ...materias.map((m) => opcao(m.slug, m.nome)));
      if (materias.some((m) => m.slug === atual)) selMateria.value = atual;
    }

    function atualizar() {
      const termo = semAcento(busca.value.trim());
      const filtrados = dados.videos.filter(
        (v) =>
          (!selArea.value || v.area === selArea.value) &&
          (!selMateria.value || v.materia === selMateria.value) &&
          (!selNivel.value || v.nivel === selNivel.value) &&
          (!selIdioma.value || v.idioma === selIdioma.value) &&
          (!termo || v._busca.includes(termo))
      );

      const n = filtrados.length;
      contador.textContent = n === 1 ? "1 vídeo encontrado" : n + " vídeos encontrados";
      resultado.replaceChildren(
        n
          ? grade(filtrados)
          : el("p", { class: "vem-vazio" },
              dados.videos.length
                ? "Nenhum vídeo com esses filtros. Tente limpar algum deles ou "
                : "O catálogo ainda está sendo montado. Conhece um vídeo bom? ",
              linkSugerir(dados.materiaInfo[selMateria.value]?.nome))
      );

      // guarda os filtros no endereço, para dar para compartilhar o link já filtrado
      const novo = new URLSearchParams();
      if (selArea.value) novo.set("area", selArea.value);
      if (selMateria.value) novo.set("materia", selMateria.value);
      if (selNivel.value) novo.set("nivel", selNivel.value);
      if (selIdioma.value) novo.set("idioma", selIdioma.value);
      if (busca.value.trim()) novo.set("busca", busca.value.trim());
      const q = novo.toString();
      history.replaceState(history.state, "", location.pathname + (q ? "?" + q : "") + location.hash);
    }

    // Filtros iniciais vindos do endereço (ex.: videos/?area=controle)
    const materiaInicial = params.get("materia");
    const areaInicial = params.get("area") || dados.materiaInfo[materiaInicial]?.area || "";
    selArea.value = areaInicial;
    preencherMaterias();
    selMateria.value = materiaInicial || "";
    selNivel.value = params.get("nivel") || "";
    selIdioma.value = params.get("idioma") || "";
    busca.value = params.get("busca") || "";

    selArea.addEventListener("change", () => { preencherMaterias(); atualizar(); });
    [selMateria, selNivel, selIdioma].forEach((s) => s.addEventListener("change", atualizar));
    busca.addEventListener("input", atualizar);

    alvo.replaceChildren(
      el("div", { class: "vem-filtros" }, busca, selArea, selMateria, selNivel, selIdioma),
      contador,
      resultado
    );
    atualizar();
  }

  // ---------- Início ----------

  function iniciar() {
    const alvos = document.querySelectorAll(".vem-catalogo:not([data-pronto]), .vem-videos:not([data-pronto])");
    if (!alvos.length) return;
    alvos.forEach((a) => {
      a.setAttribute("data-pronto", "");
      a.replaceChildren(el("p", { class: "vem-carregando" }, "Carregando vídeos..."));
    });

    carregarDados()
      .then((dados) => {
        alvos.forEach((a) =>
          a.classList.contains("vem-catalogo") ? montarCatalogo(a, dados) : montarLista(a, dados)
        );
      })
      .catch((erro) => {
        console.error("Catálogo de vídeos:", erro);
        alvos.forEach((a) =>
          a.replaceChildren(el("p", { class: "vem-vazio" }, "Não foi possível carregar os vídeos agora."))
        );
      });
  }

  // O tema troca de página sem recarregar (navegação instantânea).
  // O document$ avisa a cada troca; sem ele, roda quando a página termina de carregar.
  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(iniciar);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
