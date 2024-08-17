import React, { useEffect } from 'react';

const KakaoMap = ({ latitude, longitude }) => {
    useEffect(() => {
        const { kakao } = window;

        const container = document.getElementById('map'); // 지도를 표시할 div
        const options = {
            center: new kakao.maps.LatLng(latitude, longitude), // 숙소의 중심좌표
            level: 3, // 지도의 확대 레벨
        };

        const map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴

        // 마커 생성
        const markerPosition = new kakao.maps.LatLng(latitude, longitude);
        const marker = new kakao.maps.Marker({
            position: markerPosition
        });
        marker.setMap(map); // 마커를 지도에 표시

        // 지도 타입 변경 함수
        const setMapType = (maptype) => {
            if (maptype === 'roadmap') {
                map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
            } else {
                map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);
            }
        };

        // 지도 확대 함수
        const zoomIn = () => {
            map.setLevel(map.getLevel() - 1);
        };

        // 지도 축소 함수
        const zoomOut = () => {
            map.setLevel(map.getLevel() + 1);
        };

        // 버튼 이벤트에 함수 연결
        document.getElementById('btnRoadmap').addEventListener('click', () => setMapType('roadmap'));
        document.getElementById('btnSkyview').addEventListener('click', () => setMapType('skyview'));
        document.getElementById('btnZoomIn').addEventListener('click', zoomIn);
        document.getElementById('btnZoomOut').addEventListener('click', zoomOut);

    }, [latitude, longitude]);

    return (
        <div>
            <div id="map" style={{ width: '500px', height: '400px' }}></div>
            <div>
                <button id="btnRoadmap">로드맵</button>
                <button id="btnSkyview">스카이뷰</button>
                <button id="btnZoomIn">확대</button>
                <button id="btnZoomOut">축소</button>
            </div>
        </div>
    );
};

export default KakaoMap;
