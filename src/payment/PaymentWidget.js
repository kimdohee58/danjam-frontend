import {useEffect, useState} from 'react'
import {loadTossPayments} from '@tosspayments/tosspayments-sdk'
import {v4 as uuidv4} from 'uuid'
import {useParams, useSearchParams} from 'react-router-dom'
import './PaymentWidget.css'

const clientKey = process.env.REACT_APP_TOSS_PAYMENTS_CLIENT_KEY
const customerKey = generateUUID()

function generateUUID() {
    return uuidv4()
}

function PaymentWidget({ bookingInfo }) {
    const [searchParams, setSearchParams] = useSearchParams()
    const params = useParams()
    const id = params.id

    const successUrl = window.location.origin + '/payments-success'
    const failUrl = window.location.origin + '/payments-fail'

    const { user, dormName, roomId, person, checkIn, checkOut } = bookingInfo

    const [amount, setAmount] = useState({
        currency: 'KRW',
        value: 100,
    })
    const [ready, setReady] = useState(false)
    const [widgets, setWidgets] = useState(null)

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
    }, [clientKey, customerKey])

    useEffect(() => {
        async function renderPaymentWidgets() {
            if (widgets == null) {
                return;
            }
            // ------ 주문의 결제 금액 설정 ------
            await widgets.setAmount(amount);

            await Promise.all([
                // ------  결제 UI 렌더링 ------
                widgets.renderPaymentMethods({
                    selector: "#payment-method",
                    variantKey: "DEFAULT",
                }),
                // ------  이용약관 UI 렌더링 ------
                widgets.renderAgreement({
                    selector: "#agreement",
                    variantKey: "AGREEMENT",
                }),
            ]);

            setReady(true);
        }

        renderPaymentWidgets();
    }, [widgets]);

    useEffect(() => {
        if (widgets == null) {
            return;
        }

        widgets.setAmount(amount);
    }, [widgets, amount]);

    const handleClick = async () => {
        try {
            if (widgets) {
                searchParams.set('userId', id)
                searchParams.set('roomId', roomId)
                searchParams.set('person', person)
                searchParams.set('checkIn', checkIn)
                searchParams.set('checkOut', checkOut)
                setSearchParams(searchParams)

                await widgets.requestPayment({
                    orderId: generateUUID(),
                    orderName: dormName,
                    successUrl: `${successUrl}?${searchParams}`,
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
                <div className="parent-payment-btn">
                    <button
                        className="payment-btn"
                        disabled={!ready}
                        onClick={handleClick}
                    >
                        결제하기
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PaymentWidget