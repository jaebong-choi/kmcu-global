// 모든 페이지 공통: 다크 모드·영문 버튼, 문의처. data.js, i18n.js 다음에 불러온다.
(() => {
  const root = document.documentElement;
  const btn = document.querySelector('[data-act="theme"]');
  // 휴대폰에서는 글자를 숨기고 아이콘만 보인다 (style.css .txt)
  const label = () => {
    const dark = root.dataset.theme === 'dark';
    btn.innerHTML = `<span aria-hidden="true">${dark ? '☀' : '☾'}</span><span class="txt">${dark ? tx('라이트 모드', 'Light mode') : tx('다크 모드', 'Dark mode')}</span>`;
    btn.setAttribute('aria-label', btn.querySelector('.txt').textContent);
  };
  label();
  btn.onclick = () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
    label();
  };

  // 언어 전환은 새로고침 방식. ?preview 같은 다른 주소 옵션은 그대로 둔다.
  const lang = document.querySelector('[data-act="lang"]');
  lang.textContent = EN ? '한국어' : 'ENG';
  lang.onclick = () => {
    const next = EN ? 'ko' : 'en';
    try { localStorage.setItem('lang', next); } catch (e) {}
    const q = new URLSearchParams(location.search);
    q.set('lang', next);
    location.search = q.toString();
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
