var dog, sadDog, happyDog, database;
var foodS, foodStock;
var addFood;
var foodObj;

//create feed and lastFed variable here
var feed, lastFed;

function preload() {
  sadDog = loadImage("dog.png");
  happyDog = loadImage("happydog.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 400);

  foodObj = new Food();

  foodStock = database.ref('food');
  foodStock.on("value", readStock);
  
  dog = createSprite(800, 200, 150, 150);
  dog.addImage(sadDog);
  dog.scale = 0.15;

  //create feed the dog button here
  feedDogButton = createButton("Feed dog");
  feedDogButton.position(725, 95);
  feedDogButton.mousePressed(feedDog);

  addFood = createButton("Add food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);
}

function draw() {
  background(46, 139, 87);
  foodObj.display();

  //write code to read fedtime value from the database
  fedTime = database.ref('feedTime');
  fedTime.on("value", function(data) {
    lastFed = data.val();
  });

  
  fill("white");
  //textSize(15);
  if(lastFed >= 12) {
    text("Last feed: " + lastFed % 12 + "PM", 350, 30);
  } else if(lastFed === 0) {
    text("Last feed: 12AM", 350, 30);
  } else {
    text("Lasst feed: " + lastFed + "AM", 350, 30);
  }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog() {
  dog.addImage(happyDog);

  //write code here to update food stock and last fed time
  var food_stock_val = foodObj.getFoodStock();
  if(food_stock_val <= 0) {
    foodObj.updateFoodStock(food_stock_val * 0);
  }
  else {
    foodObj.updateFoodStock(food_stock_val - 1);
  }
}

//function to add food in stock
function addFoods() {
  getTime();
  foodS++;
  database.ref('/').update({
    food:foodS
  })
}