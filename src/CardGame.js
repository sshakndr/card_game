import {Card} from "./Card.js";
import {Sounds} from "./sounds.js";

export class CardGame{
    app;    //объект приложения
    cards = [[],[],[],[]];  //массив с картами
    openedCard = null;  //буфер для открытой (но не угаданной) карты
    wait = false;   //переменная для отключения нажатий
    openCounter = 0;    //счетчик угаданных пар
    gameText;   //текст для таймера
    gameTimer;  //сам таймер(текст)
    style = new PIXI.TextStyle({    //стиль для дальнейшего управления размером шрифта
        fontSize: 35,
    });
    timer = {   //таймер
        min: 0,
        sec: 0,
        id: null,
    };
    sound = new Sounds();   //объект со звуками

    constructor() {
        //объявление приложения
        this.app = new PIXI.Application({
            backgroundColor: 0x89e970,
            width: window.innerWidth,
            height: window.innerHeight,
        });
        this.app.renderer.view.style.position = 'absolute';
        document.body.appendChild(this.app.view);
        //заполнение массива карт
        let x = this;
        for(let i=0;i<4;i++){
            for(let j=0;j<4;j++){
                this.cards[i][j] = new Card();
                this.cards[i][j].look.on('pointerdown',function () {
                    if(x.wait===false) x.check(i,j);
                });
                this.app.stage.addChild(this.cards[i][j].look);
            }
        }
        //объявление текста для таймера
        this.gameText = new PIXI.Text('Время игры:  ',this.style);
        this.app.stage.addChild(this.gameText);
        this.gameTimer = new PIXI.Text("00:00",this.style);
        this.app.stage.addChild(this.gameTimer);
        this.resize();  //установка всех объектов на свои места
    }

    getRandomInt(max) { //метод для удобного рандома
        return Math.floor(Math.random() * max);
    }
    initCats() {    //заполнение  поля (перемешивание карт)
        let usedSprites = [0,0,0,0,0,0,0,0,];
        for(let i=0;i<4;i++) {
            for (let j = 0; j < 4; j++) {
                do{
                    let x = this.getRandomInt(8);
                    if(usedSprites[x]<2){
                        this.cards[i][j].cat=x;
                        usedSprites[x]++;
                        break;
                    }
                }while(true)
            }
        }
    }
    closeC() {  //закрытие всех карт
        for(let i=0;i<4;i++) {
            for (let j = 0; j < 4; j++) {
                this.cards[i][j].close();
            }
        }
    }
    openC() {   //открытие всех карт
        for(let i=0;i<4;i++) {
            for (let j = 0; j < 4; j++) {
                this.cards[i][j].open();
            }
        }
    }
    resize(){   //метод для установки всех объектов на свои места
        //местные числа - посчитанные коэффициенты, а не магические
        this.app.renderer.resize(window.innerWidth,window.innerHeight);
        for(let i=0;i<4;i++) {
            for (let j = 0; j < 4; j++){
                this.cards[i][j].resize(i,j);
            }
        }
        if(window.innerHeight > window.innerWidth){
            this.gameText.anchor.y = 0;
            this.gameText.anchor.x = 1;
            this.style.fontSize = window.innerHeight / 40;
            this.gameText.position.set(window.innerWidth/2,window.innerHeight > 1.5 * window.innerWidth?window.innerHeight/8:0);
            this.gameTimer.position.set(window.innerWidth/2,window.innerHeight > 1.5 * window.innerWidth?window.innerHeight/8:0);
        }else{
            this.gameText.anchor.y = 1;
            this.gameText.anchor.x = 0;
            this.style.fontSize = window.innerWidth / 40;
            this.gameText.position.set(window.innerWidth > 1.5 * window.innerHeight?window.innerWidth/8:0,window.innerHeight/2);
            this.gameTimer.position.set(window.innerWidth > 1.5 * window.innerHeight?window.innerWidth/8:0,window.innerHeight/2);
        }
    }
    check(i,j){ //проверка поля при нажатии на карту
        if (this.cards[i][j].state===false){
            //нажатая карта не угадана
            this.wait = true;
            if(this.openedCard==null){
                //нет открытой карты, просто открытие нажатой
                this.sound.cardFlipSound();
                this.cards[i][j].open();
                this.openedCard = [i,j];
                this.wait = false;
            }
            else{
                if(this.cards[i][j].cat===this.cards[this.openedCard[0]][this.openedCard[1]].cat && !(i===this.openedCard[0] && j===this.openedCard[1])){
                    //нажатая карта такая же, как ранее открытая. пара угадана
                    this.sound.cardFlipSound();
                    this.cards[i][j].open();
                    this.cards[i][j].state=true;
                    this.cards[this.openedCard[0]][this.openedCard[1]].state=true;
                    this.openCounter++;
                    let x = this;
                    if(this.openCounter!==8)  setTimeout(function () {
                        x.sound.correctSound();
                    },500);
                    this.openedCard = null;
                    this.wait = false;
                }
                else{
                    if(!(i===this.openedCard[0] && j===this.openedCard[1])){
                        //нажатая карта не такая как ранее открытая. через секунду обе закроются
                        this.cards[i][j].open();
                        this.sound.cardFlipSound();
                        let x = this;
                        setTimeout(function () {
                            x.sound.nopeSound();
                        },500);
                        setTimeout(function () {
                            x.nopeDelay(i,j);
                        },1000);
                    }
                    else{
                        //открытая карта нажата снова
                        this.wait = false;
                    }
                }
            }
            if(this.openCounter===8){   //если угадано 8 пар => победа
                let x = this;
                setTimeout(function () {
                    x.sound.winSound();
                },500);
                clearInterval(this.timer.id);
                setTimeout(function () {
                    x.start();
                },5000);
            }
        }
    }
    start(){    //метод начала новой игры
        //очистка данных об игре
        this.openCounter = 0;
        this.openedCard = null;
        this.wait = false;
        this.timer.min = 0;
        this.timer.sec = 0;
        this.timer.id = null;
        for(let i=0;i<4;i++) {
            for (let j = 0; j < 4; j++){
                this.cards[i][j].clean();
            }
        }
        this.gameTimer.text = '00:00';
        //перемешивание карт
        this.initCats();
        this.closeC();
        this.sound.cardsMixSound();
        //открытие карт (через секунду) на 5 секунд чтобы запомнить
        let x = this;
        setTimeout(function () {
            x.startDelay();
        },1000);
    }
    //далее вынесены функции для задержки и таймера, так как их методы отказываются работать нормально внутри объекта
    startDelay(){   //задержка перед открытием
        this.sound.cardFlipSound();
        this.openC();
        let x = this;
        setTimeout(function () {
            x.showDelay();
        },5000);
    }
    showDelay(){    //показ карт на 5 секунд
        this.sound.cardFlipSound();
        this.closeC();
        this.wait = false;
        let x = this;
        this.timer.id = setInterval(function () {
            x.timerTick();
        },1000);
    }
    timerTick(){    //метод для хода таймера
        if(this.timer.sec===59){
            this.timer.sec = 0;
            this.timer.min++;
        }
        else this.timer.sec++;
        this.gameTimer.text = (this.timer.min<10?"0"+this.timer.min:this.timer.min)+":"+(this.timer.sec<10?"0"+this.timer.sec:this.timer.sec);
    }
    nopeDelay(i,j){ //задержка закрытия карт при несоответствии открытых
        this.sound.cardFlipSound();
        this.cards[i][j].close();
        this.cards[this.openedCard[0]][this.openedCard[1]].close();
        this.openedCard = null;
        this.wait = false;
    }
}