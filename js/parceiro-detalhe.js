// js/parceiro-detalhe.js
(function () {
  const API = "https://6860899b8e74864084437167.mockapi.io/jmt-futurodev/api/parceiros";

  const $card = document.getElementById("detailCard");
  const $status = document.getElementById("statusDetail");

  function qsParam(key) {
    const url = new URL(window.location.href);
    return url.searchParams.get(key);
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
    return { cls: "pevs", label: "PEV", code: "PEVs" };
  }

  function chip(label) {
    return `<span class="chip">${label}</span>`;
  }

  function renderDetail(p) {
    const t = typeInfo(p.tipoParceiro);
    const created = p.createdAt || p.created_at || p.criadoEm || p.atualizadoEm || p.updatedAt || null;

    const residuos = [
      p.papel ? "Papel" : null,
      p.plastico ? "Plástico" : null,
      p.vidro ? "Vidro" : null,
      p.metal ? "Metal" : null,
      p.oleoCozinha ? "Óleo de cozinha" : null,
      p.pilhaBateria ? "Pilhas e baterias" : null,
      p.eletronico ? "Eletrônicos" : null,
      p.roupa ? "Roupas" : null,
      p.outros ? "Outros" : null,
    ].filter(Boolean);

    const hasResiduos = residuos.length > 0;

    $card.innerHTML = `
      <header class="detail-header">
        <div class="avatar ${t.cls}" aria-hidden="true">${t.code}</div>
        <div>
          <h2 class="detail-name">${p.nomeParceiro || "Parceiro"}</h2>
          <div class="muted detail-sub">
            <span class="badge-type ${t.cls}">${t.label}</span>
            <span>•</span>
            <span>Incluído em <time>${fmtDate(created)}</time></span>
          </div>
        </div>
      </header>

      <section class="detail-grid">
        <div class="panel">
          <h3>Contato</h3>
          <dl class="kv">
            <div><dt>Responsável</dt><dd>${p.responsavelParceiro || "—"}</dd></div>
            <div><dt>Telefone</dt><dd>${p.telResponsavel ? `<a href="tel:${p.telResponsavel}">${p.telResponsavel}</a>` : "—"}</dd></div>
            <div><dt>E-mail</dt><dd>${p.emailResponsavel ? `<a href="mailto:${p.emailResponsavel}">${p.emailResponsavel}</a>` : "—"}</dd></div>
          </dl>
        </div>

        <div class="panel">
          <h3>Endereço</h3>
          <dl class="kv">
            <div><dt>Rua</dt><dd>${p.rua || "—"}</dd></div>
            <div><dt>Número</dt><dd>${(p.numero ?? "") === "" ? "—" : p.numero}</dd></div>
            <div><dt>Bairro</dt><dd>${p.bairro || "—"}</dd></div>
          </dl>
        </div>

        <div class="panel panel-span">
          <h3>Resíduos aceitos</h3>
          <div class="chips">
            ${hasResiduos ? residuos.map(chip).join("") : '<span class="muted">Nenhum especificado</span>'}
          </div>
        </div>
      </section>
    `;

    $card.setAttribute("aria-busy", "false");
    $status.textContent = "";
  }

  async function load() {
    const id = qsParam("id");
    if (!id) {
      $status.textContent = "Parâmetro ?id ausente.";
      $card.setAttribute("aria-busy", "false");
      $card.innerHTML = `<div class="empty">ID não informado.</div>`;
      return;
    }

    try {
      $status.textContent = "Carregando parceiro...";
      const res = await fetch(`${API}/${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      renderDetail(data);
    } catch (err) {
      console.error(err);
      $status.textContent = "Falha ao carregar parceiro.";
      $card.setAttribute("aria-busy", "false");
      $card.innerHTML = `<div class="empty">Não foi possível carregar os dados.</div>`;
    }
  }

  document.addEventListener("DOMContentLoaded", load);
})();
