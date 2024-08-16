import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

function List() {
    const [data, setData] = useState({dormList: []})

    let navigate = useNavigate()
    let moveToDorm = (id) => {
        navigate('dorm/showOne/' + id)
    }

    useEffect(() => {
        let selectList = async () => {
            let resp = await axios
                .get("http://localhost:8080/showAll")
                .catch((e) => {
                    console.error("console.log: "+e)
                })

            if (resp.status === 200) {
                setData(resp.data)
            }
        }
        selectList()
    }, []);

    return (
        <>
            <h1>List</h1>
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
export default List