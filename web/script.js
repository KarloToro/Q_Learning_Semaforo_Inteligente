const intersectionDiv = document.getElementById("intersection");

function generateCar(axis = "Y") {
    const carElement = document.createElement("div");
    carElement.classList.add("car");

    // Posición inicial para autos verticales
    if (axis === "Y") {
        carElement.style.top = "-10%";
        carElement.style.right = "43%";
    }

    // Eliminar el auto después de que termine su animación
    carElement.addEventListener("animationend", () => {
        carElement.remove();
    });

    intersectionDiv.append(carElement);
}

// Función para generar autos en intervalos aleatorios
function startTrafficFlow(axis = "Y") {
    function spawn() {
        const randomDelay = Math.random() * 2000 + 100; // entre 2s y 5s
        generateCar(axis);
        setTimeout(spawn, randomDelay);
    }
    spawn();
}

startTrafficFlow("Y");