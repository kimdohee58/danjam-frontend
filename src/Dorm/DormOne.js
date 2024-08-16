import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Col, Container, Row, Table, Carousel, Card } from 'react-bootstrap';

const DormDetails = () => {
    const [dorm, setDorm] = useState(null);
    const [rooms, setRooms] = useState([]); // 방 목록 상태
    const [user, setUser] = useState(null); // 유저 정보 상태
    const { id } = useParams();
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 사용

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

    if (!dorm || !user) {
        return <div>로딩 중...</div>;
    }



    const handleBooking = (room) => {

        const bookingInfo = {
            user: {
                email: user.email,
                name: user.name,
                phoneNumber: user.phoneNum
            },}
        navigate(`/bookings/${user.id}?dormName=${encodeURIComponent(dorm.name)}&roomId=${room.id}&person=${room.person}&checkIn=${room.checkIn}&checkOut=${room.checkOut}&roomImg=${room.img}&reviewAvg=${room.reviewAvg}&price=${room.price}&email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name)}&phoneNumber=${user.phoneNumber}`, {
            state: { bookingInfo }
        });


    };



    return (
        <Container>
            <Row className="justify-content-center">
                <Col xs md lg={8} style={{ backgroundColor: 'lightblue' }}>
                    <h2 className="text-center my-4">호텔 상세 정보</h2>
                    <Table striped bordered hover>
                        <tbody>
                        <tr><td>이름 :</td><td>{dorm.name}</td></tr>
                        <tr><td>설명 :</td><td>{dorm.description}</td></tr>
                        <tr><td>연락처 :</td><td>{dorm.contactNum}</td></tr>
                        <tr><td>도시 :</td><td>{dorm.city}</td></tr>
                        <tr><td>구/읍 :</td><td>{dorm.town}</td></tr>
                        <tr><td>주소 :</td><td>{dorm.address}</td></tr>
                        </tbody>
                    </Table>
                    <div className="text-center my-4">
                        <Button onClick={() => window.history.back()}>뒤로 가기</Button>
                        <h2>Images</h2>
                        <Carousel>
                            {dorm.dormImages && dorm.dormImages.length > 0 ? (
                                dorm.dormImages.map((imgName, index) => (
                                    <Carousel.Item key={index}>
                                        <img className="d-block w-100" src={`http://localhost:8080/uploads/${imgName}`} alt={`Slide ${index + 1}`} style={{ height: '180px', objectFit: 'cover' }} />
                                    </Carousel.Item>
                                ))
                            ) : (
                                <Carousel.Item>
                                    <img className="d-block w-100" src="/default-placeholder-image.jpg" alt="No image available" style={{ height: '180px', objectFit: 'cover' }} />
                                </Carousel.Item>
                            )}
                        </Carousel>
                    </div>

                    <div className="room-list">
                        <h3 className="my-4">방 정보</h3>
                        <Row>
                            {rooms && rooms.length > 0 ? (
                                rooms.map((room, index) => (
                                    <Col md={4} key={index} className="mb-4">
                                        <Card>
                                            <Card.Img variant="top" src={`http://localhost:8080/uploads/${room.name}`} alt={room.name} />
                                            <Card.Body>
                                                <Card.Title>{room.name}</Card.Title>
                                                <Card.Text>{room.description}</Card.Text>
                                                <Card.Text><strong>가격:</strong> {room.price.toLocaleString()} 원/박</Card.Text>
                                                <Button variant="primary" onClick={() => handleBooking(room)}>예약하기</Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <p>이 호텔에는 방 정보가 없습니다.</p>
                            )}
                        </Row>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default DormDetails;
