//TODO: более адаптивные расстояния между картами в ширину и адаптивный текст
//TODO: анимация перемешивания в центр при начале игры
//TODO: почему звуки в первой игре не успевают подгружаться и не проигрываются...
//автор: Кондратьев Александр
//вроде для pixi.js нужен сервер, так что через index.html из папки не запускает
//но из вебшторма на локальном сервере работает

//variables
let cats = [[],[],[],[]];
let cards = [[],[],[],[]];
let opened = [[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false],];
let usedSprites = [0,0,0,0,0,0,0,0,];
let openedCard = null;
let wait = false;
let openCounter = 0;
let timer = {
    min: 0,
    sec: 0,
    id: null,
};

//functions
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function getPos(x) {
    switch (x) {
        case 0: return -3;
        case 1: return -1;
        case 2: return 1;
        case 3: return 3;
    }
}
function initCats() {
    for(let i=0;i<4;i++) {
        for (let j = 0; j < 4; j++) {
            do{
                let x = getRandomInt(8);
                if(usedSprites[x]<2){
                    cats[i][j]=x;
                    usedSprites[x]++;
                    break;
                }
            }while(true)
        }
    }
}
function closeCards() {
    for(let i=0;i<4;i++) {
        for (let j = 0; j < 4; j++) {
            cards[i][j].textures = cardTexturesBack[cats[i][j]];
            cards[i][j].play();
        }
    }
}
function openCards() {
    for(let i=0;i<4;i++) {
        for (let j = 0; j < 4; j++) {
            cards[i][j].textures = cardTextures[cats[i][j]];
            cards[i][j].play();
        }
    }
}
function openCard(i,j) {
    if (opened[i][j]===false){
        wait = true;
        if(openedCard==null){
            cardFlipSound();
            cards[i][j].textures = cardTextures[cats[i][j]];
            cards[i][j].play();
            openedCard = [i,j];
            wait = false;
            console.log("null");
        }
        else{
            if(!(i===openedCard[0] && j===openedCard[1])){
                cards[i][j].textures = cardTextures[cats[i][j]];
                cards[i][j].play();
            }
            if(cats[i][j]===cats[openedCard[0]][openedCard[1]] && !(i===openedCard[0] && j===openedCard[1])){
                cardFlipSound();
                opened[i][j]=true;
                opened[openedCard[0]][openedCard[1]]=true;
                openCounter++;
                if(openCounter!==8)  setTimeout("correctSound()",500);
                openedCard = null;
                wait = false;
                console.log("==");
            }
            else{
                if(!(i===openedCard[0] && j===openedCard[1])){
                    cardFlipSound();
                    console.log("no");
                    setTimeout("nopeSound();",500);
                    setTimeout(function () {
                        cardFlipSound();
                        cards[i][j].textures = cardTexturesBack[cats[i][j]];
                        cards[i][j].play();
                        cards[openedCard[0]][openedCard[1]].textures = cardTexturesBack[cats[openedCard[0]][openedCard[1]]];
                        cards[openedCard[0]][openedCard[1]].play();
                        openedCard = null;
                        wait = false;
                    },1000);
                }
                else{
                    console.log("same");
                    wait = false;
                }
            }
        }
        if(openCounter===8){
            setTimeout("winSound();",500);
            clearInterval(timer.id);
            setTimeout("newGame()",5000);
        }
    }
}
function resized(){
    app.renderer.resize(window.innerWidth,window.innerHeight);
    gameTimer.position.set(window.innerWidth/8,window.innerHeight/2);
    gameText.position.set(window.innerWidth/8,window.innerHeight/2);
    for(let i=0;i<4;i++) {
        for (let j = 0; j < 4; j++) {
            cards[i][j].scale.set(window.innerHeight / 4586);
            cards[i][j].position.set(
                window.innerWidth/2 + (window.innerWidth / 25 * getPos(i)),
                window.innerHeight/2 + (window.innerHeight / 9 * getPos(j)),
            );
        }
    }
}
function newGame() {
    //cleaning
    usedSprites = [0,0,0,0,0,0,0,0,];
    opened = [[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false],];
    cats = [[],[],[],[]];
    openCounter = 0;
    openedCard = null;
    wait = false;
    timer.min = 0;
    timer.sec = 0;
    timer.id = null;
    gameTimer.text = '00:00';
    //initialising
    initCats();
    closeCards();
    //playing
    wait = true;
    cardsMixSound();
    setTimeout(function () {
        cardFlipSound();
        openCards();
        setTimeout(function () {
            cardFlipSound();
            closeCards();
            wait = false;
            timer.id = setInterval(function () {
                if(timer.sec===59){
                    timer.sec = 0;
                    timer.min++;
                }
                else timer.sec++;
                gameTimer.text = (timer.min<10?"0"+timer.min:timer.min)+":"+(timer.sec<10?"0"+timer.sec:timer.sec);
            },1000);
        },5000);
    },1000);
}
window.onresize = resized;

