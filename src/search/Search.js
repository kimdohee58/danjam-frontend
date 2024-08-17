import {useCallback, useEffect, useMemo, useState} from "react";
import 'react-datepicker/dist/react-datepicker.css';
import List from "./List";
import DatePicker from "react-datepicker";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import SearchResult from "./SearchResult";
import TestList from "./TestList";
import styled from 'styled-components';

// Styled components
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`;

const Header = styled.h1`
    cursor: pointer;
    font-size: 2rem;
    color: #007bff;
    margin-bottom: 20px;
`;

const FormContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
`;

const Select = styled.select`
    padding: 10px;
    font-size: 1rem;
`;

const DatePickerWrapper = styled(DatePicker)`
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
    font-size: 1rem;
`;

const PersonSelector = styled.div`
    display: flex;
    align-items: center;
    font-size: 1rem;
`;

const PersonButton = styled(Button)`
    margin: 0 5px;
`;

const SearchButton = styled(Button)`
    background-color: #007bff;
    border: none;
    margin-left: 10px;
    &:hover {
        background-color: #0056b3;
    }
`;

function Search() {
    const navigate = useNavigate();

    const [search, setSearch] = useState({
        city: '선택',
        checkIn: '',
        checkOut: '',
        person: 0,
    })

    // logo 누르면 main으로 돌아가기
    const toMain = () => {
        setSelectedCity('선택')
        setSelectedDate({
            checkIn: new Date(),
            checkOut: new Date(),
        })
        setSelectedPerson(0)
        onSubmit()
    }

    const cityList = ["서울특별시", "경기도", "강원도", "인천광역시",
        "충청북도", "충청남도", "경상남도", "경상북도", "전라남도", "전라북도",
        "부산광역시", "대전광역시", "울산광역시", "광주광역시", "대구광역시"]
    const [selectedCity, setSelectedCity] = useState('선택')
    const handleSelect = (e) => {
        setSelectedCity(e.currentTarget.value)
    }

    // calendar
    const [selectedDate, setSelectedDate] = useState({
        checkIn: new Date(),
        checkOut: new Date(),
    })
    const setChangeDate = (dates) => {
        const [start, end] = dates
        setSelectedDate({
            // format https://steemit.com/hive-101145/@realmankwon/react
            checkIn: start,
            checkOut: end,

            // checkIn: format(start, 'yyyy-MM-dd HH:mm:ss'),
            // checkOut: format(end, 'yyyy-MM-dd HH:mm:ss'),
        })
        console.log(selectedDate.checkIn, selectedDate.checkOut)
    }

    // person
    let [selectedPerson, setSelectedPerson] = useState(0)

    let onMinus = () => {
        if (selectedPerson > 0) {
            setSelectedPerson(selectedPerson - 1);
        } else {
            setSelectedPerson(0)
        }
    }

    let onPlus = () => {
        setSelectedPerson(selectedPerson + 1);
    }

    // submit
    // const navigate = useNavigate()
    const onSubmit = () => {
        setSearch({
            city: selectedCity,
            date: selectedDate,
            person: selectedPerson,
        })
        console.log("onSubmit", search)
        // navigate('/search')
    }

    // https://ityranno.tistory.com/entry/react-Spring-Boot-Spring-Boot-%EB%8D%B0%EC%9D%B4%ED%84%B0-react%EC%97%90-%EA%B0%80%EC%A0%B8%EC%98%A4%EA%B8%B0

    return (
        <Container>
            <Header onClick={toMain}>{'단잠'}</Header>
            <FormContainer>
                <Select onChange={handleSelect} value={selectedCity}>
                    <option value={'선택'} key={'선택'}>
                        도시 선택
                    </option>
                    {cityList.map((item) => (
                        <option value={item} key={item}>
                            {item}
                        </option>
                    ))}
                </Select>

                <DatePickerWrapper
                    selectsRange={true}
                    dateFormat="MM월 dd일"
                    startDate={selectedDate.checkIn}
                    endDate={selectedDate.checkOut}
                    minDate={new Date()}
                    maxDate={new Date('2025-12-31')}
                    onChange={setChangeDate} />

                <PersonSelector>
                    인원 선택
                    <PersonButton onClick={onMinus}>-</PersonButton>
                    {selectedPerson}
                    <PersonButton onClick={onPlus}>+</PersonButton>
                    <SearchButton onClick={onSubmit}>검색</SearchButton>
                </PersonSelector>
            </FormContainer>
            <div>
                {search.city === '선택' && search.checkIn === '' && search.checkOut === '' && search.person === 0 ?
                    <List /> : <SearchResult search={search} />}
            </div>
        </Container>
    );
}

export default Search;
