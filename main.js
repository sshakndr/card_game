import {CardGame} from "./src/CardGame.js";
let game = new CardGame();
function res(){         //метод для ресайза, так как ниже он должен быть присвоен без круглых скобок
    game.resize();      //а метод из класса CardGame ждет с круглыми скобками
}
window.onresize = res;  //"очень удобно"
game.start();           //старт игры