//sounds
function nopeSound() {
    let audio = new Audio();
    audio.src = './src/sounds/nope.mp3';
    audio.autoplay = true;
}
function cardFlipSound() {
    let audio = new Audio();
    audio.src = './src/sounds/cardflip.mp3';
    audio.autoplay = true;
}
function cardsMixSound() {
    let audio = new Audio();
    audio.src = './src/sounds/cardsmix.mp3';
    audio.autoplay = true;
}
function correctSound() {
    let audio = new Audio();
    audio.src = './src/sounds/correct.mp3';
    audio.autoplay = true;
}
function winSound() {
    let audio = new Audio();
    audio.src = './src/sounds/win.mp3';
    audio.autoplay = true;
}

//textures
let cardTextures = [[],[],[],[],[],[],[],[]];
for (let i=0;i<8;i++){
    for (let j=0;j<5;j++){
        cardTextures[i].push(PIXI.Texture.from('./src/images/cardback_'+j+'.png'));
    }
    for(let j=3;j>-1;j--){
        cardTextures[i].push(PIXI.Texture.from('./src/images/cat'+i+'_'+j+'.png'));
    }
}
let cardTexturesBack = [[],[],[],[],[],[],[],[]];
for (let i=0;i<8;i++){
    for(let j=0;j<4;j++){
        cardTexturesBack[i].push(PIXI.Texture.from('./src/images/cat'+i+'_'+j+'.png'));
    }
    for(let j=4;j>-1;j--){
        cardTexturesBack[i].push(PIXI.Texture.from('./src/images/cardback_'+j+'.png'));
    }
}

//canvas filling
const Application = PIXI.Application;
const app = new Application({
    backgroundColor: 0x89e970,
    width: window.innerWidth,
    height: window.innerHeight,
});
app.renderer.view.style.position = 'absolute';
document.body.appendChild(app.view);
for(let i=0;i<4;i++){
    for(let j=0;j<4;j++){
        cards[i][j] = new PIXI.AnimatedSprite(cardTexturesBack[0]);
        cards[i][j].loop = false;
        cards[i][j].interactive = true;
        cards[i][j].buttonMode = true;
        cards[i][j].scale.set(window.innerHeight / 4586);
        cards[i][j].anchor.set(0.5);
        cards[i][j].position.set(
            window.innerWidth/2 + (window.innerWidth / 25 * getPos(i)),
            window.innerHeight/2 + (window.innerHeight / 9 * getPos(j)),
        );
        cards[i][j].on('pointerdown',function () {
            if(wait===false)openCard(i,j);
        })
        app.stage.addChild(cards[i][j]);
        console.log(i+'.'+j);
    }
}
const style = new PIXI.TextStyle({
    fontSize: 35,
});
const gameText = new PIXI.Text('Время игры',style);
app.stage.addChild(gameText);
gameText.anchor.y = 1;
gameText.position.set(window.innerWidth/8,window.innerHeight/2);
const gameTimer = new PIXI.Text("00:00",style);
app.stage.addChild(gameTimer);
gameTimer.position.set(window.innerWidth/8,window.innerHeight/2);

//playing
newGame();




