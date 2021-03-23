import { Chess } from "./chess.js"
export class ChessBoard {

    constructor() {
        this.container = null;
        this.chessEngine = new Chess();
        this.movesAccumulator = [];
    }
    drawBoard(host) {
        if (host === null)
            throw new Error("Container is null or invalid.");
        this.container = document.createElement("table");
        this.container.classList.add("ChessBoardTable");
        this.drawTable(this.container);
        host.appendChild(this.container);
    }
    getChessPiece(field) {
        let Pieces = ['♔', '♕', '♖', '♗', '♘', '♙', '♚', '♛', '♜', '♝', '♞', '♟'];
        let keys = ['K', 'Q', 'R', 'B', 'N', 'P', 'k', 'q', 'r', 'b', 'n', 'p'];
        if (!field)
            return "";
        let map = new Map();
        Pieces.forEach((el, ind) => map.set(keys[ind], el));
        let key = (field.color === 'w') ? field.type.toUpperCase() : field.type;
        return map.get(key);

    }
    drawTable(table) {

        let thead = document.createElement("thead");
        table.appendChild(thead);

        let trHead = document.createElement("tr");
        thead.appendChild(trHead);

        let files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        for (let i = 0; i <= 8; i++) {
            let th = document.createElement("th");
            th.innerHTML = (i !== 0) ? files[i - 1] : "";
            trHead.appendChild(th);
        }


        let tbody = document.createElement("tbody");
        table.appendChild(tbody);

        let fields = this.chessEngine.board();
        console.log(fields);
        for (let i = 0; i < 8; i++) {
            let tr = document.createElement("tr");

            let num = document.createElement("th");
            num.innerHTML = 8 - i;
            tr.appendChild(num);

            for (let j = 0; j < 8; j++) {
                let td = document.createElement("td");
                td.classList.add("ChessField");
                let fieldColorClass = ((i + j) % 2 == 0) ? "WhiteField" : "BlackField";
                td.classList.add(fieldColorClass);
                tr.appendChild(td);

                td.innerHTML = this.getChessPiece(fields[i][j]);
            }

            tbody.appendChild(tr);
        }
    }
    redraw() {
        let parent = this.container.parentNode;
        this.container.remove();
        this.drawBoard(parent);
    }
    rollbackGame() { //returns a list of moves and sets a loaded game to the initial state
        let move = this.chessEngine.undo();
        let moves = [];
        while (move !== null) {
            moves.push(move);
            move = this.chessEngine.undo();
        }
        if (moves.length > 0) {
            this.movesAccumulator = this.movesAccumulator.concat(moves);
            this.redraw();
            return true;
        }
        return false;
    }
    undoMove() {
        let move = this.chessEngine.undo()
        if (move !== null) {
            this.movesAccumulator.push(move);
            this.redraw();
        }
        return move;
    }
    playMove() {

        let move = this.chessEngine.move(this.movesAccumulator.pop());
        if (move)
            this.redraw();
        return move;
    }
    gotoEnd() {
        if (this.movesAccumulator.length === 0)
            return false;

        while (this.movesAccumulator.length > 0) {
            this.playMove();
        }
        this.redraw();
        return true;
    }

    availableMoves() {
        return this.movesAccumulator.length;
    }
    load(match) {
        this.chessEngine.load_pgn(match.getPGN());
        this.movesAccumulator = [];
    }
}