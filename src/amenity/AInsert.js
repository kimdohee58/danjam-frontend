import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { Button, Container } from 'react-bootstrap';

// Styled Components
const FormContainer = styled(Container)`
    margin-top: 3rem;
    max-width: 800px;
`;

const FormTitle = styled.h1`
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
`;

const StyledForm = styled.form`
    background: #fff;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const AmenityGroup = styled.div`
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
    display: none; // Hide the default checkbox
`;

const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    color: #333;
    background-color: ${({ checked }) => (checked ? '#007bff' : '#fff')};
    color: ${({ checked }) => (checked ? '#fff' : '#333')};
    box-shadow: ${({ checked }) => (checked ? '0 0 0 0.2rem rgba(38, 143, 255, 0.25)' : 'none')};

    &:hover {
        background-color: ${({ checked }) => (checked ? '#0056b3' : '#f1f1f1')};
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

const NoAmenitiesMessage = styled.p`
    text-align: center;
    color: #777;
    font-size: 1rem;
    margin-top: 1rem;
`;

const AInsert = () => {
    const location = useLocation();
    const userInfo = location.state.userInfo;
    const params = useParams();
    const id = parseInt(params.id);

    const [amenities, setAmenities] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_SERVER_URL}/amenity/list`);
                const { amenityList } = response.data;
                setAmenities(amenityList);
            } catch (error) {
                console.error('Error fetching amenities:', error);
            }
        };

        fetchAmenities();
    }, []);

    const onChange = (e) => {
        const { value, checked } = e.target;
        setSelectedAmenities(prev =>
            checked ? [...prev, parseInt(value)] : prev.filter(id => id !== parseInt(value))
        );
    };

    const moveToNext = (id) => {
        navigate(`/room/rInsert/${id}`, { state: { userInfo } });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            amenityId: selectedAmenities,
            dormId: id
        };
            console.log(dataToSend)
        try {
            await axios.post(`${process.env.REACT_APP_API_SERVER_URL}/damenity/insert`, dataToSend, {
                withCredentials: true
            });
            moveToNext(id);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <FormContainer>
            <FormTitle>숙소 편의시설 정보를 추가하세요</FormTitle>
            <StyledForm onSubmit={onSubmit}>
                {Array.isArray(amenities) && amenities.length > 0 ? (
                    amenities.map(amenity => (
                        <AmenityGroup key={amenity.id}>
                            <HiddenCheckbox
                                id={`amenity-${amenity.id}`}
                                name="amenityId"
                                value={amenity.id}
                                checked={selectedAmenities.includes(amenity.id)}
                                onChange={onChange}
                            />
                            <CheckboxLabel
                                htmlFor={`amenity-${amenity.id}`}
                                checked={selectedAmenities.includes(amenity.id)}
                            >
                                {amenity.name}
                            </CheckboxLabel>
                        </AmenityGroup>
                    ))
                ) : (
                    <NoAmenitiesMessage>No amenities available.</NoAmenitiesMessage>
                )}
                <SubmitButton type='submit'>
                    다음단계
                </SubmitButton>
            </StyledForm>
        </FormContainer>
    );
};

export default AInsert;
