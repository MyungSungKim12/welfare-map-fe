'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  DEFAULT_USER_PROFILE,
  useUserProfile,
} from '@/hooks/useUserProfile';
import type {
  BenefitInterest,
  ChildrenStatus,
  Gender,
  LifeStage,
  MaritalStatus,
  UserProfile,
} from '@/hooks/useUserProfile';
import type { FormEvent } from 'react';

const genderOptions: { value: Gender; label: string }[] = [
  { value: 'none', label: '선택 안 함' },
  { value: 'female', label: '여성' },
  { value: 'male', label: '남성' },
];

const maritalOptions: { value: MaritalStatus; label: string }[] = [
  { value: 'single', label: '미혼' },
  { value: 'married', label: '기혼' },
];

const childrenOptions: { value: ChildrenStatus; label: string }[] = [
  { value: 'none', label: '자녀 없음' },
  { value: 'hasChildren', label: '자녀 있음' },
];

const lifeStageOptions: { value: LifeStage; label: string }[] = [
  { value: 'youth', label: '청년' },
  { value: 'newlywed', label: '신혼부부' },
  { value: 'pregnancy', label: '임신/출산' },
  { value: 'senior', label: '고령자' },
  { value: 'disabled', label: '장애인' },
  { value: 'lowIncome', label: '저소득' },
];

const interestOptions: { value: BenefitInterest; label: string }[] = [
  { value: 'housing', label: '주거' },
  { value: 'living', label: '생활비' },
  { value: 'job', label: '일자리' },
  { value: 'education', label: '교육' },
  { value: 'medical', label: '의료' },
  { value: 'care', label: '돌봄' },
];

const examplePrompts = [
  '강남구 사는 29살 청년인데, 주거 지원 받을 수 있어?',
  '아이 있는 기혼 가정이 받을 수 있는 돌봄 혜택 찾아줘',
  '부모님 의료비나 고령자 복지 혜택 알려줘',
];

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, hydrated, save } = useUserProfile();
  const [form, setForm] = useState<UserProfile>(DEFAULT_USER_PROFILE);

  useEffect(() => {
    if (!hydrated) return;
    const sync = async () => {
      setForm(profile);
    };
    sync();
  }, [hydrated, profile]);

  const updateField = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleList = <T extends LifeStage | BenefitInterest>(
    key: 'lifeStages' | 'interests',
    value: T,
  ) => {
    setForm((prev) => {
      const current = prev[key] as T[];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    save(form);
    router.push('/search');
  };

  return (
    <main className="auth-shell onboarding-shell">
      <nav className="auth-nav" aria-label="온보딩 페이지 메뉴">
        <Link className="auth-brand" href="/">
          WelfareMap
          <span>personal welfare OS</span>
        </Link>
        <div className="auth-nav-actions">
          <Link className="auth-ghost-link" href="/login">
            로그인
          </Link>
          <Link className="auth-ghost-link" href="/search">
            건너뛰기
          </Link>
        </div>
      </nav>

      <section className="onboarding-layout">
        <aside className="onboarding-copy">
          <span className="landing-kicker">Profile first</span>
          <h1>
            처음 한 번만,
            <br />
            내 조건을 알려주세요.
          </h1>
          <p>
            지금 입력한 정보는 맞춤 프롬프트와 복지 추천의 기준으로 쓰입니다. 이후 실제
            소셜로그인과 연결하면 같은 구조를 마이페이지 프로필로 옮길 수 있습니다.
          </p>

          <div className="profile-context-card">
            <span>검색창 하단 예시</span>
            {examplePrompts.map((prompt) => (
              <strong key={prompt}>{prompt}</strong>
            ))}
          </div>
        </aside>

        <form className="profile-form-card" onSubmit={handleSubmit}>
          <div className="profile-form-head">
            <span>01</span>
            <div>
              <h2>사용자 정보</h2>
              <p>정확한 추천을 위해 필요한 최소 정보만 먼저 저장합니다.</p>
            </div>
          </div>

          <div className="profile-form-grid">
            <label className="profile-field">
              <span>생년월일</span>
              <input
                className="profile-input"
                type="date"
                value={form.birthDate}
                onChange={(event) => updateField('birthDate', event.target.value)}
              />
            </label>

            <label className="profile-field">
              <span>거주지</span>
              <input
                className="profile-input"
                type="text"
                placeholder="예: 서울특별시 강남구"
                value={form.region}
                onChange={(event) => updateField('region', event.target.value)}
              />
            </label>
          </div>

          <fieldset className="profile-fieldset">
            <legend>성별</legend>
            <div className="profile-options">
              {genderOptions.map((option) => (
                <button
                  className={`profile-option ${form.gender === option.value ? 'is-selected' : ''}`}
                  key={option.value}
                  type="button"
                  onClick={() => updateField('gender', option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="profile-form-grid">
            <fieldset className="profile-fieldset">
              <legend>혼인 상태</legend>
              <div className="profile-options">
                {maritalOptions.map((option) => (
                  <button
                    className={`profile-option ${
                      form.maritalStatus === option.value ? 'is-selected' : ''
                    }`}
                    key={option.value}
                    type="button"
                    onClick={() => updateField('maritalStatus', option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="profile-fieldset">
              <legend>자녀 여부</legend>
              <div className="profile-options">
                {childrenOptions.map((option) => (
                  <button
                    className={`profile-option ${
                      form.childrenStatus === option.value ? 'is-selected' : ''
                    }`}
                    key={option.value}
                    type="button"
                    onClick={() => updateField('childrenStatus', option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <fieldset className="profile-fieldset">
            <legend>나에게 해당되는 조건</legend>
            <div className="profile-options">
              {lifeStageOptions.map((option) => (
                <button
                  className={`profile-option ${
                    form.lifeStages.includes(option.value) ? 'is-selected' : ''
                  }`}
                  key={option.value}
                  type="button"
                  onClick={() => toggleList('lifeStages', option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="profile-fieldset">
            <legend>관심 혜택</legend>
            <div className="profile-options">
              {interestOptions.map((option) => (
                <button
                  className={`profile-option ${
                    form.interests.includes(option.value) ? 'is-selected' : ''
                  }`}
                  key={option.value}
                  type="button"
                  onClick={() => toggleList('interests', option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="profile-actions">
            <Link className="auth-secondary-link" href="/search">
              나중에 입력
            </Link>
            <button className="auth-primary-link" type="submit">
              저장하고 AI 검색으로
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
