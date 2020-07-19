import React from 'react';
import { BoardTile } from './BoardTile.js';
import { ScrabbleTiles } from './ScrabbleTiles.js';


export const Board = ({ board, availableMoves, playerTiles, submit, tileVal, pass, startSwappingLetters, swappingFinished, swapLetters, swapMode, updateBoard, getMovesOnBoard, updateAvailableMoves, getMoves}) => {
    const [lettersToSwap, setLettersToSwap] = React.useState([]);
    const [word, setWord] = React.useState('');
    const [tiles, setTiles] = React.useState([]);
    const [placed, setPlaced] = React.useState(false);

    const handleClick = e => {
        const { value } = e.target;
        e.preventDefault();
        if (!swapMode) {
            return;
        } else {
            setLettersToSwap(letters => [...letters, value])
        }
    }
    const handleSubmit = e => {
        e.preventDefault();
        const letterMap = {};
        playerTiles.forEach(letter => {
            if (letterMap[letter]) {
                letterMap[letter]++
            } else {
                letterMap[letter] = 1;
            }
        });
        [...word].forEach(letter => {
            letterMap[letter]--;
        })
        let lettersToRemain = [];
        Object.entries(letterMap).forEach(([key, value]) => {
            for (let i = 0; i < value; i++) {
                lettersToRemain.push(key);
            }
        });
        submit(lettersToRemain);
        tiles.forEach(tile => {
            tile.style.display = '';
        })
        setWord('');
        setTiles([])
    }
    const handleDragStart = e => {
        if (!word) {
           getMovesOnBoard();
        }
        e.currentTarget.style.border = ''
        e.dataTransfer.setData('text', e.target.id);
        e.effectAllowed = 'copyMove';
    };
    const handleDragEnd = e => {
        if (placed) {
            setWord(`${word}${e.target.value}`);
            const currentTiles = tiles;
            currentTiles.push(e.target);
            setTiles(currentTiles);
            e.target.style.display = 'none';
            e.dataTransfer.clearData();
        }


    };
    const _swapLetters = e => {
        e.preventDefault();
        let letterMap = {};
        const originalLetters = playerTiles;
        originalLetters.forEach(letter => {
            if (letterMap[letter]) {
                letterMap[letter]++;
            } else {
                letterMap[letter] = 1;
            }
        });
        lettersToSwap.forEach(letter => {
            letterMap[letter]--;
        });
        let lettersToRemain = [];
        Object.entries(letterMap).forEach(([key, value]) => {
            for (let i = 0; i < value; i++) {
                lettersToRemain.push(key);
            }
        });
        swapLetters(lettersToSwap, lettersToRemain)
        setLettersToSwap([]);
    }
    let rows = [], cols = [];
    for (let index = 0; index < board.length; index++) {
        if (board[index].value) {
            const value = JSON.stringify();
            cols.push(<BoardTile setPlaced={setPlaced} key={index} id={board[index]} updateAvailableMoves={updateAvailableMoves} availableMoves={availableMoves} tileVal={tileVal} row={rows.length} col={cols.length} value={board[index]} className="letter"/>);
        } else {
            cols.push(<BoardTile setPlaced={setPlaced} key={index} updateAvailableMoves={updateAvailableMoves} availableMoves={availableMoves} updateBoard={updateBoard} row={rows.length} col={cols.length} value={board[index]}/>)
        }
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
        <div className="gameBoard">
        <div>
            {rows}
        </div>
        <div className="actions">
        <div className="playerTiles">
            {playerTiles.map((tile, index) => {
                return <ScrabbleTiles tileVal={tileVal} key={index} id={index} tile={tile} handleClick={handleClick} handleDragEnd={handleDragEnd} handleDragStart={handleDragStart}/>

            })}
        </div>
            <div>
                <button onClick={() => pass()}>Pass</button>
                {!swapMode ? <button onClick={() => startSwappingLetters()}>Swap Letters</button> : <button onClick={_swapLetters}>Finish Swap</button>}
                <button onClick={handleSubmit}>Submit Word</button>
            </div>
            </div>
        </div>

    )
}