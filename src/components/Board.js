import React from 'react';
import { BoardTile } from './BoardTile.js';

export function Board(props) {
    const handleDragStart = e => {
        e.currentTarget.style.border = ''
        e.dataTransfer.setData('text', e.target.id);
        e.effectAllowed = 'copyMove';
    };
    const handleDragEnd = e => {
        e.dataTransfer.clearData();
    };

    let rows = [], cols = [];
    for (let index = 0; index < props.tiles.length; index++) {
        cols.push(<BoardTile key={index} row={rows.length + 1} col={cols.length + 1} value={props.tiles[index]}/>);
        if ((index + 1) % 15 === 0) {
            rows.push(
                <div key={index} className="board-row">
                    {cols}
                </div>
            );
            cols = [];
        }
    }
    return (
        <>
        <div>
            {rows}
        </div>
        <div>
            {props.scrabbleTiles.map((tile, index) => {
            return <button id={index} key={index} className="letter" draggable onDragStart={e => handleDragStart(e)} onDragEnd={e => handleDragEnd(e)}>{tile}</button>
            })}
        </div>
        </>

    )
}