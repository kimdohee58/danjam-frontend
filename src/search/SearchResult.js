import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import DormCard from "./DormCard";

function SearchResult(props) {
    // Setting up search object and default values
    let search = {};
    if (props.search.date.checkOut === null) {
        props.search.date.checkOut = new Date();
    } else if (props.search.date.checkIn === null) {
        props.search.date.checkIn = new Date();
    }
    search = {
        city: props.search.city,
        checkIn: format(props.search.date.checkIn, 'yyyy-MM-dd 15:00:00'),
        checkOut: format(props.search.date.checkOut, 'yyyy-MM-dd 11:00:00'),
        person: props.search.person,
    };

    const navigate = useNavigate();

    // Filter state
    const [isChecked, setIsChecked] = useState(false);
    const [selectedAmenity, setSelectedAmenity] = useState([]);
    const [amenity, setAmenity] = useState({ amenityList: [] });
    const [selectedTown, setSelectedTown] = useState([]);
    const [town, setTown] = useState({ townList: [] });

    // Checkbox handlers
    const checkedAmenityHandler = (value, isChecked) => {
        setSelectedAmenity(prev =>
            isChecked ? [...prev, value] : prev.filter(amenity => amenity !== value)
        );
    };

    const checkAHandler = (e, value) => {
        setIsChecked(!isChecked);
        checkedAmenityHandler(value, e.target.checked);
    };

    const checkedTownHandler = (value, isChecked) => {
        setSelectedTown(prev =>
            isChecked ? [...prev, value] : prev.filter(town => town !== value)
        );
    };

    const checkTHandler = (e, value) => {
        setIsChecked(!isChecked);
        checkedTownHandler(value, e.target.checked);
    };

    // Dorm list state
    const [dorms, setDorms] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const size = 10; // Number of items per page

    useEffect(() => {
        setSelectedAmenity([]);
        setSelectedTown([]);

        const fetchTownList = async () => {
            try {
                const resp = await axios.post("http://localhost:8080/town/list", props.search, { withCredentials: true });
                if (resp.status === 200 && resp.data.result === 'success') {
                    setTown(resp.data);
                }
            } catch (e) {
                console.error("Error fetching town list", e);
            }
        };

        const fetchAmenityList = async () => {
            try {
                const resp = await axios.get("http://localhost:8080/amenity/list");
                if (resp.status === 200 && resp.data.result === 'success') {
                    setAmenity(resp.data);
                }
            } catch (e) {
                console.error("Error fetching amenity list", e);
            }
        };

        const fetchDormList = async () => {
            try {
                const resp = await axios.post("http://localhost:8080/search", search, { withCredentials: true });
                if (resp.status === 200 && resp.data.result === 'success') {
                    setDorms(resp.data.dormList);
                }
            } catch (e) {
                console.error("Error fetching dorm list", e);
            }
        };

        fetchTownList();
        fetchAmenityList();
        fetchDormList();
    }, [props]);

    useEffect(() => {
        const fetchFilteredDorms = async () => {
            const filter = {
                searchDto: search,
                amenities: selectedAmenity,
                cities: selectedTown,
            };

            try {
                const resp = selectedAmenity.length === 0 && selectedTown.length === 0
                    ? await axios.post("http://localhost:8080/search", search, { withCredentials: true })
                    : await axios.post("http://localhost:8080/search/filter", filter, { withCredentials: true, headers: { 'Content-Type': "application/json" } });

                if (resp.status === 200 && resp.data.result === 'success') {
                    setDorms(resp.data.dormList);
                    setHasMore(resp.data.dormList.length >= size);
                }
            } catch (e) {
                console.error("Error fetching filtered dorms", e);
            }
        };

        fetchFilteredDorms();
    }, [selectedAmenity, selectedTown]);

    const toggleWish = async (dormId) => {
        try {
            setDorms(prevDorms =>
                prevDorms.map(dorm =>
                    dorm.id === dormId
                        ? { ...dorm, isWish: !dorm.isWish }
                        : dorm
                )
            );

            const targetDorm = dorms.find(dorm => dorm.id === dormId);
            if (targetDorm.isWish) {
                await axios.delete(`http://localhost:8080/wish/${dormId}`, { withCredentials: true });
            } else {
                await axios.get(`http://localhost:8080/wish/${dormId}`, {}, { withCredentials: true });
            }
        } catch (e) {
            console.error("Error toggling wish status", e);
            setDorms(prevDorms =>
                prevDorms.map(dorm =>
                    dorm.id === dormId
                        ? { ...dorm, isWish: !dorm.isWish }
                        : dorm
                )
            );
        }
    };

    const loadMoreDorms = () => {
        setPage(prevPage => prevPage + 1);
    };

    const searchInfo = {
        checkIn: search.checkIn,
        checkOut: search.checkOut,
        person: search.person,
    };

    const moveToDorm = (id) => {
        navigate('dorm/' + id, { state: { searchInfo: searchInfo, userInfo: props.userInfo } });
    };

    return (
        <>
            <h1>Search List</h1>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                {/* Filter section */}
                <div style={{ flex: 1, marginRight: '20px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <h3>{props.search.city} Town</h3>
                        {town.townList.map(town => (
                            <label key={town} style={{ display: 'block' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedTown.includes(town)}
                                    onChange={(e) => checkTHandler(e, town)}
                                />
                                {town}
                            </label>
                        ))}
                    </div>
                    <div>
                        <h3>Amenities</h3>
                        {amenity.amenityList.map(amenity => (
                            <label key={amenity.id} style={{ display: 'block' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedAmenity.includes(amenity.id)}
                                    onChange={(e) => checkAHandler(e, amenity.id)}
                                />
                                {amenity.name}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Dorm list */}
                <div style={{ flex: 2 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '50px' }}>
                        {dorms.map(dorm => (
                            <DormCard
                                key={dorm.id}
                                dorm={dorm}
                                isWish={dorm.isWish}
                                toggleWish={() => toggleWish(dorm.id)}
                                onClick={() => moveToDorm(dorm.id)}
                            />
                        ))}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        {hasMore ? (
                            <button
                                onClick={loadMoreDorms}
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '16px',
                                    backgroundColor: '#007BFF',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }}
                            >
                                더보기
                            </button>
                        ) : (
                            <p>더 불러올 목록이 없습니다.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default SearchResult;
