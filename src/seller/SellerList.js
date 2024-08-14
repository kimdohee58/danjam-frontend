import {useLocation, useNavigate} from "react-router-dom";
import {Button, Container, Card, Row, Col, Carousel} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";


const SellerList = () => {
    const navigate = useNavigate();
    const [dorms, setDorms] = useState([]);

    const location = useLocation();
    const userInfo = location.state.userInfo;

    console.log(userInfo)


    // Fetch dorm list function
    const fetchDormList = async () => {
        try {
            const id = userInfo.id;
            const response = await axios.get(`http://localhost:8080/dorm/Sellerlist/${id}`, {
                withCredentials: true
            });
            console.log(response.data)
            const {dormList} = response.data;
            setDorms(dormList);
        } catch (error) {
            console.error('Error fetching dorms:', error);
        }
    };

    const onRoomInsert = (dormId) => {
        navigate('/room/RInsert/' + dormId, {
            state: {userInfo: userInfo, dormId: dormId}
        });
    };

    const onDormDelete = async (dormId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/dorm/delete/${dormId}`, {
                withCredentials: true
            });

            if (response.status === 200) {
                // 사용자에게 삭제 성공 메시지를 표시합니다.
                alert("Dorm deleted successfully!");

                // 리스트를 다시 조회하여 최신 상태로 업데이트합니다.
                fetchDormList();
            } else {
                // 실패 시의 처리를 여기에 추가할 수 있습니다.
                alert("Failed to delete dorm.");
            }
        } catch (error) {
            // 오류가 발생한 경우
            alert("An error occurred while deleting the dorm.");
            console.error('Error deleting dorm:', error);
        }
    };

    useEffect(() => {
        fetchDormList();
    }, [userInfo.id]);

    const getImageSrc = (imageName) => {
        return `http://localhost:8080/uploads/${imageName}`;
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
                                                        style={{height: '180px', objectFit: 'cover'}}
                                                    />
                                                </Carousel.Item>
                                            ))
                                        ) : (
                                            <Carousel.Item>
                                                <img
                                                    className="d-block w-100"
                                                    src="path-to-default-image.jpg"
                                                    alt="Default"
                                                    style={{height: '180px', objectFit: 'cover'}}
                                                />
                                            </Carousel.Item>
                                        )}
                                    </Carousel>
                                    <Card.Title>{dorm.name}</Card.Title>
                                    <Card.Text>{dorm.description}</Card.Text>
                                </Card.Body>
                                <Button variant="secondary" onClick={() => onRoomInsert(dorm.id)}>
                                    방추가하기
                                </Button>
                                <Button variant="secondary" onClick={() => onDormDelete(dorm.id)}>
                                    dorm삭제하기
                                </Button>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
    );
}

export default SellerList;
