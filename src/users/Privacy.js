import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
`;

const Header = styled.div`
    margin-bottom: 20px;
`;

const Section = styled.div`
    margin-bottom: 20px;
`;

const Title = styled.h1`
    font-size: 24px;
    margin: 0;
`;

const FieldLabel = styled.div`
    font-weight: bold;
    margin-bottom: 8px;
`;

const FieldValue = styled.div`
    margin-bottom: 8px;
    font-size: 16px;
    color: #333;
`;

const Input = styled.input`
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 16px;
`;

const Button = styled.button`
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
    &:hover {
        background-color: #0056b3;
    }
`;

const LinkButton = styled(Button)`
    background-color: #dc3545;
    &:hover {
        background-color: #c82333;
    }
`;

function Privacy() {
    const [inputs, setInputs] = useState({
        password: '',
        phoneNum: '',
    });
    const [user, setUser] = useState({
        id: '',
        email: '',
        name: '',
        phoneNum: '',
    });
    const [userInfo, setUserInfo] = useState({
        id: '',
        name: '',
        role: '',
    });

    const navigate = useNavigate();
    const params = useParams();
    const id = params.id;
    const fetchUserUrl = 'http://localhost:8080/users';

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch(`${fetchUserUrl}/${id}`, {
                method: 'GET',
                credentials: 'include',
            });
            return await response.json();
        };

        fetchUsers()
            .then((data) => {
                setUser(data);
                setInputs({
                    ...inputs,
                    phoneNum: data.phoneNum,
                });
            });
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs({
            ...inputs,
            [name]: value,
        });
    };

    const handleUpdate = async () => {
        const response = await fetch(`${fetchUserUrl}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                password: inputs.password,
            }),
        });
        if (response.ok) {
            alert('비밀번호를 변경했습니다.');
            navigate(`/users/${id}/my-page/privacy`);
        }
    };

    const handleUpdatePhone = async () => {
        const response = await fetch(`${fetchUserUrl}/${id}/phone`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                phoneNum: inputs.phoneNum,
            }),
        });
        if (response.ok) {
            alert('핸드폰 번호를 변경했습니다.');
            navigate(`/users/${id}/my-page/privacy`);
        }
    };

    const handleCancel = async () => {
        const response = await fetch(`${fetchUserUrl}/${id}/cancel`, {
            method: 'PATCH',
            credentials: 'include',
        });

        if (response.status === 200) {
            alert('휴면 계정으로 전환됐습니다.');
            const resp = await fetch(`${fetchUserUrl}/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            if (resp.status === 200) {
                navigate('/', { state: { userInfo } });
            }
        }
    };

    return (
        <Container>
            <Header>
                <Title>개인 정보</Title>
            </Header>

            <Section>
                <FieldLabel>실명</FieldLabel>
                <FieldValue>{user.name}</FieldValue>
            </Section>

            <Section>
                <FieldLabel>비밀번호</FieldLabel>
                <Input
                    type="password"
                    name="password"
                    placeholder="Input Password"
                    value={inputs.password}
                    onChange={handleChange}
                />
                <Button onClick={handleUpdate}>수정</Button>
            </Section>

            <Section>
                <FieldLabel>이메일 주소</FieldLabel>
                <FieldValue>{user.email}</FieldValue>
            </Section>

            <Section>
                <FieldLabel>전화번호</FieldLabel>
                <Input
                    type="tel"
                    name="phoneNum"
                    minLength={11}
                    maxLength={13}
                    value={inputs.phoneNum}
                    onChange={handleChange}
                />
                <Button onClick={handleUpdatePhone}>수정</Button>
            </Section>

            <Section>
                <LinkButton onClick={handleCancel}>회원 탈퇴</LinkButton>
            </Section>
        </Container>
    );
}

export default Privacy;
