// Hamburger Menu Toggle: Shows and hides the dropdown menu
function hamburg() {
  const navbar = document.querySelector(".dropdown");
  navbar.style.transform = "translateY(0px)"; // Show dropdown menu
}

function cancel() {
  const navbar = document.querySelector(".dropdown");
  navbar.style.transform = "translateY(-500px)"; // Hide dropdown menu
}

// Typewriter Effect: Displays texts with a typewriter effect
const texts = ["DEVELOPER", "DESIGNER"];
let speed = 100;
const textElements = document.querySelector(".typewriter-text");
let textIndex = 0;
let characterIndex = 0;

function typeWriter() {
  if (characterIndex < texts[textIndex].length) {
    textElements.innerHTML += texts[textIndex].charAt(characterIndex); // Add one character at a time
    characterIndex++;
    setTimeout(typeWriter, speed); // Continue typing
  } else {
    setTimeout(eraseText, 1000); // Wait for 1 second after typing before erasing
  }
}

function eraseText() {
  if (textElements.innerHTML.length > 0) {
    textElements.innerHTML = textElements.innerHTML.slice(0, -1); // Remove one character at a time
    setTimeout(eraseText, 50); // Continue erasing
  } else {
    textIndex = (textIndex + 1) % texts.length; // Move to next text
    characterIndex = 0;
    setTimeout(typeWriter, 500); // Wait for 0.5 seconds before starting typing again
  }
}

window.onload = typeWriter; // Start the typewriter effect on page load

// Form Validation and Email Sending
function sendMail(event) {
  event.preventDefault(); // Prevent form submission and page reload

  // Get form elements and notifications
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;
  const notification = document.getElementById("notification");
  const notificationMessage = document.getElementById("notification-message");
  const notificationClose = document.getElementById("notification-close");

  // Validate form inputs
  if (name === "" || email === "" || message === "") {
    notificationMessage.textContent = "All fields are required.";
    notification.classList.add("show");
    setTimeout(() => notification.classList.remove("show"), 3000);
    return;
  }

  // Email format validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    notificationMessage.textContent = "Please enter a valid email address.";
    notification.classList.add("show");
    setTimeout(() => notification.classList.remove("show"), 3000);
    return;
  }

  // Email.js parameters
  let parms = {
    name: name,
    email: email,
    message: message,
  };

  // Send email using Email.js
  emailjs
    .send("service_pws5f0q", "template_zcjdyxs", parms)
    .then(() => {
      // Show success notification
      notificationMessage.textContent = "Message sent successfully!";
      notification.classList.add("show");
      setTimeout(() => notification.classList.remove("show"), 3000);

      // Clear form fields
      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("message").value = "";
    })
    .catch((error) => {
      // Show error notification
      notificationMessage.textContent = "Failed to send message. Please try again.";
      notification.classList.add("show");
      setTimeout(() => notification.classList.remove("show"), 3000);
      console.error("Error sending email: ", error);
    });

  // Close notification when the close button is clicked
  notificationClose.addEventListener("click", () => {
    notification.classList.remove("show");
  });
}

// Attach the sendMail function to the form submission
document.querySelector("form").addEventListener("submit", sendMail);


// Theme Toggle (Light/Dark Mode)
function toggleTheme() {
  const themeIcon = document.getElementById("theme-toggle-icon");
  const body = document.body;

  body.classList.toggle("dark-mode"); // Toggle dark mode class on the body

  if (body.classList.contains("dark-mode")) {
    body.classList.remove("light-mode"); // Remove light mode class if dark mode is active
    themeIcon.src = "assets/moon.png"; // Change icon to Moon for dark mode
    themeIcon.alt = "Light Mode";
  } else {
    body.classList.add("light-mode"); // Add light mode class
    themeIcon.src = "assets/sun.png"; // Change icon to Sun for light mode
    themeIcon.alt = "Dark Mode";
  }
}

// Flip the card when clicked: Adds flip effect to the card element
const cards = document.querySelectorAll(".card");

cards.forEach((card) => {
  card.addEventListener("click", function () {
    this.classList.toggle("clicked"); // Toggle flip effect when card is clicked
  });
});
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('holographic-bg').appendChild(renderer.domElement);

  // 2. Create Holographic Boxes (more spaced apart)
  const createHolographicBox = (size, x, y, z) => {
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0a3a,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
      emissive: 0xff0a3a,
      emissiveIntensity: 0.8
    });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(x, y, z);
    return box;
  };

  const box1 = createHolographicBox(5, -10, 0, -10);
  const box2 = createHolographicBox(4, 0, 3, -18);
  const box3 = createHolographicBox(3, 10, -2, -26);

  scene.add(box1, box2, box3);

  // 3. Create Particles
  const particleCount = 1500;
  const particlesGeometry = new THREE.BufferGeometry();
  const posArray = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    posArray[i * 3 + 0] = (Math.random() - 0.5) * 60; // X
    posArray[i * 3 + 1] = (Math.random() - 0.5) * 60; // Y
    posArray[i * 3 + 2] = (Math.random() - 0.5) * 60; // Z
    velocities[i] = (Math.random() - 0.5) * 0.01; // Gentle vertical drift
  }

  particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(posArray, 3)
  );

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.07,
    color: 0xff0a3a,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // 4. Camera Position
  camera.position.z = 20;

  // 5. Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    // Rotate Boxes
    box1.rotation.x += 0.006;
    box1.rotation.y += 0.008;

    box2.rotation.x += 0.008;
    box2.rotation.y += 0.006;

    box3.rotation.x += 0.007;
    box3.rotation.y += 0.009;

    // Floating Boxes
    const time = Date.now() * 0.001;
    box1.position.y = Math.sin(time) * 0.7;
    box2.position.y = Math.sin(time * 1.2) * 0.5 + 1;
    box3.position.y = Math.sin(time * 0.8) * 0.6 - 1;

    // Update Particle Y Positions
    const positions = particlesGeometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      const yIndex = i * 3 + 1;
      positions[yIndex] += velocities[i];

      if (positions[yIndex] > 30 || positions[yIndex] < -30) {
        positions[yIndex] = (Math.random() - 0.5) * 60;
      }
    }

    particlesGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();

  // 6. Responsive Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});

