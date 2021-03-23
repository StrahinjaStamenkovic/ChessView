
export class GameInfo {
    constructor(id, pgn, whitePlayer, blackPlayer) {

        this.pgn = pgn;
        this.whitePlayer = whitePlayer;
        this.blackPlayer = blackPlayer;
        this.infoContainer = null;
        this.archiveContainer = null;

        this.id = id;
    }
    setID() { this.id = id; }
    getID() { return this.id; }
    getWhiteID() { return this.whitePlayer.getID() }
    getBlackID() { return this.blackPlayer.getID() }
    getPGN() { return this.pgn }
    getWhitePlayerAsString() {
        return this.whitePlayer.getFullNameAndElo();
    }

    getBlackPlayerAsString() {
        return this.blackPlayer.getFullNameAndElo();
    }

    getWhiteImage() { return this.whitePlayer.getImagePath(); }
    getBlackImage() { return this.blackPlayer.getImagePath(); }

    getWhitePlayer() { return this.whitePlayer; }
    getBlackPlayer() { return this.blackPlayer; }

    getArchiveContainer() { return this.archiveContainer; }
    drawInfo(host) {
        if (host === null)
            throw new Error("Container is null or invalid.");

        while (host.childNodes.length > 0) {
            host.removeChild(host.childNodes[0]);
        }

        this.infoContainer = document.createElement("pre");
        this.infoContainer.classList.add("Info");
        this.infoContainer.innerHTML = this.pgn;
        host.appendChild(this.infoContainer);
    }
    drawArchive(host) {
        if (host === null)
            throw new Error("Container is null or invalid.");


        this.archiveContainer = host;

        let white = document.createElement('td');
        white.innerHTML = this.whitePlayer.getFullNameAndElo()
        this.archiveContainer.appendChild(white);

        let black = document.createElement('td');
        black.innerHTML = this.blackPlayer.getFullNameAndElo()
        this.archiveContainer.appendChild(black);

        let info = document.createElement('td');
        let infoPre = document.createElement('pre');
        infoPre.className = "InfoCellPre";

        infoPre.innerHTML = this.pgn;;
        info.appendChild(infoPre);
        this.archiveContainer.appendChild(info);

    }

}
