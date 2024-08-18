import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { Button, Col, Row } from 'react-bootstrap';
import ReviewList from "../review/ReviewList";

// Polly Pocket 테마 색상
const colors = {
    primary: '#FFB6C1',
    secondary: '#FFD700',
    background: '#FFF0F5',
    text: '#FF69B4',
    button: '#FF69B4',
    buttonHover: '#FF1493',
    buttonActive: '#FF69B4',
};

// 스타일드 컴포넌트
const StyledContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background-color: ${colors.background};
    border-radius: 16px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
`;

const Title = styled.h4`
    margin: 0;
    font-size: 1.2rem; // Adjust font size if needed
    color: ${colors.text};
`;

const ButtonGroup = styled.div`
    margin: 0;
`;

const FeaturedImageContainer = styled.div`
    position: relative;
    width: 100%;
    height: 500px; // 크게 설정
    overflow: hidden;
    border-radius: 16px;
    margin-bottom: 20px;
`;

const FeaturedImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover; // 이미지가 컨테이너를 꽉 채우도록 설정
`;

const HorizontalScrollContainer = styled.div`
    display: flex;
    overflow-x: auto;
    width: 100%;
    scrollbar-width: thin; /* For Firefox */
    -ms-overflow-style: none; /* For Internet Explorer and Edge */

    ::-webkit-scrollbar {
        width: 8px; /* For Chrome, Safari, and Opera */
    }

    ::-webkit-scrollbar-thumb {
        background: ${colors.primary};
        border-radius: 10px;
    }

    ::-webkit-scrollbar-track {
        background: ${colors.background};
    }
`;

const ImageContainer = styled.div`
    width: 100%;
    height: 60%; // Adjust height for the image to take up more space
    overflow: hidden;
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover; // Ensure the image covers the container
`;

const DetailsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 20px;
    padding: 15px 0;
    border-bottom: 1px solid ${colors.primary};
    margin-bottom: 20px;

    &:last-child {
        border-bottom: none;
    }
`;

const Label = styled.div`
    font-weight: 600;
    color: ${colors.text};
`;

const Value = styled.div`
    color: ${colors.primary};
`;

const MapContainer = styled.div`
    width: 100%;
    height: 450px;
    border-radius: 16px;
    position: relative;
    margin-top: 20px;
    background-color: ${colors.primary};
`;

const MapControls = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const RoomListContainer = styled.div`
    margin-top: 40px;
    overflow-x: auto; // Enable horizontal scrolling
    display: flex;
    padding-bottom: 20px; // Ensure there's space for the scrollbar
`;

const RoomCardContainer = styled.div`
    position: relative;
    border: 1px solid ${colors.primary};
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-right: 20px; // Space between cards
    cursor: pointer;
    width: 600px;
    height: 500px;
    display: flex; // Use flexbox to align children
    flex-direction: column; // Arrange children vertically
`;

const InfoContainer = styled.div`
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 40%; // Ensure height is adjusted for the remaining space
    box-sizing: border-box;
    overflow: hidden; // Hide any overflowed content
`;

const StyledButton = styled(Button)`
    background: linear-gradient(135deg, ${colors.button} 0%, ${colors.buttonHover} 100%);
    border: none;
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    border-radius: 25px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: background 0.3s, box-shadow 0.3s, transform 0.3s;

    &:hover {
        background: linear-gradient(135deg, ${colors.buttonHover} 0%, ${colors.button} 100%);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        transform: translateY(-2px);
    }

    &:active {
        background: ${colors.buttonActive};
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transform: translateY(0);
    }
`;

const DormDetails = (props) => {
    const [dorm, setDorm] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [user, setUser] = useState(null);
    const [featuredImage, setFeaturedImage] = useState(null); // 최상단 사진 상태 추가
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dormResponse = await axios.get(`http://localhost:8080/dorms/${id}`);
                if (dormResponse.data.result === 'success') {
                    setDorm(dormResponse.data);
                    setRooms(dormResponse.data.rooms);
                    setFeaturedImage(dormResponse.data.dormImages[0]); // 최상단 사진 초기화
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

    const handleImageClick = (newImage) => {
        setFeaturedImage(newImage); // 클릭된 이미지로 최상단 이미지 변경
    };

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

    const BackButton = () => (
        <StyledButton variant="secondary" onClick={() => window.history.back()}>
            Back
        </StyledButton>
    );

    return (
        <StyledContainer>
            <Row className="justify-content-center">
                <Col xs={12} md={10} lg={8}>
                    <TitleContainer>
                        <ButtonGroup>
                            <BackButton/>
                        </ButtonGroup>
                        <Title>숙소 사진</Title>
                    </TitleContainer>
                    <FeaturedImageContainer>
                        {featuredImage ? (
                            <FeaturedImage src={`${featuredImage}`} alt="Featured Image" />
                        ) : (
                            <FeaturedImage src="/default-placeholder-image.jpg" alt="No image available" />
                        )}
                    </FeaturedImageContainer>

                    <HorizontalScrollContainer>
                        {dorm.dormImages && dorm.dormImages.length > 1 ? (
                            dorm.dormImages.slice(1).map((imgName, index) => (
                                <ImageContainer key={index} onClick={() => handleImageClick(imgName)}>
                                    <Image src={`${imgName}`} alt={`Slide ${index + 1}`} />
                                </ImageContainer>
                            ))
                        ) : (
                            <ImageContainer>
                                <Image src="/default-placeholder-image.jpg" alt="No image available" />
                            </ImageContainer>
                        )}
                    </HorizontalScrollContainer>

                    <Title>숙소 정보</Title>
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

                    <Title>호텔 위치</Title>
                    <MapContainer id="map">
                        <MapControls>
                            <Button id="btnZoomIn" variant="outline-primary">+</Button>
                            <Button id="btnZoomOut" variant="outline-primary">-</Button>
                        </MapControls>
                    </MapContainer>
                    <Title>방 정보</Title>
                    <RoomListContainer>
                        {rooms && rooms.length > 0 ? (
                            rooms.map((room, index) => (
                                <RoomCardContainer key={index}>
                                    <ImageContainer>
                                        <Image src={`${room.img}`} alt={room.name} />
                                    </ImageContainer>
                                    <InfoContainer>
                                        <Title>{room.name}</Title>
                                        <p>{room.description}</p>
                                        <p><strong>가격:</strong> {room.price.toLocaleString()} 원/박</p>
                                        <StyledButton variant="primary" onClick={() => handleBooking(room)}>예약하기</StyledButton>
                                    </InfoContainer>
                                </RoomCardContainer>
                            ))
                        ) : (
                            <p style={{ color: colors.text }}>이 호텔에는 방 정보가 없습니다.</p>
                        )}
                    </RoomListContainer>

                    <hr/>
                    <ReviewList dormId={id} domrmId="review-section"/>
                </Col>
            </Row>
        </StyledContainer>
    );
};

export default DormDetails;
