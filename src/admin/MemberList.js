import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
    margin-top: 20px;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    border: 1px solid #ddd;
`;

const TableHeader = styled.th`
    background-color: #f4f4f4;
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
`;

const TableCell = styled.td`
    padding: 12px;
    border-bottom: 1px solid #ddd;
`;

const TableRow = styled.tr`
    &:nth-child(even) {
        background-color: #f9f9f9;
    }
    &:hover {
        background-color: #f1f1f1;
    }
`;

const Heading = styled.h1`
    color: #333;
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
`;

const NoMembersCell = styled(TableCell)`
    text-align: center;
    colspan: 8;
    font-style: italic;
`;

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
                console.log('userList_response.data:', response.data);
                setMembers(response.data);
            } catch (error) {
                console.error('Error fetching user lists:', error);
                setMembers([]);
            }
        };

        fetchData();
    }, []);

    // Helper functions to map values
    const getStatusLabel = (status) => {
        switch (status) {
            case 'Y':
                return '사용중';
            case 'N':
                return '휴면중';
            default:
                return '알 수 없음';
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'ROLE_ADMIN':
                return '관리자';
            case 'ROLE_USER':
                return '사용자';
            case 'ROLE_SELLER':
                return '판매자';
            default:
                return '알 수 없음';
        }
    };

    return (
        <Container>
            <Heading>회원 관리 리스트</Heading>

            {/* 회원 리스트 테이블 */}
            <Table>
                <thead>
                <tr>
                    <TableHeader>회원 ID</TableHeader>
                    <TableHeader>이름</TableHeader>
                    <TableHeader>이메일</TableHeader>
                    <TableHeader>전화번호</TableHeader>
                    <TableHeader>가입일</TableHeader>
                    <TableHeader>수정일</TableHeader>
                    <TableHeader>상태</TableHeader>
                    <TableHeader>권한</TableHeader>
                </tr>
                </thead>
                <tbody>
                {members.length > 0 ? (
                    members.map((member) => (
                        <TableRow key={member.id}>
                            <TableCell>{member.id}</TableCell>
                            <TableCell>{member.name}</TableCell>
                            <TableCell>{member.email}</TableCell>
                            <TableCell>+82 {member.phoneNum}</TableCell>
                            <TableCell>{new Date(member.createAt).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(member.updateAt).toLocaleDateString()}</TableCell>
                            <TableCell>{getStatusLabel(member.status)}</TableCell>
                            <TableCell>{getRoleLabel(member.role)}</TableCell>
                        </TableRow>
                    ))
                ) : (
                    <tr>
                        <NoMembersCell>회원이 없습니다.</NoMembersCell>
                    </tr>
                )}
                </tbody>
            </Table>
        </Container>
    );
};

export default MemberList;
