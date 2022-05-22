export  class Sounds {      //класс со звукамиы
    nopeSound() {
        let audio = new Audio();
        audio.src = './src/sounds/nope.mp3';
        audio.autoplay = true;
    }
    cardFlipSound() {
        let audio = new Audio();
        audio.src = './src/sounds/cardflip.mp3';
        audio.autoplay = true;
    }
    cardsMixSound() {
        let audio = new Audio();
        audio.src = './src/sounds/cardsmix.mp3';
        audio.autoplay = true;
    }
    correctSound() {
        let audio = new Audio();
        audio.src = './src/sounds/correct.mp3';
        audio.autoplay = true;
    }
    winSound() {
        let audio = new Audio();
        audio.src = './src/sounds/win.mp3';
        audio.autoplay = true;
    }
}