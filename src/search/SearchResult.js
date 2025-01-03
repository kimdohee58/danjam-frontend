import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {addDays, format, isSameDay} from "date-fns";
import DormCard from "./DormCard";
import styled from "styled-components";

const Filter = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 5%;
    margin-left: 8%;
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
`;

const Title = styled.h3`
    font-size: 18px;
    margin-bottom: 10px;
    font-weight: bold;
`;

const Label = styled.label`
    display: flex;
    align-items: center;
    margin-bottom: 8px;
`;

const Checkbox = styled.input`
    margin-right: 8px;
`;

const Text = styled.span`
    font-size: 14px;
    color: #333;
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: space-evenly;
    position: relative;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const DormList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 50px;
`;

const CenteredDiv = styled.div`
    text-align: center;
    margin-bottom: 20px;
`;

const LoadMoreButton = styled.button`
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #0056b3;
    }

    &:disabled {
        background-color: #d6d6d6;
        cursor: not-allowed;
    }
`;

const Message = styled.p`
    text-align: center;
    color: #ff6b6b;
    font-size: 30px;
    font-weight: bold;
    background-color: #ffecec;
    border: 1px solid #ff6b6b;
    padding: 10px 15px;
    border-radius: 8px;
    margin: 20px auto;
    max-width: 500px;
