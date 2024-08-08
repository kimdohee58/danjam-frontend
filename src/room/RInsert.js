import { useParams } from "react-router-dom";
import { Button, Container, FormControl, Table } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";

const RInsert = () => {
    const params = useParams();
    const id = parseInt(params.id);

    const [roomid, setRoomId] = useState(null);
    const [inputs, setInputs] = useState({
        name: '',
        description: '',
        person: '',
        price: '',
        type: '',
        dormId: ''
    });
    const [file, setFile] = useState(null); // File state
    const [filePreviews, setFilePreviews] = useState([]); // To store file previews

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
            const resp = await axios.post('http://localhost:8080/room/insert', dataToSend);
            const roomId = resp.data.resultId;

            console.log('roomId', roomId);
            setRoomId(roomId); // Store roomId in state

            // Call Send function after getting roomId
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

        // Create URLs for file previews
        const previews = Array.from(files).map(file => URL.createObjectURL(file));
        setFilePreviews(previews);
    };

    function Send(roomId, files) {
        console.log('Sending files with roomId:', roomId);
        console.log('Files:', files);

        const fd = new FormData();
        Array.from(files).forEach((fileItem) => fd.append("file", fileItem));

        fd.append("roomId", roomId);
        console.log('roomId:', roomId);
        console.log('fd:', fd);
        axios.post('/roomImg/insert', fd, {
            baseURL: 'http://localhost:8080'
        })
            .then((response) => {
                console.log('Response:', response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    return (
        <Container className={"mt-3"}>
            <form onSubmit={onSubmit}>
                <Table striped hover bordered>
                    <thead>
                    <tr>
                        <td colSpan={2} className={"text-center"}>숙소 방 작성</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>방이름</td>
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
                        <td>방내용</td>
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
                        <td>수용인원</td>
                        <td>
                            <FormControl
                                type={'number'}
                                value={inputs.person}
                                name={'person'}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>방가격</td>
                        <td>
                            <FormControl
                                type={'number'}
                                value={inputs.price}
                                name={'price'}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>방종류</td>
                        <td>
                            <FormControl
                                as="select"
                                value={inputs.type}
                                name={'type'}
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
                    </tr>
                    <tr>
                        <td colSpan={2} className={'text-center'}>
                            <Button type={'submit'}>
                                방저장
                            </Button>
                        </td>
                    </tr>
                    </tbody>
                </Table>
            </form>
            <div>
                <h5>File Data</h5>
                <input type="file" id="file" onChange={handleChangeFile} multiple />
                <div>
                    <h5>Selected Files:</h5>
                    {filePreviews.length > 0 && (
                        <div>
                            {filePreviews.map((preview, index) => (
                                <div key={index} className="file-preview">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index}`}
                                        style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '5px' }}
                                    />
                                    <p>{file[index]?.name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="text-center mt-3">
                    <Button
                        onClick={() => roomid && file && Send(roomid, file)}
                        disabled={!roomid || !file}
                    >
                        Send
                    </Button>
                </div>
            </div>
        </Container>
    );
};

export default RInsert;
