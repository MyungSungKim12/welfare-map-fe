'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { WelfareItem } from '@/types/welfare';
import { LocationInfo } from '@/hooks/useLocation';
import {
  MapWrapper, MapContainer, MapControls, MapControlBtn,
  MyLocationBtn, LoadingOverlay, MarkerInfoBox,
} from './Map.style';

interface Props {
  location?: LocationInfo;
  items?: WelfareItem[];
}

const CATEGORY_COLOR: Record<string, string> = {
  '노인':   '#1B3A4B',
  '장애인': '#7C3AED',
  '가족':   '#2E9E7A',
  '취업':   '#F59E0B',
  '영유아': '#EC4899',
  '기타':   '#6B7280',
};

declare global {
  interface Window { kakao: any; }
}

export default function Map({ location, items = [] }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef          = useRef<any>(null);
  const overlaysRef     = useRef<any[]>([]);
  const [isLoaded,       setIsLoaded]       = useState(false);
  const [isLocating,     setIsLocating]     = useState(false);
  const [selectedItem,   setSelectedItem]   = useState<WelfareItem | null>(null);

  // ── 마커 생성 ─────────────────────────────────────────
  const drawMarkers = useCallback((map: any, welfareItems: WelfareItem[]) => {
    overlaysRef.current.forEach((o) => o.setMap(null));
    overlaysRef.current = [];

    if (welfareItems.length === 0) return;

    const center  = map.getCenter();
    const baseLat = center.getLat();
    const baseLng = center.getLng();

    welfareItems.slice(0, 30).forEach((item, i) => {
      const angle  = (i / Math.min(welfareItems.length, 30)) * 2 * Math.PI;
      const radius = 0.005 + (i % 5) * 0.003;
      const lat    = baseLat + Math.sin(angle) * radius;
      const lng    = baseLng + Math.cos(angle) * radius;

      const position = new window.kakao.maps.LatLng(lat, lng);
      const color    = CATEGORY_COLOR[item.category] ?? '#6B7280';

      const overlay = new window.kakao.maps.CustomOverlay({
        map,
        position,
        yAnchor: 1.4,
        content: `
          <div onclick="window.__mapMarkerClick('${item.id}')" style="
            background:${color};color:#fff;
            padding:5px 10px;border-radius:20px;
            font-size:11px;font-weight:700;
            box-shadow:0 2px 6px rgba(0,0,0,0.25);
            white-space:nowrap;position:relative;cursor:pointer;
          ">
            ${item.category.split(',')[0].trim()}
            <div style="
              position:absolute;bottom:-5px;left:50%;
              transform:translateX(-50%);width:0;height:0;
              border-left:5px solid transparent;
              border-right:5px solid transparent;
              border-top:5px solid ${color};
            "></div>
          </div>`,
      });

      overlaysRef.current.push(overlay);
    });
  }, []);

  // ── 지도 초기화 ───────────────────────────────────────
  const buildMap = useCallback(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const lat = location?.lat ?? 37.4563;
    const lng = location?.lng ?? 126.7052;

    const map = new window.kakao.maps.Map(mapContainerRef.current, {
      center: new window.kakao.maps.LatLng(lat, lng),
      level: 5,
    });
    mapRef.current = map;

    // 마커 클릭 이벤트 전역 등록
    (window as any).__mapMarkerClick = (id: string) => {
      const found = items.find((i) => i.id === id);
      if (found) setSelectedItem(found);
    };

    setIsLoaded(true);
  }, [location?.lat, location?.lng, items]);

  // ── items 변경 시 마커 재드로우 ───────────────────────
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;
    // 전역 클릭 핸들러도 최신 items로 갱신
    (window as any).__mapMarkerClick = (id: string) => {
      const found = items.find((i) => i.id === id);
      if (found) setSelectedItem(found);
    };
    drawMarkers(mapRef.current, items);
  }, [items, isLoaded, drawMarkers]);

  // ── 위치 변경 시 지도 중심 이동 ──────────────────────
  useEffect(() => {
    if (!mapRef.current || !location?.lat || !location?.lng) return;
    const pos = new window.kakao.maps.LatLng(location.lat, location.lng);
    mapRef.current.setCenter(pos);
    mapRef.current.setLevel(6);
  }, [location?.lat, location?.lng]);

  // ── 스크립트 로드 ─────────────────────────────────────
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    if (!key) return;

    if (window.kakao?.maps?.Map) { buildMap(); return; }
    if (window.kakao?.maps)      { window.kakao.maps.load(buildMap); return; }
    if (document.getElementById('kakao-map-sdk')) return;

    const script   = document.createElement('script');
    script.id      = 'kakao-map-sdk';
    script.type    = 'text/javascript';
    script.src     = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false`;
    script.onload  = () => { window.kakao.maps.load(buildMap); };
    script.onerror = () => { console.error('[KakaoMap] 스크립트 로드 실패'); };
    document.head.appendChild(script);
  }, [buildMap]);

  // ── 내 위치 이동 ──────────────────────────────────────
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
      () => { alert('위치 권한을 허용해주세요.'); setIsLocating(false); }
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

      {selectedItem && (
        <MarkerInfoBox>
          <button className="info_close" onClick={() => setSelectedItem(null)}>✕</button>
          <p className="info_category">{selectedItem.category}</p>
          <p className="info_name">{selectedItem.title}</p>
          <p className="info_address">{selectedItem.region}</p>
          {selectedItem.link && (
            
              <a href={selectedItem.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: '0.8rem',
                fontSize: '1.2rem',
                color: '#2E9E7A',
                textDecoration: 'underline',
              }}
            >
              자세히 보기 →
            </a>
          )}
        </MarkerInfoBox>
      )}
    </MapWrapper>
  );
}