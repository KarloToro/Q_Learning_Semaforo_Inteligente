let trafficYEnabled = true;
let trafficYTimeoutId = null;

const intersectionDiv = document.getElementById("intersection");

function generateCar(axis = "Y") {
    const carElement = document.createElement("div");
    carElement.classList.add("car");

    if (axis === "Y") {
        carElement.style.top = "-10%";
        carElement.style.right = "45%";
        carElement.style.animation = "moveDown 10s linear forwards";

        // Monitorear posición para pausa simulada
        function monitorPosition() {
            if (!trafficYEnabled) {
                const top = parseFloat(getComputedStyle(carElement).top);
                const parentHeight = carElement.parentElement.clientHeight;
                const topRatio = top / parentHeight;

                if (topRatio >= 0.35) {
                    // Está en la zona peatonal o cerca, debe detenerse
                    carElement.style.animationPlayState = "paused";
                    return;
                }
            }

            // Si aún no llegó o el tráfico sigue, seguir verificando
            requestAnimationFrame(monitorPosition);
        }

        requestAnimationFrame(monitorPosition);
    }

    // Otros ejes (no tocados aún)
    else if (axis === "-Y") {
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
    trafficYEnabled = !trafficYEnabled;

    if (!trafficYEnabled) {
        clearTimeout(trafficYTimeoutId);
    } else {
        const pausedCars = document.querySelectorAll(".car");
        pausedCars.forEach(car => car.style.animationPlayState = "running");
        startTrafficFlow("Y");
    }
});



startTrafficFlow("Y");
// startTrafficFlow("-Y");
// startTrafficFlow("X");
// startTrafficFlow("-X");