import React from 'react';
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const StarRating = ({ rate, onRateChange, readonly = false , size, width}) => {
    const totalStars = 5;
    const fullStars = Math.floor(rate);
    const halfStar = rate % 1 !== 0;

    const handleStarClick = (index) => {
        if (!readonly && onRateChange) {
            const newRate = index + 1;
            onRateChange(newRate);
        }
    };

    const handleHalfStarClick = (index) => {
        if (!readonly && onRateChange) {
            const newRate = index + 0.5;
            onRateChange(newRate);
        }
    };

    return (
        <div className="starRating">
            {[...Array(totalStars)].map((_, index) => (
                <span
                    key={index}
                    style={{
                        color: '#fbc02d',
                        cursor: readonly ? 'default' : 'pointer',
                        position: 'relative',
                        display: 'inline-block',
                        width: width
                    }}
                >
                    <span
                        style={{
                            position: 'absolute',
                            left: 0,
                            width: '50%',
                            height: '100%',
                            zIndex: 1
                        }}
                        onClick={() => handleHalfStarClick(index)}
                    />
                    <span
                        style={{
                            position: 'absolute',
                            right: 0,
                            width: '50%',
                            height: '100%',
                            zIndex: 2
                        }}
                        onClick={() => handleStarClick(index)}
                    />
                    {index < fullStars ? (
                        <FaStar size={size} />
                    ) : index === fullStars && halfStar ? (
                        <FaStarHalfAlt size={size} />
                    ) : (
                        <FaRegStar size={size} />
                    )}
                </span>
            ))}
        </div>
    );
};

export default StarRating;