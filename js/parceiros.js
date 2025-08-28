// js/parceiros.js
(function () {
  const ENDPOINT = "https://6860899b8e74864084437167.mockapi.io/jmt-futurodev/api/parceiros";

  function el(id) { return document.getElementById(id); }
  function isChecked(id) { return !!el(id)?.checked; }

  function buildPayload() {
    // numero: numérico; tipoParceiro: 'ECO' | 'COO' | 'PEVs' (conforme enunciado)
    const numeroVal = Number(el("numero").value);
    return {
      nomeParceiro: el("nomeParceiro").value.trim(),
      tipoParceiro: el("tipoParceiro").value, // ECO | COO | PEVs
      responsavelParceiro: el("responsavelParceiro").value.trim(),
      telResponsavel: el("telResponsavel").value.trim(),
      emailResponsavel: el("emailResponsavel").value.trim(),
      rua: el("rua").value.trim(),
      numero: Number.isFinite(numeroVal) ? numeroVal : null,
      bairro: el("bairro").value.trim(),
      papel: isChecked("papel"),
      plastico: isChecked("plastico"),
      vidro: isChecked("vidro"),
      metal: isChecked("metal"),
      oleoCozinha: isChecked("oleoCozinha"),
      pilhaBateria: isChecked("pilhaBateria"),
      eletronico: isChecked("eletronico"),
      roupa: isChecked("roupa"),
      outros: isChecked("outros"),
    };
  }

  async function postParceiro(data) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Falha no envio (${res.status}): ${text}`);
    }
    return res.json();
  }

  function validateRequired() {
    const requiredIds = [
      "nomeParceiro",
      "tipoParceiro",
      "responsavelParceiro",
      "telResponsavel",
      "emailResponsavel",
    ];
    let ok = true;
    requiredIds.forEach((id) => {
      const input = el(id);
      const valid = input && (input.value && input.value.trim() !== "");
      input?.classList.toggle("invalid", !valid);
      ok = ok && !!valid;
    });
    return ok;
  }

  function setSendingState(sending) {
    const btn = el("btnEnviarParceiro");
    if (!btn) return;
    btn.disabled = sending;
    btn.textContent = sending ? "Enviando..." : "Enviar";
  }

  document.addEventListener("DOMContentLoaded", () => {
    const form = el("formParceiro");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!validateRequired()) {
        window.alert("Preencha os campos obrigatórios marcados com *.");
        return;
      }

      const payload = buildPayload();

      try {
        setSendingState(true);
        await postParceiro(payload);
        window.alert("Dados enviados com sucesso!");
        form.reset();
      } catch (err) {
        console.error(err);
        window.alert("Não foi possível enviar os dados. Tente novamente.");
      } finally {
        setSendingState(false);
      }
    });
  });
})();
