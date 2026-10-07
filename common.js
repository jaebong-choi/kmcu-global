// 모든 페이지 공통: 다크 모드 버튼, 아래 문의처. data.js 다음에 불러온다.
(() => {
  const root = document.documentElement;
  const btn = document.querySelector('[data-act="theme"]');
  const label = () => (btn.textContent = root.dataset.theme === 'dark' ? '라이트 모드' : '다크 모드');
  label();
  btn.onclick = () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
    label();
  };

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const c = DATA.contact;
  document.getElementById('contact').innerHTML = `<strong>${esc(c.team)}</strong>`
    + [c.place, c.phone, c.email].filter(Boolean).map(x => `<p>${esc(x)}</p>`).join('')
    + '<p><a href="https://www.kmcu.ac.kr/global/?pCode=MN0000040" target="_blank" rel="noopener">공지사항</a>'
    + ' · <a href="https://www.kmcu.ac.kr/global/" target="_blank" rel="noopener">국제처 홈페이지</a>'
    + ' · <a href="https://jaebong-choi.github.io/kmcu-global-map/">해외 프로그램 지도</a></p>';
})();
