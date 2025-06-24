let trafficEnabledY = true;
let trafficEnabledX = false;

let timeOutIdXp; //X
let timeOutIdXn; //-X
let timeOutIdYp; //Y
let timeOutIdYn; //-Y

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
        const timeoutId = setTimeout(spawn, randomDelay);

        if (axis.includes("Y") && !trafficEnabledY) return;
        if (axis.includes("X") && !trafficEnabledX) return;

        generateCar(axis);


        if (axis === "Y") timeOutIdYp = timeoutId; // guardar el timeout solo para eje Y
        if (axis === "-Y") timeOutIdYn = timeoutId; // guardar el timeout solo para eje Y
        if (axis === "X") timeOutIdXp = timeoutId; // guardar el timeout solo para eje Y
        if (axis === "-X") timeOutIdXn = timeoutId; // guardar el timeout solo para eje Y
    }
    spawn();
}

startTrafficFlow("Y")
startTrafficFlow("-Y")
startTrafficFlow("X")
startTrafficFlow("-X")