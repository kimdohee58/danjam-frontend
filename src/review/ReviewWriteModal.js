import Modal from "react-modal";
import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import StarRating from "./StarRating";

Modal.setAppElement('#root');

const StyledModal = styled(Modal)`
    position: relative;
    width: 600px;
    height: 400px;
    margin-top: 10%;
    margin-left: 30%;
    background: white;
    border-radius: 10px;
    padding: 20px;
    max-height: 90vh;
    overflow-y: auto;
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding-bottom: 5px;
    margin-bottom: 20px;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
`;

const TextArea = styled.textarea`
    width: 95%;
    height: 100px;
    margin-bottom: 20px;
    padding: 15px;
    border-radius: 10px;
    border: 2px solid #ddd;
    font-size: 16px;
    line-height: 1;
    resize: none;
    transition: border-color 0.3s, box-shadow 0.3s;

    &:focus {
        border-color: #2D3543;
        box-shadow: 0 0 10px rgba(35, 44, 62, 0.74);
        outline: none;
    }

    &::placeholder {
        color: #aaa;
    }
`;

const SubmitButton = styled.button`
    background-color: black;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

const StarRatingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
`;

const TagContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.75);
`;

const TagButton = styled.button`
    padding: 10px 15px;
    border-radius: 20px;
    border: 2px solid ${props => (props.$selected ? 'black' : '#ddd')};
    background-color: ${props => (props.$selected ? 'black' : 'white')};
    color: ${props => (props.$selected ? 'white' : 'black')};
    cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
    transition: background-color 0.3s, color 0.3s, border-color 0.3s;
    opacity: ${props => (props.$disabled ? 0.5 : 1)};

    &:hover {
        background-color: ${props => (props.$selected ? 'black' : '#f0f0f0')};
        border-color: ${props => (props.$selected ? 'black' : '#ccc')};
    }
`;

const ReviewWriteModal = ({ isOpen, onRequestClose, bookingId, userId }) => {
    const [content, setContent] = useState('');
    const [rate, setRate] = useState(0);
    const [selectedTags, setSelectedTags] = useState([]);

    const contentChange = (e) => {
        setContent(e.target.value);
    }

    const tags = [
        { id: 1, topic: "위생", name: "위생이 좋아요", type: "P" },
        { id: 2, topic: "위생", name: "위생이 나빠요", type: "N" },
        { id: 3, topic: "소통", name: "소통이 잘돼요", type: "P" },
        { id: 4, topic: "소통", name: "소통이 안돼요", type: "N" },
        { id: 5, topic: "위치", name: "위치가 좋아요", type: "P" },
        { id: 6, topic: "위치", name: "위치가 별로예요", type: "N" },
        { id: 7, topic: "정보", name: "정보가 정확해요", type: "P" },
        { id: 8, topic: "정보", name: "정보와 달라요", type: "N" },
        { id: 9, topic: "체크인", name: "체크인이 수월해요", type: "P" },
        { id: 10, topic: "체크인", name: "체크인이 불편해요", type: "N" },
        { id: 11, topic: "가격", name: "가격대비 만족해요", type: "P" },
        { id: 12, topic: "가격", name: "가격대비 불만족해요", type: "N" },
        { id: 13, topic: "친절", name: "친절해요", type: "P" },
        { id: 14, topic: "친절", name: "불친절해요", type: "N" }
    ];

    const handleTagClick = (clickedTag) => {
        const conflictingTag = selectedTags.find((tag) =>
            tag.topic === clickedTag.topic && tag.type !== clickedTag.type);

        if (conflictingTag) {
            setSelectedTags(selectedTags.filter((tag) =>
                tag.id !== conflictingTag.id));
        }

        if (selectedTags.some(tag => tag.id === clickedTag.id)) {
            setSelectedTags(selectedTags.filter((tag) =>
                tag.id !== clickedTag.id));
        } else {
            setSelectedTags([...selectedTags, clickedTag]);
        }
    };

    const handleSubmit = async () => {
        try {
            const requestBody = {
                review: {
                    content: content,
                    rate: rate,
                    booking_id: bookingId,
                    user_id: userId
                },
                tags: selectedTags.map(tag => tag.id)
            };

            const resp = await axios.post(`${process.env.REACT_APP_API_SERVER_URL}/review/write`, requestBody, {
                withCredentials: true
            });

            console.log("등록 리뷰 확인: ", resp.data, requestBody);
            onRequestClose();
        } catch (e) {
            console.error("리뷰 등록 중 오류 발생", e);
        }
    };

    const handleRateChange = (newRate) => {
        setRate(newRate);
    };

    return (
        <StyledModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="리뷰 작성"
            overlayClassName="ReviewModalOverlay"
            overlayElement={(props, contentElement) => <Overlay {...props}>{contentElement}</Overlay>}
        >
            <ModalHeader>
                <p>리뷰 작성</p>
                <CloseButton onClick={onRequestClose}><FaTimes /></CloseButton>
            </ModalHeader>
            <StarRatingContainer>
                <StarRating width={30} size={30} rate={rate} onRateChange={handleRateChange} />
                <p>현재 별점 (0.5 ~ 5.0) : {rate.toFixed(1)}</p>
            </StarRatingContainer>
            <TextArea
                value={content}
                onChange={contentChange}
                placeholder="리뷰를 작성하세요..."
            />
            <TagContainer>
                {tags.map(tag => {
                    const isSelected = selectedTags.includes(tag);
                    const conflictingTag = selectedTags.find(
                        selectedTag => selectedTag.topic === tag.topic && selectedTag.type !== tag.type
                    );

                    return (
                        <TagButton
                            key={tag.id}
                            $selected={isSelected}
                            $disabled={conflictingTag && !isSelected}
                            onClick={() => !conflictingTag && handleTagClick(tag)}
                        >
                            {tag.name}
                        </TagButton>
                    );
                })}
            </TagContainer>
            <SubmitButton onClick={handleSubmit}>제출</SubmitButton>
            <button onClick={onRequestClose}>닫기</button>
        </StyledModal>
    );
};

export default ReviewWriteModal;