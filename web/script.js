let trafficEnabledY = true;
let trafficEnabledX = false;

let timeOutIdXp; //X
let timeOutIdXn; //-X
let timeOutIdYp; //Y
let timeOutIdYn; //-Y

const translator = {
    "Y" : ["top", "Height"],
    "-Y" : ["bottom", "Height"],
    "X" : ["left", "Width"],
    "-X" : ["right", "Width"],
}

function generateCar(axis = "Y") {
    const carElement = document.createElement("div");
    carElement.classList.add("car");
    carElement.classList.add("car"+axis);
    

    function monitorPosition() {
        if ((!trafficEnabledY && axis.includes("Y")) || (!trafficEnabledX && axis.includes("X"))) {
            const pos = translator[axis][0]
            const posValue = parseFloat(getComputedStyle(carElement)[pos]);
            const parentHeight = carElement.parentElement["client"+translator[axis][1]];
            const posValueRatio = posValue / parentHeight;
            let siblingPosValue, siblingValueRatio;
            let isFirst = false;
            try {
                siblingPosValue = parseFloat(getComputedStyle(carElement.previousSibling)[pos])
                siblingValueRatio = siblingPosValue / parentHeight;
            } catch (error) {
                siblingValueRatio = 0;
                isFirst;
            }

            if (((posValueRatio >= 0.32 && posValueRatio <= 0.34) || isFirst) ||
                (posValueRatio > siblingValueRatio - 0.025 && posValueRatio < siblingValueRatio)) {
                // Está en la zona peatonal o cerca, debe detenerse
                carElement.style.animationPlayState = "paused";
            } else {
                carElement.style.animationPlayState = "running";
            }
        } 
        if ((trafficEnabledY && axis.includes("Y")) || (trafficEnabledX && axis.includes("X"))) {
            carElement.style.animationPlayState = "running";
        }
        // Si aún no llegó o el tráfico sigue, seguir verificando
        requestAnimationFrame(monitorPosition);
    }
    
    carElement.addEventListener("animationend", () => {
        carElement.remove()
    });
    
    document.getElementById("container"+axis).append(carElement);
    requestAnimationFrame(monitorPosition);
}


document.addEventListener("click", () => {
    trafficEnabledX = !trafficEnabledX;
    trafficEnabledY = !trafficEnabledY;
});

function startTrafficFlow(axis) {
    function spawn() {
        const randomDelay = Math.random() * 1000 + 400;
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