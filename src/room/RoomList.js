import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate 사용
import axios from 'axios';
import { Button, Col, Container, Row, Card } from 'react-bootstrap';


/*룸 리스트 컴포넌트 방 목록 관리하기 위한 파일. */
const RoomList = () => {
    const [rooms, setRooms] = useState([]); // 방 목록을 저장할 상태
    const { id } = useParams(); // URL에서 ID를 추출
    const navigate = useNavigate(); // useNavigate 사용

    useEffect(() => {
        console.log("유즈 이팩트 rooms 들어 오는지 확인용 입니다.", rooms)
        const fetchRoomDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/rooms/${id}`);
                if (response.data && response.data.rooms) {
                    setRooms(response.data.rooms); // 방 목록을 상태에 저장
                } else {
                    console.error('Failed to fetch room details or no rooms found.');
                }
            } catch (error) {
                console.error('Error fetching room details:', error);
            }
        };

        fetchRoomDetails();
    }, [id]); // id가 변경될 때마다 useEffect 실행

    if (rooms.length === 0) {
        return <div>Loading... Room information is being loaded...</div>;
    }

    const handleBooking = (room) => {
        // navigate를 사용하여 예약 페이지로 이동하며 상태를 전달
        navigate(`/bookings/${room.id}`, { state: { room } });
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col xs={12} className="text-center">
                    <h2 className="my-4">Available Rooms</h2>
                </Col>
                {rooms.map((room, index) => (
                    <Col md={4} key={index} className="mb-4">
                        <Card>
                            <Card.Img
                                variant="top"
                                src={`https://via.placeholder.com/150?text=${encodeURIComponent(room.name)}`}
                                alt={room.name}
                            />
                            <Card.Body>
                                <Card.Title>{room.name}</Card.Title>
                                <Card.Text>
                                    {room.description}
                                </Card.Text>
                                <Card.Text>
                                    <strong>가격:</strong> {room.price.toLocaleString()} 원/박
                                </Card.Text>
                                <Button variant="primary" onClick={() => handleBooking(room)}>예약하기</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <div className="text-center my-4">
                <Button onClick={() => window.history.back()}>뒤로 가기</Button>
            </div>
        </Container>
    );
};

export default RoomList;
