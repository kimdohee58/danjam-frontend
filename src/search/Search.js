import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import List from './List';
import SearchResult from './SearchResult';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
    background: #f0f4f8;
    min-height: 100vh;
`;

const Title = styled.h1`
    cursor: pointer;
    margin-bottom: 30px;
    font-size: 2.5em;
    color: #333;
`;

const SearchBar = styled.div`
    display: flex;
    justify-content: space-around; /* 요소들을 일정 간격으로 배치 */
    align-items: center;
    width: 100%;
    max-width: 1400px;
    background: white;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
    position: relative;
`;

const SelectWrapper = styled.div`
    position: relative;
    flex: 1;
    margin-right: 10px;
    min-width: 200px; /* 최소 가로 크기 지정 */
`;

const DatePickerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 2;
    position: relative;
    margin: 0 10px;
    min-width: 200px; /* 최소 가로 크기 지정 */
`;

const PersonSelector = styled.div`
    position: relative;
    flex: 1;
    margin-left: 10px;
    min-width: 200px; /* 최소 가로 크기 지정 */
`;

const SelectLabel = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 1.2em;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 30px;
    padding: 12px 20px;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    position: relative;
    user-select: none;
    margin-bottom: 5px;
    text-align: center;
    &:hover {
        background-color: #f8f8f8;
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
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
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
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    transition: background-color 0.3s;
    margin: 5px;
    flex: 1;
    &:hover {
        background-color: #f8f8f8;
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
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    position: relative;
    user-select: none;
    margin-bottom: 5px;
    width: 100%;
    max-width: 250px;
    text-align: center;
    &:hover {
        background-color: #f8f8f8;
    }
`;

const PersonLabel = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 1.2em;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 30px;
    padding: 12px 20px;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    position: relative;
    user-select: none;
`;

const Dropdown = styled.div`
    display: ${props => props.open ? 'block' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
    z-index: 1000;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
`;

const DropdownItem = styled.div`
    padding: 12px;
    cursor: pointer;
    border-radius: 6px;
    &:hover {
        background-color: #f8f8f8;
    }
`;

const SubmitButton = styled(Button)`
    margin-left: 10px;
    font-size: 1.1em;
    padding: 0.6em 2.5em;
    border-radius: 30px;
    background-color: #FF5A5F;
    border: none;
    color: white;
    &:hover {
        background-color: #FF3A3F;
    }
`;

function Search(props) {
    const navigate = useNavigate();

    const [search, setSearch] = useState({
        city: '선택',
        checkIn: '',
        checkOut: '',
        person: 0,
    });

    const [selectedCity, setSelectedCity] = useState('선택');
    const [selectedDate, setSelectedDate] = useState({
        checkIn: new Date(),
        checkOut: null,
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

    const handleGuestClick = (increment) => {
        setSelectedPerson(prev => prev + increment);
        setDropdownOpen(false);
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
        // navigate('/search')
    };

    return (
        <Container>
            <Title onClick={() => navigate('/')}>단잠</Title>

            <SearchBar>
                <SelectWrapper>
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
                </SelectWrapper>

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

                <PersonSelector>
                    <PersonLabel onClick={toggleDropdown}>
                        인원 {selectedPerson}
                    </PersonLabel>
                    <Dropdown open={dropdownOpen}>
                        <DropdownItem onClick={() => handleGuestClick(-1)}>- {selectedPerson > 0 ? `(${selectedPerson - 1})` : '없음'}</DropdownItem>
                        <DropdownItem onClick={() => handleGuestClick(1)}>+ {selectedPerson + 1}</DropdownItem>
                    </Dropdown>
                </PersonSelector>

                <SubmitButton onClick={onSubmit}>검색</SubmitButton>
            </SearchBar>

            <div style={{ marginTop: '20px', width: '100%', maxWidth: '1400px' }}>
                {search.city === '선택' && search.checkIn === '' && search.checkOut === '' && search.person === 0 ?
                    <List userInfo={props.userInfo}/> : <SearchResult search={search} userInfo={props.userInfo} />}
            </div>
        </Container>
    );
}

export default Search;
