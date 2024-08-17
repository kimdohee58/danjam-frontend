import { Link, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
`;

const WishContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
`;

const WishBox = styled.div`
    flex: 1 1 calc(33.333% - 20px); /* Three columns with a gap */
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 15px;
    box-sizing: border-box;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
`;

const WishTitle = styled.h3`
    margin: 0;
    font-size: 18px;
    color: #333;
    text-decoration: none;
`;

const WishDescription = styled.p`
    margin: 10px 0;
    font-size: 14px;
    color: #666;
`;

const LoadMoreButton = styled.button`
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 20px;
    
    &:hover {
        background-color: #0056b3;
    }

    &:disabled {
        background-color: #b0b0b0;
        cursor: not-allowed;
    }
`;

const NoItemsMessage = styled.h2`
    text-align: center;
    color: #666;
    margin-top: 50px;
`;

const WishPage = () => {
    const fetchWishUrl = 'http://localhost:8080/wishes';
    const params = useParams();
    const id = params.id;

    const [items, setItems] = useState([]);
    const [page, setPage] = useState(0);
    const [hasNext, setHasNext] = useState(true);
    const [loading, setLoading] = useState(false);
    const size = 25;

    const listRef = useRef(null);

    const fetchItems = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await fetch(`${fetchWishUrl}/${id}?page=${page}&size=${size}`);
            const data = await response.json();

            setItems(prevItems => [...prevItems, ...data.content]);
            setHasNext(!data.last);
        } catch (error) {
            console.error('Error fetching items', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMoreItems = () => {
        setPage(prevPage => prevPage + 1);
    };

    useEffect(() => {
        fetchItems();
    }, [page]);

    return (
        <Container>
            {items.length !== 0 ? (
                <WishContainer ref={listRef}>
                    {items.map(item => (
                        <WishBox key={item.id}>
                            <Link to={`/dorms/${item.dormId}`} style={{ textDecoration: 'none' }}>
                                <WishTitle>{item.dormName}</WishTitle>
                            </Link>
                            <WishDescription>{item.dormDescription}</WishDescription>
                        </WishBox>
                    ))}
                    {hasNext && !loading && (
                        <LoadMoreButton onClick={loadMoreItems}>더보기</LoadMoreButton>
                    )}
                </WishContainer>
            ) : (
                <NoItemsMessage>찜한 숙소가 없습니다.</NoItemsMessage>
            )}
        </Container>
    );
};

export default WishPage;
