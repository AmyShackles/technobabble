import React from 'react';
import { Board } from './Board.js';

let tiles = Array(9).fill('A').concat(Array(2).fill('B')).concat(Array(2).fill('C')).concat(Array(4).fill('D')).concat(Array(12).fill('E')).concat(Array(2).fill('F')).concat(Array(3).fill("G")).concat(Array(2).fill("H")).concat(Array(9).fill("I")).concat(Array(1).fill("J")).concat(Array(1).fill("K")).concat(Array(4).fill("L")).concat(Array(2).fill("M")).concat(Array(6).fill("N")).concat(Array(8).fill("O")).concat(Array(2).fill("P")).concat(Array(1).fill("Q")).concat(Array(6).fill("R")).concat(Array(4).fill("S")).concat(Array(6).fill("T")).concat(Array(4).fill("U")).concat(Array(2).fill("V")).concat(Array(2).fill("W")).concat(Array(1).fill("X")).concat(Array(2).fill("Y")).concat(Array(1).fill("Z")).concat(Array(2).fill(" "));
console.log(tiles)




export class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: [
                {bonus: 'WSx3'}, {}, {}, {bonus: 'LSx2'}, {}, {}, {}, {bonus: 'WSx3'}, {}, {}, {}, {bonus: 'LSx2'}, {}, {}, {bonus: 'WSx3'},
                {}, {bonus: 'WSx2'}, {}, {}, {}, {bonus: 'LSx3'}, {}, {}, {}, {bonus: 'LSx3'}, {}, {}, {}, {bonus: 'WSx2'}, {},
                {}, {}, {bonus: 'WSx2'}, {}, {}, {}, {bonus: 'LSx2'}, {}, {bonus: 'LSx2'}, {}, {}, {}, {bonus: 'WSx2'}, {}, {},
                {bonus: 'LSx2'}, {}, {}, {bonus: 'WSx2'}, {}, {}, {}, {bonus: 'LSx2'}, {}, {}, {}, {bonus: 'WSx2'}, {}, {}, {bonus: 'LSx2'},
                {}, {}, {}, {}, {bonus: 'WSx2'}, {}, {}, {}, {}, {}, {bonus: 'WSx2'}, {}, {}, {}, {},
                {}, {bonus: 'LSx3'}, {}, {}, {}, {bonus: 'LSx3'}, {}, {}, {}, {bonus: 'LSx3'}, {}, {}, {}, {bonus: 'LSx3'}, {},
                {}, {}, {bonus: 'LSx2'}, {}, {}, {}, {bonus: 'LSx2'}, {}, {bonus: 'LSx2'}, {}, {}, {}, {bonus: 'LSx2'}, {}, {},
                {bonus: 'WSx3'}, {}, {}, {bonus: 'LSx2'}, {}, {}, {}, {bonus: 'WSx2'}, {}, {}, {}, {bonus: 'LSx2'}, {}, {}, {bonus: 'WSx3'},
                {}, {}, {bonus: 'LSx2'}, {}, {}, {}, {bonus: 'LSx2'}, {}, {bonus: 'LSx2'}, {}, {}, {}, {bonus: 'LSx2'}, {}, {},
                {}, {bonus: 'LSx3'}, {}, {}, {}, {bonus: 'LSx3'}, {}, {}, {}, {bonus: 'LSx3'}, {}, {}, {}, {bonus: 'LSx3'}, {},
                {}, {}, {}, {}, {bonus: 'WSx2'}, {}, {}, {}, {}, {}, {bonus: 'WSx2'}, {}, {}, {}, {},
                {bonus: 'LSx2'}, {}, {}, {bonus: 'WSx2'}, {}, {}, {}, {bonus: 'LSx2'}, {}, {}, {}, {bonus: 'WSx2'}, {}, {}, {bonus: 'LSx2'},
                {}, {}, {bonus: 'WSx2'}, {}, {}, {}, {bonus: 'LSx2'}, {}, {bonus: 'LSx2'}, {}, {}, {}, {bonus: 'WSx2'}, {}, {},
                {}, {bonus: 'WSx2'}, {}, {}, {}, {bonus: 'LSx3'}, {}, {}, {}, {bonus: 'LSx3'}, {}, {}, {}, {bonus: 'WSx2'}, {},
                {bonus: 'WSx3'}, {}, {}, {bonus: 'LSx2'}, {}, {}, {}, {bonus: 'WSx3'}, {}, {}, {}, {bonus: 'LSx2'}, {}, {}, {bonus: 'WSx3'},
            ],
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
        };
    }
    setupGame() {
        const selectedTiles = [];
        let tiles = this.state.tiles;
        for (let i = 0; i < 7; i++) {
            const tile = Math.floor(Math.random() * (tiles.length));
            console.log(tile)
            selectedTiles.push(tiles[tile]);
            console.log(selectedTiles)
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
    render() {
        return (
            <div className="game">
               {this.state.playerTiles &&  <Board tiles={this.state.board} scrabbleTiles={this.state.playerTiles} tileVal={this.state.tileVal} />}
            </div>
        )
    }
}