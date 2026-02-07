const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particlesArray;

// responsive canvas sizing
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// mouse interaction
const mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 80) * (canvas.width / 80)
};

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

// Particle Class
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.density = (Math.random() * 10) + 5;
        this.pushX = 0; // Inertia X
        this.pushY = 0; // Inertia Y
        this.friction = 0.95; // Smoothing factor
    }

    // Method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        
        // 3D Effect using Radial Gradient
        let gradient = ctx.createRadialGradient(
            this.x - this.size/3, 
            this.y - this.size/3, 
            this.size/10, 
            this.x, 
            this.y, 
            this.size
        );
        gradient.addColorStop(0, '#a3ffce'); // Highlight (light mint)
        gradient.addColorStop(1, this.color); // Base color
        
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    // Check particle position, check mouse position, move the particle, draw the particle
    update() {
        // Check if particle is still within canvas
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
             this.pushX = -this.pushX; // Bounce inertia too
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
            this.pushY = -this.pushY; // Bounce inertia too
        }

        // Check collision detection - mouse position / particle position
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        // Physics-based smooth repulsion adding to Momentum
        if (distance < mouse.radius + this.size) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = mouse.radius;
            const force = (maxDistance - distance) / maxDistance;
            
            // Add to push vector instead of direct position mod
            this.pushX -= forceDirectionX * force * this.density * 0.1; // Accumulate force
            this.pushY -= forceDirectionY * force * this.density * 0.1;
        }

        // Move particle (Base drift + Inertia)
        this.x += this.directionX + this.pushX;
        this.y += this.directionY + this.pushY;
        
        // Apply friction to inertia
        this.pushX *= this.friction;
        this.pushY *= this.friction;

        // Draw particle
        this.draw();
    }
}

// Create particle array
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 10000; // Slightly fewer particles due to size
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 5) + 2; // LARGER SIZE: 2px to 7px
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        let color = '#00b894'; // DARKER MINT GREEN for Light Mode

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Check if particles are close enough to draw line between them
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                           ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                
                // Add stronger opacity for closer particles logic if needed
                ctx.strokeStyle = 'rgba(0, 184, 148,' + (opacityValue * 0.2) + ')'; // Contrast green lines
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Initialize and animate
init();
animate();
