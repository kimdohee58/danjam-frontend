import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Container, FormControl, Table } from 'react-bootstrap';

const Insert = () => {
    const [inputs, setInputs] = useState({
        name: '',
        description: '',
        contact_num: '',
        city: '',
        town: '',
        address: '',
        categoryId: '',
        usersId: ''
    });

    const [categories, setCategories] = useState([]);

    // Fetch categories when the component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/dcategory/list');
                const { dcategoryList } = response.data;
                setCategories(dcategoryList);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const onChange = (e) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
    };

    const navigate = useNavigate()

    const moveToNext = (id) => {
        navigate(`/amenity/AInsert/${id}`)
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            ...inputs,
            usersId: '3'
        };

        try {

            const resp = await axios.post('http://localhost:8080/dorm/insert', dataToSend);
            moveToNext(resp.data.resultId)

        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <Container className={"mt-3"}>
            <form onSubmit={onSubmit}>
                <Table striped hover bordered>
                    <thead>
                    <tr>
                        <td colSpan={2} className={"text-center"}>숙소 주소 작성</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>숙소이름</td>
                        <td>
                            <FormControl
                                type={'text'}
                                value={inputs.name}
                                name={'name'}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>시설내용</td>
                        <td>
                                <textarea
                                    name={'description'}
                                    value={inputs.description}
                                    className={"form-control"}
                                    onChange={onChange}
                                />
                        </td>
                    </tr>
                    <tr>
                        <td>전화번호</td>
                        <td>
                            <FormControl
                                type={'tel'}
                                value={inputs.contact_num}
                                name={'contact_num'}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>시 도/특별광역시</td>
                        <td>
                            <FormControl
                                type={'text'}
                                value={inputs.city}
                                name={'city'}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>주/도 군/구</td>
                        <td>
                            <FormControl
                                type={'text'}
                                value={inputs.town}
                                name={'town'}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>전체주소(도로명 포함)</td>
                        <td>
                            <FormControl
                                type={'text'}
                                value={inputs.address}
                                name={'address'}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>숙소 종류</td>
                        <td>
                            {categories.map(category => (
                                <div key={category.id}>
                                    <FormControl
                                        type={'radio'}
                                        id={`category-${category.id}`}
                                        name={'categoryId'}
                                        value={category.id}
                                        // checked={inputs.categoryId === category.id}
                                        onChange={onChange}
                                    />
                                    <label htmlFor={`category-${category.id}`}>{category.name}</label>
                                </div>
                            ))}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className={'text-center'}>
                            <Button type={'submit'}>
                                다음단계
                            </Button>
                        </td>
                    </tr>
                    </tbody>
                </Table>
            </form>
        </Container>
    );
};

export default Insert;
