import { ChessBoard } from "./chessboard.js";
import { ChessPlayer } from "./chessplayer.js";
import { ChessView } from "./chessview.js"
import { ChessArchive } from "./chessarchive.js"


let chessView = new ChessView();
chessView.draw(document.body);

let chessArchive = new ChessArchive(chessView);
await chessArchive.loadFromDB();

let archiveCont = document.createElement("div");
archiveCont.classList.add("Archive");
document.body.appendChild(archiveCont);

chessArchive.draw(archiveCont);



