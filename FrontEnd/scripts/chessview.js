
import { Chess } from "./chess.js";
import { ChessBoard } from "./chessboard.js";
import { GameInfo } from "./gameinfo.js";

var audio = new Audio("./move-self.mp3");

export class ChessView {
    constructor(chessGame, whitePlayer, blackPlayer) {
        this.gameInfo = null;
        this.chessBoard = new ChessBoard(/*chessGame*/);
        this.container = null;
    }
    draw(host) {
        if (host === null)
            throw new Error("Container is null or invalid.");

        let emptyBoard = (this.gameInfo === null);

        this.container = document.createElement("div");
        this.container.classList.add("GameAndInfo");

        let pictureContainer = document.createElement("div");
        pictureContainer.classList.add("PlayerPictures");
        this.container.appendChild(pictureContainer);
        this.drawPictures(pictureContainer, emptyBoard);

        let chessBoardAndControls = document.createElement("div")
        chessBoardAndControls.classList.add("ChessBoardAndControls")

        let boardContainer = document.createElement("div");
        chessBoardAndControls.appendChild(boardContainer);
        this.chessBoard.drawBoard(boardContainer);


        let buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("ControlButtons");
        chessBoardAndControls.appendChild(buttonsContainer);

        let buttonNames = ["↺", "<", ">", "↻"];
        let buttonFunctions = [this.rollbackGame, this.back, this.forward, this.end];

        buttonNames.forEach((el, ind) => {
            let btn = document.createElement("button");
            btn.innerHTML = el;
            btn.onclick = () => { if (buttonFunctions[ind](this.chessBoard)) audio.play(); };
            buttonsContainer.appendChild(btn);
        })

        this.container.appendChild(chessBoardAndControls);

        let infoContainer = document.createElement("div");
        infoContainer.className = "InfoDiv";
        this.container.appendChild(infoContainer);

        if (this.gameInfo) {
            this.gameInfo.drawInfo(infoContainer);
        }


        host.appendChild(this.container);
    }
    focus() {
        this.container.scrollIntoView({ behavior: "auto", block: "center", inline: "nearest" });
    }
    redraw() {
        this.chessBoard.redraw();
        let pictureContainer = document.querySelector(".PlayerPictures")
        this.drawPictures(pictureContainer, false);
        let info = document.querySelector(".InfoDiv");
        this.gameInfo.drawInfo(info);
    }
    drawPictures(host, emptyBoard) {
        if (host === null)
            throw new Error("Container is null or invalid.");

        while (host.childNodes.length > 0) {
            host.removeChild(host.childNodes[0]);
        }

        let blackPlayerContainer = document.createElement("div");
        blackPlayerContainer.classList.add("BlackPlayer");

        let label = document.createElement("label");
        label.innerHTML = (!emptyBoard) ? this.gameInfo.getBlackPlayerAsString() : "Black";
        label.classList.add("PlayerNameLabel");
        blackPlayerContainer.appendChild(label);

        let img = document.createElement("img");
        img.classList.add("BlackPlayerImage");
        if (!emptyBoard) {
            img.src = this.gameInfo.getBlackImage();
            img.alt = "Black Player"
        }
        blackPlayerContainer.appendChild(img);

        host.appendChild(blackPlayerContainer);

        label = document.createElement("label");
        label.innerHTML = "VS.";
        label.classList.add("PlayerNameLabel");
        host.appendChild(label);

        let whitePlayerContainer = document.createElement("div");
        whitePlayerContainer.classList.add("WhitePlayer");

        img = document.createElement("img");
        img.classList.add("WhitePlayerImage");
        if (!emptyBoard) {
            img.src = this.gameInfo.getWhiteImage();
            img.alt = "White Player";
        }
        whitePlayerContainer.appendChild(img);

        label = document.createElement("label");
        label.innerHTML = (!emptyBoard) ? this.gameInfo.getWhitePlayerAsString() : "White";
        label.classList.add("PlayerNameLabel");
        whitePlayerContainer.appendChild(label);

        host.appendChild(whitePlayerContainer);

    }
    getGameInfo() {
        return this.gameInfo;
    }
    rollbackGame(board) {
        return board.rollbackGame();
    }
    back(board) {
        return board.undoMove();
    }
    forward(board) {
        return board.playMove();
    }
    end(board) {
        return board.gotoEnd();
    }
    availableMoves() {
        return this.chessBoard.availableMoves();
    }
    load(match) {
        this.gameInfo = match;
        this.chessBoard.load(match);
        this.redraw();

    }
}
