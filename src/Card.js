export class Card{
    look;   //объект спрайта
    cat;    //спрятанная кошка
    state = false;  //является ли карта угаданной
    cardTextures = [[],[],[],[],[],[],[],[]];   //массив для набора текстур анимаций открытия карт
    cardTexturesBack = [[],[],[],[],[],[],[],[]];   //и закрытия
    cardWidth;  //ширина первоначальной текстуры карты
    cardHeight; //и высота

    constructor() {
        //загрузка текстур
        for (let i=0;i<8;i++){
            for (let j=0;j<5;j++){
                this.cardTextures[i].push(PIXI.Texture.from('./src/images/cardback_'+j+'.png'));
            }
            for(let j=3;j>-1;j--){
                this.cardTextures[i].push(PIXI.Texture.from('./src/images/cat'+i+'_'+j+'.png'));
            }
            for(let j=0;j<4;j++){
                this.cardTexturesBack[i].push(PIXI.Texture.from('./src/images/cat'+i+'_'+j+'.png'));
            }
            for(let j=4;j>-1;j--){
                this.cardTexturesBack[i].push(PIXI.Texture.from('./src/images/cardback_'+j+'.png'));
            }
        }
        //объявление спрайта
        this.look = new PIXI.AnimatedSprite(this.cardTexturesBack[0]);
        this.look.loop = false;
        this.look.interactive = true;
        this.look.buttonMode = true;
        this.look.anchor.set(0.5);
        //запонение высоты и ширины текстуры
        this.cardHeight = 977;
        this.cardWidth = 704;
    }

    getPos(x) {     //метод для установки карты в нужное положение относительно других
        switch (x) {
            case 0: return -3;
            case 1: return -1;
            case 2: return 1;
            case 3: return 3;
        }
    }
    open(){     //открыть карту
        this.look.textures = this.cardTextures[this.cat];
        this.look.play();
    }
    close(){    //закрыть карту
        this.look.textures = this.cardTexturesBack[this.cat];
        this.look.play();
    }
    resize(i,j){    //метод для установки размера и позиции карты
        //все местные числа не магические, а коэффициенты для адаптивности, высчитанные на бумаге
        //например 4.7 означает, что высота карты при горизонтальном экране будет в 4.7 раз меньше экрана
        if(window.innerHeight > 1.5 * window.innerWidth){
            this.look.scale.set(window.innerWidth / (this.cardWidth*4.7));
            this.look.position.set(
                window.innerWidth/2 + ((window.innerHeight/window.innerWidth) * window.innerWidth / 18 * this.getPos(i)),
                window.innerHeight/2 + (window.innerHeight / 12 * this.getPos(j)),
            );
        }else{
            this.look.scale.set(window.innerHeight / (this.cardHeight*4.7));
            this.look.position.set(
                window.innerWidth/2 + ((window.innerHeight/window.innerWidth) * window.innerWidth / 12 * this.getPos(i)),
                window.innerHeight/2 + (window.innerHeight / 9 * this.getPos(j)),
            );
        }
    }
    clean(){    //очистка данных о карте
        this.state = false;
        this.cat = null;
    }
}