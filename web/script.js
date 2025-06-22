let trafficYEnabled = true;
let trafficYTimeoutId = null;

const intersectionDiv = document.getElementById("intersection");

function generateCar(axis = "Y") {
    const carElement = document.createElement("div");
    carElement.classList.add("car");

    // Posición inicial para autos verticales
    if (axis === "Y") {
        carElement.style.top = "-10%";
        carElement.style.right = "45%";
        carElement.style.animation = "moveDown 10s linear forwards"
    } else if (axis === "-Y") {
        carElement.style.bottom = "-10%";
        carElement.style.left = "45%";
        carElement.style.animation = "moveUp 10s linear forwards"
    } else if (axis === "X") {
        carElement.style.left = "-10%";
        carElement.style.bottom = "45%";
        carElement.style.animation = "moveLeft 10s linear forwards"
    } else if (axis === "-X") {
        carElement.style.right = "-10%";
        carElement.style.top = "45%";
        carElement.style.animation = "moveRight 10s linear forwards"
    }

    carElement.addEventListener("animationend", () => {
        carElement.remove();
    });

    intersectionDiv.append(carElement);
}

// Función para generar autos en intervalos aleatorios
function startTrafficFlow(axis = "Y") {
    function spawn() {
        const randomDelay = Math.random() * 1000 + 100;

        // Si está deshabilitado, no generar más autos en ese eje
        if (axis === "Y" && !trafficYEnabled) return;

        generateCar(axis);

        const timeoutId = setTimeout(spawn, randomDelay);
        if (axis === "Y") trafficYTimeoutId = timeoutId; // guardar el timeout solo para eje Y
    }
    spawn();
}

document.addEventListener("click", () => {
    // if (!trafficYEnabled) return; // si ya está detenido, no hacer nada

    trafficYEnabled = !trafficYEnabled;

    if (!trafficYEnabled) {
        // Detener el próximo spawn del eje Y
        clearTimeout(trafficYTimeoutId);
    
        // Buscar todos los autos en el eje Y aún no cruzando (top < 50%)
        const cars = document.querySelectorAll(".car");
        cars.forEach(car => {
            const top = parseFloat(getComputedStyle(car).top);
            const parentHeight = car.parentElement.clientHeight;
    
            if (top / parentHeight < 0.35) {
                // Detener animación
                car.style.animationPlayState = "paused";
            }
        });
    } else {
        const cars = document.querySelectorAll(".car");
        cars.forEach(car => {            
            car.style.animationPlayState = "running";
        });
        startTrafficFlow("Y");
    }

});


startTrafficFlow("Y");
// startTrafficFlow("-Y");
// startTrafficFlow("X");
// startTrafficFlow("-X");