import React, {useEffect, useState} from 'react';
import WishButton from './WishButton';
import {FaStar} from "react-icons/fa";
import styled from "styled-components";
import {IoIosArrowDropleft, IoIosArrowDropright} from "react-icons/io";
import {useNavigate} from "react-router-dom";

const CardContainer = styled.div`
    position: relative;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    width: 250px;
`;

const ImageContainer = styled.div`
    position: relative;
    width: 100%;
    height: 150px;

    &:hover .nav-button {
        opacity: 1;
    }
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const NavButton = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: white;
    background: none;
    border: none;
    font-size: 30px;
    cursor: pointer;
    padding: 0;
    opacity: 0;
    transition: opacity 0.3s;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

    &:hover {
        opacity: 1;
    }

    ${(props) => props.left && `
    left: 10px;
  `}

    ${(props) => props.right && `
    right: 10px;
  `}
`;

const InfoContainer = styled.div`
    padding: 15px;
    padding-top: 5px;
`;

const DormCard = ({dorm, isWish, toggleWish}) => {
    const maxLength = 30;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const images = dorm.room.images || [];
    let navigate = useNavigate();

    const moveToDorm = () => {
        navigate('dorm/' + dorm.id)
    };

    const nextImage = (e) => {
        e.stopPropagation(); // 부모로의 이벤트 전파 방지
        setCurrentImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = (e) => {
        e.stopPropagation(); // 부모로의 이벤트 전파 방지
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <CardContainer onClick={moveToDorm}>
            <ImageContainer
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {images.length > 0 ? (
                    <Image src={'http://localhost:8080/uploads/' + images[currentImageIndex].name + '.' + images[currentImageIndex].ext} alt={`룸이미지 ${currentImageIndex + 1}`}/>
                ) : (
                    <Image src="/호텔샘플.png" alt="기본 이미지"/>
                )}
                {images.length > 1 && (
                    <>
                        <NavButton left onClick={prevImage} className="nav-button">
                            <IoIosArrowDropleft />
                        </NavButton>
                        <NavButton right onClick={nextImage} className="nav-button">
                            <IoIosArrowDropright />
                        </NavButton>
                    </>
                )}
                <WishButton isWish={isWish} toggleWish={toggleWish}/>
            </ImageContainer>
            <InfoContainer>
                <h3 style={{margin: '5px 0'}}>{dorm.name}</h3>
                {dorm.description.length > maxLength
                    ? dorm.description.slice(0, maxLength) + "..."
                    : dorm.description.content}
                <div>
                    <span style={{color: '#e53935', marginLeft: '10px'}}>{dorm.room.price} 원</span>
                </div>
                <div style={{color: '#fbc02d'}}>
                    <FaStar/> {dorm.rate}
                </div>
            </InfoContainer>
        </CardContainer>
    );
};

export default DormCard;
