import { Link, useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

const WishPage = () => {
    const fetchWishUrl = 'http://localhost:8080/wishes'
    const params = useParams()
    const id = params.id

    const [items, setItems] = useState([])
    const [page, setPage] = useState(0)
    const [hasNext, setHasNext] = useState(true)
    const [loading, setLoading] = useState(false)
    const size = 25

    const listRef = useRef(null)

    const fetchItems = async () => {
        if (loading) return

        setLoading(true)

        try {
            const response = await fetch(`${fetchWishUrl}/${id}?page=${page}&size=${size}`)
            const data = await response.json()

            setItems(prevItems => [...prevItems, ...data.content])
            setHasNext(!data.last)
        } catch (error) {
            console.error('Error fetching items', error)
        } finally {
            setLoading(false)
        }
    }

    const loadMoreItems = () => {
        setPage(prevPage => prevPage + 1)
    }

    useEffect(() => {
        fetchItems()
    }, [page])

    return (
        <>
            {items.length !== 0 ? (
                <div className="wishcontainer" ref={listRef}>
                    {items.map(item => (
                        <div className="wishbox" key={item.id}>
                            {/TODO : 상세보기 들어가는 링크 확인 후 넣기/}
                            <Link to={`/dorms/${item.dormId}`} >
                                <h3>{item.dormName}</h3>
                            </Link>
                            <p>{item.dormDescription}</p>
                        </div>
                    ))}
                    {hasNext && !loading &&
                        <button onClick={loadMoreItems}>더보기</button>
                    }
                </div>
            ) : (
                <h2>찜한 숙소가 없습니다.</h2>
            )}
        </>
    )
}

export default WishPage