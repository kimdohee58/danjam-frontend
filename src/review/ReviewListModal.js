import React from 'react';
import Modal from 'react-modal';
import StarRating from "./StarRating";
import styled from "styled-components";
import {FaTimes} from "react-icons/fa";
import ReviewCard from "./ReviewCard";
import {IoKeyOutline} from "react-icons/io5";
import {MdOutlineCleanHands} from "react-icons/md";
import {CiCircleCheck, CiShoppingTag, CiChat1, CiMap} from "react-icons/ci";
import {FaRegCircleCheck} from "react-icons/fa6";
import {IoMdPin} from "react-icons/io";
import {SlSpeech} from "react-icons/sl";
import {PiHandSoapLight} from "react-icons/pi";
import {GoKey} from "react-icons/go";

Modal.setAppElement('#root');

const StyledModal = styled(Modal)`
    position: relative;
    top: 10%;
    width: 80%;
    max-width: 1000px;
    margin: auto;
    background: white;
    border-radius: 20px;
    padding: 20px;
    overflow-y: auto;
    max-height: 90vh;
    flex-direction: row;
    display: flex;
`;

const LeftPanel = styled.div`
    flex: 1;
    padding: 20px;
    border-right: 1px solid #ddd;
`;

const RightPanel = styled.div`
    flex: 2;
    padding: 20px;
    overflow-y: auto;
    max-height: 70vh;
`;


const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.75);
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
`;

const ModalBody = styled.div`
    padding-top: 10px;
`;

const ReviewItem = styled.div`
    margin-bottom: 20px;
`;

const ReviewContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const RatingLabel = styled.div`
    font-size: 15px;
    flex: 1;
`;

const RatingValue = styled.div`
    font-weight: bold;
    font-size: 15px;
`;

const RatingTitle = styled.div`
    font: bold 3rem 'arial';
    margin-bottom: 20px;
    text-align: center;
    line-height: 1;
`;

const RatingItem = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    font-size: 1.2rem;
    align-items: center;
`;

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    height: 100px;line-height: 1;
`;

const StyledImage = styled.img`
    width: 20%;
    max-height: 100%;
    object-fit: contain;
`;




const ReviewListModal = ({isOpen, onRequestClose, reviews, stats, from = {}}) => {

    console.log("모달 stats 확인: ", stats);

    return (
        <StyledModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Review Modal"
            overlayClassName="ReviewModalOverlay"
            overlayElement={(props, contentElement) => <Overlay {...props}>{contentElement}</Overlay>}
        >
            <LeftPanel>
                <TitleContainer>
                    <StyledImage src="/left.png" alt="왼쪽 월계관"/>
                    <RatingTitle>{stats ? stats.rateAverage : "리뷰없음"}</RatingTitle>
                    <StyledImage src="/right.png" alt="오른쪽 월계관"/>
                </TitleContainer>
                <RatingItem>
                    <PiHandSoapLight size={25} style={{marginRight: '8px'}}/>
                    <RatingLabel>청결도</RatingLabel>
                    <RatingValue>{stats ? stats.cleanliness : "N/A"}</RatingValue>
                </RatingItem>
                <RatingItem>
                    <CiCircleCheck size={25} style={{ marginRight: '8px' }}/>
                    <RatingLabel>정확도</RatingLabel>
                    <RatingValue>{stats ? stats.accuracy : "N/A"}</RatingValue>
                </RatingItem>
                <RatingItem>
                    <GoKey size={25} style={{ marginRight: '8px' }}/>
                    <RatingLabel> 체크인 </RatingLabel>
                    <RatingValue>{stats ? stats.checkIn : "N/A"}</RatingValue>
                </RatingItem>
                <RatingItem>
                    <CiChat1 size={25} style={{ marginRight: '8px' }}/>
                    <RatingLabel>의사소통</RatingLabel>
                    <RatingValue>{stats ? stats.communication : "N/A"}</RatingValue>
                </RatingItem>
                <RatingItem>
                    <CiMap size={25} style={{ marginRight: '8px' }}/>
                    <RatingLabel>위치</RatingLabel>
                    <RatingValue>{stats ? stats.location : "N/A"}</RatingValue>
                </RatingItem>
                <RatingItem>
                    <CiShoppingTag size={25} style={{ marginRight: '8px' }}/>
                    <RatingLabel>가격 대비 만족도</RatingLabel>
                    <RatingValue>{stats ? stats.costEffectiveness : "N/A"}</RatingValue>
                </RatingItem>
            </LeftPanel>
            <RightPanel>
                <ModalHeader>
                    <h2>후기 {reviews.length}개</h2>
                    <CloseButton onClick={onRequestClose} className="close-button"><FaTimes/></CloseButton>
                </ModalHeader>
                <ModalBody>
                    {reviews.map(review => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                        />
                    ))}
                </ModalBody>
            </RightPanel>
        </StyledModal>
    );
};
export default ReviewListModal;