'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { LocateFixed, X, ZoomIn, ZoomOut } from 'lucide-react';
import { WelfareItem } from '@/types/welfare';
import { LocationInfo } from '@/hooks/useLocation';
import {
  MapWrapper,
  MapContainer,
  MapControls,
  MapControlBtn,
  MyLocationBtn,
  LoadingOverlay,
  MarkerInfoBox,
} from './Map.style';

interface Props {
  location?: LocationInfo;
  items?: WelfareItem[];
}

interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

interface KakaoMapInstance {
  getCenter(): KakaoLatLng;
  setCenter(position: KakaoLatLng): void;
  setLevel(level: number): void;
  getLevel(): number;
}

interface KakaoOverlay {
  setMap(map: KakaoMapInstance | null): void;
}

interface KakaoSdk {
  maps: {
    Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMapInstance;
    LatLng: new (lat: number, lng: number) => KakaoLatLng;
    CustomOverlay: new (options: {
      map?: KakaoMapInstance;
      position: KakaoLatLng;
      yAnchor?: number;
      content: string;
    }) => KakaoOverlay;
    load(callback: () => void): void;
  };
}

declare global {
  interface Window {
    kakao?: KakaoSdk;
    __mapMarkerClick?: (id: string) => void;
  }
}

const CATEGORY_COLOR: Record<string, string> = {
  의료: '#0f6b57',
  건강: '#0f6b57',
  주거: '#173344',
  생활: '#173344',
  취업: '#b86b17',
  교육: '#3657a6',
  보육: '#3657a6',
  돌봄: '#7c4d8b',
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getCategoryColor(category: string) {
  const found = Object.entries(CATEGORY_COLOR).find(([key]) => category.includes(key));
  return found?.[1] ?? '#14866d';
}

export default function Map({ location, items = [] }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMapInstance | null>(null);
  const overlaysRef = useRef<KakaoOverlay[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [mapError, setMapError] = useState<string | null>(() =>
    process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ? null : '카카오맵 API 키가 설정되지 않았습니다.'
  );
  const [selectedItem, setSelectedItem] = useState<WelfareItem | null>(null);

  const drawMarkers = useCallback((map: KakaoMapInstance, welfareItems: WelfareItem[]) => {
    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current = [];

    const kakao = window.kakao;
    if (!kakao || welfareItems.length === 0) return;

    const center = map.getCenter();
    const baseLat = center.getLat();
    const baseLng = center.getLng();
    const visibleItems = welfareItems.slice(0, 30);

    visibleItems.forEach((item, index) => {
      const angle = (index / Math.max(visibleItems.length, 1)) * 2 * Math.PI;
      const radius = 0.004 + (index % 5) * 0.0024;
      const lat = baseLat + Math.sin(angle) * radius;
      const lng = baseLng + Math.cos(angle) * radius;
      const category = item.category.split(',')[0].trim() || '복지';
      const color = getCategoryColor(category);
      const safeId = escapeHtml(item.id);
      const safeCategory = escapeHtml(category);

      const overlay = new kakao.maps.CustomOverlay({
        map,
        position: new kakao.maps.LatLng(lat, lng),
        yAnchor: 1.4,
        content: `
          <button onclick="window.__mapMarkerClick && window.__mapMarkerClick('${safeId}')" style="
            appearance:none;border:0;background:${color};color:#fff;
            padding:7px 11px;border-radius:999px;font-size:12px;font-weight:800;
            box-shadow:0 8px 18px rgba(16,32,39,0.22);white-space:nowrap;cursor:pointer;
          ">${safeCategory}</button>
        `,
      });

      overlaysRef.current.push(overlay);
    });
  }, []);

  const buildMap = useCallback(() => {
    if (!mapContainerRef.current || mapRef.current || !window.kakao) return;

    const lat = location?.lat ?? 37.4563;
    const lng = location?.lng ?? 126.7052;
    const map = new window.kakao.maps.Map(mapContainerRef.current, {
      center: new window.kakao.maps.LatLng(lat, lng),
      level: 6,
    });

    mapRef.current = map;
    window.__mapMarkerClick = (id: string) => {
      const found = items.find((item) => item.id === id);
      if (found) setSelectedItem(found);
    };
    setIsLoaded(true);
  }, [location?.lat, location?.lng, items]);

  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;
    window.__mapMarkerClick = (id: string) => {
      const found = items.find((item) => item.id === id);
      if (found) setSelectedItem(found);
    };
    drawMarkers(mapRef.current, items);
  }, [items, isLoaded, drawMarkers]);

  useEffect(() => {
    if (!mapRef.current || !window.kakao || !location?.lat || !location?.lng) return;
    const position = new window.kakao.maps.LatLng(location.lat, location.lng);
    mapRef.current.setCenter(position);
    mapRef.current.setLevel(6);
  }, [location?.lat, location?.lng]);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    if (!key) return;

    if (window.kakao?.maps?.Map) {
      queueMicrotask(buildMap);
      return;
    }
    if (window.kakao?.maps) {
      window.kakao.maps.load(buildMap);
      return;
    }
    if (document.getElementById('kakao-map-sdk')) return;

    const script = document.createElement('script');
    script.id = 'kakao-map-sdk';
    script.type = 'text/javascript';
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false`;
    script.onload = () => window.kakao?.maps.load(buildMap);
    script.onerror = () => setMapError('카카오맵을 불러오지 못했습니다. API 키와 도메인 설정을 확인해주세요.');
    document.head.appendChild(script);
  }, [buildMap]);

  const moveToMyLocation = useCallback(() => {
    if (!mapRef.current || !navigator.geolocation || !window.kakao) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (!mapRef.current || !window.kakao) return;
        const position = new window.kakao.maps.LatLng(coords.latitude, coords.longitude);
        new window.kakao.maps.CustomOverlay({
          map: mapRef.current,
          position,
          yAnchor: 0.5,
          content: '<div style="width:16px;height:16px;background:#14866d;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 6px rgba(20,134,109,0.24);"></div>',
        });
        mapRef.current.setCenter(position);
        mapRef.current.setLevel(5);
        setIsLocating(false);
      },
      () => {
        alert('위치 권한을 허용하면 현재 위치로 지도를 이동할 수 있습니다.');
        setIsLocating(false);
      }
    );
  }, []);

  const zoomIn = () => mapRef.current?.setLevel(mapRef.current.getLevel() - 1);
  const zoomOut = () => mapRef.current?.setLevel(mapRef.current.getLevel() + 1);

  return (
    <MapWrapper>
      <MapContainer ref={mapContainerRef} />

      {(!isLoaded || mapError) && (
        <LoadingOverlay>
          {!mapError && <div className="loading_spinner" />}
          <p className="loading_text">{mapError ?? '지도를 불러오는 중입니다'}</p>
        </LoadingOverlay>
      )}

      {isLoaded && (
        <MapControls>
          <MapControlBtn type="button" onClick={zoomIn} title="확대"><ZoomIn size={18} /></MapControlBtn>
          <MapControlBtn type="button" onClick={zoomOut} title="축소"><ZoomOut size={18} /></MapControlBtn>
        </MapControls>
      )}

      {isLoaded && (
        <MyLocationBtn type="button" onClick={moveToMyLocation} disabled={isLocating}>
          <LocateFixed size={17} />
          {isLocating ? '위치 확인 중' : '내 위치'}
        </MyLocationBtn>
      )}

      {selectedItem && (
        <MarkerInfoBox>
          <button className="info_close" onClick={() => setSelectedItem(null)} type="button" title="닫기">
            <X size={17} />
          </button>
          <p className="info_category">{selectedItem.category}</p>
          <p className="info_name">{selectedItem.title}</p>
          <p className="info_address">{selectedItem.region}</p>
          {selectedItem.link && (
            <a href={selectedItem.link} target="_blank" rel="noopener noreferrer">
              상세 페이지 열기
            </a>
          )}
        </MarkerInfoBox>
      )}
    </MapWrapper>
  );
}
