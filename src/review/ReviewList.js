import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReviewListModal from './ReviewListModal';
import ReviewCard from "./ReviewCard";
import styled from 'styled-components';

const ReviewListContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
`;

const ReviewColumn = styled.div`
    flex: 1;
    min-width: 300px;
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

    /*리턴안에 리뷰가 들어가야하는 공간이 있잖아 디브를 하나 만들어서
    * 그 안에 리뷰 리스트 */
    return (
        <div id={dormId}>
            <h2>리뷰</h2>
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
        </div>
    );
};

export default ReviewList;