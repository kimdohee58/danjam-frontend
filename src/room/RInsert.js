import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { Button, Container, FormControl, Table } from 'react-bootstrap';

// Styled Components
const FormContainer = styled(Container)`
    margin-top: 3rem;
    max-width: 900px;
`;

const FormTitle = styled.h1`
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
`;

const StyledForm = styled.form`
    background: #fff;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const InputGroup = styled.tr`
    td {
        padding: 1rem;
    }
    input, select, textarea {
        width: 100%;
        border-radius: 5px;
        border: 1px solid #ddd;
        padding: 0.5rem;
        font-size: 1rem;
    }
    textarea {
        resize: vertical;
        height: 100px;
    }
`;

const SubmitButton = styled(Button)`
    width: 100%;
    padding: 0.75rem;
    font-size: 1.1rem;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s;

    &:hover {
        background-color: #0056b3;
    }

    &:disabled {
        background-color: #c0c0c0;
        cursor: not-allowed;
    }
`;

const FilePreviewContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-top: 1rem;
`;

const FilePreview = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 5px;
    
    img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border: 1px solid #ddd;
        border-radius: 5px;
    }
    
    p {
        margin-top: 0.5rem;
        font-size: 0.9rem;
        color: #333;
    }
`;

const RInsert = () => {
    const location = useLocation();
    const userInfo = location.state.userInfo;
    const params = useParams();
    const id = parseInt(params.id);

    const [roomID, setRoomId] = useState(null);
    const [inputs, setInputs] = useState({
        name: '',
        description: '',
        person: '',
        price: '',
        type: '',
        dormId: ''
    });
    const [file, setFile] = useState(null);
    const [filePreviews, setFilePreviews] = useState([]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            ...inputs,
            dormId: id
        };

        try {
            const resp = await axios.post('http://localhost:8080/room/insert', dataToSend, {
                withCredentials: true
            });
            const roomId = resp.data.resultId;
            setRoomId(roomId);
            if (file) {
                Send(roomId, file);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleChangeFile = (event) => {
        const files = event.target.files;
        setFile(files);

        const previews = Array.from(files).map(file => URL.createObjectURL(file));
        setFilePreviews(previews);
    };

    const navigate = useNavigate();

    const moveToNext = () => {
        navigate('/seller/SellerList', { state: { userInfo } });
    };

    const Send = (roomID, files) => {
        const fd = new FormData();
        Array.from(files).forEach((fileItem) => fd.append("file", fileItem));
        fd.append("roomId", roomID);

        axios.post('/roomImg/insert', fd, {
            baseURL: 'http://localhost:8080'
        })
            .then((response) => {
                console.log('Response:', response.data);
                moveToNext();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <FormContainer>
            <FormTitle>숙소 방 작성</FormTitle>
            <StyledForm onSubmit={onSubmit}>
                <Table striped hover bordered>
                    <thead>
                    <tr>
                        <td colSpan={2} className="text-center">방 작성</td>
                    </tr>
                    </thead>
                    <tbody>
                    <InputGroup>
                        <td>방이름</td>
                        <td>
                            <FormControl
                                type='text'
                                value={inputs.name}
                                name='name'
                                onChange={onChange}
                            />
                        </td>
                    </InputGroup>
                    <InputGroup>
                        <td>방내용</td>
                        <td>
                                <textarea
                                    name='description'
                                    value={inputs.description}
                                    onChange={onChange}
                                />
                        </td>
                    </InputGroup>
                    <InputGroup>
                        <td>수용인원</td>
                        <td>
                            <FormControl
                                type='number'
                                value={inputs.person}
                                name='person'
                                onChange={onChange}
                            />
                        </td>
                    </InputGroup>
                    <InputGroup>
                        <td>방가격</td>
                        <td>
                            <FormControl
                                type='number'
                                value={inputs.price}
                                name='price'
                                onChange={onChange}
                            />
                        </td>
                    </InputGroup>
                    <InputGroup>
                        <td>방종류</td>
                        <td>
                            <FormControl
                                as='select'
                                value={inputs.type}
                                name='type'
                                onChange={onChange}
                            >
                                <option value="">Choose...</option>
                                <option value="싱글룸">싱글룸</option>
                                <option value="더블룸">더블룸</option>
                                <option value="트윈룸">트윈룸</option>
                                <option value="트리플룸">트리플룸</option>
                                <option value="쿼드룸">쿼드룸</option>
                                <option value="스위트룸">스위트룸</option>
                                <option value="주니어스위트">주니어스위트</option>
                                <option value="패밀리룸">패밀리룸</option>
                                <option value="디럭스룸">디럭스룸</option>
                                <option value="킹룸">킹룸</option>
                                <option value="프레지덴셜스위트">프레지덴셜스위트</option>
                            </FormControl>
                        </td>
                    </InputGroup>
                    <InputGroup>
                        <td colSpan={2} className="text-center">
                            <SubmitButton type='submit'>방저장</SubmitButton>
                        </td>
                    </InputGroup>
                    </tbody>
                </Table>
            </StyledForm>

            {roomID && (
                <div>
                    <h5>파일 업로드</h5>
                    <input type="file" id="file" onChange={handleChangeFile} multiple />
                    <FilePreviewContainer>
                        {filePreviews.length > 0 && (
                            filePreviews.map((preview, index) => (
                                <FilePreview key={index}>
                                    <img src={preview} alt={`Preview ${index}`} />
                                    <p>{file[index]?.name}</p>
                                </FilePreview>
                            ))
                        )}
                    </FilePreviewContainer>
                    <div className="text-center mt-3">
                        <SubmitButton
                            onClick={() => roomID && file && Send(roomID, file)}
                            disabled={!roomID || !file}
                        >
                            Send
                        </SubmitButton>
                    </div>
                </div>
            )}
        </FormContainer>
    );
};

export default RInsert;
