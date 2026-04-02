'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { WelfareMarker } from '@/types/welfare';
import {
  MapWrapper, MapContainer, MapControls, MapControlBtn,
  MyLocationBtn, LoadingOverlay, MarkerInfoBox,
} from './Map.style';
import { LocationInfo } from '@/hooks/useLocation';

interface Props {
  location?: LocationInfo;
}

const DUMMY_MARKERS: WelfareMarker[] = [
  { id: '1', name: '미추홀구 노인복지관',           lat: 37.4563, lng: 126.7052, category: '노인',   address: '인천 미추홀구 매소홀로 388' },
  { id: '2', name: '인천 장애인 종합복지관',         lat: 37.4601, lng: 126.7120, category: '장애인', address: '인천 미추홀구 소성로163번길 33' },
  { id: '3', name: '미추홀구 건강가정지원센터',       lat: 37.4520, lng: 126.7080, category: '가족',   address: '인천 미추홀구 학익소로 50' },
  { id: '4', name: '인천남부 고용복지플러스센터',     lat: 37.4490, lng: 126.7010, category: '취업',   address: '인천 미추홀구 인주대로 321' },
  { id: '5', name: '미추홀구 육아종합지원센터',       lat: 37.4580, lng: 126.6990, category: '영유아', address: '인천 미추홀구 경인로 287' },
];

const CATEGORY_COLOR: Record<string, string> = {
  '노인':   '#1B3A4B',
  '장애인': '#7C3AED',
  '가족':   '#2E9E7A',
  '취업':   '#F59E0B',
  '영유아': '#EC4899',
};

declare global {
  interface Window { kakao: any; }
}

export default function Map({ location }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef          = useRef<any>(null);
  const [isLoaded,       setIsLoaded]       = useState(false);
  const [isLocating,     setIsLocating]     = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<WelfareMarker | null>(null);

  useEffect(() => {
    if (!mapRef.current || !location?.lat || !location?.lng) return;
    const pos = new window.kakao.maps.LatLng(location.lat, location.lng);
    mapRef.current.setCenter(pos);
    mapRef.current.setLevel(6);
  }, [location?.lat, location?.lng]);

  // ── 지도 + 마커 생성 ──────────────────────────────────
  const buildMap = useCallback(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new window.kakao.maps.Map(mapContainerRef.current, {
      center: new window.kakao.maps.LatLng(37.4563, 126.7052),
      level: 5,
    });
    mapRef.current = map;

    DUMMY_MARKERS.forEach((item) => {
      const position = new window.kakao.maps.LatLng(item.lat, item.lng);
      const color    = CATEGORY_COLOR[item.category] ?? '#2E9E7A';

      new window.kakao.maps.CustomOverlay({
        map,
        position,
        yAnchor: 1.4,
        content: `
          <div style="
            background:${color};color:#fff;
            padding:5px 10px;border-radius:20px;
            font-size:12px;font-weight:700;
            box-shadow:0 2px 6px rgba(0,0,0,0.25);
            white-space:nowrap;position:relative;
          ">
            ${item.category}
            <div style="
              position:absolute;bottom:-5px;left:50%;
              transform:translateX(-50%);width:0;height:0;
              border-left:5px solid transparent;
              border-right:5px solid transparent;
              border-top:5px solid ${color};
            "></div>
          </div>`,
      });

      const marker = new window.kakao.maps.Marker({ position, map });
      window.kakao.maps.event.addListener(marker, 'click', () => {
        setSelectedMarker(item);
        map.panTo(position);
      });
    });

    setIsLoaded(true);
  }, []);

  // ── 스크립트 로드 ──────────────────────────────────────
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    if (!key) { console.error('[KakaoMap] API 키 없음'); return; }

    // 이미 초기화 완료된 경우
    if (window.kakao?.maps?.Map) {
      buildMap();
      return;
    }

    // kakao 객체는 있지만 maps.load 대기 중인 경우
    if (window.kakao?.maps) {
      window.kakao.maps.load(buildMap);
      return;
    }

    // 스크립트 중복 삽입 방지
    if (document.getElementById('kakao-map-sdk')) return;

    const script    = document.createElement('script');
    script.id       = 'kakao-map-sdk';
    script.type     = 'text/javascript';
    // autoload=false → maps.load() 콜백 안에서 안전하게 초기화
    script.src      = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false`;
    script.onload   = () => { window.kakao.maps.load(buildMap); };
    script.onerror  = () => { console.error('[KakaoMap] 스크립트 로드 실패 — 카카오 콘솔 도메인 확인 필요'); };
    document.head.appendChild(script);
  }, [buildMap]);

  // ── 내 위치 ────────────────────────────────────────────
  const moveToMyLocation = useCallback(() => {
    if (!mapRef.current || !navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = new window.kakao.maps.LatLng(coords.latitude, coords.longitude);
        new window.kakao.maps.CustomOverlay({
          map: mapRef.current, position: pos, yAnchor: 0.5,
          content: `<div style="
            width:14px;height:14px;background:#3B82F6;
            border:3px solid #fff;border-radius:50%;
            box-shadow:0 0 0 4px rgba(59,130,246,0.3);
          "></div>`,
        });
        mapRef.current.setCenter(pos);
        mapRef.current.setLevel(4);
        setIsLocating(false);
      },
      () => {
        alert('위치 권한을 허용해주세요.');
        setIsLocating(false);
      }
    );
  }, []);

  const zoomIn  = () => mapRef.current?.setLevel(mapRef.current.getLevel() - 1);
  const zoomOut = () => mapRef.current?.setLevel(mapRef.current.getLevel() + 1);

  return (
    <MapWrapper>
      <MapContainer ref={mapContainerRef} />

      {!isLoaded && (
        <LoadingOverlay>
          <div className="loading_spinner" />
          <p className="loading_text">지도를 불러오는 중...</p>
        </LoadingOverlay>
      )}

      {isLoaded && (
        <MapControls>
          <MapControlBtn onClick={zoomIn}>+</MapControlBtn>
          <MapControlBtn onClick={zoomOut}>−</MapControlBtn>
        </MapControls>
      )}

      {isLoaded && (
        <MyLocationBtn onClick={moveToMyLocation} disabled={isLocating}>
          {isLocating ? '위치 찾는 중...' : '📍 내 위치'}
        </MyLocationBtn>
      )}

      {selectedMarker && (
        <MarkerInfoBox>
          <button className="info_close" onClick={() => setSelectedMarker(null)}>✕</button>
          <p className="info_category">{selectedMarker.category}</p>
          <p className="info_name">{selectedMarker.name}</p>
          <p className="info_address">{selectedMarker.address}</p>
        </MarkerInfoBox>
      )}
    </MapWrapper>
  );
}