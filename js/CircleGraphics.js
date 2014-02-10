/* Implementation pour plateau carree */

var pasAngle = (2 * Math.PI)/40;
var width = 800;
var widthCase = 280;

function getCoords(angle,rayon){
	return {
		y:(Math.sin(angle))*rayon,
		x:(Math.cos(angle))*rayon
	}
}

function convertAxePos(axe,pos){
	return ((axe+2)%4)*10 + pos;
}

var nbJoueurs = 0;

// Represente un pion d'un joueur
function CirclePionJoueur(color, largeur) {
	Component.apply(this);
	this.pos;
	this.color = color;
	this.isSelected = false;
	this.largeur = largeur; // Largeur du pion
	
	this.init = function(axe,pos){
		this.pos = convertAxePos(axe,pos);
		this._rayon = width/2- (70 + (nbJoueurs%3)*25);
		this._angle = 0.5 + ((nbJoueurs%2)?1:-1) * 0.25;
		nbJoueurs++;
	}
	
	this.draw = function (canvas) {
		var centre = getCoords((this.pos+this._angle)*pasAngle,this._rayon);
		if(this.isSelected){
			canvas.beginPath();
			canvas.fillStyle = '#FFFFFF';
			canvas.arc(centre.x+width/2,centre.y+width/2,12,0,2*Math.PI);
			canvas.fill();
			canvas.closePath();	
		}		
		canvas.beginPath();
		canvas.fillStyle = this.color;
		canvas.arc(centre.x+width/2,centre.y+width/2,10,0,2*Math.PI);
		canvas.fill();
		canvas.closePath();				
	}
	this.setSelected = function(value){
		this.isSelected = value;
	}
	
	this._moveTo = function(ciblePos,callback,pas){			
		var limit = 0 ;	
		var _self = this;
		if(this.pos!=ciblePos){
			setTimeout(function(){
				_self.pos=parseFloat((_self.pos + pas).toFixed(1));
				if(_self.pos>=40){
					_self.pos = 0;
				}
				//drawPion(currentPos);
				_self._moveTo(ciblePos,callback,pas);
			},30);
		}
		else{
			// Fin
			if(callback){
				callback();
			}
		}
	}
	
	// Se dirige vers une cellule donnee. Se deplace sur la case suivante et relance l'algo
	this.goto = function (axe, pos, callback) {
		var ciblePos = convertAxePos(axe,pos);
		this._moveTo(ciblePos,callback,0.1);			
	}
	
	this.gotoDirect = function(axe, pos, callback){
		if (axe == null || pos == null) {
			return;
		}
		var ciblePos = convertAxePos(axe,pos);
		this._moveTo(ciblePos,callback,1);	       
	}
	
	this.init(2,0);
}

