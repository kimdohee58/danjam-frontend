import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

function SearchResult(props) {
    console.log(props.search)
    console.log(props.search.date)

    // const [data, setData] = useState({dormList: []})
    //
    // let navigate = useNavigate()
    // let moveToDorm = (id) => {
    //     navigate('dorm/showOne/' + id)
    // }
    //
    // useEffect(() => {
    //     let selectList = async () => {
    //         let resp = await axios
    //             .get("http://localhost:8080/dorm/showList",{
    //                 withCredentials: true
    //             })
    //             .catch((e) => {
    //                 console.error(e)
    //             })
    //
    //         if (resp.status === 200) {
    //             setData(resp.data)
    //         }
    //     }
    //     selectList()
    // }, []);

    return (
        <>
            <h1>SearchList</h1>
            {/*<table>
                <thead>
                <tr>
                    <th>호텔번호</th>
                    <th>이름</th>
                    <th>가격</th>
                </tr>
                </thead>
                <tbody>
                {data.dormList.map((dorm) => (
                    <TableRow dorm={dorm} key={dorm.id} moveToDorm={moveToDorm}/>
                ))}
                </tbody>
            </table>*/}
        </>
    )
}
let TableRow = ({dorm, moveToDorm}) => {
    return (
        <tr onClick={() => moveToDorm(dorm.id)}>
            <td>{dorm.id}</td>
            <td>{dorm.title}</td>
            <td>{dorm.nickname}</td>
        </tr>
    )
}
export default SearchResult