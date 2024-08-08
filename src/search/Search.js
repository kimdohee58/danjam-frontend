import DatePicker from "react-datepicker";
import {useState} from "react";
import 'react-datepicker/dist/react-datepicker.css';

function Search() {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // https://ityranno.tistory.com/entry/react-Spring-Boot-Spring-Boot-%EB%8D%B0%EC%9D%B4%ED%84%B0-react%EC%97%90-%EA%B0%80%EC%A0%B8%EC%98%A4%EA%B8%B0

    return (
        <>
            <div style={{display: "flex", justifyContent: "space-evenly"}}>
                <h1>City</h1>
                <DatePicker
                    dateFormat='yyyy.MM.dd' // 날짜 형태
                    shouldCloseOnSelect // 날짜를 선택하면 datepicker가 자동으로 닫힘
                    minDate={new Date()} // minDate 이전 날짜 선택 불가
                    maxDate={new Date('2025-12-31')} // maxDate 이후 날짜 선택 불가
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                />
                <h1>Person</h1>
            </div>
            <div>

            </div>
        </>
    );
    // 캘린더 2개 띄우기
    /*
    return (
            <>
                <DatePicker
                    renderCustomHeader={({
                                             monthDate,
                                             customHeaderCount,
                                             decreaseMonth,
                                             increaseMonth,
                                         }) => (
                        <div>
                            <button
                                aria-label="Previous Month"
                                className={
                                    "react-datepicker__navigation react-datepicker__navigation--previous"
                                }
                                style={customHeaderCount === 1 ? {visibility: "hidden"} : null}
                                onClick={decreaseMonth}
                            >
                <span
                    className={
                        "react-datepicker__navigation-icon react-datepicker__navigation-icon--previous"
                    }
                >
                  {"<"}
                </span>
                            </button>
                            <span className="react-datepicker__current-month">
                {monthDate.toLocaleString("en-US", {
                    month: "long",
                    year: "numeric",
                })}
              </span>
                            <button
                                aria-label="Next Month"
                                className={
                                    "react-datepicker__navigation react-datepicker__navigation--next"
                                }
                                style={customHeaderCount === 0 ? {visibility: "hidden"} : null}
                                onClick={increaseMonth}
                            >
                <span
                    className={
                        "react-datepicker__navigation-icon react-datepicker__navigation-icon--next"
                    }
                >
                  {">"}
                </span>
                            </button>
                        </div>
                    )}
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    monthsShown={2}
                />
            </>
        );
    */
}

export default Search