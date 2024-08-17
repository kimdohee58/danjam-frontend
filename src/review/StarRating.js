import React from 'react';
import {FaRegStar, FaStar, FaStarHalfAlt} from "react-icons/fa";

const StarRating = ({ rate }) => {
    const totalStars = 5;
    const fullStars = Math.floor(rate);
    const halfStar = rate % 1 !== 0;

    return (
        <div className="starRating">
            {[...Array(fullStars)].map((_, index) => (
                <span key={index} style={{color: '#fbc02d'}}><FaStar size={12} /></span>
            ))}
            {halfStar && <span style={{color: '#fbc02d'}}><FaStarHalfAlt size={12} /></span>}
            {[...Array(totalStars - fullStars - (halfStar ? 1 : 0))].map((_, index) => (
                <span key={index} style={{color: '#fbc02d'}}><FaRegStar size={12} /></span>
            ))}
        </div>
    );
};


export default StarRating;