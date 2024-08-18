import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Auth({ onSuccess }) { // Accept onSuccess as a prop
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
            // Security requires formLogin, so we use FormData
            const formData = new FormData();
            formData.append('username', user.email);
            formData.append('password', user.password);

            const resp = await axios({
                url: 'http://localhost:8080/users/auth',
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

                // Navigate and pass userInfo in the state
                navigate('/', { state: { userInfo: userInfo } });

                // Call onSuccess prop function if provided
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
        <form onSubmit={onSubmit}>
            <input
                type='email'
                name='email'
                value={email}
                onChange={onChange}
                placeholder='email'
            />
            <input
                type='password'
                name='password'
                value={password}
                onChange={onChange}
                placeholder='password'
            />
            <button type='submit'>로그인</button>
            <button type='button' onClick={onSignUp}>
                회원가입
            </button>
        </form>
    );
}

export default Auth;
