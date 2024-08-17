import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const FormContainer = styled.div`
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const Title = styled.h2`
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
`;

const Input = styled.input`
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    box-sizing: border-box;
`;

const Button = styled.button`
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
    &:hover {
        background-color: #0056b3;
    }
    &:disabled {
        background-color: #b0b0b0;
        cursor: not-allowed;
    }
`;

const RadioGroup = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
`;

const Label = styled.label`
    font-size: 16px;
    cursor: pointer;
`;

const ErrorText = styled.p`
    color: red;
    font-size: 14px;
    text-align: center;
`;

function Register() {
    const [user, setUser] = useState({
        email: '',
        password: '',
        name: '',
        phoneNum: '',
        role: '',
    });

    const [isValid, setIsValid] = useState(true);
    const navigate = useNavigate();

    const moveToNext = () => {
        navigate('/login');
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value,
        });
    };

    const onCheck = async () => {
        try {
            const resp = await axios.post('http://localhost:8080/users/validate', user.email);
            if (resp.data.result === 'success') {
                alert('사용 가능한 메일입니다.');
                setIsValid(false);
            } else {
                alert('이미 가입된 이메일입니다.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const resp = await axios.post('http://localhost:8080/users/signUp', user);
            if (resp.data.result === 'success') {
                moveToNext();
            } else {
                alert('회원가입 실패');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const { email, password, name, phoneNum, role } = user;

    return (
        <FormContainer>
            <Title>회원가입</Title>
            <form onSubmit={onSubmit}>
                <Input
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    placeholder="이메일 주소"
                />
                <Button type="button" onClick={onCheck}>중복 확인</Button>
                <Input
                    type="password"
                    name="password"
                    value={password}
                    maxLength={18}
                    onChange={onChange}
                    placeholder="비밀번호"
                />
                <Input
                    type="text"
                    name="name"
                    value={name}
                    onChange={onChange}
                    placeholder="이름"
                />
                <Input
                    type="tel"
                    name="phoneNum"
                    value={phoneNum}
                    onChange={onChange}
                    placeholder="전화번호 (하이픈 없이 입력)"
                />
                <RadioGroup>
                    <Label>
                        <Input
                            type="radio"
                            id="ROLE_USER"
                            name="role"
                            value="ROLE_USER"
                            onChange={onChange}
                        />
                        일반회원
                    </Label>
                    <Label>
                        <Input
                            type="radio"
                            id="ROLE_SELLER"
                            name="role"
                            value="ROLE_SELLER"
                            onChange={onChange}
                        />
                        판매자
                    </Label>
                </RadioGroup>
                <Button type="submit" disabled={isValid}>회원가입</Button>
                {isValid && <ErrorText>이메일 중복 확인이 필요합니다.</ErrorText>}
            </form>
        </FormContainer>
    );
}

export default Register;
