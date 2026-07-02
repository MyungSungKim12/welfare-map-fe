import { normalizeTextBenefit } from '@/lib/benefits/normalize';
import type { BenefitIntent, BenefitSourceDescriptor, BenefitSourceResult, NormalizedBenefit } from '@/types/benefit';

export type SeoulOpenDataKind = 'benefit-program' | 'facility-reservation' | 'facility-location' | 'faq';

export interface SeoulOpenDataServiceConfig {
  id: string;
  label: string;
  serviceName: string;
  kind: SeoulOpenDataKind;
  tags: string[];
  region?: string;
}

interface SeoulOpenDataPreset {
  id: string;
  label: string;
  envKey: string;
  kind: SeoulOpenDataKind;
  tags: string[];
  region?: string;
}

const SEOUL_OPEN_DATA_BASE_URL = 'http://openapi.seoul.go.kr:8088';

const SEOUL_SIGUNGU_NAMES = [
  '강남구',
  '강동구',
  '강북구',
  '강서구',
  '관악구',
  '광진구',
  '구로구',
  '금천구',
  '노원구',
  '도봉구',
  '동대문구',
  '동작구',
  '마포구',
  '서대문구',
  '서초구',
  '성동구',
  '성북구',
  '송파구',
  '양천구',
  '영등포구',
  '용산구',
  '은평구',
  '종로구',
  '중구',
  '중랑구',
];

const DEFAULT_SERVICE_ENV_MAP: SeoulOpenDataPreset[] = [
  {
    id: 'seoul-one-person-program',
    label: '[1인가구포털]서울시 1인가구 참여프로그램 현황',
    envKey: 'SEOUL_ONE_PERSON_PROGRAM_SERVICE_NAME',
    kind: 'benefit-program',
    tags: ['1인가구', '청년', '중장년', '고령자', '프로그램', '상담', '안전', '생활', '무료'],
    region: '서울',
  },
  {
    id: 'seoul-elderly-facility',
    label: '[강동구 어르신복지시설]서울시 강동구 어르신 복지시설 현황',
    envKey: 'SEOUL_ELDERLY_FACILITY_SERVICE_NAME',
    kind: 'facility-location',
    tags: ['어르신', '고령자', '노인', '복지시설', '돌봄', '주간보호', '시설', '강동구'],
    region: '서울 강동구',
  },
  {
    id: 'seoul-public-reservation',
    label: '[공공서비스예약 정보]서울시 은평구 시설대관 공공서비스예약 정보',
    envKey: 'SEOUL_PUBLIC_RESERVATION_SERVICE_NAME',
    kind: 'facility-reservation',
    tags: ['공공서비스예약', '시설대관', '예약', '청년공간', '공간시설', '체육', '강당', '캠핑장', '은평구'],
    region: '서울 은평구',
  },
];

interface SeoulOpenDataEnvelope {
  [serviceName: string]: {
    list_total_count?: number;
    RESULT?: {
      CODE?: string;
      MESSAGE?: string;
    };
    row?: Record<string, unknown>[];
  } | unknown;
}

function parseJsonServices(): SeoulOpenDataServiceConfig[] {
  const raw = process.env.SEOUL_OPEN_DATA_SERVICES;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as SeoulOpenDataServiceConfig[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item.id && item.label && item.serviceName && item.kind);
  } catch {
    return [];
  }
}

export function getConfiguredSeoulOpenDataServices(): SeoulOpenDataServiceConfig[] {
  const explicit = parseJsonServices();
  const fromEnv = DEFAULT_SERVICE_ENV_MAP.flatMap((preset) => {
    const serviceName = process.env[preset.envKey];
    if (!serviceName) return [];
    return [{
      id: preset.id,
      label: preset.label,
      serviceName,
      kind: preset.kind,
      tags: preset.tags,
      region: preset.region ?? '서울',
    }];
  });

  const seen = new Set<string>();
  return [...explicit, ...fromEnv].filter((service) => {
    if (seen.has(service.id)) return false;
    seen.add(service.id);
    return true;
  });
}

function shouldSearchSeoul(params: URLSearchParams, intent?: BenefitIntent) {
  const sidoName = params.get('sidoName') ?? '';
  const queryRegion = [intent?.region?.sido, intent?.region?.sigungu].filter(Boolean).join(' ');
  const query = params.get('q') ?? '';
  const combined = `${sidoName} ${queryRegion} ${query}`;
  if (!combined.trim()) return true;
  return combined.includes('서울') || SEOUL_SIGUNGU_NAMES.some((name) => combined.includes(name));
}

