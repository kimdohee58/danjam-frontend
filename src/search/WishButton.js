import React from 'react';
import styled from 'styled-components';
import { FaHeart } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa';

const Button = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;

    &:hover {
        transform: scale(1.2);
    }

    svg {
        color: ${props => (props.isWish ? 'red' : 'gray')};
    }
`;

const WishButton = ({ isWish, toggleWish }) => (
    <Button onClick={(e) => {
        e.stopPropagation();
        toggleWish();
    }} isWish={isWish}>
        {isWish ? <FaHeart /> : <FaRegHeart />}
    </Button>
);

export default WishButton;
