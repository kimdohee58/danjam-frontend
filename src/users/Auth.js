import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

function Auth({ onSuccess }) {
    const [user, setUser] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const onSignUp = () => {
        navigate('/signUp');
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value,
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('username', user.email);
            formData.append('password', user.password);

            const resp = await axios({
                url: `${process.env.REACT_APP_API_SERVER_URL}/api/users/auth`,
                method: 'POST',
                data: formData,
                withCredentials: true,
            });
            if (resp.status === 200 && resp.data.result === 'success') {
                const userInfo = {
                    id: resp.data.id,
                    name: resp.data.name,
                    email: resp.data.email,
                    phoneNum: resp.data.phoneNum,
                    role: resp.data.role,
                };

                navigate('/', { state: { userInfo: userInfo } });

                if (onSuccess) {
                    onSuccess();
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const { email, password } = user;

    return (
        <Form onSubmit={onSubmit}>
            <Input
                type='email'
                name='email'
                value={email}
                onChange={onChange}
                placeholder='Email'
            />
            <Input
                type='password'
                name='password'
                value={password}
                onChange={onChange}
                placeholder='Password'
            />
            <Button type='submit'>로그인</Button>
            <Button type='button' onClick={onSignUp}>
                회원가입
            </Button>
        </Form>
    );
}

const Form = styled.form`
    display: flex;
    flex-direction: column;
    max-width: 400px;
    margin: auto;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
`;

const Input = styled.input`
    margin-bottom: 15px;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;

    &::placeholder {
        color: #888;
    }
`;

const Button = styled.button`
    padding: 10px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: #fff;
    cursor: pointer;
    margin-bottom: 10px;

    &:last-of-type {
        background-color: #28a745;
    }

    &:hover {
        background-color: #0056b3;
    }

    &:last-of-type:hover {
        background-color: #218838;
    }
`;

export default Auth;
