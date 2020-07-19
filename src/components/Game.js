import React from 'react';
import { Board } from './Board.js';
import socketIO from 'socket.io-client';
const socket = socketIO(process.env.REACT_APP_URL);
let tiles = Array(9).fill('A').concat(Array(2).fill('B')).concat(Array(2).fill('C')).concat(Array(4).fill('D')).concat(Array(12).fill('E')).concat(Array(2).fill('F')).concat(Array(3).fill("G")).concat(Array(2).fill("H")).concat(Array(9).fill("I")).concat(Array(1).fill("J")).concat(Array(1).fill("K")).concat(Array(4).fill("L")).concat(Array(2).fill("M")).concat(Array(6).fill("N")).concat(Array(8).fill("O")).concat(Array(2).fill("P")).concat(Array(1).fill("Q")).concat(Array(6).fill("R")).concat(Array(4).fill("S")).concat(Array(6).fill("T")).concat(Array(4).fill("U")).concat(Array(2).fill("V")).concat(Array(2).fill("W")).concat(Array(1).fill("X")).concat(Array(2).fill("Y")).concat(Array(1).fill("Z")).concat(Array(2).fill(" "));




export class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: [
                {bonus: 'WSx3'}, {}, {}, {bonus: 'LSx2'}, {bonus: 'LSx2'}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {bonus: 'WSx3'},
                {}, {}, {bonus: 'WSx2'}, {}, {}, {bonus: 'LSx2'}, {}, {}, {}, {}, {}, {}, {}, {}, {},
                {}, {}, {bonus: 'WSx2'}, {}, {}, {bonus: 'LSx2'}, {}, {}, {}, {}, {}, {}, {}, {}, {},
                {}, {}, {}, {}, {}, {}, {bonus: 'LSx2'}, {}, {}, {}, {}, {}, {}, {}, {},
                {}, {}, {}, {}, {}, {}, {bonus: 'LSx2'}, {}, {}, {}, {}, {}, {}, {}, {},
                {}, {}, {}, {}, {}, {}, {}, {bonus: 'LSx2'}, {}, {}, {}, {}, {}, {}, {},
                {}, {}, {}, {}, {}, {}, {}, {bonus: 'LSx2'}, {}, {}, {}, {}, {}, {}, {},
                {}, {}, {}, {}, {}, {}, {bonus: 'LSx3'}, {bonus: 'LSx2'}, {bonus: 'LSx2'}, {}, {}, {}, {}, {}, {},
                {}, {}, {}, {}, {}, {}, {bonus: 'LSx3'}, {}, {bonus: 'LSx2'}, {}, {}, {}, {}, {}, {},
                {}, {}, {}, {}, {}, {bonus: 'LSx3'}, {}, {}, {bonus: 'LSx2'}, {}, {}, {}, {}, {}, {},
                {}, {}, {}, {}, {}, {bonus: 'LSx3'}, {}, {}, {}, {bonus: 'LSx2'}, {}, {}, {}, {}, {},
                {}, {}, {}, {}, {bonus: 'LSx3'}, {}, {}, {}, {}, {bonus: 'LSx2'}, {}, {}, {}, {}, {},
                {}, {}, {}, {bonus: 'LSx3'}, {bonus:'LSx3'}, {}, {}, {}, {}, {bonus: 'LSx2'}, {}, {}, {bonus: 'WSx2'}, {}, {},
                {}, {}, {}, {bonus: 'LSx3'}, {}, {}, {}, {}, {}, {bonus: 'LSx2'}, {}, {}, {bonus: 'WSx2'}, {}, {},
                {bonus: 'WSx3'}, {}, {bonus: 'LSx3'}, {}, {}, {}, {}, {}, {}, {}, {bonus:'LSx2'}, {bonus: 'LSx2'}, {}, {}, {bonus: 'WSx3'},
            ].map((tile, index) => { return {...tile, index }}),
            tiles,
            tileVal: {
                A: 1,
                B: 3,
                C: 3,
                D: 2,
                E: 1,
                F: 4,
                G: 2,
                H: 4,
                I: 1,
                J: 8,
                K: 5,
                L: 1,
                M: 3,
                N: 1,
                O: 1,
                P: 3,
                Q: 10,
                R: 1,
                S: 1,
                T: 1,
                U: 1,
                V: 4,
                W: 4,
                X: 8,
                Y: 4,
                Z: 10
            },
            playerTiles: [],
            firstMove: true,
            availableMoves: ['7,7'],
            wordDirection: '',
            word: [],
            response: {},
            yourTurn: true,
            currentTurn: []
        };
        this.updateBoard = this.updateBoard.bind(this);
        this.submit = this.submit.bind(this);
        this.updateAvailableMoves = this.updateAvailableMoves.bind(this);
        this.getMovesOnBoard = this.getMovesOnBoard.bind(this);
    }
    
    setupGame() {
        const selectedTiles = [];
        let tiles = this.state.tiles;
        for (let i = 0; i < 7; i++) {
            const tile = Math.floor(Math.random() * (tiles.length));
            selectedTiles.push(tiles[tile]);
            tiles.splice(tile, 1);
        }
        this.setState({
            tiles,
            playerTiles: selectedTiles
        })
    }
    componentDidMount() {
        this.setupGame();
    }
    componentDidUpdate() {
        socket.on('FromAPI', data => {
            this.setState({
                response: data
            })
        })
    }
    getCol(index) {
        return index % 15;
    }
    getRow(index) {
        return Math.floor(index / 15);
    }
    getAdjacentTileIndices(index) {
        // To get the tile above the given tile, we need to subtract 15 to get to the spot on the previous row
        // To get the tile below the given tile, we need to add 15 to get to the spot on the next row
        // To get the tile to the left, we need to subtract one
        // To get to the tile on the right, we need to add one
        return [index - 15, index - 1, index + 1, index + 15]
    }
    getAdjacentTiles(index) {
        // Converts index values to "row,col" values
        const tiles = this.getAdjacentTileIndices(index);
        return [...tiles.map(tile => `${this.getRow(tile)},${this.getCol(tile)}`)];
    }
    getMovesOnBoard(index) {
        let moves = [];
        this.state.board.forEach(tile => {
            if (tile.value) {
                moves.push(tile.index)
            }
        });
        if (moves.length !== 0) {
            // If calling this from a child function for a first move, we don't need to check against the current tile
            if (!index) {
            const availableMoves = [];
                moves.forEach(tile => availableMoves.push(...this.getAdjacentTiles(tile)))
                this.setState({
                    availableMoves
                })
            } else {
                // Now we need to find the tile already on the board that the first move of the turn is attaching to
                // This is important for determining what moves are valid and for having a correct value for currentTurn
                const current = [index];
                let prevMove;
                console.log({current})
                const directions = [index - 15, index - 1, index + 1, index + 15];
                for (let i = 0; i < moves.length; i++) {
                    if (directions.includes(moves[i])) {
                        prevMove = moves[i];
                        break;
                    }
                }
                current.unshift(prevMove);
                const available = [];
                current.forEach(tile => available.push(...this.getAdjacentTiles(tile)));
                const currentTurn = current.map(tile => `${this.getRow(tile)},${this.getCol(tile)}`)
                this.setState({
                    availableMoves: available,
                    currentTurn
                })
            }
        }
    }
    getIndex(id) {
        const [row, col] = id.split(",");
        return row * 15 + col;
    }
    getMoves(currentTurn) {
        if (currentTurn.length < 2) {
            return false;
        } else {
            // Sorting the array to get the first index that appears in the word
            currentTurn.sort((a, b) => {
                const aIndex = this.getIndex(a);
                const bIndex = this.getIndex(b);
                return aIndex - bIndex
            })
            let [firstRow, firstCol] = currentTurn[0].split(",");
            let [prevRow, prevCol] = currentTurn[currentTurn.length - 2].split(",");
            let [curRow, curCol] = currentTurn[currentTurn.length - 1].split(",");
            if (+prevRow < +curRow) {
                const prev = `${--firstRow},${firstCol}`;
                const next = `${++curRow},${curCol}`;
                return [prev, next];
            } else if (+prevRow > +curRow) {
                const prev = `${++firstRow},${firstCol}`;
                const next = `${--curRow},${curCol}`;
                return [prev, next];
            } else if (+prevCol < +curCol) {
                const prev = `${firstRow},${--firstCol}`;
                const next = `${curRow},${++curCol}`;
                return [prev, next];
            } else if (+prevCol > +curCol) {
                const prev = `${firstRow},${++firstCol}`;
                const next = `${curRow},${--curCol}`
                return [prev, next];
            }
        }
    }
    updateAvailableMoves(id, value) {
        const board = this.state.board;
        const index = value.index;
        board[index] = value;

        const current = [...this.state.currentTurn, id];
        const availableMoves = this.getMoves(current);
        if (availableMoves) {
            this.setState({
                availableMoves,
                currentTurn: current,
                board
            })
        } else if (id === '7,7') {
            // Since the first move is always 7,7, the second move is also predictable
            // Hardcoded to avoid necessity to calculate it
            this.setState({
                availableMoves: ['6,7', '8,7', '7,6', '7,8'],
                currentTurn: current,
                board
            });
        } else {
            this.setState({
                currentTurn: current,
                board
            });
            this.getMovesOnBoard(index);
        }
    }
    pass() {
        socket.emit('submit_move', [])
    }
    submit(playerTiles) {
        const [tiles, selectedTiles] = this.getRandom(playerTiles);
        this.setState({
            tiles,
            playerTiles: selectedTiles,
            currentTurn: []
        })
        socket.emit('submit_move', this.state.board);
    }
    getRandom(playerTiles) {
        const selectedTiles = playerTiles.slice();
        let tiles = this.state.tiles;
        for (let i = playerTiles.length; i < 7; i++) {
            const tile = Math.floor(Math.random() * (tiles.length));
            selectedTiles.push(tiles[tile]);
            tiles.splice(tile, 1);
        }
        return [tiles, selectedTiles]
    }
    startSwappingLetters = () => {
        this.setState({
            swapMode: true
        });
    }
    updateBoard(tile) {
        const id = tile.index;
        let board = this.state.board;
        board[id] = tile;
        this.setState({
            board
        })
        const availableMoves = this.getAdjacentTiles(id);
        this.setState({
            availableMoves
        })
    }
    swapLetters = (lettersToSwap, lettersToKeep) => {
        /* NOT YET WORKING 
        const selectedTiles = lettersToKeep
        let tiles = this.state.tiles;
        for (let i = 0; i < lettersToSwap.length || 7; i++) {
            const tile = Math.floor(Math.random() * (tiles.length));
            selectedTiles.push(tiles[tile]);
            tiles.splice(tile, 1);
        }
        tiles.push(...lettersToSwap);
        this.setState({
            tiles,
            playerTiles: selectedTiles
        })
        this.swappingFinished();
        */
    }
    swappingFinished = () => {
        /* NOT YET WORKING
        this.setState({
            swapMode: false
        })
        socket.emit('submit_move', [])
        */
    }
    
    render() {
        return (
            <div className="game">
               {this.state.playerTiles && this.state.playerTiles.length === 7 &&  (
               <Board 
                    tiles={this.state.tiles}
                    board={this.state.board}
                    availableMoves={this.state.availableMoves}
                    playerTiles={this.state.playerTiles}
                    tileVal={this.state.tileVal}
                    pass={this.pass}
                    startSwappingLetters={this.startSwappingLetters}
                    swapLetters={this.swapLetters}
                    swappingFinished={this.swappingFinished}
                    submit={this.submit}
                    swapMode={this.state.swapMode}
                    updateBoard={this.updateBoard}
                    yourTurn={this.state.yourTurn}
                    updateAvailableMoves={this.updateAvailableMoves}
                    getMovesOnBoard={this.getMovesOnBoard}
                    getMoves={this.getMoves}
                />
               )}
            </div>
        )
    }
}