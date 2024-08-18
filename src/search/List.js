import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import DormCard from "./DormCard";
import * as dorms from "react-bootstrap/ElementChildren";
import {format} from "date-fns";

function List(props) {
    // 리스트
    const [dorms, setDorms] = useState([])
    const getDorms = async () => {
        // const pageable = {
        //     page: page,
        //     size: size
        // };

        const resp = await axios.get("http://localhost:8080/showAll", {withCredentials: true});
        console.log("데이터 확인", resp.data);

        try {
            if (resp.data.result === 'success') {
                const newDorms = resp.data.dormList;
                setDorms(newDorms);

                // if (resp.data.totalPages) {
                //     setHasMore(false);
                // }
            }
        } catch (e) {
            console.error("호텔 로드 중 오류 발생", e);
        }
    }


    // 위시한테 값 넘겨주기
    // const location = useLocation();
    // let userInfo = location.state.userInfo;
    const navigate = useNavigate();


    const [isWish, setIsWish] = useState(false);
    const toggleWish = async (dormId) => {
        try {
            // 로그인
            // if (!userInfo) {
            //     navigate("/login", { state: { from: location } });
            //     return;
            // }

            setDorms(prevDorms =>
                prevDorms.map(dorm =>
                    dorm.id === dormId
                        ? {...dorm, isWish: !dorm.isWish}
                        : dorm
                )
            );

            const targetDorm = dorms.find(dorm => dorm.id === dormId);

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
                        ? {...dorm, isWish: !dorm.isWish}
                        : dorm
                )
            );
        }
    };

    // 무한스크롤
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const size = 10; // 에어비앤비 기준

    const loadMoreDorms = () => {
        setPage((prevPage) => prevPage + 1);
    }

    useEffect(() => {
        // setPage(1); //페이지 초기화
        // setDorms([]); //호텔 초기화
        getDorms();
    }, []);

    // 호텔 상세보기-옵션 선택 정보 넘기기
    const searchInfo = {
        checkIn: format(new Date(), 'yyyy-MM-dd 15:00:00'),
        checkOut: format(new Date(), 'yyyy-MM-dd 11:00:00'),
        person: 2,
    }

    let moveToDorm = (id) => {
        navigate('dorm/' + id, {state: {searchInfo: searchInfo, userInfo: props.userInfo}})
    }

    return (
        <>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px'}}>
                {dorms.map((dorm) => (
                    <DormCard
                        key={dorm.id}
                        dorm={dorm}
                        isWish={isWish}
                        toggleWish={() => toggleWish(dorm.id)}
                        onClick={() => moveToDorm(dorm.id)}
                    />
                ))}
                {hasMore && (
                    <button onClick={loadMoreDorms} style={{margin: '20px', padding: '10px'}}>
                        더보기
                    </button>
                )}
                {!hasMore && (
                    <p>더 불러올 목록이 없습니다.</p>
                )}
            </div>


        </>
    )
}


export default List

