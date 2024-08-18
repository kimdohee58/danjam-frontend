import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DormCard from "./DormCard";
import { format } from "date-fns";
import styled from "styled-components";

const LoadMoreButton = styled.button`
    margin: 20px auto;
    padding: 10px 20px;
    display: block;
    text-align: center;
    background-color: black;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    cursor: pointer;

    &:hover {
        background-color: #333;
    }

    &:active {
        background-color: #111;
    }

    &:focus {
        outline: none;
    }
`;

const ListContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
`;

function List(props) {
    const [dorms, setDorms] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const size = 15;

    const location = useLocation();
    const userInfo = location.state?.userInfo || {};
    const navigate = useNavigate();
    const [wishList, setWishList] = useState([]);

    const loadMoreDorms = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const getDorms = async (reset = false) => {
        const pageable = {
            page: page,
            size: size,
        };

        try {
            const resp = await axios.get("http://localhost:8080/showAll", {
                params: pageable,
                withCredentials: true,
            });

            console.log("데이터 확인", resp.data);

            if (resp.data.result === 'success') {
                const newDorms = resp.data.dormList.content.map(dorm => ({
                    ...dorm,
                    isWish: wishList.includes(dorm.id), // 위시리스트에 포함된 도미토리는 isWish를 true로 설정
                }));

                const allDormsNull = newDorms.every(dorm => dorm.id == null);

                if (reset) {
                    setDorms(newDorms);
                } else {
                    setDorms(prevDorms => [...prevDorms, ...newDorms]);
                }

                if (newDorms.length < size || allDormsNull) {
                    setHasMore(false);
                }
            }

        } catch (e) {
            console.error("호텔 로드 중 오류 발생", e);
        }
    };

    const getWishList = async () => {
        if (userInfo.id != null) {
            try {
                const resp = await axios.get(`http://localhost:8080/wishes/wish/${userInfo.id}`, {
                    withCredentials: true,
                });
                console.log("위시리스트 성공적으로 로드: ", resp.data);
                const dormIds = resp.data.map(wish => wish.dormId);
                setWishList(dormIds);

            } catch (e) {
                console.error("위시리스트 가져오는 도중 오류 발생", e);
            }
        }
    };

    const toggleWish = async (dormId) => {
        try {
            if (!userInfo) {
                navigate("/login", { state: { from: location } });
                return;
            }

            const updatedDorms = dorms.map(dorm =>
                dorm.id === dormId
                    ? { ...dorm, isWish: !dorm.isWish }
                    : dorm
            );

            setDorms(updatedDorms);

            const targetDorm = dorms.find(dorm => dorm.id === dormId);

            console.log("targetDorm?: " + targetDorm.isWish)

            if (targetDorm.isWish) {
                await axios.delete(`http://localhost:8080/wishes/${userInfo.id}/${dormId}`, { withCredentials: true });

            } else {
                await axios.post(`http://localhost:8080/wishes/${userInfo.id}/${dormId}`, {}, { withCredentials: true });
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

    useEffect(() => {
        if (userInfo?.id) {
            setPage(0);
            setDorms([]);
            setHasMore(true); // 페이지 번호, 리스트, 더보기 초기화
            getWishList();
        }
    }, [userInfo]);

    // 페이지나 위시리스트가 변경될 때 도미토리 로드
    useEffect(() => {
        if (page === 0) {
            getDorms(true);
        } else {
            getDorms();
        }
    }, [wishList, page]);

    useEffect(() => {
        // 사용자가 로그아웃했을 때 리스트 초기화 및 isWish 상태 초기화
        if (!userInfo?.id) {
            const resetDorms = dorms.map(dorm => ({
                ...dorm,
                isWish: false // 모든 도미토리의 isWish를 false로 설정
            }));
            setDorms(resetDorms);
        }
    }, [userInfo]);

    const searchInfo = {
        checkIn: format(new Date(), 'yyyy-MM-dd 15:00:00'),
        checkOut: format(addDays(new Date(), 1), 'yyyy-MM-dd 11:00:00'),
        person: 2,
    };

    const moveToDorm = (id) => {
        navigate('dorm/' + id, { state: { searchInfo: searchInfo, userInfo: props.userInfo } });
    };

    return (
        <>
            <ListContainer>
                {dorms.map((dorm) => (dorm.id && (
                        <DormCard
                            key={dorm.id}
                            dorm={dorm}
                            isWish={dorm.isWish}
                            toggleWish={() => toggleWish(dorm.id)}
                            goToDorm={() => moveToDorm(dorm.id)}
                        />)
                ))}
            </ListContainer>

            {hasMore && (
                <LoadMoreButton onClick={loadMoreDorms}>
                    더보기
                </LoadMoreButton>
            )}
            {!hasMore && (
                <p>더 불러올 목록이 없습니다.</p>
            )}
        </>
    );
}

export default List;