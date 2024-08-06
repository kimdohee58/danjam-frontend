import { useEffect, useState } from 'react'
import { loadTossPayments } from '@tosspayments/tosspayments-sdk'
import { v4 as uuidv4 } from 'uuid'
import { useLocation } from 'react-router-dom'

const clientKey = process.env.REACT_APP_TOSS_PAYMENTS_CLIENT_KEY
const customerKey = generateUUID()

function generateUUID() {
    return uuidv4()
}

function PaymentWidget() {
    const findDormUrl = 'http://localhost:8080/dorms'
    const successUrl = window.location.origin + '/success'
    const failUrl = window.location.origin + '/fail'

    const location = useLocation()
    const bookingInfo = { ...location.state }
    const { user, dormId } = bookingInfo


    const [amount, setAmount] = useState({
        currency: 'KRW',
        value: 100,
    })
    const [ready, setReady] = useState(false)
    const [widgets, setWidgets] = useState(null)

    // useEffect(async () => {
    //     const response = await fetch(`${findDormUrl}/${dormId}`,{
    //         credentials: 'include',
    //     })
    //     console.log(response)
    // }, [dormId])

    useEffect(() => {
        async function fetchPaymentWidgets() {
            if (clientKey && customerKey) {
                const tossPayment = await loadTossPayments(clientKey)
                const widgets = tossPayment.widgets({
                    customerKey
                })

                setWidgets(widgets)
            }
        }

        fetchPaymentWidgets()
    }, [])

    useEffect(() => {
        async function renderPaymentWidgets() {
            if (widgets == null) {
                return
            }

            await widgets.setAmount(amount)

            await Promise.all([
                widgets.renderPaymentMethods({
                    selector: '#payment-method',
                    variantKey: "DEFAULT",
                }),
                widgets.renderAgreement({
                    selector: '#agreement',
                    variantKey: "AGREEMENT",
                })
            ])

            setReady(true)
        }

        renderPaymentWidgets()
    }, [widgets, amount])

    useEffect(() => {
        if (widgets == null) {
            return
        }

        widgets.setAmount(amount)
    }, [widgets, amount])

    const handleClick = async () => {
        try {
            if (widgets) {
                await widgets.requestPayment({
                    orderId: generateUUID(),
                    orderName: '나르샤호텔',
                    successUrl: successUrl,
                    failUrl: failUrl,
                    customerEmail: user.email,
                    customerName: user.name,
                    customerMobilePhone: user.phoneNumber,
                })
            }
        } catch (error) {
            console.error(error)
            if (error.code === 'USER_CANCEL') {
                // 결제 고객이 결제창을 닫았을 때 에러 처리
            } if (error.code === 'INVALID_CARD_COMPANY') {
                // 유효하지 않은 카드 코드에 대한 에러 처리
            }
        }
    }

    return (
        <div className="wrapper">
            <div className="box_section">
                {/* 결제 UI */}
                <div id="payment-method" />

                {/* 이용약관 UI */}
                <div id="agreement" />

                {/* 결제하기 버튼 */}
                <button
                    className="btn"
                    disabled={!ready}
                    onClick={handleClick}
                >
                    결제하기
                </button>
            </div>
        </div>
    )
}

export default PaymentWidget