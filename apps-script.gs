// 지원서 저장·조회 서버. 학교 구글 계정의 시트에 붙여서 쓴다.
//
// 설치 (한 번만)
// 1. 학교 계정 구글 드라이브에서 새 스프레드시트를 만든다. 예: "2027 글로벌 현장학습 지원자"
// 2. 시트 메뉴 확장 프로그램 > Apps Script > 이 파일 내용을 전체 붙여넣고 저장
// 3. 배포 > 새 배포 > 유형 "웹 앱" > 실행 계정 "나", 액세스 권한 "모든 사용자" > 배포
// 4. 나온 /exec 주소를 data.js 의 apiUrl 에 넣는다
// 5. 신청명단 엑셀 서식 등록 (아래 "신청명단 엑셀" 참고)
// 코드를 고친 뒤에는 배포 > 배포 관리 > 수정 > 버전 "새 버전"으로 다시 배포해야 반영된다.
//
// 시트 사용법
// - 첫 번째 탭이 지원서가 쌓이는 곳이다. 탭 순서를 바꾸지 말 것.
// - 1행은 제목줄이다. 첫 지원서가 들어올 때 자동으로 만들어진다.
// - "상태" 열을 고치면 학생 조회 화면에 그대로 보인다. 예: 접수 → 서류 합격 → 최종 합격
//   "취소"로 바꾼 지원자는 신청명단 엑셀에서 빠진다.
// - "비밀번호" 열은 암호화된 값이라 지우거나 고치지 말 것.
//
// 신청명단 엑셀 (전대협 서식)
// 1. 시트를 새로고침하면 메뉴에 "글로벌 현장학습"이 생긴다.
// 2. 파일 > 가져오기 > 업로드 > 지난해 신청명단 xlsx > "새 시트 삽입". 신청자명단·담당자 탭이 뒤에 붙는다.
// 3. 글로벌 현장학습 > 엑셀 서식 등록. 지난해 학생 정보를 지우고 서식 탭을 숨긴다.
// 4. 이후 글로벌 현장학습 > 신청명단 엑셀 만들기 를 누르면 같은 폴더에 xlsx 파일이 생긴다.
//    국가별 권역·학기·기간·예산은 사이트의 data.js 에서 읽어 온다.
//    주민등록번호는 받지 않으므로 비워 둔다. 제출 전에 직접 채울 것.

const YEAR = 2027;
const FIXED = ['접수번호', '접수일시', '상태', '비밀번호'];
const REQUIRED = ['개인정보 동의', '성명(한글)', '학번', '휴대폰', '이메일', '1지망', '의무사항 확인'];
const DATA_URL = 'https://raw.githubusercontent.com/jaebong-choi/kmcu-global/main/data.js';
const TPL = ['신청자명단', '담당자'];

function doPost(e) {
  let out;
  try {
    const req = JSON.parse(e.postData.contents);
    out = req.action === 'apply' ? apply(req) : req.action === 'check' ? check(req) : fail('잘못된 요청입니다.');
  } catch (err) {
    out = fail('요청을 처리하지 못했습니다.');
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

function apply(req) {
  const data = req.data;
  if (!data || typeof data !== 'object') return fail('지원서 내용이 없습니다.');
  const keys = Object.keys(data);
  if (keys.length > 50) return fail('항목이 너무 많습니다.');
  for (const k of keys) {
    if (k.length > 40 || FIXED.includes(k) || typeof data[k] !== 'string' || data[k].length > 2000) return fail('입력값을 확인해 주세요.');
  }
  for (const k of REQUIRED) if (!data[k]) return fail(k + ' 항목이 비어 있습니다.');
  if (typeof req.password !== 'string' || req.password.length < 6) return fail('비밀번호는 6자 이상이어야 합니다.');

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = appSheet();
    let head = sh.getLastRow() ? sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0] : [];
    if (!head.length) head = FIXED.slice();
    const add = keys.filter(k => !head.includes(k));
    if (add.length || sh.getLastRow() === 0) {
      head = head.concat(add);
      sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold');
      sh.setFrozenRows(1);
    }

    const no = YEAR + '-' + String(Math.max(sh.getLastRow(), 1)).padStart(4, '0');
    const salt = Utilities.getUuid();
    const row = head.map(h =>
      h === '접수번호' ? no :
      h === '접수일시' ? Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss') :
      h === '상태' ? '접수' :
      h === '비밀번호' ? salt + ':' + hash(salt, req.password) :
      safe(data[h] || ''));
    sh.getRange(sh.getLastRow() + 1, 1, 1, row.length).setNumberFormat('@').setValues([row]);
    return { ok: true, no: no };
  } finally {
    lock.releaseLock();
  }
}

