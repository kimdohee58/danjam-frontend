import ReviewWriteModal from "./ReviewWriteModal";
import {useState} from "react";

const ReviewWriteButton = ({userId, bookingId}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const closeModal = () => setIsModalOpen(false);
    const openModal = () => setIsModalOpen(true);

    return (
        <>
            <button onClick={openModal}> 리뷰작성</button>
            <ReviewWriteModal isOpen={isModalOpen}
                              onRequestClose={closeModal}
                              bookingId={bookingId}
                              userId={userId}/>
        </>

    )
};

export default ReviewWriteButton;