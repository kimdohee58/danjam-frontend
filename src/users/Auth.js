import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

function Auth() {
    const [user, setUser] = useState({
        email: '',
        password: '',
    })

    const navigate = useNavigate()

    const onSignUp = () => {
        navigate('/signUp')
    }

    const onChange = (e) => {
        const {name, value} = e.target
        setUser({
            ...user,
            [name]: value,
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            // security에서 formLogin으로 받기 때문에 우리도 form 형식으로 데이터를 보내야 함
            const formData = new FormData()
            formData.append('username', user.email)
            formData.append('password', user.password)

            const resp = await axios({
                url: 'http://localhost:8080/users/auth',
                method: 'POST',
                data: formData,
                withCredentials: true,
            })

            console.log(resp.data.result)
            if (resp.status === 200 && resp.data.result === 'success') {
                const userInfo = {
                    id: resp.data.id,
                    role: resp.data.role,
                    name: resp.data.name,
                }
                navigate('/', {state: {userInfo: userInfo}})
                // navigate('/')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const {email, password} = user

    return (
        <form onSubmit={onSubmit}>
            <input
                type={'email'}
                name={'email'}
                value={user.email}
                onChange={onChange}
                placeholder={'email'}
            />
            <input
                type={'password'}
                name={'password'}
                value={user.password}
                onChange={onChange}
                placeholder={'password'}
            />
            <button type={'submit'}>{'로그인'}</button>
            <button type={'button'} onClick={onSignUp}>
                {'회원가입'}
            </button>
        </form>
    )
}

export default Auth
