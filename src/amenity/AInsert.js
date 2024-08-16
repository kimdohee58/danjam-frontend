import {useNavigate, useParams} from "react-router-dom";
import { Button, Container, FormControl } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";

const AInsert = () => {
    const params = useParams();
    const id = parseInt(params.id);

    const [amenities, setAmenities] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);

    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const response = await axios.get('http://localhost:8080/amenity/list');
                const { amenityList } = response.data;
                setAmenities(amenityList);
                console.log('fetching amenities:', amenityList);
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
    const navigate = useNavigate()

    const moveToNext = (id) => {
        navigate(`/room/rInsert/${id}`)
    }
    const onSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            amenityId: selectedAmenities,
            dormId: id
        };

        try {
            const resp = await axios.post('http://localhost:8080/damenity/insert', dataToSend);
            moveToNext(id)
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <Container className="mt-3">
            <h1>숙소 편의시설 정보를 추가하세요</h1>
            <form onSubmit={onSubmit}>
                {Array.isArray(amenities) && amenities.length > 0 ? (
                    amenities.map(amenity => (
                        <div key={amenity.id}>
                            <FormControl
                                type="checkbox"
                                id={`category-${amenity.id}`}
                                name="categoryId"
                                value={amenity.id}
                                checked={selectedAmenities.includes(amenity.id)}
                                onChange={onChange}
                            />
                            <label htmlFor={`category-${amenity.id}`}>{amenity.name}</label>
                        </div>
                    ))
                ) : (
                    <p>No amenities available.</p>
                )}
                <Button type='submit'>
                    다음단계
                </Button>
            </form>
        </Container>
    );
};

export default AInsert;
