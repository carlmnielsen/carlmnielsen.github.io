console.clear();

let width = window.innerWidth;
let height = window.innerHeight;
const body = document.body;

const elButton = document.querySelector(".button-3");
const elWrapper = document.querySelector(".treat-wrapper");

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const treatmojis = ["✨"];
const treats = [];
const radius = 20;

const Cd = 0.47; // Dimensionless
const rho = 1.22; // kg / m^3
const A = Math.PI * radius * radius / 10000; // m^2
const ag = 9.81; // m / s^2
const frameRate = 1 / 60;

function createTreat() /* create a treat */ {
    const vx = getRandomArbitrary(-10, 10); // x velocity
    const vy = getRandomArbitrary(-10, 1);  // y velocity
    
    const el = document.createElement("div");
    el.className = "treat";
  
    const inner = document.createElement("span");
    inner.className = "inner";
    inner.innerText = treatmojis[getRandomInt(0, treatmojis.length - 1)];
    inner.style.fontSize = "40px";
    el.appendChild(inner);
  
    // Set the initial position just above button 3
    const button3Rect = elButton.getBoundingClientRect();
    el.style.left = `${button3Rect.left + button3Rect.width / 2}px`;
    el.style.top = `${button3Rect.top - 20}px`;
    
    elWrapper.appendChild(el);
  
    const rect = el.getBoundingClientRect();
  
    const lifetime = getRandomArbitrary(2000, 3000);
  
    el.style.setProperty("--lifetime", lifetime);
  
    const treat = {
      el,
      absolutePosition: { x: rect.left, y: rect.top },
      position: { x: rect.left, y: rect.top },
      velocity: { x: vx, y: vy },
      mass: 0.1, //kg
      radius: el.offsetWidth, // 1px = 1cm
      restitution: -.7,
      
      lifetime,
      direction: vx > 0 ? 1 : -1,
  
      animating: true,
  
      remove() {
        this.animating = false;
        this.el.parentNode.removeChild(this.el);
      },
  
      animate() {
        const treat = this;
        let Fx =
          -0.5 *
          Cd *
          A *
          rho *
          treat.velocity.x *
          treat.velocity.x *
          treat.velocity.x /
          Math.abs(treat.velocity.x);
        let Fy =
          -0.5 *
          Cd *
          A *
          rho *
          treat.velocity.y *
          treat.velocity.y *
          treat.velocity.y /
          Math.abs(treat.velocity.y);
  
        Fx = isNaN(Fx) ? 0 : Fx;
        Fy = isNaN(Fy) ? 0 : Fy;
  
        // Calculate acceleration ( F = ma )
        var ax = Fx / treat.mass;
        var ay = ag + Fy / treat.mass;
        // Integrate to get velocity
        treat.velocity.x += ax * frameRate;
        treat.velocity.y += ay * frameRate;
  
        // Integrate to get position
        treat.position.x += treat.velocity.x * frameRate * 100;
        treat.position.y += treat.velocity.y * frameRate * 100;
        
        treat.checkBounds();
        treat.update();
      },
      
      checkBounds() {
  
        if (treat.position.y > height - treat.radius) {
          treat.velocity.y *= treat.restitution;
          treat.position.y = height - treat.radius;
        }
        if (treat.position.x > width - treat.radius) {
          treat.velocity.x *= treat.restitution;
          treat.position.x = width - treat.radius;
          treat.direction = -1;
        }
        if (treat.position.x < treat.radius) {
          treat.velocity.x *= treat.restitution;
          treat.position.x = treat.radius;
          treat.direction = 1;
        }
  
      },
  
      update() {
        const relX = this.position.x - this.absolutePosition.x;
        const relY = this.position.y - this.absolutePosition.y;
  
        this.el.style.setProperty("--x", relX);
        this.el.style.setProperty("--y", relY);
        this.el.style.setProperty("--direction", this.direction);
      }
    };
  
    setTimeout(() => {
      treat.remove();
    }, lifetime);
  
    return treat;
  }
  
  

function animationLoop() {
  var i = treats.length;
  while (i--) {
    treats[i].animate();
    if (!treats[i].animating) treats.splice(i, 1);
  }
  requestAnimationFrame(animationLoop);
}

document.addEventListener("DOMContentLoaded", function () {
  const button3 = document.querySelector(".button-3");

  button3.addEventListener("click", function (event) {
    const treat = createTreat();
    treats.push(treat);
  });

  elButton.addEventListener("click", function () {
    const treat = createTreat();
    treats.push(treat);
  });

  animationLoop();
});