function CircleCase(pos, axe, color, title, prix, img){
	this.pos = convertAxePos(axe,pos);
	this.color = color;
	this.title = title;
	this.prix = prix;
	this.img = img;
	this.nbMaison = 0;
	this.imageMaison = new Image();
	this.imageHotel = new Image();

	this.init = function(){
        this.imageMaison.src = "img/maison.png";
        this.imageHotel.src = "img/hotel.png";
	}

	this.draw = function(canvas){
		var pA = getCoords(this.pos*pasAngle,width/2);
		var pB = getCoords(this.pos*pasAngle,width/2-widthCase);
		canvas.fillStyle='#000000';
		canvas.lineWidth=0.5;
		canvas.moveTo(width/2 - pA.x,width/2 - pA.y);
		canvas.lineTo(width/2 - pB.x,width/2 - pB.y);
		canvas.stroke();
		if(this.color!=null){
			canvas.beginPath();
			canvas.fillStyle=this.color;
			canvas.moveTo(width/2,width/2);
			canvas.arc(width/2,width/2,width/2-2,(this.pos)*pasAngle,(this.pos+1)*pasAngle);
			canvas.fill();
			canvas.closePath();
			canvas.beginPath();
			canvas.fillStyle='#FFFFFF';
			canvas.moveTo(width/2,width/2);
			canvas.arc(width/2,width/2,width/2-25,this.pos*pasAngle,(this.pos+1)*pasAngle);
			canvas.fill();
			canvas.closePath();
		}
		if(this.title!=null){
			if(this.pos > 10 && this.pos < 30){
				var p = getCoords((this.pos+0.7)*pasAngle,width/2-30);
				DrawerHelper.writeText(this.title, p.x + width/2,p.y + width/2, ((this.pos+20)%40 + 0.8)*pasAngle, canvas,9,300,true);
			}else{
				var length = canvas.measureText(this.title).width + 30;
				var p = getCoords((this.pos+0.3)*pasAngle,width/2 - length);
				DrawerHelper.writeText(this.title, p.x + width/2,p.y + width/2, (this.pos + 0.2)*pasAngle, canvas,9,300,true);
			}			
		}
		if(this.prix!=null){
			if(this.pos > 10 && this.pos < 30){
				var p = getCoords((this.pos+0.3)*pasAngle,width/2-30);
				DrawerHelper.writeText(this.prix, p.x + width/2,p.y + width/2, ((this.pos+20)%40 + 0.8)*pasAngle, canvas,9,300,true);
			}else{
				var length = canvas.measureText(this.prix).width + 30;
				var p = getCoords((this.pos+0.7)*pasAngle,width/2 - length);
				DrawerHelper.writeText(this.prix, p.x + width/2,p.y + width/2, (this.pos + 0.5)*pasAngle, canvas,9,300,true);
			}
		}
		// Image
		if(this.nbMaison <= 4){
			for(var i = 0 ; i < this.nbMaison ; i++){
				var coords = getCoords((this.pos + 0.25*i)*pasAngle,width/2-4);
				DrawerHelper.drawImage(canvas, this.imageMaison, width/2+coords.x, width/2+coords.y, 16,16, this.pos*pasAngle + Math.PI/2)				
	    	}
    	}
    	else{
    		var coords = getCoords((this.pos + 0.4)*pasAngle,width/2-4);
    		DrawerHelper.drawImage(canvas, this.imageHotel, width/2+coords.x, width/2+coords.y, 16,16, this.pos*pasAngle + Math.PI/2)							
    	}
	}
	this.init();
}

function CircleCaseSpeciale(axe, title){
	this.pos = convertAxePos(axe,0);
	this.title = title;

	this.draw = function(canvas){
		var pA = getCoords(this.pos*pasAngle,width/2);
		var pB = getCoords(this.pos*pasAngle,width/2-widthCase);
		canvas.fillStyle='#000000';
		canvas.lineWidth=0.5;
		canvas.moveTo(width/2 - pA.x,width/2 - pA.y);
		canvas.lineTo(width/2 - pB.x,width/2 - pB.y);
		canvas.stroke();
		if(this.title!=null){
			if(this.pos > 10 && this.pos < 30){
				var p = getCoords((this.pos+0.7)*pasAngle,width/2-30);
				DrawerHelper.writeText(this.title, p.x + width/2,p.y + width/2, ((this.pos+20)%40 + 0.8)*pasAngle, canvas,9,300,true);
			}else{
				var length = canvas.measureText(this.title).width + 30;
				var p = getCoords((this.pos+0.3)*pasAngle,width/2 - length);
				DrawerHelper.writeText(this.title, p.x + width/2,p.y + width/2, (this.pos + 0.2)*pasAngle, canvas,9,300,true);
			}
		}
	}
}

