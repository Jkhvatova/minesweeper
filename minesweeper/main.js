(()=>{"use strict";function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(t)}function t(t,n){for(var i=0;i<n.length;i++){var o=n[i];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,(void 0,s=function(t,n){if("object"!==e(t)||null===t)return t;var i=t[Symbol.toPrimitive];if(void 0!==i){var o=i.call(t,"string");if("object"!==e(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(o.key),"symbol"===e(s)?s:String(s)),o)}var s}window.addEventListener("DOMContentLoaded",(function(){var e=document.querySelector("body"),n=document.createElement("header");e.appendChild(n),n.innerHTML='<div class="container"><h1>Run Away From a Fox</h1></div>';var i=document.createElement("div");i.className="menu",i.innerHTML=' <div class="container">\n  <div class="settings">\n  <div class="difficulty">\n    <div class="dropdown">\n      <select name="difficulty" id="difficulty" class="dropbtn">\n        <option value="easy">easy</option>\n        <option value="medium">medium</option>\n        <option value="hard">hard</option>\n      </select>\n    </div>\n  </div>\n  <div class="mines">\n    <input type="range" min="10" max="99" step="1" value="10">\n    <div class="value">10</div>\n  </div>\n  <div class="start"><button class="start-btn">Start game</button></div>\n  <button class="sound"></button>\n</div>\n<div class="gamestats">\n  <div class="timer-title">time:</div>\n  <div class="timer">00:00</div>\n  <div class="clicks-title">clicks:</div>\n  <div class="clicks">0</div>\n  <div class="flags-title">flags:</div>\n  <div class="flags">0</div>\n</div> </div> ',e.appendChild(i);var o=document.createElement("div");o.className="main",e.appendChild(o),o.innerHTML='<canvas id="canvas" width=" 480" height="480"></canvas>';var s=document.createElement("div");s.className="highscore",e.appendChild(s),s.innerHTML='\n  <div class="container">\n    <h2>highscore</h2>\n  </div>';var r=document.getElementById("canvas");r.innerText="Your browser does not support canvas",r.style.border="none";var a=r.getContext("2d");a.fillStyle="#222";var l={easy:{difficulty:"easy",bombs:10,rows:10,columns:10},medium:{difficulty:"medium",bombs:10,rows:15,columns:15},hard:{difficulty:"hard",bombs:10,rows:25,columns:25}},c=document.querySelector(".sound"),d="on";function u(e){c.classList.contains(d)&&new Audio("./assets/".concat(e,".wav")).play()}c.addEventListener("click",(function(){c.classList.contains(d)?c.classList.remove(d):c.classList.add(d)}));var f=document.querySelector("input[type=range]"),v=l.easy.bombs,h=document.getElementById("difficulty"),m=l.easy.difficulty;h.addEventListener("change",(function(e){var t=e.target[e.target.options.selectedIndex].value;return m=t})),f.addEventListener("input",(function(){v=f.value,document.querySelector(".value").innerHTML=v}));var y=0,g=document.querySelector(".clicks"),b=v,p=l.easy.columns,w=l.easy.columns,S=b,C=0,B=0,E=document.querySelector(".flags");E.innerHTML=S;var k,M=document.querySelector(".timer"),L=0;function F(){L+=1;var e=Math.floor(L/60).toString().padStart(2,"0"),t=Math.floor(L%60).toString().padStart(2,"0");M.innerHTML="".concat(e,":").concat(t)}var T=Math.floor(parseInt(r.width,10)/p);function z(e,t){for(var n=new Array(e),i=0;i<n.length;i+=1)n[i]=new Array(t);return n}var x=z(p,w),I=function(){function e(t,n,i){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.size=t,this.i=n,this.j=i,this.coordX=n*t,this.coordY=i*t,this.isShown=!1,this.isBomb=!1,this.isFlagged=!1,this.nearestBombsCount=0}var n,i;return n=e,(i=[{key:"createCell",value:function(){a.fillRect(this.coordX+1,this.coordY+1,this.size-2,this.size-2),a.strokeRect(this.coordX,this.coordY,this.size,this.size),a.strokeStyle="#2E86C1",a.lineWidth=1,a.stroke()}},{key:"countNeigbourBombs",value:function(){var e=0;if(this.isBomb)this.nearestBombsCount=-1;else{for(var t=-1;t<=1;t+=1)for(var n=-1;n<=1;n+=1){var i=this.i+t,o=this.j+n;i>-1&&i<p&&o>-1&&o<w&&x[i][o].isBomb&&(e+=1)}this.nearestBombsCount=e}}},{key:"render",value:function(){var e=this;if(a.fillStyle="lightblue",this.createCell(),this.isShown){if(this.isBomb){a.fillStyle="#F5B7B1",this.createCell();var t=new Image;t.src="./assets/fox.png",t.onload=function(){25===p?a.drawImage(t,e.coordX+e.size/4,e.coordY+e.size/4,10,10):a.drawImage(t,e.coordX+e.size/4,e.coordY+e.size/4,20,20)}}else switch(this.nearestBombsCount){case 1:a.fillStyle="#D5F5E3 ";break;case 2:a.fillStyle="#D4E6F1";break;case 3:a.fillStyle="#E8DAEF";break;case 4:a.fillStyle="#EBDEF0";break;case 5:a.fillStyle="#FCF3CF";break;case 6:a.fillStyle="#FDEBD0";break;case 7:a.fillStyle="#FADBD8";break;case 8:a.fillStyle="#F2D7D5";break;default:a.fillStyle="#EBF5FB "}this.createCell(),this.nearestBombsCount>0&&(a.font="30px Arial",15===p&&(a.font="20px Arial"),25===p&&(a.font="12px Arial"),a.fillStyle="#154360",a.textAlign="center",25===p&&a.fillText(this.nearestBombsCount,this.coordX+this.size/2,this.coordY+this.size-4),15===p&&a.fillText(this.nearestBombsCount,this.coordX+this.size/2,this.coordY+this.size-6),10===p&&a.fillText(this.nearestBombsCount,this.coordX+this.size/2,this.coordY+this.size-10))}else a.fillStyle="lightblue",this.createCell();if(this.isFlagged){a.fillStyle="#F9E79F",this.createCell();var n=new Image;n.src="./assets/rabbit.png",n.onload=function(){25===p?a.drawImage(n,e.coordX+e.size/4,e.coordY+e.size/4,10,10):a.drawImage(n,e.coordX+e.size/4,e.coordY+e.size/4,20,20)}}0!==this.nearestBombsCount||this.isShown||this.openEmptyCells()}},{key:"showCell",value:function(){this.isShown=!0,0===this.nearestBombsCount&&this.openEmptyCells()}},{key:"openEmptyCells",value:function(){for(var e=-1;e<=1;e+=1)for(var t=-1;t<=1;t+=1){var n=this.i+e,i=this.j+t;if(n>-1&&n<p&&i>-1&&i<w){var o=x[n][i];o.isBomb||o.isShown||o.showCell()}}}}])&&t(n.prototype,i),Object.defineProperty(n,"prototype",{writable:!1}),e}();function H(e,t,n){for(var i=0;i<e;i+=1)for(var o=0;o<t;o+=1)x[i][o]=new I(T,i,o);!function(e,t,n){for(var i=0;i<n;i+=1){var o=Math.floor(Math.random()*t),s=Math.floor(Math.random()*e);x[o][s].isBomb?i-=1:x[o][s].isBomb=!0}}(e,t,n);for(var s=0;s<e;s+=1)for(var r=0;r<t;r+=1)x[s][r].countNeigbourBombs()}var Y=function(e,t){for(var n=0;n<e;n+=1)for(var i=0;i<t;i+=1)x[n][i].render()};function D(t){var n=document.createElement("div");n.className="modal",n.innerHTML="lose"===t?' <div class="modal-content">\n      <span class="close">x</span>\n      <p>Game over! Fox caught the bunny!</p>\n      <img class="modal-img" src="./assets/rabbit-lose.svg"/>\n    </div>\n    ':' <div class="modal-content">\n      <span class="close">x</span>\n      <p>You win! Bunny ran away from fox!</p>\n      <img class="modal-img" src="./assets/rabbit-win.svg"/>\n    </div>\n    ',e.appendChild(n);var i=document.querySelector(".close");n.style.display="block",i.addEventListener("click",(function(){n.style.display="none"})),window.addEventListener("click",(function(e){e.target===n&&(n.style.display="none")}))}H(p,w),Y(p,w),r.addEventListener("click",(function(e){var t=r.getBoundingClientRect(),n=Math.round(e.clientX-t.left),i=Math.round(e.clientY-t.top),o=Math.floor(n/T),s=Math.floor(i/T),a=x[o][s];u("click"),a.isShown||a.isBomb||(B+=1),0===a.nearestBombsCount?(a.openEmptyCells(),a.render(),y+=1):a.isBomb?function(){for(var e=0;e<p;e+=1)for(var t=0;t<w;t+=1)x[e][t].showCell(),x[e][t].render();clearInterval(k),u("lose"),D("lose")}():(a.showCell(),a.render(),y+=1),g.innerHTML=y}));var X=x.flat().length-v,q=document.querySelector(".start-btn");function A(){p=l[m].columns,w=l[m].rows,T=Math.floor(parseInt(r.width,10)/p);var e=z(p,w);x=e,H(p,w,v),Y(p,w),L=0,C=0,y=0,S=v,E.innerHTML=S,function(){if(window.localStorage.getItem("highscore")){var e=JSON.parse(window.localStorage.getItem("highscore"));e.length>10&&e.slice(-10);var t=document.createElement("ol");s.innerHTML='\n      <div class="container">\n        <h2>highscore</h2>\n      </div>',s.querySelector(".container").appendChild(t),e.forEach((function(e){t.innerHTML+="<li>Time: ".concat(e.time," and ").concat(e.clicks," clicks</li>")}))}}(),k=setInterval(F,1e3),B=x.flat().filter((function(e){return e.isShown})).length}var N=[];r.addEventListener("contextmenu",(function(e){e.preventDefault();var t=r.getBoundingClientRect(),n=Math.round(e.clientX-t.left),i=Math.round(e.clientY-t.top),o=Math.floor(n/T),s=Math.floor(i/T);u("click"),x[o][s].isFlagged?x[o][s].isFlagged&&(x[o][s].isFlagged=!1,x[o][s].render(),S+=1):(x[o][s].isFlagged=!0,x[o][s].render(),(S-=1)<0&&(S=0),x[o][s].isBomb&&(C+=1)),y+=1,g.innerHTML=y,E.innerHTML=S,function(e,t){if(0===t&&e===v&&B===X){u("win"),D("win");var n={time:L,clicks:y,flags:S};window.localStorage.setItem("gameStats",JSON.stringify(n)),N.push(n),window.localStorage.setItem("highscore",JSON.stringify(N))}}(C,S)})),q.addEventListener("click",A),A()}))})();
//# sourceMappingURL=main.js.map