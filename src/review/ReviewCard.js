import {useState} from "react";
import ReviewListModal from "./ReviewListModal";
import StarRating from "./StarRating";
import styled from "styled-components";

const ReviewCardContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 16px;
    border-radius: 8px;
    max-width: 700px;
    background-color: white;
    margin-bottom: 20px;
`;

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 8px;
`;

const UserName = styled.p`
    font-weight: bold;
    margin: 0;
`;

const ReviewDetails = styled.div`
    display: flex;
    align-items: center;
`;

const ReviewDate = styled.p`
    color: #777;
    font-size: 14px;
    margin-left: 8px;
`;

const ReviewContent = styled.p`
    margin-top: 12px;
    line-height: 1.4;
`;

const MoreButton = styled.button`
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
    padding: 0;
    font-size: 14px;
    margin-top: 8px;
`;

const ReviewCard = ({review, from = {}}) => {

    const maxLength = 70;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
            <ReviewCardContainer>
                <UserInfo>
                        <UserName>{review.username}</UserName>
                        <ReviewDate>{review.createdAt}</ReviewDate>
                </UserInfo>
                <ReviewDetails>
                    <StarRating rate={review.rate}/>
                    <span>{review.rate}</span>
                </ReviewDetails>
                <ReviewContent>
                    <p>{review.email}</p>
                    {review.content.length > maxLength
                    ? review.content.slice(0, maxLength) + "..."
                    : review.content}
                    {from === 'fromList' && review.content.length > maxLength && (
                        <MoreButton onClick={openModal}>더보기</MoreButton>
                    )}
                    {isModalOpen && (
                        <ReviewListModal from='fromModal' review={review} closeModal={closeModal} />
                    )}
                </ReviewContent>
            </ReviewCardContainer>
    );
};

export default ReviewCard;