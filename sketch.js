var database,foodS,foodStock;
var feedTime, lastFed;
var dog, happyDog, bedroom,washroom,garden;
var gameState;
var imageAdded = false;

function preload()
{
  dog = loadImage("Dog.png");
  happyDog = loadImage("Happy.png");
  bedroom = loadImage("bedRoom.png");
  washroom = loadImage("washRoom.png");
  garden = loadImage("Garden.png");
}



function setup() {
  database=firebase.database();
  createCanvas(800, 500);

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  readState = database.ref('GameState');
  readState.on("value",function(data){
    gameState=data.val();
  })
  
  Dog = createSprite(700,250,25,25);
  Dog.addImage(dog);
  Dog.scale=0.15;
 
  feed = createButton('Feed Pet');
  feed.position(850,85);
  feed.mousePressed(feedDog);
  
  addFood=createButton("Add food");
  addFood.position(925,85);
  addFood.mousePressed(addFoods);
}

function draw() { 
 background(46,139,87);

   foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed=data.val();
  })

  if (gameState!== "Hungry"){
    feed.hide();
    addFood.hide();
    Dog.remove();
    imageAdded = false
  }else{
    feed.show();
    addFood.show();
   if(imageAdded === false){
      imageAdded = true;
      Dog = createSprite(700,250,25,25);
      Dog.addImage(dog);
      Dog.addImage(dog);
      Dog.scale=0.15;
   }
  }

  currentTime=hour();
  if(currentTime===(lastFed+1)){
    update("Playing");
    foodObj.garden(garden);
  }else if(currentTime===(lastFed+2)){
    update("Sleeping")
    foodObj.bedroom(bedroom);
  }else if(currentTime >(lastFed+2) && currentTime<= (lastFed+4)){
    update("Bathing")
    foodObj.washroom(washroom);
  }else{
    update("Hungry")
    foodObj.display();
  }
 
  fill(255,255,254);
  textSize(15);
  if (lastFed>=12){
    text("Last Fed : " + lastFed%12 + "pm",400,30);
  } else if (lastFed==0){
    text("Last Feed : 12 AM", 400,30);
  }else{
    text("Last Feed :"+ lastFed + " AM", 400,30 );
  }

  drawSprites();
}

function update(state){
  database.ref('/').update({
    GameState: state
  })
}

function readStock (data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  Dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

