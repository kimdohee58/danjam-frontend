import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { addDays, format, isSameDay } from "date-fns";
import DormCard from "./DormCard";

function SearchResult(props) {
    const search = ({
        city: props.search.city,
        checkIn: format(props.search.date.checkIn, 'yyyy-MM-dd 15:00:00'),
        checkOut: format(props.search.date.checkOut, 'yyyy-MM-dd 11:00:00'),
        person: props.search.person,
    })

    // State for filter options and dorm list
    const [isChecked, setIsChecked] = useState(false);
    const [selectedAmenity, setSelectedAmenity] = useState([]);
    const [amenity, setAmenity] = useState({ amenityList: [] });
    const [selectedTown, setSelectedTown] = useState([]);
    const [town, setTown] = useState({ townList: [] });
    const [dorms, setDorms] = useState([]);
    const [isWish, setIsWish] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const navigate = useNavigate();

    // Fetch town and amenity lists on component mount
    useEffect(() => {
        setSelectedAmenity([]);
        setSelectedTown([]);

        const fetchTownList = async () => {
            try {
                const resp = await axios.post(`${process.env.REACT_APP_API_SERVER_URL}/town/list`, props.search, { withCredentials: true });
                if (resp.status === 200 && resp.data.result === 'success') {
                    setTown(resp.data);
                }
            } catch (e) {
                console.error("Error fetching town list: ", e);
            }
        };
        fetchTownList();

        const fetchAmenityList = async () => {
            try {
                const resp = await axios.get(`${process.env.REACT_APP_API_SERVER_URL}/amenity/list`);
                if (resp.status === 200 && resp.data.result === 'success') {
                    setAmenity(resp.data);
                }
            } catch (e) {
                console.error("Error fetching amenity list: ", e);
            }
        };
        fetchAmenityList();

        const fetchDormList = async () => {
            try {
                const resp = await axios.post(`${process.env.REACT_APP_API_SERVER_URL}/search`, search, { withCredentials: true });
                if (resp.status === 200 && resp.data.result === 'success') {
                    setDorms(resp.data.dormList);
                }
            } catch (e) {
                console.error("Error fetching dorm list: ", e);
            }
        };
        fetchDormList();
    }, [props]);

    // Fetch filtered dorms when amenities or towns change
    useEffect(() => {
        const filter = {
            searchDto: search,
            amenities: selectedAmenity,
            cities: selectedTown,
        };

        const fetchFilteredDorms = async () => {
            try {
                const resp = selectedAmenity.length === 0 && selectedTown.length === 0
                    ? await axios.post(`${process.env.REACT_APP_API_SERVER_URL}/search`, search, { withCredentials: true })
                    : await axios.post(`${process.env.REACT_APP_API_SERVER_URL}/search/filter`, filter, {
                        withCredentials: true,
                        headers: { 'Content-Type': "application/json" }
                    });

                if (resp.status === 200 && resp.data.result === 'success') {
                    setDorms(resp.data.dormList);
                }
            } catch (e) {
                console.error("Error fetching filtered dorms: ", e);
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
                await axios.delete(`${process.env.REACT_APP_API_SERVER_URL}/wish/${dormId}`, { withCredentials: true });
            } else {
                await axios.get(`${process.env.REACT_APP_API_SERVER_URL}/wish/${dormId}`, { withCredentials: true });
            }
        } catch (e) {
            console.error("Error toggling wish status: ", e);
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
        checkOut: isSameDay(search.checkIn, search.checkOut) ? format(addDays(search.checkOut, 1), 'yyyy-MM-dd 11:00:00') : search.checkOut,
        person: search.person,
    };

    const moveToDorm = (id) => {
        navigate('dorm/' + id, { state: { searchInfo: searchInfo, userInfo: props.userInfo } });
    };

    return (
        <>
            <h1>SearchList</h1>
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                {/* filter */}
                <div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <h3>{props.search.city} town</h3>
                        {town.townList.map((town) => (
                            <label key={town}>
                                <input
                                    id={town}
                                    type="checkbox"
                                    checked={selectedTown.includes(town)}
                                    onChange={(e) => {
                                        setIsChecked(!isChecked);
                                        setSelectedTown(prev =>
                                            e.target.checked
                                                ? [...prev, town]
                                                : prev.filter(t => t !== town)
                                        );
                                    }}
                                />
                                {town}
                            </label>
                        ))}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <h3>편의시설</h3>
                        {amenity.amenityList.map((amenity) => (
                            <label key={amenity.id}>
                                <input
                                    id={amenity.id}
                                    type="checkbox"
                                    checked={selectedAmenity.includes(amenity.id)}
                                    onChange={(e) => {
                                        setIsChecked(!isChecked);
                                        setSelectedAmenity(prev =>
                                            e.target.checked
                                                ? [...prev, amenity.id]
                                                : prev.filter(a => a !== amenity.id)
                                        );
                                    }}
                                />
                                {amenity.name}
                            </label>
                        ))}
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '50px' }}>
                        {dorms.map((dorm) => (
                            <DormCard
                                key={dorm.id}
                                dorm={dorm}
                                isWish={isWish}
                                toggleWish={() => toggleWish(dorm.id)}
                                goToDorm={() => moveToDorm(dorm.id)}
                            />
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        {hasMore ? (
                            <button onClick={loadMoreDorms} className="load-more-button">
                                더보기
                            </button>
                        ) : (
                            <p>더 불러올 목록이 없습니다.</p>
                        )}
                    </div>
                </div>
            </div>
            <style>
                {`
                    .load-more-button {
                        background-color: #007bff;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        font-size: 16px;
                        cursor: pointer;
                        border-radius: 5px;
                        transition: background-color 0.3s;
                    }
                    
                    .load-more-button:hover {
                        background-color: #0056b3;
                    }
                    
                    .load-more-button:disabled {
                        background-color: #d6d6d6;
                        cursor: not-allowed;
                    }
                `}
            </style>
        </>
    );
}

export default SearchResult;
