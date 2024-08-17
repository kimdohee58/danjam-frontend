import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { Button, Container } from 'react-bootstrap';

// Styled Components
const FormContainer = styled(Container)`
    margin-top: 3rem;
    max-width: 800px;
    width: 1000px;
    
`;

const StyledForm = styled.form`
    background: #fff;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
`;

const FormGroup = styled.div`
    margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #333;
`;

const FormControl = styled.input`
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-sizing: border-box;
    font-size: 1rem;
    margin-bottom: 0.5rem;

    &:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.25);
    }
`;

const TextArea = styled.textarea`
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-sizing: border-box;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    resize: vertical;

    &:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.25);
    }
`;

const RadioGroup = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 1.5rem;
`;

const RadioLabel = styled.label`
    display: block;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    color: #333;
    background-color: ${({ checked }) => (checked ? '#007bff' : '#fff')};
    color: ${({ checked }) => (checked ? '#fff' : '#333')};
    box-shadow: ${({ checked }) => (checked ? '0 0 0 0.2rem rgba(38, 143, 255, 0.25)' : 'none')};

    &:hover {
        background-color: #f1f1f1;
    }
`;

const SubmitButton = styled(Button)`
    width: 100%;
    padding: 0.75rem;
    font-size: 1.1rem;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s;

    &:hover {
        background-color: #0056b3;
    }

    &:disabled {
        background-color: #c0c0c0;
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.div`
    color: #dc3545;
    text-align: center;
    margin-top: 1rem;
    font-size: 1rem;
`;

const Insert = () => {
    const location = useLocation();
    const userInfo = location.state?.userInfo;

    const [inputs, setInputs] = useState({
        name: '',
        description: '',
        contactNum: '',
        city: '',
        town: '',
        address: '',
        categoryId: '',
        usersId: ''
    });

    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/dcategory/list');
                const { dcategoryList } = response.data;
                setCategories(dcategoryList);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('Error fetching categories');
            }
        };

        fetchCategories();
    }, []);

    const onChange = (e) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
    };

    const moveToNext = (id) => {
        navigate(`/amenity/AInsert/${id}`, { state: { userInfo } });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const dataToSend = {
            ...inputs,
            usersId: userInfo.id
        };

        try {
            const resp = await axios.post('http://localhost:8080/dorm/insert', dataToSend, {
                withCredentials: true
            });

            const { result, resultId, message } = resp.data;

            if (result === 'success') {
                moveToNext(resultId);
            } else {
                setError(message || 'An unexpected error occurred');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setError('Error submitting form');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormContainer>
            <StyledForm onSubmit={onSubmit}>
                <FormTitle>숙소 주소 작성</FormTitle>
                <FormGroup>
                    <FormLabel htmlFor="name">숙소이름</FormLabel>
                    <FormControl
                        type="text"
                        id="name"
                        value={inputs.name}
                        name="name"
                        onChange={onChange}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel htmlFor="description">시설내용</FormLabel>
                    <TextArea
                        id="description"
                        name="description"
                        value={inputs.description}
                        onChange={onChange}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel htmlFor="contactNum">전화번호</FormLabel>
                    <FormControl
                        type="tel"
                        id="contactNum"
                        value={inputs.contactNum}
                        name="contactNum"
                        onChange={onChange}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel htmlFor="city">시 도/특별광역시</FormLabel>
                    <FormControl
                        type="text"
                        id="city"
                        value={inputs.city}
                        name="city"
                        onChange={onChange}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel htmlFor="town">주/도 군/구</FormLabel>
                    <FormControl
                        type="text"
                        id="town"
                        value={inputs.town}
                        name="town"
                        onChange={onChange}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel htmlFor="address">전체주소(도로명 포함)</FormLabel>
                    <FormControl
                        type="text"
                        id="address"
                        value={inputs.address}
                        name="address"
                        onChange={onChange}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>숙소 종류</FormLabel>
                    <RadioGroup>
                        {categories.map(category => (
                            <div key={category.id}>
                                <input
                                    type="radio"
                                    id={`category-${category.id}`}
                                    name="categoryId"
                                    value={category.id}
                                    checked={inputs.categoryId === category.id.toString()}
                                    onChange={onChange}
                                    style={{ display: 'none' }} // Hide the radio buttons
                                />
                                <RadioLabel
                                    htmlFor={`category-${category.id}`}
                                    checked={inputs.categoryId === category.id.toString()}
                                >
                                    {category.name}
                                </RadioLabel>
                            </div>
                        ))}
                    </RadioGroup>
                </FormGroup>
                <FormGroup>
                    <SubmitButton type="submit" disabled={isSubmitting}>
                        {isSubmitting ? '제출 중...' : '다음단계'}
                    </SubmitButton>
                </FormGroup>
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </StyledForm>
        </FormContainer>
    );
};

export default Insert;