/* Represente un dé physique */
function CircleDes(x, y, width) {
	x+=195;
	y+=160;
	this.value;
	this.coin = 15;
	this.width = width - 2 * this.coin;
	this.setValue = function (value, color) {
		this.value = value;
		this.color = color || '#000000';
	}
	this.draw = function (canvas) {		
		// Structure du des
		canvas.strokeStyle = '#000000';
		canvas.fillStyle = '#000000';
		canvas.beginPath();
		canvas.moveTo(x + this.coin, y);
		canvas.lineTo(x + this.coin + this.width, y);
		canvas.bezierCurveTo(x + this.coin * 2 + this.width, y, x + this.coin * 2 + this.width, y + this.coin, x + this.coin * 2 + this.width, y + this.coin);
		canvas.lineTo(x + this.coin * 2 + this.width, y + this.coin + this.width);
		canvas.bezierCurveTo(x + this.coin * 2 + this.width, y + this.coin * 2 + this.width, x + this.width + this.coin, y + this.coin * 2 + this.width, x + this.width + this.coin, y + this.coin * 2 + this.width);
		canvas.lineTo(x + this.coin, y + this.coin * 2 + this.width);
		canvas.bezierCurveTo(x, y + this.coin * 2 + this.width, x, y + this.coin + this.width, x, y + this.coin + this.width);
		canvas.lineTo(x, y + this.coin);
		canvas.bezierCurveTo(x, y, x + this.coin, y, x + this.coin, y);
		canvas.stroke();
		canvas.closePath();
		if (this.value == null) {
			return;
		}
		if (this.value % 2 == 1) {
			this.drawPoint(canvas, x + width / 2, y + width / 2, width / 5, this.color);
		}
		if (this.value != 1) {
			this.drawPoint(canvas, x + width * 0.25, y + width * 0.75, width / 5, this.color);
			this.drawPoint(canvas, x + width * 0.75, y + width * 0.25, width / 5, this.color);
		}
		if (this.value >= 4) {
			this.drawPoint(canvas, x + width * 0.75, y + width * 0.75, width / 5, this.color);
			this.drawPoint(canvas, x + width * 0.25, y + width * 0.25, width / 5, this.color);
		}
		if (this.value == 6) {
			this.drawPoint(canvas, x + width * 0.75, y + width * 0.5, width / 5, this.color);
			this.drawPoint(canvas, x + width * 0.25, y + width * 0.5, width / 5, this.color);
		}
	}
	// Dessine un point
	this.drawPoint = function (canvas, x, y, width, color) {
		canvas.strokeStyle = color || '#000000';
		canvas.fillStyle = color || '#000000';
		canvas.beginPath();
		canvas.arc(x, y, width / 2, 0, 2 * Math.PI);
		canvas.fill();
		canvas.closePath();
	}
}

function CirclePlateau(x,y,width,height,color){
	Component.apply();
	this.data = {
		x: x,
		y: y,
		width: width,
		height: height
	};

	this.draw = function (canvas) {
		DrawerHelper.drawCircle(canvas,color,this.data.width/2,{x:this.data.width/2,y:this.data.width/2});		
	}
}

function finishCirclePlateau(canvas){
	DrawerHelper.drawCircle(canvas,'#000000',width/2-widthCase,{x:width/2,y:width/2});
	DrawerHelper.drawCircle(canvas,'#FFFFFF',width/2-widthCase - 2,{x:width/2,y:width/2});
	DrawerHelper.drawArcCircle(canvas,'#FF0000',width/2-widthCase -2,{x:width/2,y:width/2},-Math.PI-0.1,0.1);	
	DrawerHelper.drawCircle(canvas,'#FFFFFF',width/2-widthCase - 45,{x:width/2,y:width/2});
}

function initSquareInstance(){
	var instance = {
		type:'circle',
		standardCase:CircleCase,
		specialCase:CircleCaseSpeciale,
		pionJoueur:CirclePionJoueur,
		des:CircleDes,
		plateau:CirclePlateau,
		endPlateau:finishCirclePlateau
	}
	DrawerFactory.addInstance(instance);
}

initSquareInstance();