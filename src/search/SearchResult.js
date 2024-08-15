import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {format} from "date-fns";

function SearchResult(props) {
    let search = ({});
    if (props.search.date.checkOut === null) {
        props.search.date.checkOut = new Date()
    } else if (props.search.date.checkIn === null) {
        props.search.date.checkIn = new Date()
    } else {
        props.search.date.checkIn = new Date()
        props.search.date.checkOut = new Date()
    }
    search = ({
        city: props.search.city,
        checkIn: format(props.search.date.checkIn, 'yyyy-MM-dd 15:00:00'),
        checkOut: format(props.search.date.checkOut, 'yyyy-MM-dd 11:00:00'),
        person: props.search.person,
    })
    console.log('SearchResult: ', search)

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
    const [data, setData] = useState({dormList: []})

    let navigate = useNavigate()
    let moveToDorm = (id) => {
        navigate('dorm/showOne/' + id)
    }

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

            if (resp.status === 200 && resp.data.result === 'success') {
                setData(resp.data)
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
                    setData(resp.data)
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
                setData(resp.data)
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
                {data.dormList === 0 ?
                    <div>조건에 해당하는 호텔이 없습니다.</div> :
                    <table>
                        <thead>
                        <tr>
                            <th>호텔번호</th>
                            <th>이름</th>
                            <th>연락처</th>
                            <th>도시</th>
                            <th>town</th>
                            <th>방 번호</th>
                            <th>가격</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.dormList.map((dorm) => (
                            <TableRow dorm={dorm} key={dorm.id} moveToDorm={moveToDorm}/>
                        ))}
                        </tbody>
                    </table>
                }
            </div>
        </>
    )
}

let TableRow = ({dorm, moveToDorm}) => {
    return (
        <tr onClick={() => moveToDorm(dorm.id)}>
            <td>{dorm.id}</td>
            <td>{dorm.name}</td>
            <td>{dorm.contactNum}</td>
            <td>{dorm.city}</td>
            <td>{dorm.town}</td>
            <td>{dorm.room.id}</td>
            <td>{dorm.room.price}</td>
        </tr>
    )
}

export default SearchResult