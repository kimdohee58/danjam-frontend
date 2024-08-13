import React, { useEffect, useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const MemberList = () => {
    const [members, setMembers] = useState([]);

    const location = useLocation();
    const userInfo = location.state?.userInfo;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/users/UsersList', {
                    withCredentials: true
                });
                console.log('userList_response.data:',response.data);
                const userList = response.data;
                console.log('userList',userList);
                setMembers( userList);
            } catch (error) {
                console.error('Error fetching user lists:', error);
                setMembers([]);
            }
        };

        fetchData();
    }, []);

    return (
        <Container className="mt-3">
            <h1>회원 관리 리스트</h1>

            {/* 회원 리스트 테이블 */}
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>회원 ID</th>
                    <th>이름</th>
                    <th>이메일</th>
                    <th>전화번호</th>
                    <th>가입일</th>
                    <th>수정일</th>
                    <th>상태</th>
                    <th>권한</th>
                </tr>
                </thead>
                <tbody>
                {members.length > 0 ? (
                    members.map((member) => (
                        <tr key={member.id}>
                            <td>{member.id}</td>
                            <td>{member.name}</td>
                            <td>{member.email}</td>
                            <td>+82 {member.phoneNum}</td>
                            <td>{new Date(member.createAt).toLocaleDateString()}</td>
                            <td>{new Date(member.updateAt).toLocaleDateString()}</td>
                            <td>{member.status}</td>
                            <td>{member.role}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7" className="text-center">회원이 없습니다.</td>
                    </tr>
                )}
                </tbody>
            </Table>
        </Container>
    );
};

export default MemberList;
