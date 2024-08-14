import {useLocation, useNavigate} from "react-router-dom";
import {Button, Container, Card, Row, Col, Carousel} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";


const Approve = () => {
    const navigate = useNavigate();
    const [dorms, setDorms] = useState([]);
    const [selectedDorms, setSelectedDorms] = useState([]);

    const location = useLocation();
    const userInfo = location.state.userInfo;

    const onChange = (e) => {
        const {value, checked} = e.target;
        const dormId = parseInt(value);

        setSelectedDorms(prevSelectedDorms =>
            checked
                ? [...prevSelectedDorms, dormId]
                : prevSelectedDorms.filter(id => id !== dormId)
        );
    };

    // Fetch dorm list function
    const fetchDormList = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/dorm/Approvelist`, {
                withCredentials: true
            });
            const {dormList} = response.data;
            console.log(dormList);
            setDorms(dormList);
        } catch (error) {
            console.error('Error fetching dorms:', error);
        }
    };

    function Send(selectedDorms) {
        console.log('Sending with Dorms:', selectedDorms);

        axios.post('http://localhost:8080/dorm/Update', selectedDorms, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
            .then((response) => {
                alert('Response:', response.data);
                fetchDormList()
            })
            .catch((error) => {
                alert('Error:', error);
            });
    }

    useEffect(() => {
        fetchDormList();
    }, [userInfo.id]);

    const getImageSrc = (imageName) => {
        return `http://localhost:8080/uploads/${imageName}`;
    };

    return (
            <Container className="mt-3">
                <h1>{userInfo.name}님 admin 승인 리스트</h1>

                <hr/>
                <div className="text-center mt-3">
                    <Button
                        onClick={() => selectedDorms && Send(selectedDorms)}
                        disabled={!selectedDorms}
                    >
                        Approve
                    </Button>
                </div>
                <hr/>

                {/* 데이터가 없을 때 메시지 표시 */}
                {dorms.length === 0 ? (
                    <div className="text-center mt-5">
                        <h3>현재 승인 대기 중인 숙소가 없습니다.</h3>
                        <p>승인할 숙소가 추가될 때까지 기다려 주세요.</p>
                    </div>
                ) : (
                    <Row>
                        {dorms.map((dorm) => (
                            <Col md={4} lg={3} key={dorm.id} className="mb-4">
                                <Card>
                                    <Card.Body>
                                        <input
                                            type="checkbox"
                                            value={dorm.id}
                                            onChange={onChange}
                                            checked={selectedDorms.includes(dorm.id)}
                                        />
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
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
    );

};

export default Approve;
