import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const FormContainer = styled.div`
    max-width: 500px;
    margin: 0 auto;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const Form = styled.form`
    width: 100%;
    max-width: 400px; /* 폼의 최대 너비 설정 */
    padding: 24px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
`;

const InputWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 2px; /* 아래 필드와의 간격 */
`;

const Input = styled.input`
    white-space: nowrap;
    width: 95%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    box-sizing: border-box;
    margin: 12px
`;

const Button = styled.button`
    white-space: nowrap;
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin: 0px 30px 0px 20px;

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
    flex-direction: row; /* 가로로 정렬 */
    gap: 12px; /* 라디오 버튼 간 간격 */
    margin-bottom: 16px; /* 라디오 그룹과 다른 요소 간 간격 */
    justify-content: center; /* 라디오 그룹 중앙 정렬 */
`;

const Label = styled.label`
    display: flex;
    width: 150px;
    align-items: center; /* 라디오 버튼과 텍스트 세로 정렬 */
    gap: 8px; /* 라디오 버튼과 텍스트 간 간격 */
    font-size: 14px; /* 적당한 텍스트 크기 */
    padding: 8px 12px; /* 클릭 가능한 영역 확대 */
    border: 1px solid #ccc; /* 라디오 그룹 경계선 */
    border-radius: 4px; /* 둥근 모서리 */
    background-color: #f9f9f9; /* 약간의 배경색 */
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background-color: #f0f0f0; /* 호버 시 색상 변경 */
        border-color: #007bff; /* 호버 시 테두리 색상 */
    }

    input[type="radio"] {
        width: 16px;
        height: 16px;
    }
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-end; /* 버튼을 오른쪽 정렬 */
    align-items: center; /* 세로 정렬 */
    margin-top: 16px; /* 상단 여백 */
`;

const ErrorText = styled.p`
    color: red;
    font-size: 14px;
    margin-left: 12px; /* 버튼과 오류 메시지 간 간격 */
    visibility: ${({ isValid }) => (isValid ? 'visible' : 'hidden')}; /* isValid에 따라 오류 메시지 보이기/숨기기 */
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
        const {name, value} = e.target;
        setUser({
            ...user,
            [name]: value,
        });
    };

    const onCheck = async () => {
        try {
            const resp = await axios.post(`${process.env.REACT_APP_API_SERVER_URL}/users/validate`, user.email);
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
            const resp = await axios.post(`${process.env.REACT_APP_API_SERVER_URL}/users/signUp`, user);
            if (resp.data.result === 'success') {
                moveToNext();
            } else {
                alert('회원가입 실패');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const {email, password, name, phoneNum, role} = user;

    return (
        <FormContainer>
            <Title>회원가입</Title>
            <Form onSubmit={onSubmit}>
                <InputWrapper>
                    <Input
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        placeholder="이메일 주소"
                        disabled={!isValid}
                    />
                    <Button type="button" onClick={onCheck}>중복확인</Button>
                </InputWrapper>
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
                    minLength={11}
                    maxLength={11}
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
                <ButtonWrapper>
                    <ErrorText isValid={isValid}>이메일 중복 확인이 필요합니다.</ErrorText>
                    <Button type="submit" disabled={isValid}>회원가입</Button>
                </ButtonWrapper>
            </Form>
        </FormContainer>
    );
}

export default Register;
