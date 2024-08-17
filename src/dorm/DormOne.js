import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { Button, Col, Row, Carousel, Card } from 'react-bootstrap';
import ReviewList from "../review/ReviewList";

// Polly Pocket 테마 색상
const colors = {
    primary: '#FFB6C1', // 연한 핑크
    secondary: '#FFD700', // 밝은 금색
    background: '#FFF0F5', // 라벤더 블러쉬
    text: '#FF69B4', // 핫핑크
    button: '#FF69B4', // 버튼 색상
    buttonHover: '#FF1493', // 버튼 호버 색상
};

// 스타일드 컴포넌트
const StyledContainer = styled.div`
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
    background-color: ${colors.background};
    border-radius: 20px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
    text-align: center;
    margin: 40px 0;
    font-weight: bold;
    color: ${colors.text};
    font-family: 'Comic Sans MS', cursive, sans-serif;
`;

const DetailsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 10px 20px;
    padding: 10px 0;
    border-bottom: 1px solid ${colors.primary};

    &:last-child {
        border-bottom: none;
    }
`;

const Label = styled.div`
    font-weight: bold;
    color: ${colors.text};
`;

const Value = styled.div`
    color: ${colors.primary};
`;

const ButtonGroup = styled.div`
    text-align: center;
    margin-top: 40px;
`;

const StyledCarousel = styled(Carousel)`
    margin-top: 20px;
    .carousel-control-prev-icon,
    .carousel-control-next-icon {
        filter: invert(100%);
    }
`;

const CarouselImage = styled.img`
    height: 350px;
    object-fit: cover;
    border-radius: 20px;
`;

const MapContainer = styled.div`
    width: 100%;
    height: 450px;
    border-radius: 20px;
    position: relative;
    margin-top: 20px;
    background-color: ${colors.primary};
`;

const MapControls = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
`;

const RoomList = styled.div`
    margin-top: 40px;
`;

const RoomCard = styled(Card)`
    border-radius: 20px;
    height: 100%;
    border: 2px solid ${colors.primary};
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const RoomCardImage = styled(Card.Img)`
    height: 180px;
    object-fit: cover;
    border-radius: 20px 20px 0 0;
`;

const RoomCardBody = styled(Card.Body)`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const StyledButton = styled(Button)`
    background-color: ${colors.button}; 
    border: none;
    color: white;
    padding: 12px 24px;
    font-size: 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    margin-top: 10px;
    border-radius: 20px;
    transition: background-color 0.3s, transform 0.3s;

    &:hover {
        background-color: ${colors.buttonHover};
        transform: translateY(-2px);
    }

    &:active {
        background-color: ${colors.buttonHover};
        transform: translateY(0);
    }
`;

