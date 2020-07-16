import React from 'react';
import { bonusText } from '../constants/bonusText.js';

export function BoardTile(props) {
    const handleDragOver = e => {
        e.preventDefault();
    }
    const handleDragEnter = e => {
        if (e.target.className.includes('tile')) {
            e.target.style.background = 'gray';
        }
    }
    const handleDragLeave = e => {
        console.log(e.target.className)
        if (e.target.className.includes('tile')) {
            e.target.style.background = '';
        }
    }
    const handleDrop = e => {
        e.preventDefault();
        e.stopPropagation();
        if (e.target.className.includes('tile')) {
            e.target.style.background = '';
            const id = e.dataTransfer.getData('text');
            const draggedTile = document.getElementById(id);
            draggedTile.setAttribute('draggable', false);
            const parentNode = e.target.parentNode;
            parentNode.replaceChild(draggedTile, e.target);
        }
    }
    const bonus = props.value.bonus;
    const tileText = bonusText[bonus] ?? <><br/><br/><br/></>;
    const { col, row } = props;
    return (
        <button id={`${col},${row}`} onDrop={e => handleDrop(e)} onDragEnter={e => handleDragEnter(e)} onDragLeave={e => handleDragLeave(e)} onDragOver={e => handleDragOver(e)} className={bonus ? `${bonus} tile` : 'tile'}>{tileText}</button>
    )
}