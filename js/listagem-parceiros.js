(function () {
  const ENDPOINT = "https://6860899b8e74864084437167.mockapi.io/jmt-futurodev/api/parceiros";
  const $grid = document.getElementById("cardsGrid");
  const $q = document.getElementById("q");
  const $btn = document.getElementById("btnSearch");
  const $status = document.getElementById("statusMsg");

  let allPartners = [];

  function setBusy(busy) {
    if ($grid) $grid.setAttribute("aria-busy", String(busy));
  }

  function fmtDate(d) {
    if (!d) return "—";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  function typeInfo(t) {
    const k = (t || "").toString().toUpperCase();
    if (k === "ECO") return { cls: "eco", label: "Ecoponto", code: "ECO" };
    if (k === "COO") return { cls: "coo", label: "Cooperativa", code: "COO" };
    return { cls: "pevs", label: "PEV", code: "PEVs" }; // default
  }

  function cardTemplate(p) {
    const t = typeInfo(p.tipoParceiro);
    const bairro = (p.bairro || "—");
    // tenta várias chaves de data, já que o objeto do POST não definia createdAt explicitamente
    const created =
      p.createdAt || p.created_at || p.criadoEm || p.atualizadoEm || p.updatedAt || null;

    return `
      <article class="card card-partner" data-id="${p.id || ""}" tabindex="0" role="button" aria-label="Abrir detalhes de ${p.nomeParceiro || "Parceiro"}">
        <div class="avatar ${t.cls}" aria-hidden="true">${t.code}</div>
        <div class="meta">
          <h3 class="name">${p.nomeParceiro || "Sem nome"}</h3>
          <div class="sub muted">
            <span class="badge-type ${t.cls}">${t.label}</span>
            <span>•</span>
            <span>Bairro: <strong>${bairro}</strong></span>
          </div>
          <div class="sub muted">
            <span>Incluído em: <time datetime="${created ? new Date(created).toISOString() : ""}">${fmtDate(created)}</time></span>
          </div>
        </div>
      </article>
    `;
  }

  function render(list) {
    if (!$grid) return;
    if (!Array.isArray(list) || list.length === 0) {
      $grid.innerHTML = `
        <div class="empty">
          Nenhum parceiro encontrado.
        </div>
      `;
      return;
    }
    $grid.innerHTML = list.map(cardTemplate).join("");
  }

  async function fetchAll() {
    setBusy(true);
    $status.textContent = "Carregando parceiros...";
    try {
      const res = await fetch(ENDPOINT);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      allPartners = Array.isArray(data) ? data : [];
      $status.textContent = `Total carregado: ${allPartners.length}`;
      render(allPartners);
    } catch (err) {
      console.error(err);
      $status.textContent = "Falha ao carregar. Tente novamente.";
      render([]);
    } finally {
      setBusy(false);
    }
  }

  function norm(s) {
    return (s || "").toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  }

  function doSearch() {
    const q = norm($q.value);
    if (!q) {
      $status.textContent = `Total carregado: ${allPartners.length}`;
      render(allPartners);
      return;
    }
    const filtered = allPartners.filter((p) => {
      const nome = norm(p.nomeParceiro);
      const bairro = norm(p.bairro);
      return nome.includes(q) || bairro.includes(q);
    });
    $status.textContent = `Exibindo ${filtered.length} de ${allPartners.length} registros para "${$q.value}"`;
    render(filtered);
  }

  // Delegação de clique/enter nos cards → abre detalhes
  $grid.addEventListener("click", (e) => {
    const art = e.target.closest(".card-partner");
    if (!art) return;
    const id = art.dataset.id;
    if (!id) return;
    window.location.href = `parceiro-detalhe.html?id=${encodeURIComponent(id)}`;
  });

  $grid.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const art = e.target.closest(".card-partner");
      if (!art) return;
      const id = art.dataset.id;
      if (!id) return;
      e.preventDefault();
      window.location.href = `parceiro-detalhe.html?id=${encodeURIComponent(id)}`;
    }
  });

  // Busca por botão e Enter no input
  $btn.addEventListener("click", doSearch);
  $q.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      doSearch();
    }
  });

  // Inicializa
  document.addEventListener("DOMContentLoaded", fetchAll);
})();
