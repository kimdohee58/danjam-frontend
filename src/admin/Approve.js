import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {Container, Row, Col, Card, Button} from 'react-bootstrap';
import axios from 'axios';
import styled from 'styled-components';

// Styled Components
const StyledContainer = styled(Container)`
    margin-top: 20px;
`;

const Title = styled.h1`
    margin-top: 20px;
    color: #333;
    text-align: center;
`;

const ApproveButton = styled(Button)`
    margin-top: 20px;
    background-color: #007bff; /* Primary blue color */
    border: none;
    color: #fff;
    font-size: 16px;
    padding: 10px 20px;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s, transform 0.3s;

    &:hover {
        background-color: #0056b3; /* Darker blue for hover effect */
        transform: scale(1.05); /* Slightly enlarge button on hover */
    }

    &:disabled {
        background-color: #6c757d; /* Grey color for disabled state */
        cursor: not-allowed;
    }
`;

const NoDormsMessage = styled.div`
    text-align: center;
    margin-top: 50px;
    color: #666;
`;

const DormCard = styled(Card)`
    margin-bottom: 20px;
    border: 1px solid #ddd;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;

    &.selected {
        border-color: #007bff;
        box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
    }

    &:hover {
        transform: scale(1.05);
    }
`;

const ImageContainer = styled.div`
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    width: 100%;
    height: 200px;
`;

const DormImage = styled.img`
    height: 100%;
    object-fit: cover;
    margin-right: 10px;
    flex-shrink: 0;
`;

const CardBody = styled(Card.Body)`
    text-align: center;
`;

const CardTitle = styled(Card.Title)`
    font-size: 18px;
    font-weight: bold;
    margin-top: 10px;
`;

const CardText = styled(Card.Text)`
    font-size: 14px;
    color: #666;
    margin-top: 10px;
`;

const Approve = () => {
    const [dorms, setDorms] = useState([]);
    const [selectedDorms, setSelectedDorms] = useState(new Set());

    const location = useLocation();
    const userInfo = location.state?.userInfo;

    // Fetch dorm list function
    const fetchDormList = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_SERVER_URL}/dorm/Approvelist`, {
                withCredentials: true
            });
            const { dormList } = response.data;
            setDorms(dormList);
        } catch (error) {
            console.error('Error fetching dorms:', error);
        }
    };

    const toggleSelection = (dormId) => {
        setSelectedDorms((prevSelectedDorms) => {
            const newSelectedDorms = new Set(prevSelectedDorms);
            if (newSelectedDorms.has(dormId)) {
                newSelectedDorms.delete(dormId);
            } else {
                newSelectedDorms.add(dormId);
            }
            return newSelectedDorms;
        });
    };

    const Send = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_SERVER_URL}/dorm/Update`, Array.from(selectedDorms), {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            alert('Response:', response.data);
            fetchDormList();
        } catch (error) {
            alert('Error:', error);
        }
    };

    useEffect(() => {
        fetchDormList();
    }, [userInfo.id]);

    const getImageSrc = (imageName) => {
        return `${process.env.REACT_APP_API_SERVER_URL}/uploads/${imageName}`;
    };

    return (
        <StyledContainer>
            <Title>{userInfo.name}님 admin 승인 리스트</Title>

            <ApproveButton
                onClick={() => selectedDorms.size > 0 && Send()}
                disabled={selectedDorms.size === 0}
            >
                Approve
            </ApproveButton>

            <hr />

            {/* 데이터가 없을 때 메시지 표시 */}
            {dorms.length === 0 ? (
                <NoDormsMessage>
                    <h3>현재 승인 대기 중인 숙소가 없습니다.</h3>
                    <p>승인할 숙소가 추가될 때까지 기다려 주세요.</p>
                </NoDormsMessage>
            ) : (
                <Row>
                    {dorms.map((dorm) => (
                        <Col md={4} lg={3} key={dorm.id}>
                            <DormCard
                                onClick={() => toggleSelection(dorm.id)}
                                className={selectedDorms.has(dorm.id) ? 'selected' : ''}
                            >
                                <ImageContainer>
                                    {dorm.roomImgNames.length > 0 ? (
                                        dorm.roomImgNames.map((imgName, index) => (
                                            <DormImage
                                                key={index}
                                                src={getImageSrc(imgName)}
                                                alt={`Dorm ${dorm.id} Image ${index + 1}`}
                                            />
                                        ))
                                    ) : (
                                        <DormImage
                                            src="path-to-default-image.jpg"
                                            alt="Default"
                                        />
                                    )}
                                </ImageContainer>
                                <CardBody>
                                    <CardTitle>{dorm.name}</CardTitle>
                                    <CardText>{dorm.description}</CardText>
                                </CardBody>
                            </DormCard>
                        </Col>
                    ))}
                </Row>
            )}
        </StyledContainer>
    );
};

export default Approve;
