import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {Container, Row, Col, Table} from "react"

const DormOne = () => {
    const params = useParams()
    const id = parseInt(params.id)
    const [detail, setDetail] = useState(null); // 초기 상태 null로 설정

    useEffect(() => {
        const getDetail = async () => {
            try{
                const resp = await axios.get(`http://localhost:8080/dorm/${id}`);
                setDetail(resp.data);
            } catch (e){
                console.error("호텔아이디 로드중 오류", e)
            }
        }
        getDetail();
    }, [id]);

    // 데이터가 없을 때 로딩 메시지를 표현
    if (!detail) return <div>Loading......1.8..2.8......</div>;

    return (
        <Container>
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg-={6} style={{ backgroundColor: 'lightblue'}}>
                    <Table striped bordered hover>
                        <tbody>
                        <tr>
                            <td>제목: {detail.name}</td>
                        </tr>
                        <tr>
                            <td>내용: {detail.description}</td>
                        </tr>
                        <tr>
                            <td>주소: {detail.address}</td>
                        </tr>

                        <tr>
                            <td>방 종류: {detail.roomType}</td>
                        </tr>

                        <tr>
                            <td>리뷰: {detail.review}</td>
                        </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}

export default DormOne