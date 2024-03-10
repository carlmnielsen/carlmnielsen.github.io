console.clear();

// Get the width and height of the window
let width = window.innerWidth;
let height = window.innerHeight;

// Reference to the document body
const body = document.body;

// Select the button and treat wrapper elements using their class names
const elButton = document.querySelector(".button-3");
const elWrapper = document.querySelector(".treat-wrapper");

// Helper function to get a random number in a given range
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// Helper function to get a random integer in a given range
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Array of treat emojis
const treatmojis = ["✨", "✨", "✨", "✨", "✨"];

// Array to store treat objects
const treats = [];

// Radius of the treats
const radius = 30;

// Constants for physics simulation
const Cd = 0.47; // Dimensionless
const rho = 1.22; // kg / m^3
const A = Math.PI * radius * radius / 10000; // m^2
const ag = 9.81; // m / s^2
const frameRate = 1 / 60;

// Function to create a single treat object
function createTreat() {
  // Set random initial velocities
  const vx = getRandomArbitrary(-10, 10); // x velocity
  const vy = getRandomArbitrary(-10, 1);  // y velocity

  // Create a new HTML element for the treat
  const el = document.createElement("div");
  el.className = "treat";

  // Create an inner element with a random treat emoji
  const inner = document.createElement("span");
  inner.className = "inner";
  inner.innerText = treatmojis[getRandomInt(0, treatmojis.length - 1)];
  inner.style.fontSize = "40px";
  el.appendChild(inner);

  // Set the initial position just above button 3
  const button3Rect = elButton.getBoundingClientRect();
  el.style.left = `${button3Rect.left + button3Rect.width / 2}px`;
  el.style.top = `${button3Rect.top - 38}px`;

  // Append the treat element to the wrapper
  elWrapper.appendChild(el);

  // Get the initial position and dimensions of the treat element
  const rect = el.getBoundingClientRect();

  // Set a random lifetime for the treat
  const lifetime = getRandomArbitrary(2000, 3000);

  // Set a CSS variable for the treat's lifetime
  el.style.setProperty("--lifetime", lifetime);

  // Define the treat object with its properties and methods
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

    // Method to remove the treat from the DOM
    remove() {
      this.animating = false;
      this.el.parentNode.removeChild(this.el);
    },

    // Method to animate the treat's movement
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

      // Check if the treat is out of bounds
      treat.checkBounds();

      // Update the treat's position in the DOM
      treat.update();
    },

    // Method to check if the treat is out of bounds
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

    // Method to update the treat's position in the DOM
    update() {
      const relX = this.position.x - this.absolutePosition.x;
      const relY = this.position.y - this.absolutePosition.y;

      this.el.style.setProperty("--x", relX);
      this.el.style.setProperty("--y", relY);
      this.el.style.setProperty("--direction", this.direction);
    }
  };

  // Set a timeout to remove the treat after its lifetime
  setTimeout(() => {
    treat.remove();
  }, lifetime);

  // Return the created treat object
  return treat;
}

// Function to create multiple treats at a time
function createMultipleTreats(numTreats) {
  for (let i = 0; i < numTreats; i++) {
    const treat = createTreat();
    treats.push(treat);
  }
}

// Function to continuously animate the treats
function animationLoop() {
  var i = treats.length;
  while (i--) {
    treats[i].animate();
    if (!treats[i].animating) treats.splice(i, 1);
  }
  requestAnimationFrame(animationLoop);
}

// Event listener when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const button3 = document.querySelector(".button-3");

  // Event listener for button3 click
  button3.addEventListener("click", function (event) {
    // Prevent the default behavior of the button click
    event.preventDefault();

    // Create 6 treats and add them to the treats array
    createMultipleTreats(4);
  });

  // Event listener for elButton click
  elButton.addEventListener("click", function (event) {
    // Prevent the default behavior of the button click
    event.preventDefault();

    // Create 6 treats and add them to the treats array
    createMultipleTreats(4);
  });

  // Start the animation loop
  animationLoop();
});
