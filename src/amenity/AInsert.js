import {useLocation, useNavigate, useParams} from "react-router-dom";
import {Button, Container, FormControl} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import Header from "../Header";

const AInsert = () => {
    const location = useLocation();  // 현재 URL의 위치 정보를 가져옵니다.
    const userInfo = location.state.userInfo;  // URL 상태에서 사용자 정보를 가져옵니다.

    console.log('AInsert', userInfo)

    const params = useParams();
    const id = parseInt(params.id);

    const [amenities, setAmenities] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);

    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const response = await axios.get('http://localhost:8080/amenity/list');
                const {amenityList} = response.data;
                setAmenities(amenityList);
                console.log('fetching amenities:', amenityList);
            } catch (error) {
                console.error('Error fetching amenities:', error);
            }
        };

        fetchAmenities();
    }, []);

    const onChange = (e) => {
        const {value, checked} = e.target;
        setSelectedAmenities(prev =>
            checked ? [...prev, parseInt(value)] : prev.filter(id => id !== parseInt(value))
        );
    };
    const navigate = useNavigate()

    const moveToNext = (id) => {
        navigate(`/room/rInsert/${id}`, {state: {userInfo}})
    }
    const onSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            amenityId: selectedAmenities,
            dormId: id
        };
        console.log(dataToSend)
        try {
            const resp = await axios.post('http://localhost:8080/damenity/insert', dataToSend, {
                withCredentials: true
            });
            moveToNext(id)
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <>
            <Header userInfo={userInfo}/>
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
        </>
    );
};

export default AInsert;
