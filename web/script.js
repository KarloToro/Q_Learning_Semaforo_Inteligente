let trafficEnabledY = true;
let trafficEnabledX = false;

function generateCar(axis = "Y") {
    const carElement = document.createElement("div");
    carElement.classList.add("car");
    carElement.classList.add("car"+axis);

    carElement.addEventListener("animationend", () => {
        carElement.remove();
    });

    document.getElementById("intersection").append(carElement);
}


document.addEventListener("click", () => {
    trafficEnabledX = !trafficEnabledX;
    trafficEnabledY = !trafficEnabledY;
});

function startTrafficFlow(axis) {
    function spawn() {
        const randomDelay = Math.random() * 1000 + 100;

        if (axis === "Y" && !trafficYEnabled) return;

        generateCar(axis);

        const timeoutId = setTimeout(spawn, randomDelay);
        if (axis === "Y") trafficYTimeoutId = timeoutId; // guardar el timeout solo para eje Y
    }
    spawn();
}