function shouldSearchService(service: SeoulOpenDataServiceConfig, keyword: string, intent?: BenefitIntent) {
  const text = [
    keyword,
    ...(intent?.keywords ?? []),
    ...(intent?.interests ?? []),
    intent?.lifeStage ?? '',
  ].join(' ');

  if (!text.trim()) return service.kind === 'benefit-program';
  if (service.tags.some((tag) => text.includes(tag))) return true;

  if (service.kind === 'benefit-program') {
    return ['청년', '중장년', '고령자', '어르신', '1인가구', '생활', '상담', '안전', '가족', '무료'].some((tag) => text.includes(tag));
  }
  if (service.kind === 'facility-location') {
    return ['어르신', '노인', '고령자', '복지시설', '시설', '돌봄', '주간보호', '위치'].some((tag) => text.includes(tag));
  }
  if (service.kind === 'facility-reservation') {
    return ['예약', '대관', '체육', '시설', '공간', '청년공간', '공공서비스', '강당', '캠핑장'].some((tag) => text.includes(tag));
  }
  if (service.kind === 'faq') {
    return ['문의', '신청', '방법', 'FAQ', '상담'].some((tag) => text.includes(tag));
  }
  return false;
}

function extractRows(envelope: SeoulOpenDataEnvelope, serviceName: string) {
  const direct = envelope[serviceName];
  if (direct && typeof direct === 'object' && 'row' in direct) {
    const rows = (direct as { row?: Record<string, unknown>[] }).row;
    return Array.isArray(rows) ? rows : [];
  }

  const fallback = Object.values(envelope).find((value) => value && typeof value === 'object' && 'row' in value);
  const rows = (fallback as { row?: Record<string, unknown>[] } | undefined)?.row;
  return Array.isArray(rows) ? rows : [];
}

