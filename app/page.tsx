import Link from 'next/link';

const previewPrompts = [
  '강남구 사는 29살 청년인데, 나한테 맞는 혜택 찾아줘',
  '월세 지원 받을 수 있는지 확인해줘',
  '근처에서 바로 상담 가능한 기관 알려줘',
];

const previewBenefits = [
  {
    title: '청년 월세 한시 특별지원',
    meta: '회원정보 입력 후 적합도 계산',
  },
  {
    title: '서울형 긴급복지 생계지원',
    meta: '거주지와 생활상태 기반 추천',
  },
];

export default function LandingPage() {
  return (
    <main className="auth-shell">
      <nav className="auth-nav" aria-label="서비스 진입 메뉴">
        <Link className="auth-brand" href="/">
          WelfareMap
          <span>personal welfare OS</span>
        </Link>
        <div className="auth-nav-actions">
          <Link className="auth-ghost-link" href="/search">
            둘러보기
          </Link>
          <Link className="auth-ghost-link" href="/login">
            로그인
          </Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-copy">
          <span className="landing-kicker">AI welfare concierge</span>
          <h1>
            내 정보를 알수록,
            <br />
            복지 추천은 더 정확해져요.
          </h1>
          <p>
            생년월일, 거주지, 가족 상태, 관심 혜택을 저장하면 WelfareMap이 내 조건을
            이해하고 로그인 후 맞춤형 AI 프롬프트를 먼저 제안합니다.
          </p>
          <div className="landing-actions">
            <Link className="auth-primary-link" href="/onboarding">
              회원가입하고 시작하기
            </Link>
            <Link className="auth-secondary-link" href="/login">
              로그인
            </Link>
          </div>
          <p className="landing-note">
            아직 계정이 없어도 둘러볼 수 있지만, 신청 가능성 점수와 맞춤 프롬프트는
            회원정보 저장 후 더 정교해집니다.
          </p>
        </div>

        <aside className="landing-preview" aria-label="로그인 후 맞춤 추천 미리보기">
          <div className="preview-header">
            <span>로그인 후</span>
            <strong>민준님에게 맞춘 추천</strong>
          </div>
          <div className="preview-prompt">
            <span>추천 프롬프트</span>
            <p>{previewPrompts[0]}</p>
            <div>
              <b>청년</b>
              <b>주거</b>
              <b>강남구</b>
            </div>
          </div>
          <div className="preview-list">
            {previewBenefits.map((benefit) => (
              <article key={benefit.title}>
                <span>예시</span>
                <strong>{benefit.title}</strong>
                <p>{benefit.meta}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="landing-flow" aria-label="서비스 이용 흐름">
        {['회원가입', '정보 입력', '로그인', '맞춤 프롬프트', 'AI 검색'].map((step) => (
          <span key={step}>{step}</span>
        ))}
      </section>
    </main>
  );
}
