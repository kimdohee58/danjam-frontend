import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DormCard from "./DormCard";
import { format } from "date-fns";

function List(props) {
    const [dorms, setDorms] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const size = 10; // Number of items per page

    const navigate = useNavigate();

    const getDorms = async () => {
        try {
            const resp = await axios.get(`http://localhost:8080/showAll?page=${page}&size=${size}`, { withCredentials: true });
            if (resp.data.result === 'success') {
                const newDorms = resp.data.dormList;
                setDorms(prevDorms => [...prevDorms, ...newDorms]);
                setHasMore(newDorms.length === size);
            }
        } catch (e) {
            console.error("Error loading dorms", e);
        }
    };

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
            console.error("Error toggling wish status", e);
            setDorms(prevDorms =>
                prevDorms.map(dorm =>
                    dorm.id === dormId
                        ? { ...dorm, isWish: !dorm.isWish }
                        : dorm
                )
            );
        }
    };

    useEffect(() => {
        getDorms();
    }, [page]);

    const searchInfo = {
        checkIn: format(new Date(), 'yyyy-MM-dd 15:00:00'),
        checkOut: format(new Date(), 'yyyy-MM-dd 11:00:00'),
        person: 2,
    };

    const moveToDorm = (id) => {
        navigate('dorm/' + id, { state: { searchInfo: searchInfo, userInfo: props.userInfo } });
    };

    return (
        <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '60px' }}>
                {dorms.map(dorm => (
                    <DormCard
                        key={dorm.id}
                        dorm={dorm}
                        isWish={dorm.isWish}
                        toggleWish={() => toggleWish(dorm.id)}
                        onClick={() => moveToDorm(dorm.id)}
                    />
                ))}
            </div>
            <div style={{ textAlign: 'center', position: 'sticky', bottom: 0, backgroundColor: 'white', padding: '10px 0' }}>
                {hasMore ? (
                    <button
                        onClick={() => setPage(prevPage => prevPage + 1)}
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
                    <p>더 불러올 목록이 없습니다.</p>
                )}
            </div>
        </>
    );
}

export default List;
