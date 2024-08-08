import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

const DormList = () => {
    const [dorms, setDorms] = useState([]);

    useEffect(() => {
        axios.get('/dorm')
            .then(response => setDorms(response.data))
            .catch(error => console.error(error))
    }, []);

    return (
        <div>
            <h1>호텔 리스트</h1>
            <ul>
                {dorms.map(dorm => (
                    <li key={dorm.id}>
                        <Link to={`/dorms/${dorm.id}`}>{dorm.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DormList;