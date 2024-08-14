import React, {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

function SearchResult(props) {
    const search = ({
        city: props.search.city,
        checkIn: props.search.date.checkIn,
        checkOut: props.search.date.checkOut,
        person: props.search.person,
    })
    console.log('SearchResult: ', search)

    // filter
    // 1. amenity
    const [selectedAmenity, setSelectedAmenity] = useState([])
    const [amenity, setAmenity] = useState({amenityList: []})

    // 2. town
    const [selectedTown, setSelectedTown] = useState([])
    const [town, setTown] = useState({townList: []})

    /*useEffect(() => {
        console.log('showTown')
        const showTownList = async () => {
            let resp = await axios
                .post("http://localhost:8080/town/list", props.search.city, {
                    withCredentials: true
                })
                .catch((e) => {
                    console.error("showTown console.log.error: " , e)
                })
            console.log("showTown console.log: " , resp.data.townList)
            if (resp.status === 200 && resp.data.result === 'success') {
                setTown(resp.data)
            }
        }
        showTownList()

        /!*const showAmenityList = async () => {
            let resp = await axios
                .get("http://localhost:8080/amenity/list")
                .catch((e) => {
                    console.error("showAmenity console.log.error: " , e)
                })

            console.log("showAmenity console.log: " , resp.data.amenityList)
            if (resp.status === 200 && resp.data.result === 'success') {
                setAmenity(resp.data)
            }
        }
        showAmenityList()*!/
    }, []);*/

    /*const onCheckedAll = useCallback(
        (checked) => {
            if (checked) {
                const checkedListArray = []
                amenity.forEach((list) => checkedListArray.push(list))
                setSelectedAmenity(checkedListArray)
            } else {
                setSelectedAmenity([])
            }
        },
        [amenity]
    )

    // 개별 체크 클릭 시 발생하는 함수
    const onCheckedElement = useCallback(
        (checked, list) => {
            if (checked) {
                setSelectedAmenity([...selectedAmenity, list]);
            } else {
                setSelectedAmenity(selectedAmenity.filter((el) => el !== list));
            }
        },
        [selectedAmenity]
    );*/

    // dormList
    const [data, setData] = useState({dormList: []})

    let navigate = useNavigate()
    let moveToDorm = (id) => {
        navigate('dorm/showOne/' + id)
    }

    useEffect(() => {
        console.log('showTown')
        const showTownList = async () => {
            let resp = await axios
                .post("http://localhost:8080/town/list", props.search, {
                    withCredentials: true
                })
                .catch((e) => {
                    console.error("showTown console.log.error: " , e)
                })
            console.log("showTown console.log: " , resp.data)
            if (resp.status === 200 && resp.data.result === 'success') {
                setTown(resp.data)
            }
        }
        showTownList()

        const showAmenityList = async () => {
            let resp = await axios
                .get("http://localhost:8080/amenity/list")
                .catch((e) => {
                    console.error("showAmenity console.log.error: " , e)
                })

            console.log("showAmenity console.log: " , resp.data.amenityList)
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
        }
        selectList()
    }, [props]);

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
                                <input id={town} type={"checkbox"} checked={false}/>
                                {town}
                            </label>
                        ))}
                    </div>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <h3>편의시설</h3>
                        {amenity.amenityList.map((amenity) => (
                            <label>
                                <input id={amenity.id} type={"checkbox"} checked={false}/>
                                {amenity.name}
                            </label>
                        ))}
                    </div>
                </div>
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
                        {/*<th>주소</th>*/}
                        {/*<th>category</th>*/}
                        {/*<th>user</th>*/}
                    </tr>
                    </thead>
                    <tbody>
                    {data.dormList.map((dorm) => (
                        <TableRow dorm={dorm} key={dorm.id} moveToDorm={moveToDorm}/>
                    ))}
                    </tbody>
                </table>
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
            {/*<td>{dorm.address}</td>*/}
            {/*<td>{dorm.dcategory.name}</td>*/}
            {/*<td>{dorm.user.name}</td>*/}
        </tr>
    )
}

export default SearchResult