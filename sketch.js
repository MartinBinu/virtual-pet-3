
//Create variables here
var dog,happyDog,starvingDog,foodS,foodStock,milk;

var addMilkButton,feedButton,foodObj,fedTimeRef,lastFed,nextFeedTime;

var writeState,readState,gameState,currentHour;

function preload(){
   //load images here
   starvingDog = loadImage("images/Starvingdog.png");

   happyDog = loadImage("images/Happydog.png"); 

   bedroom = loadImage("images/Bedroom.png");

   garden = loadImage("images/Garden.png");

   washroom = loadImage("images/Washroom.png");

   livingroom = loadImage("images/Livingroom.png")
}

function setup() {
   createCanvas(500, 500);

   database = firebase.database();
   
   readState = database.ref("GameState")
   readState.on("value",function(data){
      gameState = data.val();
   });

   foodObj = new Food();

   dog = createSprite(400,250,20,20);
   dog.addImage(starvingDog);
   dog.scale = 0.15;

   feedButton = createButton("Feed the dog");
   feedButton.position(675,95);
   
   addMilkButton = createButton("Add Milk");
   addMilkButton.position(775,95);

   foodStock = database.ref("food");
   foodStock.on("value",readStock);
}

function draw() {  
   background(46, 139, 87);

   currentHour = hour();

   nextFeedTime = lastFed + 5;
   
   textSize(15);
   
   fill(255,255,254);

   if(foodStock !== undefined){
      if(gameState === "hungry"){
         feedButton.mousePressed(function(){
            dog.addImage(happyDog);
            
            lastFed = hour();
            
            writeFoodStock(foodS);
            
            foodObj.updateLastFed(lastFed);
            
            foodObj.updateState("feeding");
         })

         foodObj.display();

         feedButton.mouseReleased(function(){        
            dog.addImage(starvingDog)
         })

         addMilkButton.mousePressed(function(){
               foodObj.updateFoodStock(20);            
         })

         text("Note: PRESS Feed Button to feed milk to the dog,",100,375);
         text("PRESS Add Milk Button to add more milk",130,395);
      }

   if(currentHour === lastFed + 1){
      foodObj.garden();

      dog.remove();

      addMilkButton.hide();

      feedButton.hide();
      
      textSize(15);
      
      fill("black");   
   
      if(lastFed>=12){
         text("Last Feed : " + lastFed%12 + "PM",375,30);
      }else if(lastFed === 0){
         text("Last Feed : 12 AM",375,30);
      }else{
         text("Last Feed : " + lastFed + "AM",375,30);
      }
   
      text("Food: " + foodS,305,30);

      if(nextFeedTime>12){
         nextFeedTime = nextFeedTime - 12;
      }

      text("Next Feeding Time: " + nextFeedTime,145,30);

      foodObj.updateState("playing");
   }  
   else if(currentHour === lastFed + 2){
      foodObj.bedroom();
      
      dog.remove();
      
      addMilkButton.hide();
      
      feedButton.hide(); 
      
      textSize(15);
      
      fill("black");   
   
      if(lastFed>=12){
         text("Last Feed : " + lastFed%12 + "PM",375,30);
      }else if(lastFed === 0){
         text("Last Feed : 12 AM",375,30);
      }else{
         text("Last Feed : " + lastFed + "AM",375,30);
      }
   
      text("Food: " + foodS,305,30);

      if(nextFeedTime>12){
         nextFeedTime = nextFeedTime - 12;
      }

      text("Next Feeding Time: " + nextFeedTime,145,30);
      
      foodObj.updateState("sleeping")
   }  
   else if(currentHour === lastFed + 3){
      foodObj.washroom(); 
      
      textSize(15);
      
      dog.remove();
      
      addMilkButton.hide();
      
      feedButton.hide();
      
      fill("black");   
   
      if(lastFed>=12){
         text("Last Feed : " + lastFed%12 + "PM",375,30);
      }else if(lastFed === 0){
         text("Last Feed : 12 AM",375,30);
      }else{
         text("Last Feed : " + lastFed + "AM",375,30);
      }
   
      text("Food: " + foodS,305,30);

      if(nextFeedTime>12){
         nextFeedTime = nextFeedTime - 12;
      }

      text("Next Feeding Time: " + nextFeedTime,145,30);
      
      foodObj.updateState("bathing");
   }
   else if(currentHour === lastFed + 4){
      foodObj.livingRoom();
      
      dog.remove();
      
      addMilkButton.hide();
      
      feedButton.hide(); 
      
      textSize(15);
      
      fill("black");   
   
      if(lastFed>=12){
         text("Last Feed : " + lastFed%12 + "PM",375,30);
      }else if(lastFed === 0){
         text("Last Feed : 12 AM",375,30);
      }else{
         text("Last Feed : " + lastFed + "AM",375,30);
      }
   
      text("Food: " + foodS,305,30);

      if(nextFeedTime>12){
         nextFeedTime = nextFeedTime - 12;
      }

      text("Next Feeding Time: " + nextFeedTime,145,30);
      
      foodObj.updateState("livingRoom");    
   }  
   else{
      gameState = "hungry";
      
      addMilkButton.show();
      
      feedButton.show();
      
      foodObj.updateState("hungry"); 
   }
   
   if(gameState !== "hungry"){
      dog.remove();
      
      addMilkButton.hide();
      
      feedButton.hide();
   }

   drawSprites();

   }

   fedTimeRef = database.ref('FeedTime');
   
   fedTimeRef.on("value",function(data){
   
      lastFed = data.val();
   });

   //add styles here
   
   textSize(15);
   
   fill("black");   

   if(lastFed>=12){
      text("Last Feed : " + lastFed%12 + "PM",375,30);
   }else if(lastFed === 0){
      text("Last Feed : 12 AM",375,30);
   }else{
      text("Last Feed : " + lastFed + "AM",375,30);
   }

   text("Food: " + foodS,305,30);

   if(nextFeedTime>12){
      nextFeedTime = nextFeedTime - 12;
   }

   text("Next Feeding Time: " + nextFeedTime,145,30);
}

function readStock(data){
   foodS = data.val();
}

function writeFoodStock(num){
   if(num<=0){
      num = 0;
   }else{
      num = num -1;
   }

   database.ref('/').update({
      food : num
   })
}