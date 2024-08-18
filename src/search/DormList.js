import React, { useEffect, useState } from 'react';
import DormCard from './DormCard';
import axios from 'axios';

const DormList = ({ filters } = {}) => {
    const [isWish, setIsWish] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [dorms, setDorms] = useState([]);
    const size = 40; // Number of items per page

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

            if (targetDorm.isWish) {
                await axios.delete(`http://localhost:8080/wish/${dormId}`, { withCredentials: true });
            } else {
                await axios.get(`http://localhost:8080/wish/${dormId}`, {}, { withCredentials: true });
            }
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

    const loadMoreDorms = () => {
        setPage(prevPage => prevPage + 1);
    };

    const getDorms = async (page, size, filters = {}) => {
        try {
            const params = new URLSearchParams({
                page: page,
                size: size,
                ...(filters.city && { city: filters.city }),
                ...(filters.person && { person: filters.person }),
                ...(filters.minPrice && { minPrice: filters.minPrice }),
                ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
                ...(filters.type && { type: filters.type })
            }).toString();

            const resp = await axios.get(`http://localhost:8080/dorm?${params}`, { withCredentials: true });

            if (resp.data && resp.data.content) {
                const newDorms = resp.data.content;
                setDorms(prevDorms => [...prevDorms, ...newDorms]);
                if (resp.data.totalPages <= page) {
                    setHasMore(false);
                }
            } else {
                console.error("호텔 로드 중 응답 데이터에 문제 있음", resp.data);
            }
        } catch (e) {
            console.error("호텔 정보 로드 중 오류 발생", e);
        }
    };

    useEffect(() => {
        setPage(1); // Reset page to 1
        setDorms([]); // Clear dorms
        getDorms(1, size, filters);
    }, [filters]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', width: '100%' }}>
                {dorms.map(dorm => (
                    <DormCard
                        key={dorm.id}
                        dorm={dorm}
                        isWish={isWish}
                        toggleWish={() => toggleWish(dorm.id)}
                    />
                ))}
            </div>
            <div style={{ marginTop: '20px' }}>
                {hasMore ? (
                    <button
                        onClick={loadMoreDorms}
                        style={{
                            padding: '10px 20px',
                            fontSize: '16px',
                            backgroundColor: '#007BFF',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        더보기
                    </button>
                ) : (
                    <p>마지막 더 불러올 리스트가 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default DormList;
