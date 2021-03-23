import { Chess } from "./chess.js";
import { ChessPlayer } from "./chessplayer.js"
import { GameInfo } from "./gameinfo.js"
export class ChessArchive {
    constructor(chessView) {
        this.id = null;
        this.matches = [];   // [] : gameInfo
        this.container = null;
        this.chessView = chessView;
    }
    pushMatch(match) {
        this.matches.push(match);
        this.redraw();
    }
    draw(host) {
        if (!host)
            throw new Error("Host is invalid.");

        let archiveCont = document.createElement('div');
        archiveCont.className = "ArchiveContainer";
        this.drawArchiveTable(archiveCont);

        host.appendChild(archiveCont);

        this.drawInputFields(host);
    }
    drawArchiveTable(host) {
        this.container = document.createElement("table");

        this.container.classList.add("GamesArchive");
        host.appendChild(this.container);



        let thead = document.createElement("thead");
        this.container.appendChild(thead);

        let trHead = document.createElement("tr");
        thead.appendChild(trHead);

        let headerInfo = ["White player", "Black player", "Info", ""];

        headerInfo.forEach(el => {
            let headerData = document.createElement('td');
            headerData.innerHTML = el;
            trHead.appendChild(headerData);
        });

        let tbody = document.createElement("tbody");
        this.container.appendChild(tbody);

        let buttons = ["Load", "Update", "Delete"];
        this.matches.forEach((el, key) => {
            let tr = document.createElement('tr');
            tbody.appendChild(tr);

            el.drawArchive(tr);

            let td = document.createElement('td');
            td.className = 'ButtonsCell';
            tr.appendChild(td);

            let functions = [this.load, this.update, this.removeMatch];
            buttons.forEach((btn, ind) => {
                let button = document.createElement('button');
                button.className = `Button${btn}${key}`;
                button.innerHTML = btn;
                td.appendChild(button);
            });
            document.querySelector(`.ButtonLoad${key}`).onclick = () => {
                this.chessView.load(el);
                this.chessView.focus();
            }
            document.querySelector(`.ButtonUpdate${key}`).onclick = async () => {
                await this.updateGame(key);
                await this.loadFromDB();
            }
            document.querySelector(`.ButtonDelete${key}`).onclick = async () => {
                //this.removeMatch(el.getID());
                let match = this.matches[key];
                let whiteId = match.getWhiteID();
                let blackId = match.getBlackID();

                let reqDelete = await fetch(`https://localhost:5001/Chess/DeleteGame/${match.getID()}/${whiteId}/${blackId}`,
                    {
                        method: "DELETE"

                    });
                if (reqDelete.ok) {

                    await this.loadFromDB();
                }
                else
                    reqDelete.json()
                        .then(er => console.log(er.message))
                        .catch(er => console.log(er));

            }
        });
    }
    drawInputFields(host) {
        let divInput = document.createElement('div');
        divInput.className = "Input";
        let inputStringWhite = `<div class="PlayerInput">
                            <label>First name</label>
                            <input type="text" placeholder="John" class="InputNameWhite" />
                            <br />
                            <label>Last name</label>
                            <input type="text" placeholder="Doe" class="InputLastNameWhite" />
                            <br />
                            <label>Rating</label><input type="number" placeholder="1600" class="InputRatingWhite" />
                            <br />
                            <label>Nationality</label>
                            <input type="text" placeholder="USA" class="InputNationalityWhite" />
                            <br />
                            <label>Age</label>
                            <input type="number" placeholder="25" class="InputAgeWhite" />
                        </div>`;
        let inputStringBlack = `<div class="PlayerInput">
                            <label>First name</label>
                            <input type="text" placeholder="John" class="InputNameBlack" />
                            <br />
                            <label>Last name</label>
                            <input type="text" placeholder="Doe" class="InputLastNameBlack" />
                            <br />
                            <label>Rating</label><input type="number" placeholder="1600" class="InputRatingBlack" />
                            <br />
                            <label>Nationality</label>
                            <input type="text" placeholder="USA" class="InputNationalityBlack"/>
                            <br />
                            <label>Age</label>
                            <input type="number" placeholder="25" class="InputAgeBlack" />
                        </div>`;
        divInput.innerHTML = `<div class="PlayersInput">` + inputStringWhite + inputStringBlack + `</div>` + `<div class="PGNInput"><label>PGN</label><br/>
                                                            <textarea class="PGNInputField" placeholder="Place moves here"></textarea></div>`;
        host.appendChild(divInput);

        let inputButton = document.createElement("button");
        inputButton.innerHTML = "Add match";
        inputButton.className = "InputButton";
        inputButton.onclick = async (ev) => {

            await this.addMatch();
            await this.loadFromDB();
        };
        divInput.appendChild(inputButton);
    }
    redraw() {
        let parent = this.container.parentNode;
        this.container.remove();
        this.drawArchiveTable(parent);
    }
    validateInput() {


        let WhitePlayer = this.validatePlayer("White");
        let BlackPlayer = this.validatePlayer("Black");

        let engine = new Chess();
        let pgnEl = document.querySelector(".PGNInputField");
        let pgnWithHeader = pgnEl.value;


        if (!engine.load_pgn(pgnWithHeader)) {
            alert("Invalid PGN format.");
            throw new Error("Invalid PGN format.");
        }
        if (WhitePlayer && BlackPlayer)
            return new GameInfo(null, pgnWithHeader, WhitePlayer, BlackPlayer);
        else
            throw new Error("Invalid data.");
    }
    validatePlayer(player) {
        let name = document.querySelector(`.InputName${player}`).value;
        let lastName = document.querySelector(`.InputLastName${player}`).value;
        let rating = parseInt(document.querySelector(`.InputRating${player}`).value);
        let nationality = document.querySelector(`.InputNationality${player}`).value;
        let age = parseInt(document.querySelector(`.InputAge${player}`).value);

        if (rating < 0 || age < 0 || !(name.length > 0) || !(lastName.length > 0) || !(nationality.length > 0)) {
            alert(`Invalid ${player} info`);
            throw new Error(`Invalid ${player} info`);
        }
        return new ChessPlayer(name, lastName, rating, nationality, age);
    }

