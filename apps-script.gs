// 지원서 저장·조회 서버. 학교 구글 계정의 시트에 붙여서 쓴다.
//
// 설치 (한 번만)
// 1. 학교 계정 구글 드라이브에서 새 스프레드시트를 만든다. 예: "2027 글로벌 현장학습 지원자"
// 2. 시트 메뉴 확장 프로그램 > Apps Script > 이 파일 내용을 전체 붙여넣고 저장
// 3. 배포 > 새 배포 > 유형 "웹 앱" > 실행 계정 "나", 액세스 권한 "모든 사용자" > 배포
// 4. 나온 /exec 주소를 data.js 의 apiUrl 에 넣는다
// 코드를 고친 뒤에는 배포 > 배포 관리 > 수정 > 버전 "새 버전"으로 다시 배포해야 반영된다.
//
// 시트 사용법
// - 1행은 제목줄이다. 첫 지원서가 들어올 때 자동으로 만들어진다.
// - "상태" 열을 고치면 학생 조회 화면에 그대로 보인다. 예: 접수 → 서류 합격 → 최종 합격
// - "비밀번호" 열은 암호화된 값이라 지우거나 고치지 말 것.

const YEAR = 2027;
const FIXED = ['접수번호', '접수일시', '상태', '비밀번호'];
const REQUIRED = ['개인정보 동의', '성명(한글)', '학번', '휴대폰', '이메일', '1지망', '의무사항 확인'];

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
    const sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
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

  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
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

// 편집기에서 한 번 실행해 보는 점검용. 시트에 테스트 행이 하나 생기니 확인 후 지울 것.
function selfTest() {
  const a = apply({ password: 'test1234', data: { '개인정보 동의': '동의', '성명(한글)': '테스트', '학번': '0000000', '휴대폰': '010-0000-0000', '이메일': 't@t.t', '1지망': '테스트', '의무사항 확인': '확인', '메모': '=1+1' } });
  if (!a.ok) throw new Error(a.error);
  const ok = check({ no: a.no, password: 'test1234' });
  const bad = check({ no: a.no, password: 'wrong' });
  if (!ok.ok || ok.data['메모'] !== '=1+1' || bad.ok) throw new Error('점검 실패');
  Logger.log('정상: ' + a.no);
}