function cleanRowValue(value: unknown) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';

  return raw
    .replace(/<!\[CDATA\[/g, '')
    .replace(/\]\]>/g, '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<img[^>]*>/gi, ' ')
    .replace(/data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function shorten(value: string, maxLength = 240) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
}

function getRowValue(row: Record<string, unknown>, candidates: string[]) {
  const lowered = new Map(Object.entries(row).map(([key, value]) => [key.toLowerCase(), cleanRowValue(value)]));
  for (const candidate of candidates) {
    const value = lowered.get(candidate.toLowerCase());
    if (value) return value;
  }
  return '';
}

function getPeriod(row: Record<string, unknown>) {
  const receptionStart = getRowValue(row, ['RCEPT_DE1', 'RCPTBGNDT', 'RECRUIT_START_DATE', 'APPLY_START_DATE']);
  const receptionEnd = getRowValue(row, ['RCEPT_DE2', 'RCPTENDDT', 'RECRUIT_END_DATE', 'APPLY_END_DATE']);
  const progressStart = getRowValue(row, ['PROGRS_DE1', 'SVCOPNBGNDT', 'START_DATE']);
  const progressEnd = getRowValue(row, ['PROGRS_DE2', 'SVCOPNENDDT', 'END_DATE']);

  const periods = [
    receptionStart || receptionEnd ? `접수 ${receptionStart || '확인 필요'} ~ ${receptionEnd || '확인 필요'}` : '',
    progressStart || progressEnd ? `운영 ${progressStart || '확인 필요'} ~ ${progressEnd || '확인 필요'}` : '',
  ].filter(Boolean);

  return periods.join(' / ')
    || getRowValue(row, ['PERIOD', 'RECRUIT_PERIOD', 'APPLY_PERIOD', 'USE_DATE'])
    || '확인 필요';
}

function getCategory(row: Record<string, unknown>, service: SeoulOpenDataServiceConfig) {
  if (service.kind === 'benefit-program') {
    return [getRowValue(row, ['TY_NM']), getRowValue(row, ['SE_NM'])].filter(Boolean).join(' / ') || '서울 프로그램';
  }
  if (service.kind === 'faq') return '상담/FAQ';
  if (service.kind === 'facility-reservation') {
    return [getRowValue(row, ['MAXCLASSNM']), getRowValue(row, ['MINCLASSNM'])].filter(Boolean).join(' / ') || '시설예약';
  }
  return '생활시설';
}

function buildSummary(row: Record<string, unknown>, service: SeoulOpenDataServiceConfig) {
  const values = [
    getRowValue(row, ['CN', 'CONTENTS', 'CONTENT', 'PROGRAM_CN', 'PRGRM_CN', 'FAQ_ANSWER', 'ANSWER', 'A']),
    getRowValue(row, ['INSTT_NM', 'PARTCPT_CT_NM', 'RCEPT_MTH_NM', 'PROGRS_INQRY']),
    getRowValue(row, ['PLACENM', 'SVCSTATNM', 'PAYATNM', 'USETGTINFO']),
    getRowValue(row, ['PLACE_ADRES1', 'PLACE_ADRES2', 'ADDR', 'ADDRESS', 'ROAD_NM_ADDR', 'BASS_ADRES', 'PLACE', 'LOCATION']),
    getRowValue(row, ['TELNO', 'TEL', 'PHONE', 'CONTACT', 'MNG_INST_TELNO']),
  ].filter(Boolean);

  if (values.length > 0) return shorten(values.join(' · '));
  return `${service.label} 데이터입니다. 상세 정보는 서울 열린데이터광장 원문에서 확인하세요.`;
}

function normalizeSeoulRow(
  row: Record<string, unknown>,
  service: SeoulOpenDataServiceConfig,
  source: BenefitSourceDescriptor,
  keyword: string,
  fetchedAt: string,
  index: number,
): NormalizedBenefit {
  const title = getRowValue(row, [
    'PARTCPTN_SJ',
    'FCLT_NM',
    'SVCNM',
    'PROGRAM_NM',
    'PRGRM_NM',
    'PROGRM_NM',
    'TITLE',
    'SUBJECT',
    'SVC_NM',
    'FACLT_NM',
    'FACILITY_NM',
    'PLACENM',
    'NAME',
    'Q',
    'QUESTION',
    'FAQ_TITLE',
  ]) || service.label;
  const region = getRowValue(row, ['ATDRC_NM', 'DONG', 'AREANM', 'GU_NM', 'SIGUNGU_NM', 'SGG_NM', 'BOROUGH', 'AREA_NM', 'REGION'])
    || service.region
    || '서울';
  const target = getRowValue(row, ['TRGET_INFO', 'USETGTINFO', 'AGRDE_NM', 'TARGET', 'TRGET', 'OBJECT', 'USER_TARGET', 'ELIGIBILITY'])
    || service.tags.join(', ');
  const applyUrl = getRowValue(row, ['RCEPT_MTH_LINK', 'SVCURL', 'URL', 'LINK', 'HMPG_URL', 'HOMEPAGE', 'HMPG_ADDR'])
    || 'https://data.seoul.go.kr';

  return normalizeTextBenefit({
    id: `${service.id}:${index}:${title}`,
    source,
    title,
    summary: buildSummary(row, service),
    category: getCategory(row, service),
    target,
    region,
    period: getPeriod(row),
    applyUrl,
    eligibilityText: target,
    keyword,
    fetchedAt,
    confidenceBoost: service.kind === 'benefit-program' ? 9 : 5,
  });
}

async function fetchSeoulRows(key: string, service: SeoulOpenDataServiceConfig) {
  const url = `${SEOUL_OPEN_DATA_BASE_URL}/${encodeURIComponent(key)}/json/${encodeURIComponent(service.serviceName)}/1/100`;
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) return [];
  const data = await response.json() as SeoulOpenDataEnvelope;
  return extractRows(data, service.serviceName);
}

export async function searchSeoulOpenDataSource(
  source: BenefitSourceDescriptor,
  params: URLSearchParams,
  keyword: string,
  fetchedAt: string,
  intent?: BenefitIntent,
): Promise<BenefitSourceResult> {
  const key = process.env.SEOUL_OPEN_DATA_KEY;
  const services = getConfiguredSeoulOpenDataServices();
  if (!key || services.length === 0 || !shouldSearchSeoul(params, intent)) {
    return { source, items: [] };
  }

  const matchedServices = services.filter((service) => shouldSearchService(service, keyword, intent));
  const selectedServices = matchedServices.length > 0 ? matchedServices : services.slice(0, 1);

  try {
    const results = await Promise.all(
      selectedServices.map(async (service) => {
        const rows = await fetchSeoulRows(key, service);
        return rows.map((row, index) => normalizeSeoulRow(row, service, source, keyword, fetchedAt, index));
      }),
    );
    return { source, items: results.flat() };
  } catch {
    return { source, items: [], error: `${source.label} 검색 실패` };
  }
}
