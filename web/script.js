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
    } else if (aixs === "X") {
        carElement.style.left = "-10%";
        carElement.style.bottom = "45%";
        carElement.style.animation = "moveLeft 10s linear forwards"
    }

    carElement.addEventListener("animationend", () => {
        carElement.remove();
    });

    intersectionDiv.append(carElement);
}

// Función para generar autos en intervalos aleatorios
function startTrafficFlow(axis = "Y") {
    function spawn() {
        const randomDelay = Math.random() * 1000 + 100; // entre 2s y 5s
        generateCar(axis);
        setTimeout(spawn, randomDelay);
    }
    spawn();
}

startTrafficFlow("Y");
startTrafficFlow("-Y");
startTrafficFlow("X");