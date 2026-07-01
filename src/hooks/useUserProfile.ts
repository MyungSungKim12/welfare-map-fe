'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

export type Gender = 'none' | 'female' | 'male';
export type MaritalStatus = 'single' | 'married';
export type ChildrenStatus = 'none' | 'hasChildren';
export type LifeStage = 'youth' | 'newlywed' | 'pregnancy' | 'senior' | 'disabled' | 'lowIncome';
export type BenefitInterest = 'housing' | 'living' | 'job' | 'education' | 'medical' | 'care';

export interface UserProfile {
  birthDate: string;
  region: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  childrenStatus: ChildrenStatus;
  lifeStages: LifeStage[];
  interests: BenefitInterest[];
  updatedAt?: string;
}

export const USER_PROFILE_STORAGE_KEY = 'welfare_user_profile_v1';

export const DEFAULT_USER_PROFILE: UserProfile = {
  birthDate: '',
  region: '',
  gender: 'none',
  maritalStatus: 'single',
  childrenStatus: 'none',
  lifeStages: [],
  interests: [],
};

const genderValues: Gender[] = ['none', 'female', 'male'];
const maritalValues: MaritalStatus[] = ['single', 'married'];
const childrenValues: ChildrenStatus[] = ['none', 'hasChildren'];
const lifeStageValues: LifeStage[] = ['youth', 'newlywed', 'pregnancy', 'senior', 'disabled', 'lowIncome'];
const interestValues: BenefitInterest[] = ['housing', 'living', 'job', 'education', 'medical', 'care'];

function keepAllowed<T extends string>(items: unknown, allowed: T[]): T[] {
  if (!Array.isArray(items)) return [];
  return items.filter((item): item is T => allowed.includes(item as T));
}

function sanitizeProfile(raw: Partial<UserProfile>): UserProfile {
  return {
    birthDate: typeof raw.birthDate === 'string' ? raw.birthDate : '',
    region: typeof raw.region === 'string' ? raw.region : '',
    gender: genderValues.includes(raw.gender as Gender) ? (raw.gender as Gender) : 'none',
    maritalStatus: maritalValues.includes(raw.maritalStatus as MaritalStatus)
      ? (raw.maritalStatus as MaritalStatus)
      : 'single',
    childrenStatus: childrenValues.includes(raw.childrenStatus as ChildrenStatus)
      ? (raw.childrenStatus as ChildrenStatus)
      : 'none',
    lifeStages: keepAllowed(raw.lifeStages, lifeStageValues),
    interests: keepAllowed(raw.interests, interestValues),
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : undefined,
  };
}

export function readUserProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(USER_PROFILE_STORAGE_KEY);
    if (!raw) return null;
    return sanitizeProfile(JSON.parse(raw) as Partial<UserProfile>);
  } catch {
    return null;
  }
}

export function writeUserProfile(profile: UserProfile) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(sanitizeProfile(profile)));
  } catch {
    // 브라우저 저장소 제한 등은 다음 로그인/프로필 저장 연결 단계에서 서버 저장으로 보완한다.
  }
}

export function clearUserProfile() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(USER_PROFILE_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      const stored = readUserProfile();
      if (stored) setProfile(stored);
      setHydrated(true);
    };
    hydrate();
  }, []);

  const save = useCallback((nextProfile: UserProfile) => {
    const payload = sanitizeProfile({
      ...nextProfile,
      updatedAt: new Date().toISOString(),
    });
    setProfile(payload);
    writeUserProfile(payload);
    return payload;
  }, []);

  const clear = useCallback(() => {
    setProfile(DEFAULT_USER_PROFILE);
    clearUserProfile();
  }, []);

  const hasProfile = useMemo(() => Boolean(profile.updatedAt), [profile.updatedAt]);

  return {
    profile,
    setProfile,
    save,
    clear,
    hydrated,
    hasProfile,
  };
}