function check(req) {
  const no = String(req.no || '').trim();
  // 같은 접수번호로 10분에 5번 넘게 틀리면 잠근다
  const cache = CacheService.getScriptCache();
  const tries = Number(cache.get('t' + no) || 0);
  if (tries >= 5) return fail('비밀번호를 여러 번 틀렸습니다. 10분 뒤에 다시 시도해 주세요.');

  const sh = appSheet();
  if (sh.getLastRow() < 2) return fail('접수번호 또는 비밀번호가 맞지 않습니다.');
  const rows = sh.getDataRange().getDisplayValues();
  const head = rows[0];
  const r = rows.find(x => x[0] === no);
  const stored = r ? r[head.indexOf('비밀번호')].split(':') : null;
  if (!stored || hash(stored[0], String(req.password || '')) !== stored[1]) {
    cache.put('t' + no, String(tries + 1), 600);
    return fail('접수번호 또는 비밀번호가 맞지 않습니다.');
  }
  const data = {};
  head.forEach((h, i) => { if (h !== '비밀번호' && h !== '상태') data[h] = r[i]; });
  return { ok: true, status: r[head.indexOf('상태')], data: data };
}

function hash(salt, pw) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + pw, Utilities.Charset.UTF_8)
    .map(b => ((b + 256) % 256).toString(16).padStart(2, '0')).join('');
}

// 시트가 수식으로 읽지 않게 막는다
function safe(v) {
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function fail(msg) {
  return { ok: false, error: msg };
}

// 지원서가 쌓이는 탭. 서식 탭을 뺀 첫 번째 탭.
function appSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets().find(s => !TPL.includes(s.getName()));
}

// ---------- 신청명단 엑셀 ----------

const FIRST = 13;  // 서식의 학생 첫 행
const BASE = 50;   // 서식에 준비된 학생 행 수 (13~62행)
const TYPE = { '일반 지정형': '지정-일반', '일반 자율형': '자율-일반', '유아교육 트랙': '지정-유아교육트랙' };
const EXAM = { 'OPIc': 'OPIC', '토익스피킹': 'Toeic Speaking', '성적 없음': '' };

function onOpen() {
  SpreadsheetApp.getUi().createMenu('글로벌 현장학습')
    .addItem('신청명단 엑셀 만들기', 'exportList')
    .addSeparator()
    .addItem('엑셀 서식 등록 (처음 한 번)', 'setupTemplate')
    .addToUi();
}

// 가져온 지난해 신청명단에서 학생 입력칸만 지우고(수식·선택목록은 남김) 서식 탭을 숨긴다
function setupTemplate() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  // 다른 시트에서 복사해 오면 "신청자명단의 사본"처럼 이름이 바뀌므로 원래 이름으로 돌린다
  TPL.forEach(n => {
    const s = ss.getSheetByName(n) || ss.getSheets().find(s => s.getName().includes(n));
    if (s) s.setName(n);
  });
  const sh = ss.getSheetByName(TPL[0]);
  if (!sh || !ss.getSheetByName(TPL[1])) return ui.alert('신청자명단·담당자 탭이 없습니다. 파일 > 가져오기 > 업로드에서 지난해 신청명단 xlsx를 "새 시트 삽입"으로 가져와 주세요.');
  // 지난해 파일에 걸려 있던 필터와 숨긴 행을 푼다
  if (sh.getFilter()) sh.getFilter().remove();
  sh.showRows(1, sh.getMaxRows());
  const last = sh.getMaxRows();
  ['B', 'E:V', 'X:AG', 'AI', 'AK'].forEach(c => {
    const [a, b] = c.split(':');
    sh.getRange(a + FIRST + ':' + (b || a) + last).clearContent();
  });
  sh.getRange('F8').clearContent();
  sh.getRange('B2').setValue(String(sh.getRange('B2').getValue()).replace(/\d{4}년/, YEAR + '년'));
  TPL.forEach(n => ss.getSheetByName(n).hideSheet());
  ui.alert('서식을 등록했습니다. 담당자 탭은 그대로 두었으니 바뀐 내용이 있으면 탭을 다시 보이게 해서 고쳐 주세요.');
}

