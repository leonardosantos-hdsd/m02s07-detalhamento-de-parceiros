// js/login.js
(function () {
  const EMAIL_KEY = "adminEmail";
  const REDIRECT_URL = "listagem-parceiros.html"; // ajuste o nome do arquivo da listagem no Ex. 04, se for diferente

  const $form = document.getElementById("formLogin");
  const $email = document.getElementById("emailLogin");
  const $senha = document.getElementById("senhaLogin");
  const $btn = document.getElementById("btnEntrar");

  function validar() {
    const hasEmail = ($email.value || "").trim().length > 0;
    const hasSenha = ($senha.value || "").trim().length > 0;
    $btn.disabled = !(hasEmail && hasSenha);
  }

  [$email, $senha].forEach((el) => el.addEventListener("input", validar));
  validar(); // estado inicial

  $form.addEventListener("submit", (e) => {
    e.preventDefault(); // sem validação de servidor neste projeto
    const email = ($email.value || "").trim();

    try {
      localStorage.setItem(EMAIL_KEY, email);
    } catch (err) {
      console.warn("Não foi possível salvar no localStorage.", err);
    }

    // redireciona para a listagem de parceiros (Ex. 04)
    window.location.href = REDIRECT_URL;
  });
})();
