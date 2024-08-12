import {useState} from 'react'
import {Button, Container} from 'react-bootstrap'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

function Register() {
    const [user, setUser] = useState({
        email: '',
        password: '',
        name: '',
        phoneNum: '',
        role: '',
    })

    const navigate = useNavigate()
    const moveToNext = () => {
        navigate('/login')
    }

    const onChange = (e) => {
        const {name, value} = e.target
        setUser({
            ...user,
            [name]: value,
        })
    }

    const [isValid, setIsValid] = useState(true)

    const onCheck = async (e) => {
        console.log(user)
        try {
            const resp = await axios.post('http://localhost:8080/users/validate', user.email)
            console.log(resp)

            if (resp.data.result === 'success') {
                alert('사용 가능한 메일입니다.')
                setIsValid(false)
            } else {
                alert('이미 가입된 이메일입니다.')
            }
        } catch (error) {
            console.error(error)
        }
    }

    const onSubmit = async (e) => {
        console.log(email, password, name, phoneNum, role)
        e.preventDefault()
        try {
            const resp = await axios.post('http://localhost:8080/users/signUp', user)
            console.log(resp)

            if (resp.data.result === 'success') {
                moveToNext()
            } else {
                alert('회원가입 실패')
            }
        } catch (error) {
            console.error(error)
        }
    }

    const {email, password, name, phoneNum, role} = user

    // 핸드폰 번호 하이픈 넣기, https://fedev-kim.medium.com/react-%EC%A0%95%EA%B7%9C%EC%8B%9D%EC%9C%BC%EB%A1%9C-%ED%9C%B4%EB%8C%80%EC%A0%84%ED%99%94-%EB%B2%88%ED%98%B8-input-%EB%A7%8C%EB%93%A4%EA%B8%B0-1a67f28855d2
    /*const [phoneNumber, setPhoneNum] = useState('')

    const parsingPhoneNum = (num) => {
        return num
            .replace(/[^0-9]/g, '')
            .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
            .replace(/(-{1,2})$/g, '')
    }

    const onChangeNum = (e) =>
        setPhoneNum(parsingPhoneNum(e.currentTarget.value))*/

    return (
        <Container className={'mt-3'}>
            <form onSubmit={onSubmit}>
                <div>
                    <input
                        type={'email'}
                        name={'email'}
                        value={email}
                        onChange={onChange}
                        placeholder={'email'}
                    />
                    <Button onClick={onCheck}>중복확인</Button></div>
                <input
                    type={'password'}
                    name={'password'}
                    value={password}
                    maxLength={18}
                    onChange={onChange}
                    placeholder={'password'}
                />
                <input
                    type={'text'}
                    name={'name'}
                    value={name}
                    onChange={onChange}
                    placeholder={'name'}
                />
                <input
                    type={'tel'}
                    name={'phoneNum'}
                    value={phoneNum}
                    minLength={11}
                    maxLength={11}
                    onChange={onChange}
                    placeholder={'phoneNumber'}
                />
                {/* 핸드폰번호 하이픈 */}
                {/*<input
                    type={'tel'}
                    name={'phoneNumber'}
                    value={phoneNumber}
                    minLength={13}
                    maxLength={13}
                    onChange={onChangeNum}
                    placeholder={'phoneNumber'}
                />*/}
                <input type={'radio'} id={'ROLE_USER'} name={'role'} value={'ROLE_USER'} onChange={onChange}/>
                <label htmlFor={'ROLE_USER'}>일반회원</label>
                <input type={'radio'} id={'ROLE_SELLER'} name={'role'} value={'ROLE_SELLER'} onChange={onChange}/>
                <label htmlFor={'ROLE_SELLER'}>판매자</label>
                <button type={'submit'} disabled={isValid}>{'회원가입'}</button>
            </form>
        </Container>
    )
}

export default Register
