import {Link, useNavigate, useSearchParams} from 'react-router-dom'
import {useEffect, useState} from 'react'

function SuccessPage() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const [responseData, setResponseData] = useState(null)
    const userId = searchParams.get("userId")

    useEffect(() => {
        async function confirm() {
            const requestData = {
                orderId: searchParams.get("orderId"),
                paymentKey: searchParams.get("paymentKey"),
                amount: searchParams.get("amount"),
                userId,
                roomId: searchParams.get("roomId"),
                person: searchParams.get("person"),
                checkIn: searchParams.get("checkIn"),
                checkOut: searchParams.get("checkOut"),
            }

            const response = await fetch('http://localhost:8080/payments/confirm', {
                method: 'POST',
                // credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            })
            const data = await response.json()

            if (data && !response.ok) {
                throw { message: data.message, code: data.code }
            }
            
            return data
        }
        
        confirm()
            .then((data) => {
                setResponseData(data)
                navigate(`/my-page/${userId}/bookings`);
            })
            .catch((error) => {
                navigate(`/payments-fail?code=${error.code}&message=${error.message}`)
            })
    }, [navigate, searchParams])

    return (
        <>
            <div className="box_section" style={{ width: "600px" }}>
                <img width="100px" src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png" />
                <h2>결제를 완료했어요</h2>
                <div className="p-grid typography--p" style={{ marginTop: "50px" }}>
                    <div className="p-grid-col text--left">
                        <b>결제금액</b>
                    </div>
                    <div className="p-grid-col text--right" id="amount">
                        {`${Number(searchParams.get("amount")).toLocaleString()}원`}
                    </div>
                </div>
                <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
                    <div className="p-grid-col text--left">
                        <b>주문번호</b>
                    </div>
                    <div className="p-grid-col text--right" id="orderId">
                        {`${searchParams.get("orderId")}`}
                    </div>
                </div>
                <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
                    <div className="p-grid-col text--left">
                        <b>paymentKey</b>
                    </div>
                    <div className="p-grid-col text--right" id="paymentKey" style={{ whiteSpace: "initial", width: "250px" }}>
                        {`${searchParams.get("paymentKey")}`}
                    </div>
                </div>
                <div className="p-grid-col">
                    <Link to="https://docs.tosspayments.com/guides/v2/payment-widget/integration">
                        <button className="button p-grid-col5">연동 문서</button>
                    </Link>
                    <Link to="https://discord.gg/A4fRFXQhRu">
                        <button className="button p-grid-col5" style={{ backgroundColor: "#e8f3ff", color: "#1b64da" }}>
                            실시간 문의
                        </button>
                    </Link>
                </div>
            </div>
            <div className="box_section" style={{ width: "600px", textAlign: "left" }}>
                <b>Response Data :</b>
                <div id="response" style={{ whiteSpace: "initial" }}>
                    {responseData && <pre>{JSON.stringify(responseData, null, 4)}</pre>}
                </div>
            </div>
        </>
    );
}

export default SuccessPage