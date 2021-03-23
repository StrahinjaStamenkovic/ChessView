var imagePathFolder = "images/";
export class ChessPlayer {
    constructor(name, lastName, elo, nationality, age, id) {
        this.name = name;
        this.lastName = lastName;
        this.elo = elo;
        this.nationality = nationality;
        this.age = age;
        this.imagePath = imagePathFolder + name.toLowerCase() + lastName.toLowerCase() + '.jpg';
        this.imageContainer = null;
        this.id = id;
    }
    getImagePath() { return this.imagePath; }
    getFullNameAndElo() { return `${this.name} ${this.lastName} (${this.elo})`; }
    getName() { return this.name; }
    getID() { return this.id; }
    setID(id) { this.id = id; }
}