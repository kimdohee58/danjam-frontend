import React, {useState} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import {Button} from 'react-bootstrap';
import {useLocation, useNavigate} from 'react-router-dom';
import List from './List';
import SearchResult from './SearchResult';
import styled from 'styled-components';
import {addDays} from "date-fns";

// Styled components
// const Container = styled.div`
//     display: flex;
//     width: 100%;
//     min-height: 100vh;
//     flex-direction: column;
//     align-items: center;
//     position: relative;
// `;
//
// const Title = styled.h1`
//     cursor: pointer;
//     margin-bottom: 30px;
//     font-size: 2.5em;
//     color: #333;
// `;
//
// const SearchBar = styled.div`
//     display: flex;
//     justify-content: space-around;
//     align-items: center;
//     width: 90%;
//     max-width: 1400px;
//     background: white;
//     border-radius: 20px;
//     padding: 20px;
//     box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
//     position: relative;
// `;
//
// const CityWrapper = styled.div`
//     position: relative;
//     flex: 1;
//     margin-right: 10px;
//     min-width: 200px;
// `;
//
// const DatePickerWrapper = styled.div`
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     flex: 2;
//     position: relative;
//     margin: 0 10px;
//     min-width: 200px;
// `;
//
// const PersonWrapper = styled.div`
//     position: relative;
//     flex: 1;
//     margin-left: 10px;
//     margin-bottom: 4px;
//     min-width: 200px;
// `;
//
// const SelectLabel = styled.div`
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     cursor: pointer;
//     font-size: 1.2em;
//     color: #333;
//     border: 1px solid #ddd;
//     border-radius: 30px;
//     padding: 12px 20px;
//     background-color: white;
//     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//     position: relative;
//     user-select: none;
//     margin-bottom: 5px;
//     text-align: center;
//
//     &:hover {
//         background-color: #f8f8f8;
//     }
// `;
//
// const CityList = styled.div`
//     display: ${props => props.open ? 'block' : 'none'};
//     position: absolute;
//     top: 100%;
//     left: 0;
//     background: white;
//     border: 1px solid #ddd;
//     border-radius: 10px;
//     box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
//     z-index: 1000;
//     width: 100%;
//     max-height: 300px;
//     overflow-y: auto;
//     padding: 10px;
//     box-sizing: border-box;
// `;
//
// const CityButton = styled.div`
//     background-color: #fff;
//     border: 1px solid #ddd;
//     border-radius: 25px;
//     padding: 10px 15px;
//     font-size: 1em;
//     color: #333;
//     cursor: pointer;
//     text-align: center;
//     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//     transition: background-color 0.3s;
//     margin: 5px;
//
//     &:hover {
//         background-color: #f8f8f8;
//     }
// `;
//
// const DatePickerLabel = styled.div`
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     cursor: pointer;
//     font-size: 1.2em;
//     color: #333;
//     border: 1px solid #ddd;
//     border-radius: 30px;
//     padding: 12px 20px;
//     background-color: white;
//     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//     position: relative;
//     user-select: none;
//     margin-bottom: 5px;
//     width: 100%;
//     max-width: 250px;
//     text-align: center;
//
//     &:hover {
//         background-color: #f8f8f8;
//     }
// `;
//
// const PersonButton = styled.button`
//     font-size: 1em;
//     background-color: #f0f4f8;
//     border: 1px solid #ddd;
//     border-radius: 80%;  /* 둥근 모양으로 설정 */
//     cursor: pointer;
//     width: 32px;  /* 크기 조정 */
//     height: 32px;  /* 크기 조정 */
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     margin: 0 8px 0 8px;  /* 위아래 간격 없앰 */
//
//     &:hover {
//         background-color: #e0e4e8;
//     }
//
//     &:focus {
//         outline: none;
//     }
// `;
//
// const PersonLabel = styled.div`
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     cursor: pointer;
//     font-size: 1.2em;
//     color: #333;
//     border: 1px solid #ddd;
//     border-radius: 30px;
//     padding: 9px 12px;
//     background-color: white;
//     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//     position: relative;
//     user-select: none;
// `;
//
// const SubmitButton = styled(Button)`
//     margin-left: 10px;
//     font-size: 1.1em;
//     padding: 0.6em 2.5em;
//     border-radius: 30px;
//     background-color: #FF5A5F;
//     border: none;
//     color: white;
//
//     &:hover {
//         background-color: #FF3A3F;
//     }
// `;

