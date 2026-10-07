// 영문 전환. 헤더의 ENG 버튼을 누르면 ?lang=en 으로 다시 열린다 (해외 프로그램 지도와 설정 공유).
// 화면의 한국어 문구를 아래 표에서 찾아 영문으로 바꾼다. 표에 없는 문구는 한국어 그대로 나온다.
// → data.js 의 한국어를 고치거나 새로 넣으면, 같은 문구를 여기에도 '한국어': '영문' 으로 넣어 주세요.
// 지원서 값(시트에 저장되는 내용)은 영문 화면에서도 한국어로 저장된다.

const EN_TEXT = {
  // 공통
  '글로벌 현장학습': 'Global Field Training',
  '해외 프로그램 지도': 'Overseas Programs Map',
  '지원서 확인': 'My Application',
  '모집 안내': 'Program Info',
  '문의': 'Contact',
  '계명문화대학교 국제처': 'Office of International Affairs, Keimyung College University',
  '(42601) 대구광역시 달서구 달서대로 675 복지관 2층': 'Welfare Hall 2F, 675 Dalseo-daero, Dalseo-gu, Daegu 42601',
  '상담 053-589-7796 · 사무실 053-589-7794~5': 'Counseling 053-589-7796 · Office 053-589-7794~5',
  '공지사항': 'Notices',
  '국제처 홈페이지': 'KMCU International',
  '추후 안내': 'TBA',

  // 모집 안내 (index)
  '모집 일정': 'Application period',
  '내 지원서 확인 →': 'Check my application →',
  '파견 프로그램': 'Programs',
  '진행 일정': 'Timeline',
  '지원 자격': 'Eligibility',
  '제출 서류': 'Required documents',
  '선발 기준': 'Selection criteria',
  '비용과 지원': 'Costs and support',
  '취업취약계층 지원': 'Support for employment-vulnerable students',
  '자주 묻는 질문': 'FAQ',
  '대상 학과': 'Majors',
  '모집 인원': 'Openings',
  '파견 기간': 'Duration',
  '과정': 'Course',
  '어학 기준': 'Language requirement',
  '참고': 'Note',

  // data.js 내용
  '2027 글로벌 현장학습 참가자 모집': '2027 Global Field Training Call for Applicants',
  '해외 대학에서 어학을 배우고, 전공과 맞는 현지 산업체에서 실습합니다. 출국 전 사전교육부터 귀국 후 학점 인정까지 국제처가 함께합니다.':
    'Study the language at an overseas college, then train at a local company in your field. The Office of International Affairs supports you from pre-departure training to credit recognition after you return.',
  '사전모집': 'Early round',
  '정식모집': 'Main round',
  '모집 설명회': 'Info session',
  '서류 심사': 'Document review',
  '면접 · 인성검사': 'Interview · Personality test',
  '최종 발표': 'Final results',
  '사전교육 (50시간)': 'Pre-departure training (50 hrs)',
  '출국': 'Departure',
  '영국': 'United Kingdom',
  '호주': 'Australia',
  '말레이시아': 'Malaysia',
  '캐나다': 'Canada',
  '미국': 'United States',
  '일본': 'Japan',
  '헤어디자인': 'Hair Design',
  '호텔관광서비스 · 디자인융합테크 · 헤어디자인': 'Hotel & Tourism Service · Design Convergence Tech · Hair Design',
  '유아교육': 'Early Childhood Education',
  '현지 어학 8주 + 산업체 실습 8주': '8 weeks of language study + 8 weeks of industry training',
  '현지 어학 + 유아교육기관 실습': 'Language study + training at early childhood centers',
  '유아교육 트랙': 'Early Childhood Education track',
  '기초생활수급자': 'Basic livelihood recipient',
  '차상위계층': 'Near-poverty household',
  '학자금 지원구간 1구간': 'Student aid bracket 1',
  '학자금 지원구간 2구간': 'Student aid bracket 2',
  '학자금 지원구간 3구간': 'Student aid bracket 3',
  '다문화가정': 'Multicultural family',
  '본교 재학생': 'Currently enrolled KMCU students',
  '어학 기준은 프로그램별로 다릅니다. 파견 프로그램에서 확인해 주세요.': 'Language requirements differ by program. See each program above.',
  '취업취약계층은 우선 선발 대상이며, 구분에 따라 지원 내용이 다릅니다.': 'Employment-vulnerable students are given priority, and support differs by category.',
  '참가 신청서와 현장학습 계획서 (온라인 작성)': 'Application form and training plan (online)',
  '성적증명서': 'Academic transcript',
  '공인어학성적표': 'Official language test score report',
  '취업취약계층 증빙서류 (해당자)': 'Proof of employment-vulnerable status (if applicable)',
  '취업취약계층 증빙서류': 'Proof of employment-vulnerable status',
  '서류심사': 'Document review',
  '참가 신청서, 현장학습 계획서': 'Application form, training plan',
  '어학성적': 'Language score',
  'TOEIC 650 · OPIc IL · 토익스피킹 5급 이상부터 점수 부여': 'Points from TOEIC 650 · OPIc IL · TOEIC Speaking Level 5',
  '대학성적': 'GPA',
  '평점 3.5 이상 3점, 4.0 이상 5점': '3 pts for 3.5+, 5 pts for 4.0+',
  '심층면접': 'Interview',
  '참여 열정과 취업 적극성, 프로그램 이해도, 면접 태도': 'Motivation, career drive, understanding of the program, attitude',
  '인성평가': 'Personality assessment',
  '진로적성검사, 대인관계검사, 지도교수 평가': 'Career aptitude test, interpersonal test, advisor evaluation',
  '취약계층': 'Vulnerable status',
  '참여 의지와 태도에 문제가 없으면 우선 선발': 'Priority selection if motivation and attitude are sound',
  '20점': '20 pts', '15점': '15 pts', '5점': '5 pts', '30점': '30 pts', '10점': '10 pts',
  '학점이 인정되나요?': 'Do I get credits?',
  '귀국 후 해외기관 평가, 지도교수 평가, 국제처 평가를 합산해 학점을 인정합니다.': 'Yes. After you return, credits are granted based on evaluations by the host institution, your advisor and the Office of International Affairs.',
  '제출한 지원서를 확인할 수 있나요?': 'Can I check my submitted application?',
  '지원 확인 페이지에서 접수번호와 비밀번호로 제출 내용과 진행 상태를 볼 수 있습니다. 내용을 고쳐야 하면 국제처로 연락해 주세요.':
    'Yes. On the My Application page, enter your application number and password to see what you submitted and its status. To make changes, contact the Office of International Affairs.',
  '호텔∙조리': 'Hotel & Culinary', '디자인': 'Design', '헤어∙뷰티': 'Hair & Beauty', '간호(보건)': 'Nursing (Health)',

  // 지원서 (apply)
  '참가 신청서': 'Application Form',
  '개인정보 수집·이용 동의': 'Consent to collection and use of personal information',
  '동의합니다': 'I agree',
  '기본 정보': 'Basic information',
  '성명(한글)': 'Name (Korean)',
  '성명(영문)': 'Name (English)',
  '여권과 같은 철자': 'as spelled in your passport',
  '성명(한자)': 'Name (Chinese characters)',
  '성별': 'Gender', '남': 'Male', '여': 'Female',
  '학번': 'Student ID',
  '학과': 'Department',
  '학과(영문)': 'Department (English)',
  '계열': 'Field of study',
  '인문사회계열': 'Humanities & Social Sciences', '자연과학계열': 'Natural Sciences', '공학계열': 'Engineering', '예체능계열': 'Arts & Physical Education',
  '기타': 'Other',
  '학년': 'Year',
  '1학년': '1st year', '2학년': '2nd year', '3학년': '3rd year', '4학년': '4th year',
  '지도교수': 'Academic advisor',
  '총 이수학점': 'Total credits earned',
  '평점': 'GPA',
  '4.5 만점': 'out of 4.5',
  '휴대폰': 'Mobile phone',
  '비상연락처': 'Emergency contact',
  '관계 포함': 'include relationship',
  '이메일': 'Email',
  '주소': 'Address',
  '지원 프로그램': 'Program choice',
  '신청 구분': 'Application type',
  '일반 지정형': 'General · Designated',
  '일반 자율형': 'General · Self-arranged',
  '희망 파견국가 (1지망)': 'Preferred country (1st choice)',
  '희망 파견국가 (2지망)': 'Preferred country (2nd choice)',
  '1지망': '1st choice', '2지망': '2nd choice',
  '신청 분야': 'Training field',
  '1지망 기준': 'for your 1st choice',
  '희망 분야': 'Preferred industry',
  '희망 업무': 'Preferred role',
  '미용헤어, 호텔서비스, 유아교육': 'Hair salon, hotel service, early childhood',
  '살롱 업무, 프런트, 유치원': 'Salon work, front desk, kindergarten',
  '시험명': 'Test',
  '토익스피킹': 'TOEIC Speaking',
  '성적 없음': 'No score',
  '점수 또는 등급': 'Score or level',
  '750, IM2, 6급': '750, IM2, Level 6',
  '010-1234-5678 (부)': '010-1234-5678 (Father)',
  '응시일': 'Test date',
  '어학 시험': 'Language test', '어학 점수': 'Language score', '어학 응시일': 'Test date',
  '취업취약계층': 'Employment-vulnerable status',
  '해당': 'Yes',
  '해당 없음': 'No',
  '구분': 'Category',
  '취약계층 구분': 'Vulnerable category',
  '취약계층 정보는 선발 가산점과 지원 내용 확인에만 쓰는 것에 동의합니다': 'I agree that this information is used only for selection points and support eligibility',
  '현장학습 계획서': 'Training plan',
  '지원동기': 'Motivation',
  '관심분야 및 주요 학습영역': 'Interests and main learning goals',
  '관심분야 및 학습영역': 'Interests and learning goals',
  '종료 후 계획 및 취업목표': 'Plans and career goals after the program',
  '첨부 서류': 'Attachments',
  'PDF, JPG, PNG 파일을 한 파일당 10MB까지 올릴 수 있습니다. 휴대폰으로 찍은 사진도 됩니다.': 'Upload PDF, JPG or PNG files up to 10MB each. Phone photos are fine.',
  '선발 시 의무사항': 'Obligations if selected',
  '확인했습니다': 'I have read and understand',
  '조회용 비밀번호': 'Password for checking your application',
  '접수번호와 이 비밀번호로 제출 내용과 진행 상태를 확인합니다.': 'You will use your application number and this password to check your submission and status.',
  '비밀번호': 'Password',
  '6자 이상': 'at least 6 characters',
  '비밀번호 확인': 'Confirm password',
  '신청서 제출': 'Submit application',
  '신청서가 접수되었습니다. 접수번호를 꼭 적어 두세요.': 'Your application has been received. Please write down your application number.',
  '접수번호와 비밀번호로 제출 내용과 진행 상태를 확인할 수 있습니다.': 'You can check your submission and status with your application number and password.',
  '내 지원서 확인': 'Check my application',

  // 조회 (check)
  '접수할 때 받은 접수번호와 직접 정한 비밀번호를 입력하세요.': 'Enter the application number you received and the password you chose.',
  '접수번호': 'Application no.',
  '진행 상태': 'Status',
  '내용을 고쳐야 하면 국제처로 연락해 주세요.': 'To make changes, please contact the Office of International Affairs.',
  '접수일시': 'Submitted at',
  '개인정보 동의': 'Privacy consent',
  '의무사항 확인': 'Obligations confirmed',
  '취약계층 정보 동의': 'Vulnerable info consent',
  '접수': 'Received', '서류 합격': 'Passed document review', '면접 합격': 'Passed interview', '최종 합격': 'Accepted', '불합격': 'Not selected', '취소': 'Cancelled',
  '동의': 'Agreed', '확인': 'Confirmed', '제출함': 'Submitted',
  '첨부-성적증명서': 'Attachment: transcript', '첨부-공인어학성적표': 'Attachment: language score report', '첨부-취업취약계층 증빙서류': 'Attachment: proof of status',

  // 서버 오류 메시지
  '접수번호 또는 비밀번호가 맞지 않습니다.': 'The application number or password is incorrect.',
  '비밀번호를 여러 번 틀렸습니다. 10분 뒤에 다시 시도해 주세요.': 'Too many wrong passwords. Please try again in 10 minutes.',
  '입력값을 확인해 주세요.': 'Please check your input.',
  '비밀번호는 6자 이상이어야 합니다.': 'Password must be at least 6 characters.',
  '첨부 파일은 PDF, JPG, PNG만 올릴 수 있습니다.': 'Only PDF, JPG and PNG files can be uploaded.',
  '첨부 파일은 한 파일당 10MB까지 올릴 수 있습니다.': 'Each file must be 10MB or smaller.',
  '요청을 처리하지 못했습니다.': 'The request could not be processed.',
};

