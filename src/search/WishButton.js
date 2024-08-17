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
    color: ${props => (props.isWish ? 'red' : 'gray')};
    transition: transform 0.2s ease-in-out;

    &:hover {
        transform: scale(1.2);
    }
`;


const WishButton = ({ isWish, toggleWish }) => (
    <Button onClick={toggleWish} className={isWish ? 'wish-active' : 'wish-inactive'}>
        {isWish ? <FaHeart /> : <FaRegHeart />}
    </Button>
);

export default WishButton;