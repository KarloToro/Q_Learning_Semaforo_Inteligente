const intersectionDiv = document.getElementById("intersection");

function generateCar(axis='X') {
    const carElement = document.createElement("div")
    carElement.classList.add("car");
    if (axis === "Y") {
        carElement.style.top = "-10%";
        carElement.style.right = "43%";
    }
    intersectionDiv.append(carElement)
}

generateCar("Y")