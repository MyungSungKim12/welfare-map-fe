import Link from 'next/link';

const providers = [
  {
    id: 'google',
    label: 'Google로 계속하기',
    className: 'social-google',
  },
  {
    id: 'kakao',
    label: '카카오로 계속하기',
    className: 'social-kakao',
  },
  {
    id: 'naver',
    label: '네이버로 계속하기',
    className: 'social-naver',
  },
];

const loginBenefits = [
  '회원정보 기반 프롬프트',
  '현재 위치 기반 혜택 검색',
  '저장한 복지 동기화',
  '신청 체크리스트',
  '마감 알림',
];

export default function LoginPage() {
  return (
    <main className="auth-shell login-shell">
      <nav className="auth-nav" aria-label="로그인 페이지 메뉴">
        <Link className="auth-brand" href="/">
          WelfareMap
          <span>personal welfare OS</span>
        </Link>
        <Link className="auth-ghost-link" href="/search">
          둘러보기
        </Link>
      </nav>

      <section className="login-layout">
        <aside className="login-info">
          <span className="landing-kicker">OAuth ready</span>
          <h1>
            소셜 계정으로
            <br />
            바로 시작하세요.
          </h1>
          <p>
            로그인 후 저장된 사용자 정보와 연결해 맞춤 프롬프트, 복지 추천, 저장 목록,
            신청 체크리스트를 이어서 사용할 수 있습니다.
          </p>
          <div className="login-benefit-list">
            {loginBenefits.map((benefit) => (
              <span key={benefit}>{benefit}</span>
            ))}
          </div>
        </aside>

        <section className="login-card" aria-labelledby="login-title">
          <div>
            <h2 id="login-title">로그인</h2>
            <p>소셜 계정으로 빠르게 로그인하고 내 복지 조건을 불러옵니다.</p>
          </div>

          <div className="social-login-list">
            {providers.map((provider) => (
              <button className={`social-login ${provider.className}`} key={provider.id} type="button">
                <span aria-hidden="true" />
                {provider.label}
              </button>
            ))}
          </div>

          <div className="login-divider" />

          <div className="login-signup">
            <span>아직 계정이 없다면</span>
            <Link className="auth-secondary-link" href="/onboarding">
              회원가입
            </Link>
          </div>

          <p className="login-policy">
            로그인하면 개인정보 처리방침과 서비스 이용약관에 동의한 것으로 간주됩니다.
          </p>
        </section>
      </section>
    </main>
  );
}
