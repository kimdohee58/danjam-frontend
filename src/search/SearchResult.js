import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {format} from "date-fns";
import DormCard from "./DormCard";
import {dateFormat} from "react-big-calendar/lib/utils/propTypes";

function SearchResult(props) {
    let search = ({});
    if (props.search.date.checkOut === null) {
        props.search.date.checkOut = new Date()
    } else if (props.search.date.checkIn === null) {
        props.search.date.checkIn = new Date()
    }
    search = ({
        city: props.search.city,
        checkIn: format(props.search.date.checkIn, 'yyyy-MM-dd 15:00:00'),
        checkOut: format(props.search.date.checkOut, 'yyyy-MM-dd 11:00:00'),
        person: props.search.person,
    })
    console.log('SearchResult: ', search)
    console.log('userInfo', props.userInfo)

    // filter
    const [isChecked, setIsChecked] = useState(false)

    // 1. amenity
    const [selectedAmenity, setSelectedAmenity] = useState([])
    const [amenity, setAmenity] = useState({amenityList: []})

    // 2. town
    const [selectedTown, setSelectedTown] = useState([])
    const [town, setTown] = useState({townList: []})

    // checkbox
    // 1. amenity
    const checkedAmenityHandler = (value, isChecked) => {
        if (isChecked) {
            setSelectedAmenity((prev) => [...prev, value])
            return;
        }

        if (!isChecked && selectedAmenity.includes(value)) {
            setSelectedAmenity(selectedAmenity.filter((amenity) => amenity !== value))
            return;
        }
        return;
    }
    const checkAHandler = (e, value) => {
        setIsChecked(!isChecked)
        console.log(value)
        checkedAmenityHandler(value, e.target.checked)
    }
    // console.log("checkedAmenity: ", selectedAmenity)

    // 2. town
    const checkedTownHandler = (value, isChecked) => {
        if (isChecked) {
            setSelectedTown((prev) => [...prev, value])
            return;
        }

        if (!isChecked && selectedTown.includes(value)) {
            setSelectedTown(selectedTown.filter((town) => town !== value))
            return;
        }
        return;
    }
    const checkTHandler = (e, value) => {
        setIsChecked(!isChecked)
        checkedTownHandler(value, e.target.checked)
    }
    // console.log("checkedTown: ", selectedTown)

    // dormList
    const [dorms, setDorms] = useState([])

    useEffect(() => {
        setSelectedAmenity([])
        setSelectedTown([])

        // console.log('showTown')
        const showTownList = async () => {
            let resp = await axios
                .post("http://localhost:8080/town/list", props.search, {
                    withCredentials: true
                })
                .catch((e) => {
                    console.error("showTown console.log.error: ", e)
                })
            // console.log("showTown console.log: ", resp.data)
            if (resp.status === 200 && resp.data.result === 'success') {
                setTown(resp.data)
            }
        }
        showTownList()

        const showAmenityList = async () => {
            let resp = await axios
                .get("http://localhost:8080/amenity/list")
                .catch((e) => {
                    console.error("showAmenity console.log.error: ", e)
                })
            // console.log("showAmenity console.log: ", resp.data.amenityList)
            if (resp.status === 200 && resp.data.result === 'success') {
                setAmenity(resp.data)
            }
        }
        showAmenityList()

        let selectList = async () => {
            let resp = await axios
                .post("http://localhost:8080/search", search, {
                    withCredentials: true
                })
                .catch((e) => {
                    console.error(e)
                })
            try {
                if (resp.status === 200 && resp.data.result === 'success') {
                    setDorms(resp.data.dormList)
                }
            } catch (e) {
                console.error("호텔 로드 중 오류 발생", e)
            }


            // if (resp.status === 200) {
            //     if (resp.data.result === 'success') {
            //         setData(resp.data)
            //     } else if (resp.data.result === 'fail') {
            //         setData(0)
            //     }
            // }
        }
        selectList()
    }, [props]);

    useEffect(() => {
        let filter = ({
            searchDto: search,
            amenities: selectedAmenity,
            cities: selectedTown,
        })
        console.log("filter: ", filter)

        if (selectedAmenity.length === 0 && selectedTown.length === 0) {
            let selectList = async () => {
                let resp = await axios
                    .post("http://localhost:8080/search", search, {
                        withCredentials: true
                    })
                    .catch((e) => {
                        console.error(e)
                    })

                if (resp.status === 200 && resp.data.result === 'success') {
                    setDorms(resp.data.dormList)
                }

                // if (resp.status === 200) {
                //     if (resp.data.result === 'success') {
                //         setData(resp.data)
                //     } else if (resp.data.result === 'fail') {
                //         setData(0)
                //     }
                // }
            }
            selectList()
        }

        let selectedAmenityList = async () => {
            let resp = await axios
                .post("http://localhost:8080/search/filter", filter, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': "application/json"
                    },
                })
                .catch((e) => {
                    console.error(e)
                })

            console.log(resp)

            if (resp.status === 200 && resp.data.result === 'success') {
                setDorms(resp.data)
            }

            // if (resp.status === 200) {
            //     if (resp.data.result === 'success') {
            //         setData(resp.data)
            //     } else if (resp.data.result === 'fail') {
            //         setData(0)
            //     }
            // }
        }
        selectedAmenityList()
    }, [selectedAmenity, selectedTown]);

    // 유정언니
    // 위시한테 값 넘겨주기
    // const location = useLocation();
    // let userInfo = location.state.userInfo;
    const navigate = useNavigate();


    const [isWish, setIsWish] = useState(false);
    const toggleWish = async (dormId) => {
        try {
            // 로그인
            // if (!userInfo) {
            //     navigate("/login", { state: { from: location } });
            //     return;
            // }

            setDorms(prevDorms =>
                prevDorms.map(dorm =>
                    dorm.id === dormId
                        ? {...dorm, isWish: !dorm.isWish}
                        : dorm
                )
            );

            const targetDorm = dorms.find(dorm => dorm.id === dormId);

            if (targetDorm.isWish) {
                await axios.delete(`http://localhost:8080/wish/${dormId}`, {withCredentials: true});
            } else {
                await axios.get(`http://localhost:8080/wish/${dormId}`, {}, {withCredentials: true});
            } // 위시리스트 매핑 설정 @영우

        } catch (e) {
            console.error("찜 상태 변경 중 오류 발생", e);
            setDorms(prevDorms =>
                prevDorms.map(dorm =>
                    dorm.id === dormId
                        ? {...dorm, isWish: !dorm.isWish}
                        : dorm
                )
            );
        }
    };

    // 무한스크롤
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const size = 10; // 에어비앤비 기준

    const loadMoreDorms = () => {
        setPage((prevPage) => prevPage + 1);
    }

    /*useEffect(() => {
        // setPage(1); //페이지 초기화
        // setDorms([]); //호텔 초기화
        getDorms();
    }, []);*/

    // 옵션 선택 정보 넘기기
    const searchInfo = {
        checkIn: search.checkIn,
        checkOut: search.checkOut,
        person: search.person,
    }

    let moveToDorm = (id) => {
        navigate('dorm/' + id, {state: {searchInfo: searchInfo, userInfo: props.userInfo} })
    }

    return (
        <>
            <h1>SearchList</h1>
            <div style={{display: "flex", justifyContent: "space-evenly"}}>
                {/* filter */}
                <div>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <h3>{props.search.city} town</h3>
                        {town.townList.map((town) => (
                            <label>
                                <input id={town} type={"checkbox"}
                                       checked={selectedTown.includes(town)}
                                       onChange={(e) => checkTHandler(e, town)}/>
                                {town}
                            </label>
                        ))}
                    </div>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <h3>편의시설</h3>
                        {amenity.amenityList.map((amenity) => (
                            <label>
                                <input id={amenity.id} type={"checkbox"}
                                       checked={selectedAmenity.includes(amenity.id)}
                                       onChange={(e) => checkAHandler(e, amenity.id)}
                                />
                                {amenity.name}
                            </label>
                        ))}
                    </div>
                </div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px'}}>
                    {dorms.map((dorm) => (
                        <DormCard
                            key={dorm.id}
                            dorm={dorm}
                            isWish={isWish}
                            toggleWish={() => toggleWish(dorm.id)}
                            onClick={() => moveToDorm(dorm.id)}
                        />
                    ))}
                    {hasMore && (
                        <button onClick={loadMoreDorms} style={{margin: '20px', padding: '10px'}}>
                            더보기
                        </button>
                    )}
                    {!hasMore && (
                        <p>더 불러올 목록이 없습니다.</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default SearchResult