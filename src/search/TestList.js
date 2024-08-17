import React, { useEffect, useState } from 'react';
import DormCard from './DormCard';
import axios from 'axios';

const DormList = ({filters} = {}) => {


    // 위시한테 값 넘겨주기
    const [isWish, setIsWish] = useState(false);
    const toggleWish = async (dormId) => {
        try {
            setDorms(prevDorms =>
                prevDorms.map(dorm =>
                    dorm.id === dormId
                        ? { ...dorm, isWish: !dorm.isWish }
                        : dorm
                )
            );

            const targetDorm = dorms.find(dorm => dorm.id === dormId);
            /** User 값 받아서 로그인 한 상태면 위시로 넘겨주고, 로그인되지 않았으면 로그인 창으로 넘겨주기
             */
            if (targetDorm.isWish) {
                await axios.delete(`http://localhost:8080/wish/${dormId}`, {withCredentials: true});
            } else {
                await axios.get(`http://localhost:8080/wish/${dormId}`, {}, {withCredentials: true});
            } // 위시리스트 매핑 설정 @영우
        } catch (e) {
            console.error("찜 상태 변경 중 오류 발생", e);
            setDorms(prevDorms =>
                prevDorms.map(dorm =>
                    dorm.id === dormId
                        ? { ...dorm, isWish: !dorm.isWish }
                        : dorm
                )
            );
        }
    };

    // 무한스크롤

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const size = 40; // 에어비앤비 기준

    const loadMoreDorms = () => {
        setPage((prevPage) => prevPage + 1);
    }


    // 호텔 리스트
    const [dorms, setDorms] = useState([]);

    const getDorms = async (page, size, filters = {}) => {
        try {
            const params = {
                page: page,
                size: size
            };

            console.log("검색에서 생성된 params 확인: ", params);

            const resp = await axios.get(`http://localhost:8080/showAll`, params, {withCredentials: true});
            console.log("데이터가 있나요?", resp.data);
            if (resp.data && resp.data.content) {
                const newDorms = resp.data.content;
                setDorms((prevDorms) =>
                    [...prevDorms, ...newDorms]
                );
                if (resp.data.totalPages) {
                    setHasMore(false);
                }
            } else {
                console.error("호텔 로드 중 응답 데이터에 문제 있음", resp.data)
            }

        } catch (e) {
            console.error("호텔 정보 로드 중 오류 발생", e);
        }
    };

    useEffect(() => {
        setPage(1); //페이지 초기화
        setDorms([]) //호텔 초기화
        getDorms(1, size, filters)
    }, [filters]);

    return (
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px'}}>
            {dorms.map((dorm) => (
                <DormCard
                    key={dorm.id}
                    dorm={dorm}
                    isWish={isWish}
                    toggleWish={() => toggleWish(dorm.id)}
                />
            ))}
            {hasMore && (
                <button onClick={loadMoreDorms} style={{margin: '20px', padding: '10px'}}>
                    더보기
                </button>
            )}
            {/* !hasMore 일 경우 마지막 더 불러올 리스트가 없습니다 메시지 추가 */}
        </div>
    );
};

export default DormList;