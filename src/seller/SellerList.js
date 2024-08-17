import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

// Styled Components
const StyledContainer = styled.div`
    margin: 20px auto;
    max-width: 1200px;
    padding: 0 15px;
`;

const Title = styled.h1`
    margin-top: 20px;
    color: #333;
    text-align: center;
`;

const CardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* Set to 4 columns */
    gap: 20px;
    justify-content: center;
    width: 100%;
    box-sizing: border-box;
`;

const StyledCard = styled.div`
    width: 335px;
    height: 450px; /* Increased height to fit content */
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
    background-color: #fff;
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
`;

const CardImage = styled.div`
    width: 335px;
    height: 318px;
    position: relative;
`;

const ImageCarousel = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
`;

const ImageItem = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    transition: opacity 0.5s ease-in-out;
    opacity: ${props => (props.active ? '1' : '0')};
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const CarouselButton = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    border: none;
    padding: 10px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 1;

    ${props => props.left && `
        left: 10px;
    `}

    ${props => props.right && `
        right: 10px;
    `}
`;

const CardBody = styled.div`
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100px; /* Adjust height to fit text and button */
`;

const CardTitle = styled.h3`
    margin-top: 5px;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
`;

const CardText = styled.p`
    font-size: 14px;
    color: #666;
    margin-top: 5px;
    margin-bottom: 0px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const StyledButton = styled.button`
    background-color: #007bff;
    border: none;
    color: #fff;
    font-size: 14px;
    padding: 8px 16px;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s, transform 0.3s;
    width: 100%;
    margin-top: 10px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
        transform: scale(1.05);
    }
`;

const DeleteButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #dc3545;
    border: none;
    color: #fff;
    font-size: 16px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #c82333;
    }
`;

const SellerList = () => {
    const navigate = useNavigate();
    const [dorms, setDorms] = useState([]);
    const [carouselIndexes, setCarouselIndexes] = useState({});

    const location = useLocation();
    const userInfo = location.state?.userInfo;

    const fetchDormList = async () => {
        try {
            const id = userInfo.id;
            const response = await axios.get(`http://localhost:8080/dorm/Sellerlist/${id}`, {
                withCredentials: true
            });
            console.log(response.data);
            const { dormList } = response.data;
            setDorms(dormList);
            // Initialize carousel indexes
            setCarouselIndexes(dormList.reduce((acc, dorm) => {
                acc[dorm.id] = 0;
                return acc;
            }, {}));
        } catch (error) {
            console.error('Error fetching dorms:', error);
        }
    };

    const onRoomInsert = (dormId) => {
        navigate('/room/RInsert/' + dormId, {
            state: { userInfo: userInfo, dormId: dormId }
        });
    };

    const onDormDelete = async (dormId) => {
        // Show confirmation dialog
        const confirmed = window.confirm("해당 단잠을 삭제 하시겠습니까?");
        if (!confirmed) {
            return; // Do nothing if user cancels
        }

        try {
            const response = await axios.delete(`http://localhost:8080/dorm/delete/${dormId}`, {
                withCredentials: true
            });

            if (response.status === 200) {
                alert("Dorm deleted successfully!");
                await fetchDormList(); // Refresh the list after deletion
            } else {
                alert("Failed to delete dorm.");
            }
        } catch (error) {
            alert("An error occurred while deleting the dorm.");
            console.error('Error deleting dorm:', error);
        }
    };

    const handlePrev = (dormId) => {
        setCarouselIndexes((prevIndexes) => {
            const currentIndex = prevIndexes[dormId] || 0;
            const dorm = dorms.find(d => d.id === dormId);
            const newIndex = currentIndex === 0 ? dorm.roomImgNames.length - 1 : currentIndex - 1;
            return { ...prevIndexes, [dormId]: newIndex };
        });
    };

    const handleNext = (dormId) => {
        setCarouselIndexes((prevIndexes) => {
            const currentIndex = prevIndexes[dormId] || 0;
            const dorm = dorms.find(d => d.id === dormId);
            const newIndex = currentIndex === dorm.roomImgNames.length - 1 ? 0 : currentIndex + 1;
            return { ...prevIndexes, [dormId]: newIndex };
        });
    };

    useEffect(() => {
        fetchDormList();
    }, [userInfo.id]);

    const getImageSrc = (imageName) => {
        return `http://localhost:8080/uploads/${imageName}`;
    };

    return (
        <StyledContainer>
            <Title>단잠 리스트 판매자 이름: {userInfo.name}</Title>
            <CardGrid>
                {dorms.map((dorm) => (
                    <StyledCard key={dorm.id}>
                        <CardImage>
                            <ImageCarousel>
                                {dorm.roomImgNames.length > 0 ? (
                                    dorm.roomImgNames.map((imgName, index) => (
                                        <ImageItem key={index} active={index === carouselIndexes[dorm.id]}>
                                            <img
                                                src={getImageSrc(imgName)}
                                                alt={`Slide ${index + 1}`}
                                            />
                                        </ImageItem>
                                    ))
                                ) : (
                                    <ImageItem>
                                        <img
                                            src="path-to-default-image.jpg"
                                            alt="Default"
                                        />
                                    </ImageItem>
                                )}
                                <CarouselButton left onClick={() => handlePrev(dorm.id)}>
                                    &lt;
                                </CarouselButton>
                                <CarouselButton right onClick={() => handleNext(dorm.id)}>
                                    &gt;
                                </CarouselButton>
                            </ImageCarousel>
                            <DeleteButton onClick={() => onDormDelete(dorm.id)}>
                                X
                            </DeleteButton>
                        </CardImage>
                        <CardBody>
                            <CardTitle>{dorm.name}</CardTitle>
                            <CardText>{dorm.address}</CardText>
                            <StyledButton onClick={() => onRoomInsert(dorm.id)}>
                                방추가하기
                            </StyledButton>
                        </CardBody>
                    </StyledCard>
                ))}
            </CardGrid>
        </StyledContainer>
    );
};

export default SellerList;