`;

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
    const [amenity, setAmenity] = useState({amenityList: []});
    const [selectedTown, setSelectedTown] = useState([]);
    const [town, setTown] = useState({townList: []});
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
                const resp = await axios.post(`${process.env.REACT_APP_API_SERVER_URL}/town/list`, props.search, {withCredentials: true});
                if (resp.status === 200 && resp.data.result === 'success') {
                    setTown(resp.data);
                }

                console.log('town', town)
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
                const resp = await axios.post(`${process.env.REACT_APP_API_SERVER_URL}/search`, search, {withCredentials: true});
                if (resp.status === 200 && resp.data.result === 'success') {
                    setDorms(resp.data.dormList);
                    setHasMore(true)
                } else {
                    setDorms(resp.data.dormList);
                    setHasMore(false)
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
                    ? await axios.post(`${process.env.REACT_APP_API_SERVER_URL}/search`, search, {withCredentials: true})
                    : await axios.post(`${process.env.REACT_APP_API_SERVER_URL}/search/filter`, filter, {
                        withCredentials: true,
                        headers: {'Content-Type': "application/json"}
                    });

                if (resp.status === 200 && resp.data.result === 'success') {
                    setDorms(resp.data.dormList);
                    setHasMore(true)
                } else {
                    setDorms(resp.data.dormList);
                    setHasMore(false)
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
                        ? {...dorm, isWish: !dorm.isWish}
                        : dorm
                )
            );

            const targetDorm = dorms.find(dorm => dorm.id === dormId);

            if (targetDorm.isWish) {
                await axios.delete(`${process.env.REACT_APP_API_SERVER_URL}/wish/${dormId}`, {withCredentials: true});
            } else {
                await axios.get(`${process.env.REACT_APP_API_SERVER_URL}/wish/${dormId}`, {withCredentials: true});
            }
        } catch (e) {
            console.error("Error toggling wish status: ", e);
            setDorms(prevDorms =>
                prevDorms.map(dorm =>
                    dorm.id === dormId
                        ? {...dorm, isWish: !dorm.isWish}
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
        navigate('dorm/' + id, {state: {searchInfo: searchInfo, userInfo: props.userInfo}});
    };

    return (
        // <>
        //     <div style={{display: "flex", justifyContent: "space-evenly", position: "relative"}}>
        //         <Filter>
        //             <Section>
        //                 <Title>{props.search.city} 지역구</Title>
        //                 {town.townList.map((town) => (
        //                     <Label key={town}>
        //                         <Checkbox
        //                             id={town}
        //                             type="checkbox"
        //                             checked={selectedTown.includes(town)}
        //                             onChange={(e) => {
        //                                 setIsChecked(!isChecked);
        //                                 setSelectedTown(prev =>
        //                                     e.target.checked
        //                                         ? [...prev, town]
        //                                         : prev.filter(t => t !== town)
        //                                 );
        //                             }}
        //                         />
        //                         <Text>{town}</Text>
        //                     </Label>
        //                 ))}
        //             </Section>
        //
        //             <Section>
        //                 <Title>편의시설</Title>
        //                 {amenity.amenityList.map((amenity) => (
        //                     <Label key={amenity.id}>
        //                         <Checkbox
        //                             id={amenity.id}
        //                             type="checkbox"
        //                             checked={selectedAmenity.includes(amenity.id)}
        //                             onChange={(e) => {
        //                                 setIsChecked(!isChecked);
        //                                 setSelectedAmenity(prev =>
        //                                     e.target.checked
        //                                         ? [...prev, amenity.id]
        //                                         : prev.filter(a => a !== amenity.id)
        //                                 );
        //                             }}
        //                         />
        //                         <Text>{amenity.name}</Text>
        //                     </Label>
        //                 ))}
        //             </Section>
        //         </Filter>
        //         <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
        //             <div style={{display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '50px'}}>
        //                 {dorms.map((dorm) => (
        //                     <DormCard
        //                         key={dorm.id}
        //                         dorm={dorm}
        //                         isWish={isWish}
        //                         toggleWish={() => toggleWish(dorm.id)}
        //                         goToDorm={() => moveToDorm(dorm.id)}
        //                     />
        //                 ))}
        //             </div>
        //             <div style={{textAlign: 'center', marginBottom: '20px'}}>
        //                 {hasMore ? (
        //                     <button onClick={loadMoreDorms} className="load-more-button">
        //                         더보기
        //                     </button>
        //                 ) : (
        //                     <p>더 불러올 목록이 없습니다.</p>
        //                 )}
        //             </div>
        //         </div>
        //     </div>
        //     <style>
        //         {`
        //             .load-more-button {
        //                 background-color: #007bff;
        //                 color: white;
        //                 border: none;
        //                 padding: 10px 20px;
        //                 font-size: 16px;
        //                 cursor: pointer;
        //                 border-radius: 5px;
        //                 transition: background-color 0.3s;
        //             }
        //
        //             .load-more-button:hover {
        //                 background-color: #0056b3;
        //             }
        //
        //             .load-more-button:disabled {
        //                 background-color: #d6d6d6;
        //                 cursor: not-allowed;
        //             }
        //         `}
        //     </style>
        // </>
        <Wrapper>
            <Filter>
                <Section>
                    <Title>{props.search.city} 지역구</Title>
                    {town.townList.map((town) => (
                        <Label key={town}>
                            <Checkbox
                                id={town}
                                type="checkbox"
                                checked={selectedTown.includes(town)}
                                onChange={(e) => {
                                    setIsChecked(!isChecked);
                                    setSelectedTown((prev) =>
                                        e.target.checked
                                            ? [...prev, town]
                                            : prev.filter((t) => t !== town)
                                    );
                                }}
                            />
                            <Text>{town}</Text>
                        </Label>
                    ))}
                </Section>

                <Section>
                    <Title>편의시설</Title>
                    {amenity.amenityList.map((amenity) => (
                        <Label key={amenity.id}>
                            <Checkbox
                                id={amenity.id}
                                type="checkbox"
                                checked={selectedAmenity.includes(amenity.id)}
                                onChange={(e) => {
                                    setIsChecked(!isChecked);
                                    setSelectedAmenity((prev) =>
                                        e.target.checked
                                            ? [...prev, amenity.id]
                                            : prev.filter((a) => a !== amenity.id)
                                    );
                                }}
                            />
                            <Text>{amenity.name}</Text>
                        </Label>
                    ))}
                </Section>
            </Filter>
            <Content>
                <DormList>
                    {dorms && dorms.length > 0 ? (
                        dorms.map((dorm) => (
                            <DormCard
                                key={dorm.id}
                                dorm={dorm}
                                isWish={isWish}
                                toggleWish={() => toggleWish(dorm.id)}
                                goToDorm={() => moveToDorm(dorm.id)}
                            />
                        ))
                    ) : (
                        <Message>해당되는 숙소가 없습니다.</Message>
                    )}
                </DormList>
                <CenteredDiv>
                        <LoadMoreButton onClick={loadMoreDorms}
                                        hidden={!hasMore}>
                            더보기
                        </LoadMoreButton>
                </CenteredDiv>
            </Content>
        </Wrapper>
    );
}

export default SearchResult;