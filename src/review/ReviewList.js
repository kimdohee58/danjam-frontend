import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReviewListModal from './ReviewListModal';
import ReviewCard from "./ReviewCard";
import styled from 'styled-components';
import { PiHandSoapLight } from "react-icons/pi";
import { CiChat1, CiCircleCheck, CiMap, CiShoppingTag } from "react-icons/ci";
import { GoKey } from "react-icons/go";

const Container = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const StatsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 20px 0;
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
    width: 100%;
`;

const OverallRating = styled.div`
    text-align: center;
    font-size: 90px;
    font-weight: bold;
    margin: 0 10px 30px 20px; /* 이미지와 간격 추가 */
    line-height: 1; /* 텍스트 라인 높이를 기본값으로 설정 */
`;

const RatingLabel = styled.div`
    font-size: 18px;
    margin-bottom: 10px;
`;

const StatGrid = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 1200px;
    margin-bottom: 20px;
`;

const StatItem = styled.div`
    flex: 1;
    text-align: left;
    padding: 10px 10px 10px 20px;
    position: relative;

    &:not(:last-child) {
        border-right: 1px solid #ddd;
    }
`;

const StatLabel = styled.div`
    font-size: 14px;
    margin-bottom: 5px;
`;

const StatValue = styled.div`
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const IconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: left;
    margin-top: 30px;
`;

const ReviewListContainer = styled.div`
    max-width: 1200px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;  // 자식요소 가로로 가운데정렬
`;

const ReviewColumn = styled.div`
    flex: 1;
    min-width: 300px;
`;

const StyledImage = styled.img`
    width: 80px; /* 이미지 크기 조정 */
    height: auto;
    object-fit: contain;
`;

const RateContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30px;
    margin-bottom: 10px;
    height: 80px; /* 전체 컨테이너 높이 설정 */
`;

const ReviewList = ({ dormId }) => {
    const [reviews, setReviews] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stats, setStats] = useState();
    const count = 6;

    useEffect(() => {
        getReviews();
    }, []);

    const getReviews = async () => {
        try {
            const resp = await axios.get(`http://localhost:8080/review/${dormId}`, { withCredentials: true });
            if (resp.status === 200) {
                console.log("응답 데이터 확인: ", resp.data);
                setReviews(resp.data.reviews);
                setStats(resp.data.stats);
            } else {
                console.error("리뷰 및 stats 불러오는 도중 오류 발생", resp.status);
            }
        } catch (e) {
            console.error("리뷰 및 stats 불러오는 도중 오류 발생", e);
        }
    };

    useEffect(() => {
        if (reviews.length > 0) {
            console.log("reviews 상태 확인: ", reviews);
        }
    }, [reviews]);

    useEffect(() => {
        if (stats) {
            console.log("stats 상태 확인: ", stats);
        }
    }, [stats]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const half = Math.ceil(reviews.slice(0, count).length / 2);
    const firstHalf = reviews.slice(0, half);
    const secondHalf = reviews.slice(half, count);

    return (
        <Container>
            <StatsContainer>
                <RateContainer>
                    <StyledImage src="/left.png" alt="왼쪽 월계관"/>
                    <OverallRating>{stats?.rateAverage || '0.00'}</OverallRating>
                    <StyledImage src="/right.png" alt="오른쪽 월계관"/>
                </RateContainer>
                <RatingLabel>게스트 선호</RatingLabel>
                <StatGrid>
                    <StatItem>
                        <StatLabel>전체 평점</StatLabel>
                        <StatValue>5점 중 {stats?.overallRating || '0.0'}</StatValue>
                    </StatItem>
                    <StatItem>
                        <StatLabel>청결도</StatLabel>
                        <StatValue>{stats?.cleanliness || '0.0'}</StatValue>
                        <IconContainer>
                            <PiHandSoapLight size={30}/>
                        </IconContainer>
                    </StatItem>
                    <StatItem>
                        <StatLabel>정확도</StatLabel>
                        <StatValue>{stats?.accuracy || '0.0'}</StatValue>
                        <IconContainer>
                            <CiCircleCheck size={30}/>
                        </IconContainer>
                    </StatItem>
                    <StatItem>
                        <StatLabel>체크인</StatLabel>
                        <StatValue>{stats?.checkIn || '0.0'}</StatValue>
                        <IconContainer>
                            <GoKey size={30}/>
                        </IconContainer>
                    </StatItem>
                    <StatItem>
                        <StatLabel>의사소통</StatLabel>
                        <StatValue>{stats?.communication || '0.0'}</StatValue>
                        <IconContainer>
                            <CiChat1 size={30}/>
                        </IconContainer>
                    </StatItem>
                    <StatItem>
                        <StatLabel>위치</StatLabel>
                        <StatValue>{stats?.location || '0.0'}</StatValue>
                        <IconContainer>
                            <CiMap size={30}/>
                        </IconContainer>
                    </StatItem>
                    <StatItem>
                        <StatLabel>가격 대비 만족도</StatLabel>
                        <StatValue>{stats?.value || '0.0'}</StatValue>
                        <IconContainer>
                            <CiShoppingTag size={30}/>
                        </IconContainer>
                    </StatItem>
                </StatGrid>
            </StatsContainer>
            <ReviewListContainer>
                <ReviewColumn>
                    {firstHalf.map(review => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            hasmore='fromList'
                        />
                    ))}
                </ReviewColumn>
                <ReviewColumn>
                    {secondHalf.map(review => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            hasmore='fromList'
                        />
                    ))}
                </ReviewColumn>
            </ReviewListContainer>
            {reviews.length > count && (
                <button onClick={openModal}>후기 {reviews.length}개 모두 보기</button>
            )}
            <ReviewListModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                reviews={reviews}
                stats={stats}
            />
        </Container>
    );
};

export default ReviewList;