const Container = styled.div`
    display: flex;
    width: 100%;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    position: relative;

    @media (max-width: 768px) {
        align-items: flex-start;  /* 모바일에서는 왼쪽 정렬 */
    }
`;

const Title = styled.h1`
    cursor: pointer;
    margin-bottom: 30px;
    font-size: 2.5em;
    color: #333;

    @media (max-width: 768px) {
        font-size: 2em;  /* 모바일에서 글씨 크기 줄이기 */
        margin-bottom: 20px;
    }
`;

const SearchBar = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 90%;
    max-width: 900px;
    background: white;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    position: relative;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
        padding: 15px;
    }
`;

const CityWrapper = styled.div`
    position: relative;
    flex: 1;
    margin-right: 10px;
    min-width: 200px;

    @media (max-width: 768px) {
        margin-right: 0;
        margin-bottom: 10px;
        min-width: 100%;
    }
`;

const DatePickerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 2;
    position: relative;
    margin: 0 10px;
    min-width: 200px;

    @media (max-width: 768px) {
        margin: 0;
        min-width: 100%;
    }
`;

const PersonWrapper = styled.div`
    position: relative;
    flex: 1;
    margin-left: 10px;
    margin-bottom: 4px;
    min-width: 200px;

    @media (max-width: 768px) {
        margin-left: 0;
        margin-bottom: 10px;
        min-width: 100%;
    }
`;

const SelectLabel = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.2em;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 30px;
    padding: 12px 20px;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative;
    user-select: none;
    margin-bottom: 5px;
    text-align: center;

    &:hover {
        background-color: #f8f8f8;
    }

    @media (max-width: 768px) {
        font-size: 1.1em;
        padding: 10px 15px;
    }
