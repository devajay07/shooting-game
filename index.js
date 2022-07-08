// refernce of canvas
let canvas = document.querySelector("canvas");
let sc = document.querySelector(".sc");
let hs = document.querySelector(".highScore");
let finalScore = document.querySelector(".setScore");
let ui = document.getElementById("hmm");
let restart = document.getElementById("btn");
let score =0;
let highScore =0;
ui.classList.add('display');
 
highScore = localStorage.getItem("highScore");
hs.innerHTML = highScore;
//restarting game

//resize game

addEventListener("resize",()=>{
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  


});
restart.addEventListener('click',()=>{
    ui.classList.add('display');
    score = 0;
    sc.innerHTML = score;
    highScore = localStorage.getItem("highScore");
hs.innerHTML = highScore;
   
    onit();
   
    animation();
    
})

// resizing canvas
canvas.width = innerWidth;
canvas.height = innerHeight;

// setting context of canvas
let c = canvas.getContext("2d");

//to store mouse coordinates
let mouse = {
    x:undefined,
    y:undefined
}


//getting click cordinates

//function to get distance between particles
const distance = (x1,y1,x2,y2) => Math.sqrt(Math.pow(x2-x1,2)+ Math.pow(y2-y1,2));

//creating function of player
function Player(x,y,radius){
    this.x = x;
    this.y =y;
    this.radius = radius;

    this.draw = function(){
        c.beginPath();
        c.fillStyle = "#FAF3E3";
        c.arc(this.x,this.y,this.radius,0,45,false);
        c.fill();
        c.closePath();
    }
}

//creating player
let player = new Player(innerWidth/2,innerHeight/2,20);

//creating function for projectiles

function Projectile(x,y,dx,dy,radius){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    
    this.draw = function(){
        c.beginPath();
        c.fillStyle = "white";
        c.arc(this.x,this.y,this.radius,0,45,false);
        c.fill();
        c.closePath();
    }

    this.update = function(){
        if(this.x+this.radius>canvas.width||this.x-this.radius<0||this.y+this.radius>canvas.height||this.y-this.radius<0){
          projectiles.pop();
        }
       else{

           this.x += dx;
           this.y += dy;
       }
    }
}

//creating projectiles


//shooting projectiles

addEventListener('click',(event)=>{

    for(let i =0;i<1;i++){
    const angle = Math.atan2(event.clientY-canvas.height/2,event.clientX-canvas.width/2);
     let dx = Math.cos(angle)*7;
     let dy = Math.sin(angle)*7;
     projectiles.push(new Projectile(innerWidth/2,innerHeight/2,dx,dy,8));
    }
    

})

//creating function for enemies

function Enemy(x,y,dx,dy,radius,color){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;

    this.draw = function(){
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x,this.y,this.radius,0,45,false);
        c.fill();
        c.closePath();
    }

    this.update = function(){
       

              this.x += dx;
              this.y += dy;
          
    }
}

//all arrays
let enemies =[];
let explosions =[];
let projectiles = [];
function onit(){

     enemies =[];
     explosions =[];
     projectiles = [];
}

//creating enemies

function init(){
   console.log("hiiiiii");
        setInterval(()=>{
            let radius = Math.random()*30+15;
            let posX;
            let posY;
           if(Math.random()<0.5){
             posX = Math.random()>0.5?canvas.width + radius :0-radius;
             posY = Math.random()*canvas.height;
           }else{
            posY = Math.random()>0.5?canvas.height + radius :0-radius;
             posX = Math.random()*canvas.width;
           }
          
            // let Y = 0;
            // let Y1 = Math.random()*innerHeight;
            // let X1 = 0;
            // let position = [X,Y,X1,Y1];
            // let posX = position[Math.floor(Math.random()*4)]
            // let posY = position[Math.floor(Math.random()*4)]
            let angle = Math.atan2(canvas.height/2-posY,canvas.width/2-posX);
            let dx = Math.cos(angle);
            let dy = Math.sin(angle);
            let h = Math.floor(Math.random()*255);
            let s = Math.floor(Math.random()*255);
            let l = Math.floor(Math.random()*255);
            let color = `rgb(${h},${s},${l})`;
            enemies.push(new Enemy(posX,posY,dx,dy,radius,color))
        },1500);
       
    

}
//creating function for explosion particles
function Explosion(x,y,dx,dy,radius,color){
    this.x = x;
    this.y =y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
    this.alpha = 1;

    this.draw = function(){
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x,this.y,this.radius,0,45,false);
        c.fill();
        c.closePath();
        c.restore();
    }
    
    this.update = function(){
       
            this.x += dx;
            this.y += dy;
            this.alpha -=0.01;
        
    }
}
//creating explosion particles

//the animation frame loop
let animationId;

function animation(){
    animationId = requestAnimationFrame(animation);
    c.fillStyle = "rgba(26,26,26,0.35)";
    c.fillRect(0,0,canvas.width,canvas.height);
    //drawing player on canvas
    player.draw();
    //drawing projectiles on canvas
   projectiles.forEach((projectile)=>{

   projectile.draw();
    projectile.update();
    
   })
       
    //drawing explosions
  
    explosions.forEach((explosion,i)=>{
        if(explosion.alpha<=0){
            setTimeout(()=>{

                explosions.splice(i,1);
            },0)
        }else{

            explosion.draw();
            explosion.update();
        }
    })

    //drawing enemies on canvas
    enemies.forEach((enemy,index)=>{
    enemy.draw();
    enemy.update();
    projectiles.forEach((projectile)=>{
        const distance = Math.hypot(enemy.x-projectile.x,enemy.y-projectile.y);
        if(distance-projectile.radius - enemy.radius <=0)
        {
              //creating explosion particles
                 for(let i =0;i<enemy.radius*2;i++){
                let radius = Math.random()*2;
                    let x = enemy.x;
                    let y = enemy.y;
                  let dx = (Math.random()-0.5)*Math.random()*9;
                  let dy = (Math.random()-0.5)*Math.random()*9;
                  let color = enemy.color;
                  explosions.push(new Explosion(x,y,dx,dy,radius,color));
                
                 }
               
               
              //decreasing radius based on conditons

            if(enemy.radius-10>10){
               gsap.to(enemy,{
                radius:enemy.radius-10
               });
              score += 50;
              sc.innerHTML = score;
             
              setTimeout(()=>{

                  projectiles.pop();
              },0)
              
            }
            else if(enemy.radius-5>5){
                gsap.to(enemy,{
                    radius:enemy.radius-5
                   })  
                   score += 50;
                   sc.innerHTML = score;
            }
            else{
                setTimeout(()=>{
                    score += 100;
              sc.innerHTML = score;
              setTimeout(()=>{

                  enemies.splice(index,1);
                  projectiles.pop();
              })
                },0)
            }
        
        }
    })
    //game over condition
    const pedistance = Math.hypot(player.x-enemy.x,player.y-enemy.y);
    if(pedistance-player.radius-enemy.radius <=0){
      cancelAnimationFrame(animationId);
      finalScore.innerHTML = score;
      ui.classList.remove('display');
      if(localStorage.getItem("highScore")<score)
      localStorage.setItem("highScore",score);
      setTimeout(()=>{

          projectiles.pop();
      },0)
    }
       
    })
    
    //collison detection between projectile and enemy
     
    
}

//calling functions
init();
animation();


