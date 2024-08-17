import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
    margin: 20px auto;
    max-width: 1200px;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
`;

const Heading = styled.h1`
    color: #4a4a4a;
    font-size: 2rem;
    margin-bottom: 20px;
    text-align: center;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
`;

const TableHeader = styled.th`
    background-color: #f4f4f4;
    padding: 15px;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid #ddd;
`;

const TableCell = styled.td`
    padding: 15px;
    border-bottom: 1px solid #ddd;
    text-align: left;
    color: #555;
`;

const TableRow = styled.tr`
    &:nth-child(even) {
        background-color: #f9f9f9;
    }
    &:hover {
        background-color: #f1f1f1;
    }
`;

const NoMembersCell = styled(TableCell)`
    text-align: center;
    colspan: 8;
    font-style: italic;
    color: #888;
`;

// Main Component
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
                return '사용중'; // Active
            case 'N':
                return '휴면중'; // Inactive
            default:
                return '알 수 없음'; // Unknown
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'ROLE_ADMIN':
                return '관리자'; // Admin
            case 'ROLE_USER':
                return '사용자'; // User
            case 'ROLE_SELLER':
                return '판매자'; // Seller
            default:
                return '알 수 없음'; // Unknown
        }
    };

    return (
        <Container>
            <Heading>회원 관리 리스트</Heading>

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
