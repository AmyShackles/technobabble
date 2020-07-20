import React from 'react';
import { bonusText } from '../constants/bonusText.js';

export function BoardTile(props) {
    const handleDragOver = e => {
        e.preventDefault();
    }
    const handleDragEnter = e => {
        if (e.target.className && e.target.className.includes('tile')) {
            if (props.availableMoves.includes(e.target.id)) {
                e.target.style.background = 'green';
            } else {
                e.target.style.background = 'red';
            }
        }
    }
    const handleDragLeave = e => {
        if (e.target.className && e.target.className.includes('tile')) {
            // If we don't place a tile, we want to not record it
            e.target.style.background = '';
            props.setPlaced(false);
        }
    }
    const handleDrop = e => {
        e.preventDefault();
        e.stopPropagation();
        const availableMoves = props.availableMoves;   
        if(availableMoves.includes(e.target.id)) {
            e.target.style.background = '';
            if (e.target.className.includes('tile')) {
                const target = JSON.parse(e.target.value);
                const id = e.dataTransfer.getData('text');
                const draggedTile = document.getElementById(id);
                target.value = draggedTile.value;
                props.updateAvailableMoves(e.target.id, target);
                props.setPlaced(true);
                props.handleScore(target.bonus, +draggedTile.firstChild.textContent)

            }
        } else {
            e.target.style.background = '';
        }
    }
    const { bonus, value } = props.value;
    const tileText = bonusText[bonus] ?? <><br/><br/><br/></>;
    const { col, row } = props;
    if (value) {
        return <button value={value} id={`${row},${col}`} className="letter" onDrop={e => handleDrop(e)} onDragEnter={e => handleDragEnter(e)} onDragLeave={e => handleDragLeave(e)} onDragOver={e => handleDragOver(e)}><p className="tileValue" value={props.tileVal[value]}>{props.tileVal[value]}</p><p className="tileLetter">{value}</p></button>
    }
    return (
        <button value={JSON.stringify(props.value)} id={`${row},${col}`} onDrop={e => handleDrop(e)} onDragEnter={e => handleDragEnter(e)} onDragLeave={e => handleDragLeave(e)} onDragOver={e => handleDragOver(e)} className={bonus ? `${bonus} tile` : 'tile'}>{tileText}</button>
    )
}