function exportList() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (TPL.some(n => !ss.getSheetByName(n))) return ui.alert('먼저 지난해 신청명단 xlsx를 가져오고 "엑셀 서식 등록"을 실행해 주세요.');

  const rows = appSheet().getDataRange().getDisplayValues();
  const head = rows.shift();
  const list = rows.map(r => Object.fromEntries(head.map((h, i) => [h, r[i]])))
    .filter(a => a['접수번호'] && a['상태'] !== '취소');
  if (!list.length) return ui.alert('내보낼 지원자가 없습니다.');
  const D = loadData();

  const name = YEAR + '년 글로벌현장학습 신청명단(최초신청-계명문화대학교) ' + Utilities.formatDate(new Date(), 'Asia/Seoul', 'MMdd-HHmm');
  const out = SpreadsheetApp.create(name);
  try {
    TPL.forEach(n => ss.getSheetByName(n).copyTo(out).setName(n).showSheet());
    out.deleteSheet(out.getSheets()[0]);
    const sh = out.getSheetByName(TPL[0]);
    const n = list.length;
    if (n > BASE) {
      // 마지막 서식 행 앞에 행을 늘리고 첫 학생 행의 수식·서식을 복사
      sh.insertRowsBefore(FIRST + BASE - 1, n - BASE);
      sh.getRange(FIRST, 2, 1, 38).copyTo(sh.getRange(FIRST + BASE - 1, 2, n - BASE, 38));
    }
    // 이름 범위는 탭 복사로 따라오지 않아서 다시 만들고, 신청 현황 수식을 다시 계산시킨다
    out.setNamedRange('신청자', sh.getRange(FIRST, 5, Math.max(n, BASE)));
    const counts = sh.getRange('G8:L8');
    counts.setFormulas(counts.getFormulas());
    sh.getRange('F8').setValue(n);

    const g = (a, k) => a[k] || '';
    const num = v => v === '' || isNaN(v) ? v : Number(v);
    const B = [], E = [], AI = [], AK = [];
    list.forEach((a, i) => {
      const p = D.programs.find(p => p.country + ' · ' + p.org === a['1지망']) || {};
      const type = TYPE[a['신청 구분']] || g(a, '신청 구분');
      const org = p.formOrg || p.org || '';
      const fixed = type.startsWith('지정');
      const v = D.vulnerable.find(v => v.type === a['취약계층 구분']);
      const grant = (D.budget && D.budget.grant[p.region]) || 0;
      const exam = g(a, '어학 시험');
      B.push([i + 1]);
      E.push([
        type, p.region || '', p.country || '', p.semester || '', p.weeks || '',
        fixed ? org : '', g(a, '신청 분야'), fixed ? '' : org,
        g(a, '희망 분야'), g(a, '희망 업무'), g(a, '성명(한글)'), g(a, '성명(영문)'),
        g(a, '계열').replace(/계열$/, ''), g(a, '학과'), g(a, '학과(영문)'),
        g(a, '학년').replace(/학년$/, ''), g(a, '학번'), '', g(a, '성별'), g(a, '휴대폰'), g(a, '이메일'),
        v ? v.group : '', num(g(a, '총 이수학점')), num(g(a, '평점')),
        exam in EXAM ? EXAM[exam] : exam, g(a, '어학 점수'), g(a, '어학 응시일'),
        p.credits === undefined ? '' : p.credits, p.visa || '',
      ].map(x => typeof x === 'string' ? safe(x) : x));
      AI.push([grant ? grant * D.budget.matching / 100 : '']);
      AK.push([grant ? grant * D.budget.self / 100 : '']);
    });
    // 서식의 입력 제한(응시일 범위, 글자 수 등)이 값을 막지 않고 경고만 하게 바꾼다. 드롭다운은 그대로 남는다.
    const area = sh.getRange(FIRST, 2, n, 38);
    area.setDataValidations(area.getDataValidations().map(r => r.map(v => v ? v.copy().setAllowInvalid(true).build() : null)));
    [21, 24, 30, 31].forEach(c => sh.getRange(FIRST, c, n).setNumberFormat('@'));  // 학번·휴대폰·점수·응시일
    sh.getRange(FIRST, 2, n, 1).setValues(B);
    sh.getRange(FIRST, 5, n, 29).setValues(E);   // E~AG
    sh.getRange(FIRST, 35, n, 1).setValues(AI);  // 대응투자금
    sh.getRange(FIRST, 37, n, 1).setValues(AK);  // 자비부담금
    SpreadsheetApp.flush();

    const blob = UrlFetchApp.fetch('https://docs.google.com/spreadsheets/d/' + out.getId() + '/export?format=xlsx', {
      headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    }).getBlob().setName(name + '.xlsx');
    const file = DriveApp.getFileById(ss.getId()).getParents().next().createFile(blob);
    const html = '<p style="font-family:sans-serif">' + n + '명을 담았습니다. 주민등록번호 칸은 비어 있습니다.</p>'
      + '<p style="font-family:sans-serif"><a href="' + file.getUrl() + '" target="_blank">' + name + '.xlsx 열기</a></p>';
    ui.showModalDialog(HtmlService.createHtmlOutput(html).setWidth(460).setHeight(150), '신청명단 엑셀');
  } finally {
    DriveApp.getFileById(out.getId()).setTrashed(true);
  }
}

// 사이트의 data.js 를 읽어 국가별 권역·학기·예산 값을 가져온다
function loadData() {
  const code = UrlFetchApp.fetch(DATA_URL).getContentText();
  return new Function(code + '\nreturn DATA;')();
}

// 편집기에서 한 번 실행해 보는 점검용. 시트에 테스트 행이 하나 생기니 확인 후 지울 것.
function selfTest() {
  const a = apply({ password: 'test1234', data: { '개인정보 동의': '동의', '성명(한글)': '테스트', '학번': '0000000', '휴대폰': '010-0000-0000', '이메일': 't@t.t', '1지망': '테스트', '의무사항 확인': '확인', '메모': '=1+1' } });
  if (!a.ok) throw new Error(a.error);
  const ok = check({ no: a.no, password: 'test1234' });
  const bad = check({ no: a.no, password: 'wrong' });
  if (!ok.ok || ok.data['메모'] !== '=1+1' || bad.ok) throw new Error('점검 실패');
  Logger.log('정상: ' + a.no);
}
