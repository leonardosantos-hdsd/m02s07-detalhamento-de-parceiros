// Mobile menu toggle + fechar ao clicar
(function(){
    const btn = document.getElementById('menuBtn');
    const mnav = document.getElementById('mnav');
    if(!btn || !mnav) return;
    btn.addEventListener('click', () => {
    const open = mnav.classList.toggle('show');
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mnav.classList.remove('show');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Abrir menu');
}));
})();