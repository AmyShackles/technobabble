import React from 'react';

export const PlayerTiles = (props) => {
        return <button id={props.id} value={props.tile} onClick={props.handleClick} className="letter" draggable onDragStart={e => props.handleDragStart(e)} onDragEnd={e => props.handleDragEnd(e)}><p className="tileValue">{props.tileVal[props.tile]}</p><p className="tileLetter">{props.tile}</p></button>
}