    async loadFromDB() {
        this.matches = [];

        let reqA = await fetch("https://localhost:5001/Chess/GetArchive");
        if (reqA.ok) {
            let data = await reqA.json();
            this.id = data.id;
            data.games.forEach(async (game) => {
                const idWhite = game.whitePlayerID;
                const idBlack = game.blackPlayerID;

                let WhitePlayer = await this.loadPlayer(idWhite);
                let BlackPlayer = await this.loadPlayer(idBlack);

                this.pushMatch(new GameInfo(game.id, game.pgn, WhitePlayer, BlackPlayer));
            });
        }
        else
            response.json()
                .then(er => console.log(er.message))
                .catch(er => console.log(er));
    }
    async loadPlayer(id) {
        let req = await fetch(`https://localhost:5001/Chess/GetPlayer/${id}`);
        if (req.ok) {
            let data = await req.json();
            return new ChessPlayer(data.name, data.lastName, data.elo,
                data.nationality, data.age, data.id);
        }
        else
            req.json()
                .then(er => console.log(er.message))
                .catch(er => console.log(er));
    }
    async updateGame(index) {
        let IDs;
        let game = this.matches[index];
        let newGame = this.validateInput();

        let request = await fetch(`https://localhost:5001/Chess/UpdateGame`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: game.getID(),
                    pgn: newGame.getPGN()
                })
            });
        if (request.ok) {
            console.log("Succsessfuly updated a game.")

            IDs = await request.json();

            await this.updatePlayer(IDs.idWhite, newGame.getWhitePlayer());

            await this.updatePlayer(IDs.idBlack, newGame.getBlackPlayer());

        } else
            request.json()
                .then(er => console.log(er.message))
                .catch(er => console.log(er));
    }
    async updatePlayer(id, player) {


        let reqU = await fetch(`https://localhost:5001/Chess/UpdatePlayer`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: player.name,
                    lastName: player.lastName,
                    elo: player.elo,
                    nationality: player.nationality,
                    age: player.age,
                    id: id
                })
            });
        if (reqU.ok) {
            console.log("Succsessfuly updated a game.")
        }
        else
            reqU.json()
                .then(er => console.log(er.message))
                .catch(er => console.log(er));

    }
    async addMatch() {
        let newGame = this.validateInput();

        let whiteID = await this.addPlayer(newGame.getWhitePlayer());

        let blackID = await this.addPlayer(newGame.getBlackPlayer());


        let request = await fetch(`https://localhost:5001/Chess/AddGame`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    pgn: newGame.getPGN(),
                    whitePlayerID: whiteID,
                    blackPlayerID: blackID
                })
            });
        if (request.ok) {
            console.log("Succsessfuly added a game.")

        } else
            request.json()
                .then(er => console.log(er.message))
                .catch(er => console.log(er));
    }
    async addPlayer(player) {
        let reqAdd = await fetch(`https://localhost:5001/Chess/AddPlayer`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: player.name,
                    lastName: player.lastName,
                    elo: player.elo,
                    nationality: player.nationality,
                    age: player.age
                })
            });
        if (reqAdd.ok) {
            console.log("Succsessfuly added a player.")
            return await reqAdd.json();
        }
        else
            reqAdd.json()
                .then(er => console.log(er.message))
                .catch(er => console.log(er));
    }
}