`;

const CityList = styled.div`
    display: ${props => props.open ? 'block' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    width: 100%;
    max-height: 300px;
    overflow-y: auto;
    padding: 10px;
    box-sizing: border-box;
`;

const CityButton = styled.div`
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 25px;
    padding: 10px 15px;
    font-size: 1em;
    color: #333;
    cursor: pointer;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s;
    margin: 5px;

    &:hover {
        background-color: #f8f8f8;
    }

    @media (max-width: 768px) {
        font-size: 0.9em;
        padding: 8px 12px;
    }
`;

const DatePickerLabel = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.2em;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 30px;
    padding: 12px 20px;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative;
    user-select: none;
    margin-bottom: 5px;
    width: 100%;
    max-width: 250px;
    text-align: center;

    &:hover {
        background-color: #f8f8f8;
    }

    @media (max-width: 768px) {
        max-width: 100%;
        font-size: 1.1em;
    }
`;

const PersonButton = styled.button`
    font-size: 1em;
    background-color: #f0f4f8;
    border: 1px solid #ddd;
    border-radius: 80%;
    cursor: pointer;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 8px 0 8px;

    &:hover {
        background-color: #e0e4e8;
    }

    &:focus {
        outline: none;
    }

    @media (max-width: 768px) {
        width: 28px;
        height: 28px;
    }
`;

const PersonLabel = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.2em;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 30px;
    padding: 9px 12px;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative;
    user-select: none;
`;

const SubmitButton = styled(Button)`
    margin-left: 10px;
    font-size: 1.1em;
    padding: 0.6em 2.5em;
    border-radius: 30px;
    background-color: #FF5A5F;
    border: none;
    color: white;
    word-wrap: break-word;
    white-space: normal;

    &:hover {
        background-color: #FF3A3F;
        cursor: pointer;
    }

    @media (max-width: 768px) {
        font-size: 1em;
        padding: 0.5em 2em;
    }
`;


function Search(props) {
    const navigate = useNavigate();
    const location = useLocation();

    let userInfo = {
        id: '',
        email: '',
        name: '',
        phoneNum: '',
        role: '',
    }
    if (location.state != null) {
        userInfo = location.state.userInfo;
    }

    const [search, setSearch] = useState({
        city: '선택',
        checkIn: '',
        checkOut: '',
        person: 0,
    });

    const [selectedCity, setSelectedCity] = useState('선택');
    const [selectedDate, setSelectedDate] = useState({
        checkIn: new Date(),
        checkOut: addDays(new Date(), 1),
    });
    const [selectedPerson, setSelectedPerson] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [cityListVisible, setCityListVisible] = useState(false);

    const cityList = ["서울특별시", "경기도", "강원도", "인천광역시",
        "충청북도", "충청남도", "경상남도", "경상북도", "전라남도", "전라북도",
        "부산광역시", "대전광역시", "울산광역시", "광주광역시", "대구광역시"];

    const handleSelect = (e) => {
        setSelectedCity(e.currentTarget.value);
    };

    const setChangeDate = (dates) => {
        const [start, end] = dates;
        setSelectedDate({
            checkIn: start,
            checkOut: end,
        });
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleGuestClick = (change) => {
        if (selectedPerson + change >= 0) {
            setSelectedPerson(prevPerson => prevPerson + change);
        }
    };

    const toggleDatePicker = () => {
        setDatePickerVisible(!datePickerVisible);
    };

    const toggleCityList = () => {
        setCityListVisible(!cityListVisible);
    };

    const onCitySelect = (city) => {
        setSelectedCity(city);
        setCityListVisible(false);
    };

    const onSubmit = () => {
        setSearch({
            city: selectedCity,
            date: selectedDate,
            person: selectedPerson,
        });
        console.log("onSubmit", search);
        // navigate('/search');
    };

    return (
        <Container>
            <Title onClick={() => navigate('/')}>단잠</Title>

            <SearchBar>
                <CityWrapper>
                    <SelectLabel onClick={toggleCityList}>
                        {selectedCity === '선택' ? '도시 선택' : selectedCity}
                    </SelectLabel>
                    <CityList open={cityListVisible}>
                        {cityList.map((city) => (
                            <CityButton key={city} onClick={() => onCitySelect(city)}>
                                {city}
                            </CityButton>
                        ))}
                    </CityList>
                </CityWrapper>

                <DatePickerWrapper>
                    <DatePickerLabel onClick={toggleDatePicker}>
                        {selectedDate.checkIn && selectedDate.checkOut
                            ? `${selectedDate.checkIn.toLocaleDateString()} - ${selectedDate.checkOut.toLocaleDateString()}`
                            : '체크인 / 체크아웃'}
                    </DatePickerLabel>
                    {datePickerVisible && (
                        <DatePicker
                            selectsRange={true}
                            dateFormat="MM월 dd일"
                            startDate={selectedDate.checkIn}
                            endDate={selectedDate.checkOut}
                            minDate={new Date()}
                            maxDate={new Date('2025-12-31')}
                            onChange={setChangeDate}
                            className="datepicker"
                            inline
                        />
                    )}
                </DatePickerWrapper>

                <PersonWrapper>
                    <PersonLabel onClick={toggleDropdown}>
                        <PersonButton onClick={() => handleGuestClick(-1)}>-</PersonButton>
                            인원 {selectedPerson}
                        <PersonButton onClick={() => handleGuestClick(+1)}>+</PersonButton>
                    </PersonLabel>
                </PersonWrapper>

                <SubmitButton onClick={onSubmit}>검색</SubmitButton>
            </SearchBar>

            <div style={{marginTop: '20px', width: '100%', maxWidth: '1400px'}}>
                {search.city === '선택' && search.checkIn === '' && search.checkOut === '' && search.person === 0
                    ? <List userInfo={userInfo}/>
                    : <SearchResult search={search} userInfo={userInfo}/>}
            </div>
        </Container>
    );
}

export default Search;
