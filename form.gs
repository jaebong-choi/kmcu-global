// 2027 글로벌 현장학습 온라인 지원서 생성 스크립트
// 사용법: script.google.com > 새 프로젝트 > 전체 붙여넣기 > createApplyForm 실행
// 실행 로그에 나온 응답 링크를 data.js 의 applyUrl 에 넣는다.
//
// 문항 기준: 2026 참가신청서(전형 공통) + 현장학습 계획서(일반전형) + 사업계획서 평가항목.
// 주민번호·서명·보호자 동의서·서약서는 받지 않는다. 최종 선발 후 종이 서류로 받는다.
// 파일 업로드 문항은 Apps Script로 만들 수 없고 학생 구글 로그인이 필요해서 넣지 않았다.

const YEAR = 2027;

// data.js 의 programs 와 같은 목록. 한쪽을 바꾸면 여기도 바꿀 것.
const PROGRAMS = [
  '영국 · BSDC',
  '호주 · NSW TAFE',
  '말레이시아 · SEGi',
  '캐나다 · CNA (유아교육 트랙)',
];

function createApplyForm() {
  const form = FormApp.create(`${YEAR} 전문대학 글로벌 현장학습 참가 신청서`);
  form.setDescription(
    `계명문화대학교 국제처 국제협력지원팀\n\n` +
    `온라인 신청서는 1차 접수용입니다. 성적증명서, 어학성적표, 취업취약계층 증빙서류는 안내에 따라 따로 제출합니다.\n` +
    `제출 후 받은 메일의 수정 링크로 모집 마감 전까지 내용을 고칠 수 있습니다.`
  );
  form.setCollectEmail(true);
  form.setAllowResponseEdits(true);
  form.setConfirmationMessage('신청서가 접수되었습니다. 증빙서류 제출 안내는 공지사항과 단톡방에서 확인해 주세요.');

  // 1. 개인정보 동의
  form.addSectionHeaderItem().setTitle('개인정보 수집·이용 동의');
  form.addMultipleChoiceItem()
    .setTitle('개인정보 수집·이용에 동의합니까?')
    .setHelpText(
      '수집 항목: 성명(한글·영문·한자), 학번, 학과, 학년, 이수학점, 평점, 연락처, 비상연락처, 이메일, 주소, 어학성적\n' +
      '목적: 글로벌 현장학습 참가자 선발 및 사업 운영(한국전문대학교육협의회 제출 포함)\n' +
      '보유 기간: 사업 결과보고 완료 시까지\n' +
      '동의하지 않으면 지원할 수 없습니다.')
    .setChoiceValues(['동의합니다'])
    .setRequired(true);
  form.addMultipleChoiceItem()
    .setTitle('취업취약계층 정보 수집·이용에 동의합니까? (선택)')
    .setHelpText('취약계층 해당 학생만 동의하면 됩니다. 선발 시 가산점(10점) 확인에만 사용합니다.')
    .setChoiceValues(['동의합니다', '해당 없음']);

  // 2. 기본 정보
  form.addPageBreakItem().setTitle('기본 정보');
  text(form, '성명(한글)', true);
  text(form, '성명(영문)', true, '여권과 같은 철자로 적어 주세요. 예: HONG GIL DONG');
  text(form, '성명(한자)', false);
  text(form, '학번', true).setValidation(
    FormApp.createTextValidation().requireTextMatchesPattern('\\d{7,10}').setHelpText('숫자만 입력해 주세요.').build());
  text(form, '학과', true);
  form.addListItem().setTitle('계열').setChoiceValues(['인문사회계열', '자연과학계열', '공학계열', '예체능계열', '기타']).setRequired(true);
  form.addMultipleChoiceItem().setTitle('학년').setChoiceValues(['1학년', '2학년', '3학년', '4학년']).setRequired(true);
  text(form, '총 이수학점', true, '숫자만. 예: 46');
  text(form, '평점 (4.5 만점)', true, '예: 3.85');
  text(form, '휴대폰', true, '예: 010-1234-5678');
  text(form, '비상연락처 (관계)', true, '예: 010-1234-5678 (부)');
  text(form, '주소', true);

  // 3. 지원 프로그램
  form.addPageBreakItem().setTitle('지원 프로그램');
  form.addMultipleChoiceItem().setTitle('신청 구분').setChoiceValues(['일반 지정형', '일반 자율형', '유아교육 트랙']).setRequired(true);
  form.addListItem().setTitle('희망 파견국가 (1지망)').setChoiceValues(PROGRAMS).setRequired(true);
  form.addListItem().setTitle('희망 파견국가 (2지망)').setChoiceValues(['없음'].concat(PROGRAMS));
  text(form, '희망 분야', true, '예: 미용헤어, 호텔서비스, 유아교육');
  text(form, '희망 업무', true, '예: 살롱 업무, 프런트 데스크, 어린이집·유치원');
  text(form, '지도교수 성명', true);

  // 4. 어학성적
  form.addPageBreakItem().setTitle('어학성적')
    .setHelpText('배점: TOEIC 650~750 / OPIc IL~IM / 토익스피킹 5급 이상부터 5점, 최대 15점.');
  form.addMultipleChoiceItem().setTitle('시험명').setChoiceValues(['TOEIC', 'OPIc', '토익스피킹', '성적 없음']).showOtherOption(true).setRequired(true);
  text(form, '점수 또는 등급', false, '예: 750, IM2, 6급');
  form.addDateItem().setTitle('응시일');

  // 5. 취업취약계층
  form.addPageBreakItem().setTitle('취업취약계층');
  form.addMultipleChoiceItem().setTitle('취업취약계층에 해당합니까?').setChoiceValues(['예', '아니오']).setRequired(true);
  form.addCheckboxItem().setTitle('해당 구분 (예를 선택한 경우)')
    .setChoiceValues(['기초생활수급자', '차상위계층', '학자금 지원구간 (구간을 기타에 적어 주세요)', '다문화가정'])
    .showOtherOption(true);

  // 6. 현장학습 계획서
  form.addPageBreakItem().setTitle('현장학습 계획서')
    .setHelpText('서류심사(20점) 자료입니다. 선발되면 같은 내용의 영문본을 따로 제출합니다.');
  para(form, '지원동기');
  para(form, '관심분야 및 주요 학습영역');
  para(form, '현장학습 종료 후 계획 및 취업목표');

  // 7. 확인
  form.addPageBreakItem().setTitle('제출 전 확인');
  form.addCheckboxItem().setTitle('선발 시 의무사항을 확인했습니다')
    .setHelpText(
      '· 월드잡플러스 가입과 이러닝 이수, 파견 전 사전교육 참여\n' +
      '· 프로그램 종료 후 공인어학시험 성적표 제출, 핵심역량진단평가(사전·사후)와 만족도조사 참여\n' +
      '· 졸업 후 3년간 인턴·취업 관련 신상정보 제공\n' +
      '· 중도 포기나 불성실 참여 시 선발 취소, 국고보조금 환수 등 불이익\n' +
      '최종 선발되면 학생 서약서와 보호자 동의서를 서면으로 제출합니다.')
    .setChoiceValues(['확인했습니다'])
    .setRequired(true);

  const ss = SpreadsheetApp.create(`${YEAR} 글로벌 현장학습 지원자 (응답)`);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  Logger.log('응답 링크(data.js applyUrl): ' + form.getPublishedUrl());
  Logger.log('편집 링크: ' + form.getEditUrl());
  Logger.log('응답 시트: ' + ss.getUrl());
}

function text(form, title, required, help) {
  const item = form.addTextItem().setTitle(title).setRequired(required);
  if (help) item.setHelpText(help);
  return item;
}

function para(form, title) {
  return form.addParagraphTextItem().setTitle(title).setRequired(true)
    .setValidation(FormApp.createParagraphTextValidation().requireTextLengthGreaterThanOrEqualTo(100)
      .setHelpText('100자 이상 작성해 주세요.').build());
}
