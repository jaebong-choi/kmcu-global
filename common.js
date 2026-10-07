// 모든 페이지 공통: 다크 모드 버튼, 문의처. data.js 다음에 불러온다.
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

  // 페이지 안 문의 상자 (<div class="ask" id="ask"></div> 가 있는 페이지만)
  const ask = document.getElementById('ask');
  if (ask) {
    const tel = (c.phone.match(/0\d{1,2}-\d{3,4}-\d{4}/) || [])[0];
    ask.innerHTML = `<b>문의</b><span>${esc(c.team)}</span>`
      + (tel ? `<a href="tel:${tel.replace(/-/g, '')}">${tel}</a>` : '')
      + (c.email ? `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : '');
  }

  document.getElementById('contact').innerHTML = `<strong>${esc(c.team)}</strong>`
    + [c.place, c.phone, c.email].filter(Boolean).map(x => `<p>${esc(x)}</p>`).join('')
    + '<p><a href="https://www.kmcu.ac.kr/global/?pCode=MN0000040" target="_blank" rel="noopener">공지사항</a>'
    + ' · <a href="https://www.kmcu.ac.kr/global/" target="_blank" rel="noopener">국제처 홈페이지</a>'
    + ' · <a href="https://jaebong-choi.github.io/kmcu-global-map/">해외 프로그램 지도</a></p>';
})();