// <small>선택</small> 은 "선택 항목", 드롭다운의 "선택"은 "골라 주세요"
const EN_SMALL = { '선택': 'optional' };
EN_TEXT['선택'] = 'Select';
EN_TEXT['없음'] = 'None';

const LANG = (() => {
  let s; try { s = localStorage.getItem('lang'); } catch (e) {}
  return new URLSearchParams(location.search).get('lang') || s || 'ko';
})();
const EN = LANG === 'en';
const tx = (ko, en) => (EN ? en : ko);
const tr = ko => (EN && EN_TEXT[String(ko).trim()]) || ko;

// root 안의 한국어 문구를 영문으로 바꾼다. 드롭다운 값은 한국어 그대로 둔다(시트에 한국어로 저장).
function translate(root) {
  if (!EN) return;
  root.querySelectorAll('[data-en]').forEach(el => (el.innerHTML = el.dataset.en));
  root.querySelectorAll('option:not([value])').forEach(o => (o.value = o.textContent));
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n; (n = w.nextNode());) {
    const k = n.nodeValue.trim();
    if (!k) continue;
    const en = (n.parentNode.nodeName === 'SMALL' && EN_SMALL[k]) || EN_TEXT[k];
    if (en) n.nodeValue = n.nodeValue.replace(k, en);
  }
  root.querySelectorAll('[placeholder]').forEach(e => { if (EN_TEXT[e.placeholder]) e.placeholder = EN_TEXT[e.placeholder]; });
}

document.documentElement.lang = LANG;
