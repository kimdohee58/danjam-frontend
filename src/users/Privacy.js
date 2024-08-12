import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Privacy () {
    const [inputs, setInputs] = useState({
        password: '',
        phoneNum: '',
    })
    const [user, setUser] = useState({
        id: '',
        email: '',
        name: '',
        phoneNum: '',
    })

    const navigate = useNavigate()
    const params = useParams()

    const id = params.id

    const fetchUserUrl = 'http://localhost:8080/users'

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch(`${fetchUserUrl}/${id}`, {
                method: 'GET',
                credentials: 'include',
            })

            return await response.json();
        }

        fetchUsers()
            .then((data) => {
                setUser(data)
                setInputs({
                    ...inputs,
                    phoneNum: data.phoneNum,
                })
            })
    }, [id])

    const handleChange = (event) => {
        const { name, value } = event.target
        setInputs({
            ...inputs,
            [name]: value,
        })
    }

    const handleUpdate = async () => {
        const response = await fetch(`${fetchUserUrl}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                password: inputs.password
            })
        })
        if (response.ok) {
            alert('비밀번호를 변경했습니다.')
            navigate(`/my-page/${id}`)
        }
    }

    const handleUpdatePhone = async () => {
        const response = await fetch(`${fetchUserUrl}/${id}/phone`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                phoneNum: inputs.phoneNum,
            })
        })
        if (response.ok) {
            alert('핸드폰 번호를 변경했습니다.')
            navigate(`/my-page/${id}`)
        }
    }

    const handleCancel = async () => {
        const response = await fetch(`${fetchUserUrl}/${id}/cancel`, {
            method: 'PATCH',
            credentials: 'include',
        })

        if (response.status === 200) {
            alert('휴면 계정으로 전환됐습니다.')
            navigate('/')
        }
    }

    return (
        <div>
            <div className="head">
                <h1>개인정보</h1>
            </div>

            <div className="content">
                <div className='realName'>
                    <div>
                        실명
                    </div>
                    <div>
                        {user.name}
                    </div>
                </div>
                <hr/>

                <div className="password">
                    <div>
                        비밀번호
                    </div>
                    <div>
                        <input type="password"
                               name='password'
                               placeholder="Input Password"
                               value={inputs.password}
                               onChange={handleChange}
                        />
                    </div>
                    <div>
                        <button type="button"
                                onClick={handleUpdate}
                        >
                            수정
                        </button>
                    </div>
                </div>
                <hr/>

                <div className="email">
                    <div>
                    이메일 주소
                    </div>
                    <div>
                        {user.email}
                    </div>
                </div>
                <hr/>

                <div className='phone-number'>
                    <div>
                        전화번호
                    </div>
                    <div>
                        +82
                        <input type="tel"
                               name='phoneNum'
                               minLength={11}
                               maxLength={13}
                               value={inputs.phoneNum}
                               onChange={handleChange}
                        />
                    </div>
                    <div>
                        <button type="button"
                                onClick={handleUpdatePhone}
                        >
                            수정
                        </button>
                    </div>
                </div>
                <hr/>

                <div className='cancel-member'>
                    <div>
                        <button
                            type="button"
                            onClick={handleCancel}
                        >
                            회원 탈퇴
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Privacy