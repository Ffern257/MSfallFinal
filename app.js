const colors = [];
const selectedColors = [];

function getColorByArtType(TypesofArt) {
    switch (TypesofArt) {
        case 'sculpture':
            return 'red';
        case 'painting':
            return 'blue';
        case 'decorative art':
            return 'green';
    }
}

function colorDifference(color1, color2) {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);

    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);

    const dr = r1 - r2;
    const dg = g1 - g2;
    const db = b1 - b2;

    return Math.sqrt(dr * dr + dg * dg + db * db);
}

function filterBySelectedColors() {
    console.log("Filtering colors...");
    const tolerance = 50;
    const selectedArtTypeElement = d3.select(".art-type-btn.active");
    const selectedArtType = selectedArtTypeElement.empty() ? "all" : selectedArtTypeElement.attr("data-value");
    console.log("Selected Art Type:", selectedArtType);

    d3.selectAll('.img-container').style('display', function() {
        if(selectedArtType !== "all" && d3.select(this).attr("data-art-type") !== selectedArtType) {
            return 'none';
        }
        const circle = d3.select(this).select('circle');
        if (!circle.empty() && circle.node().hasAttribute('data-color')) {
            const circleColor = circle.attr('data-color').toUpperCase();
            for (let i = 0; i < selectedColors.length; i++) {
                if (colorDifference(circleColor, selectedColors[i]) < tolerance) {
                    return 'block';
                }
            }
            return 'none';
        }
        d3.selectAll('.img-container circle').each(function() {
    const dataColor = d3.select(this).attr('data-color');
    console.log(data-color);
});

    });
}

document.querySelectorAll('.toggle-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        filterBySelectedColors(); // Added call to filter function
    });
});



const modal = document.getElementById("myModal");
const modalImage = document.getElementById("modalImage");
const modalInfo = document.getElementById("modalInfo");
const span = document.getElementsByClassName("close")[0];

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function showModal(imageUrl, info, colors) {
    modalImage.src = imageUrl;
    modalInfo.textContent = info;

    // แสดงสีทั้งหมดใน modal
    let colorDivs = "";
    colors.forEach(color => {
        colorDivs += `<div style="background-color: ${color}; width: 20px; height: 20px;"></div>`;
    });
    document.getElementById("colorContainer").innerHTML = colorDivs;

    modal.style.display = "block";
}



d3.csv('data.csv').then(function(data) {
    data.slice(0, 1000).forEach(function(d, index) {
        const imgContainer = d3.select('#image_container')
            .append('svg')
            .attr('class', 'img-container')
            .attr('id', 'img-container-' + index)
            .attr('width', 100)
            .attr('height', 100)
            .attr('data-art-type', d.TypesofArt);

        Vibrant.from(d.iiifthumburl).getPalette(function(err, palette) {
            if (!err) {
                for (var swatch in palette) {
                    if (palette[swatch] && typeof palette[swatch].getHex === 'function') {
                        const hexColor = palette[swatch].getHex();
                        colors.push(hexColor);

                        imgContainer.append("circle")
                            .attr('cx', 10)
                            .attr('cy', 10)
                            .attr('r', 5)
                            .attr('fill', getColorByArtType(d.TypesofArt))
                            .attr('data-color', hexColor)
                            .attr('data-art-type', d.TypesofArt);
                    }
                }
            }
        });
    });
});

d3.selectAll(".toggle-btn").on("click", function() {
    d3.selectAll(".toggle-btn").classed("active", false);  
    d3.select(this).classed("active", true); 
    const type = d3.select(this).attr("data-value");
    filterArtByType(type);
});

function filterArtByType(type) {
    if (type === "all") {
        d3.selectAll(".img-container").style("display", "block");
        return 'none';
    }

    d3.selectAll(".img-container").style("display", "none");
    d3.selectAll(`.img-container[data-art-type='${type}']`).style("display", "block");
}


d3.selectAll('.color-picker').on('input', function() {
    const id = this.id.replace('colorPicker', '');  // แยก ID ของ color-picker เพื่อใช้งาน
    const selectedColor = this.value.toUpperCase();
    if (!selectedColors.includes(selectedColor)) {
        selectedColors.push(selectedColor);
    }
    updateColorBoxDisplay(id, selectedColor);  // ปรับแต่งการแสดงผล
    filterBySelectedColors();
    addToStackedColorBoxContainer(this.value);

});


function updateColorBoxDisplay(id, color) {
    const box = document.getElementById(`box${id}`);
    box.style.backgroundColor = color;

    const colorPicker = document.getElementById(`colorPicker${id}`);
    colorPicker.style.display = 'none';
}

function addColorBox() {
    // Iterate over the possible color boxes
    for (let i = 1; i <= 5; i++) {
        const box = document.getElementById(`box${i}`);
        if (box.classList.contains("hidden")) {
            // Only allow adding a box if the previous box exists and is visible
            if (i === 1 || !document.getElementById(`box${i - 1}`).classList.contains("hidden")) {
                box.classList.remove("hidden");
                return;
            }
        }
    }
    alert("Maximum number of color boxes reached or previous box is hidden.");
}


function clearBoxColor(id) {
    const box = document.getElementById(`box${id}`);
    box.style.backgroundColor = ""; 

    const colorPicker = document.getElementById(`colorPicker${id}`);
    colorPicker.style.display = 'block'; 
    colorPicker.value = "#ffffff"; 

    const colorIndex = selectedColors.indexOf(box.style.backgroundColor.toUpperCase());
    if (colorIndex > -1) {
        selectedColors.splice(colorIndex, 1);
    }

    filterBySelectedColors();
}

function deleteBox(id) {
    const box = document.getElementById(`box${id}`);
    box.classList.add("hidden"); // Hide the box

    // Reset the box state
    clearBoxColor(id);
}

// Add double-click event listeners to all color boxes.
for (let i = 1; i <= 5; i++) {
    document.getElementById(`box${i}`).addEventListener('dblclick', function() {
        clearColor(i);
    });
}

function updateColorBoxDisplay(id, color) {
    const box = document.getElementById(`box${id}`);
    box.style.backgroundColor = color;

    const colorPicker = document.getElementById(`colorPicker${id}`);
    colorPicker.style.display = 'none';

    // Update the corresponding stackedColorBox with the selected color
    const stackedBox = document.getElementById(`stackedBox${id}`);
    stackedBox.style.backgroundColor = color;
}
function addToStackedColorBoxContainer(color, id) {
    const stackedBox = document.getElementById(`stackedBox${id}`);
    if (!stackedBox.style.backgroundColor) {
        stackedBox.style.backgroundColor = color;
    }
}