const DormDetails = (props) => {
    const [dorm, setDorm] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [user, setUser] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dormResponse = await axios.get(`http://localhost:8080/dorms/${id}`);

                if (dormResponse.data.result === 'success') {
                    setDorm(dormResponse.data);
                    setRooms(dormResponse.data.rooms);
                } else {
                    console.error('숙소 정보를 가져오는 데 실패했습니다.');
                }

                const userResponse = await axios.get(`http://localhost:8080/users/1`);
                if (userResponse.status === 200) {
                    setUser(userResponse.data);
                } else {
                    console.error('유저 정보를 가져오는 데 실패했습니다.');
                }
            } catch (error) {
                console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (dorm) {
            const script = document.createElement('script');
            script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=14ff642a02cda637b2dfce4e7985dbf7&libraries=services";
            script.async = true;

            script.onload = () => {
                if (window.kakao && window.kakao.maps) {
                    const mapContainer = document.getElementById('map');
                    const mapOption = {
                        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                        level: 3
                    };
                    const map = new window.kakao.maps.Map(mapContainer, mapOption);

                    const geocoder = new window.kakao.maps.services.Geocoder();
                    geocoder.addressSearch(dorm.address, function (result, status) {
                        if (status === window.kakao.maps.services.Status.OK) {
                            const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                            map.setCenter(coords);
                            new window.kakao.maps.Marker({
                                map: map,
                                position: coords
                            });
                        } else {
                            console.error('주소 검색 실패:', status);
                        }
                    });

                    const zoomInBtn = document.getElementById('btnZoomIn');
                    const zoomOutBtn = document.getElementById('btnZoomOut');

                    if (zoomInBtn && zoomOutBtn) {
                        zoomInBtn.addEventListener('click', () => map.setLevel(map.getLevel() - 1));
                        zoomOutBtn.addEventListener('click', () => map.setLevel(map.getLevel() + 1));
                    } else {
                        console.error('버튼 요소를 찾을 수 없습니다.');
                    }
                } else {
                    console.error('카카오 맵 객체를 로드하는 데 실패했습니다.');
                }
            };

            script.onerror = () => {
                console.error('카카오 맵 API 스크립트 로드 실패. 브라우저 캐시를 지우고 새로고침을 시도하세요.');
            };

            if (!document.querySelector(`script[src="${script.src}"]`)) {
                document.head.appendChild(script);
            } else {
                console.log('이미 스크립트가 로드되었습니다.');
            }
        }
    }, [dorm]);

    if (!dorm || !user) {
        return <div>로딩 중...</div>;
    }

    const handleBooking = (room) => {
        const bookingInfo = {
            user: {
                email: user.email,
                name: user.name,
                phoneNumber: user.phoneNum
            }
        };
        navigate(`/bookings/${user.id}?dormName=${encodeURIComponent(dorm.name)}&roomId=${room.id}&person=${room.person}&checkIn=${room.checkIn}&checkOut=${room.checkOut}&roomImg=${room.img}&reviewAvg=${room.reviewAvg}&price=${room.price}&email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name)}&phoneNumber=${user.phoneNumber}`, {
            state: { bookingInfo: bookingInfo, userInfo: props.userInfo }
        });
    };

    return (
        <StyledContainer>
            <Row className="justify-content-center">
                <Col xs={12} md={10} lg={8}>
                    <Title>호텔 상세 정보</Title>

                    {/* Details Grid */}
                    <DetailsGrid>
                        <Label>이름:</Label>
                        <Value>{dorm.name}</Value>
                    </DetailsGrid>
                    <DetailsGrid>
                        <Label>설명:</Label>
                        <Value>{dorm.description}</Value>
                    </DetailsGrid>
                    <DetailsGrid>
                        <Label>연락처:</Label>
                        <Value>{dorm.contactNum}</Value>
                    </DetailsGrid>
                    <DetailsGrid>
                        <Label>도시:</Label>
                        <Value>{dorm.city}</Value>
                    </DetailsGrid>
                    <DetailsGrid>
                        <Label>구/읍:</Label>
                        <Value>{dorm.town}</Value>
                    </DetailsGrid>
                    <DetailsGrid>
                        <Label>주소:</Label>
                        <Value>{dorm.address}</Value>
                    </DetailsGrid>

                    <ButtonGroup>
                        <Button variant="secondary" onClick={() => window.history.back()} style={{marginRight: '10px'}}>뒤로 가기</Button>
                    </ButtonGroup>

                    <h2 style={{fontWeight: 'bold', marginTop: '20px', color: colors.text}}>Images</h2>
                    <StyledCarousel interval={3000} indicators={false}>
                        {dorm.dormImages && dorm.dormImages.length > 0 ? (
                            dorm.dormImages.map((imgName, index) => (
                                <Carousel.Item key={index}>
                                    <CarouselImage
                                        src={`http://localhost:8080/uploads/${imgName}`}
                                        alt={`Slide ${index + 1}`}
                                    />
                                </Carousel.Item>
                            ))
                        ) : (
                            <Carousel.Item>
                                <CarouselImage
                                    src="/default-placeholder-image.jpg"
                                    alt="No image available"
                                />
                            </Carousel.Item>
                        )}
                    </StyledCarousel>

                    <h3 style={{ fontWeight: 'bold', color: colors.text, marginTop: '40px' }}>호텔 위치</h3>
                    <MapContainer id="map">
                        <MapControls>
                            <Button id="btnZoomIn" variant="outline-primary">+</Button>
                            <Button id="btnZoomOut" variant="outline-primary">-</Button>
                        </MapControls>
                    </MapContainer>

                    {/* 리뷰 섹션 */}
                    <ReviewList dormId={id} domrmId="review-section" />

                    <RoomList>
                        <h3 className="my-4" style={{ fontWeight: 'bold', color: colors.text }}>방 정보</h3>
                        <Row>
                            {rooms && rooms.length > 0 ? (
                                rooms.map((room, index) => (
                                    <Col md={4} key={index} className="mb-4">
                                        <RoomCard>
                                            <RoomCardImage
                                                variant="top"
                                                src={`http://localhost:8080/uploads/${room.name}`}
                                                alt={room.name}
                                            />
                                            <RoomCardBody>
                                                <Card.Title style={{ fontWeight: 'bold', color: colors.text }}>{room.name}</Card.Title>
                                                <Card.Text style={{ color: colors.primary }}>{room.description}</Card.Text>
                                                <Card.Text style={{ color: colors.primary }}><strong>가격:</strong> {room.price.toLocaleString()} 원/박</Card.Text>
                                                <StyledButton variant="primary" onClick={() => handleBooking(room)}>예약하기</StyledButton>
                                            </RoomCardBody>
                                        </RoomCard>
                                    </Col>
                                ))
                            ) : (
                                <p style={{ color: colors.text }}>이 호텔에는 방 정보가 없습니다.</p>
                            )}
                        </Row>
                    </RoomList>
                </Col>
            </Row>
        </StyledContainer>
    );
};

export default DormDetails;
