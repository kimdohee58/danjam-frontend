import { useLocation, useNavigate } from "react-router-dom";
import { Button, Container, Card, Row, Col, Carousel } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";

const SellerList = () => {
    const navigate = useNavigate();
    const [dorms, setDorms] = useState([]);

    const location = useLocation();
    const userInfo = location.state.userInfo;

    const onRoomInsert = (dormId) => {
        navigate('/room/RInsert/' + dormId, {
            state: { userInfo: userInfo, dormId: dormId }
        });
    };

    useEffect(() => {
        const fetchDormList = async () => {
            try {
                const id = userInfo.id;
                const response = await axios.get(`http://localhost:8080/dorm/Sellerlist/${id}`, {
                    withCredentials: true
                });
                const { dormList } = response.data;
                setDorms(dormList);
                console.log(dormList);
            } catch (error) {
                console.error('Error fetching dorms:', error);
            }
        };

        fetchDormList();
    }, [userInfo.id]);

    const getImageSrc = (imageName) => {
        const url = `http://localhost:8080/uploads/${imageName}`
        console.log(url)
        return url
    };

    return (
        <Container className="mt-3">
            <h1>Dorms List for Seller name: {userInfo.name}</h1>
            <Row>
                {dorms.map((dorm) => (
                    <Col md={4} lg={3} key={dorm.id} className="mb-4">
                        <Card>
                            <Card.Body>
                                {/* Image Carousel */}
                                <Carousel>
                                    {dorm.roomImgNames.length > 0 ? (
                                        dorm.roomImgNames.map((imgName, index) => (
                                            <Carousel.Item key={index}>
                                                <img
                                                    className="d-block w-100"
                                                    src={getImageSrc(imgName)}
                                                    alt={`Slide ${index + 1}`}
                                                    style={{ height: '180px', objectFit: 'cover' }}
                                                />
                                            </Carousel.Item>
                                        ))
                                    ) : (
                                        <Carousel.Item>
                                            <img
                                                className="d-block w-100"
                                                src="path-to-default-image.jpg"
                                                alt="Default"
                                                style={{ height: '180px', objectFit: 'cover' }}
                                            />
                                        </Carousel.Item>
                                    )}
                                </Carousel>
                                <Card.Title>{dorm.name}</Card.Title>
                                <Card.Text>{dorm.description}</Card.Text>
                                <Button variant="primary">More Details</Button>
                            </Card.Body>
                            <Button variant="secondary" onClick={() => onRoomInsert(dorm.id)}>
                                방추가하기
                            </Button>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default SellerList
