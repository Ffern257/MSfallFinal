import
let selectedColors = []

// Function to get color by art type
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

// Function to check color similarity
function isColorSimilar(hex1, hex2) {
      let threshold = 10;
      let rgb1 = hexToRgb(hex1);
      let rgb2 = hexToRgb(hex2);

      let diffR = Math.abs(rgb1.r - rgb2.r);
      let diffG = Math.abs(rgb1.g - rgb2.g);
      let diffB = Math.abs(rgb1.b - rgb2.b);

      return diffR <= threshold && diffG <= threshold && diffB <= threshold;
    }

    // Function to convert hex to RGB
    function hexToRgb(hex) {
      let bigint = parseInt(hex.slice(1), 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
      };
    }


let selectedArtType = 'all';

function filterBySelectedColors() {
const tolerance = 10;

d3.selectAll('circle').style('display', function() {
    const circle = d3.select(this);
    const artType = circle.attr('data-art-type');
    const circleColors = circle.attr('data-colors').split(', ');

    const isCorrectType = (selectedArtType === 'all' || artType === selectedArtType);
    let isColorMatched = (selectedColors.length === 0);

    if (isCorrectType) {
        selectedColors.forEach(selectedColor => {
            circleColors.forEach(circleColor => {
                if (colorDifference(circleColor, selectedColor) < tolerance) {
                    isColorMatched = true;
                }
            });
        });
        return isColorMatched ? 'block' : 'none';
    }
    return 'none';
});
}

d3.selectAll('.img-container circle').each(function() {
    const dataColor = d3.select(this).attr('data-color');
    console.log(data-color);
});


document.querySelectorAll('.tablinks').forEach(button => {
button.addEventListener('click', function() {
    document.querySelectorAll('.tablinks').forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    selectedArtType = this.getAttribute('data-value');
    console.log('Selected Art Type:', selectedArtType); // เพิ่ม console.log ตรงนี้
    filterBySelectedColors(); // กรองภาพตามประเภทศิลปะที่เลือก
});
});



d3.selectAll('.color-picker').on('input', function() {
const selectedColor = this.value.toUpperCase();
if (!selectedColors.includes(selectedColor)) {
    selectedColors.push(selectedColor);
}
filterBySelectedColors();
});



function onColorBoxClick(id) {
const colorPicker = document.getElementById(`colorPicker${id}`);
colorPicker.style.display = 'block'; // แสดง color picker

// กำหนดฟังก์ชันเมื่อมีการเปลี่ยนแปลงสี
colorPicker.onchange = function() {
    const newColor = this.value.toUpperCase();
    updateSelectedColors(id, newColor); // อัปเดตรายการสีที่เลือก
    updateColorBoxDisplay(id, newColor); // อัปเดตการแสดงผลของกล่องสี
    filterBySelectedColors(); // กรองอีกครั้งด้วยสีใหม่
};
}

function updateSelectedColors(id, newColor) {
// อัปเดตสีในรายการ selectedColors
if (selectedColors.length >= id) {
    selectedColors[id - 1] = newColor;
}
}

// อัปเดตการแสดงผลของกล่องสี
function updateColorBoxDisplay(id, color) {
const box = document.getElementById(`box${id}`);
box.style.backgroundColor = color;

const stackedBox = document.getElementById(`stackedBox${id}`);
if (stackedBox) {
    stackedBox.style.backgroundColor = color;
}
}

// เพิ่ม Event Listener ให้กล่องสี
for (let i = 1; i <= 20; i++) {
document.getElementById(`box${i}`).addEventListener('click', function() {
    onColorBoxClick(i);
});
}

function addColorBox() {
for (let i = 1; i <= 20; i++) {
    const box = document.getElementById(`box${i}`);
    if (box.classList.contains("hidden")) {
        if (i === 1 || document.getElementById(`box${i-1}`).style.backgroundColor !== "") {
            box.classList.remove("hidden");
            return;
        }
    }
}
alert("Cannot add new color box. Previous box is empty or maximum number of color boxes reached.");
}

d3.selectAll('.color-picker').on('input', function() {
const id = this.id.replace('colorPicker', '');
const selectedColor = this.value.toUpperCase();
if (!selectedColors.includes(selectedColor)) {
    selectedColors.push(selectedColor);
}
updateColorBoxDisplay(id, selectedColor);
filterBySelectedColors();
});


function clearBoxColor(id) {
const box = document.getElementById(`box${id}`);
box.style.backgroundColor = ''; 

const colorPicker = document.getElementById(`colorPicker${id}`);
colorPicker.style.display = 'block'; 

const stackedBox = document.getElementById(`stackedBox${id}`);
if (stackedBox) {
    stackedBox.style.backgroundColor = '';
    
}

// Clear and hide subsequent boxes
for (let i = id + 1; i <= 5; i++) {
    const nextBox = document.getElementById(`box${i}`);
    nextBox.style.backgroundColor = '';
    nextBox.classList.add("hidden");

    const nextStackedBox = document.getElementById(`stackedBox${i}`);
    if (nextStackedBox) {
        nextStackedBox.style.backgroundColor = '';
    }

    const nextColorPicker = document.getElementById(`colorPicker${i}`);
    nextColorPicker.style.display = 'block';
}

filterBySelectedColors();
}
function deleteBox(id) {
const box = document.getElementById(`box${id}`);
box.classList.add("hidden");

clearBoxColor(id);

// Clear and hide subsequent boxes
for (let i = id + 1; i <= 5; i++) {
    clearBoxColor(i);
    document.getElementById(`box${i}`).classList.add("hidden");
}
}

d3.selectAll('.color-picker').on('input', function() {
    const id = this.id.replace('colorPicker', '');
    const selectedColor = this.value.toUpperCase();
    if (!selectedColors.includes(selectedColor)) {
        selectedColors.push(selectedColor);
    }
    updateColorBoxDisplay(id, selectedColor);
    filterBySelectedColors();
});

for (let i = 1; i <= 5; i++) {
    document.getElementById(`box${i}`).addEventListener('dblclick', function() {
        clearBoxColor(i);
    });
}

// Create a function to generate color boxes
function createColorBox(container, color) {
const colorBox = document.createElement("div");
colorBox.classList.add("color-box");
colorBox.style.backgroundColor = color;

// Show color code on hover
colorBox.addEventListener("mouseover", function () {
    colorBox.textContent = color;
});

// Hide color code on mouseout
colorBox.addEventListener("mouseout", function () {
    colorBox.textContent = "";
});

container.appendChild(colorBox);
}
// Function to show modal
function showModal(imageUrl, info, colors, site, description) {
    modalImage.src = imageUrl;
    modalInfo.innerHTML = info.replace(/\n/g, "<br>");

    let tagButtons = `<button class="tag-button" onclick="alert('${site}')">Site Tag</button>` +
                    `<button class="tag-button" onclick="alert('${description}')">Description Tag</button>`;

    modalInfo.innerHTML += tagButtons;

    let colorDivs = "<div>Your ingredients:</div>";
    colors.forEach(color => {
        colorDivs += `<div style="background-color: ${color}; width: 20px; height: 20px; margin: 5px;"></div>`;
    });
    document.getElementById("colorContainer").innerHTML = colorDivs;

    modal.style.display = "block";
}



// Load the SVG file
d3.xml('West bd_ Ground flr_ Right.svg').then(svgData => {

const svgContainer = document.getElementById("svg-container");
svgContainer.appendChild(svgData.documentElement);


d3.csv('data.csv').then(function(data) {
    data.forEach(function(d, index) {
        console.log("Room ID from CSV:", d.room); // ตรวจสอบข้อมูลจาก CSV
        const roomGroup = d3.select(`#${d.room}`);
        console.log("Selected Room Group:", roomGroup.node()); // ตรวจสอบว่าเลือก group ถูกต้องหรือไม่

        if (!roomGroup.empty()) {
            // Calculate the bounding box of the roomGroup
            const roomGroupElement = roomGroup.node(); // Get the DOM element
            const roomGroupBBox = roomGroupElement.getBBox();

            // Use the bounding box dimensions
            const roomGroupWidth = roomGroupBBox.width;
            const roomGroupHeight = roomGroupBBox.height;

            // Calculate random coordinates within the roomGroup
            const randomX = roomGroupBBox.x + Math.random() * roomGroupWidth;
            const randomY = roomGroupBBox.y + Math.random() * roomGroupHeight;

            Vibrant.from(d.iiifthumburl).getPalette(function(err, palette) {
                if (!err) {
                    let hexColorsForThisCircle = [];
                    for (const swatch in palette) {
                        if (palette[swatch] && typeof palette[swatch].getHex === 'function') {
                            hexColorsForThisCircle.push(palette[swatch].getHex());
                        }
                    }

                    // Append a circle to the selected group
                    let circle = roomGroup.append("circle")
                        .attr('cx', randomX)
                        .attr('cy', randomY)
                        .attr('r', 3)
                        .attr('fill', getColorByArtType(d.TypesofArt))
                        .attr('data-colors', hexColorsForThisCircle.join(', '))
                        .attr('data-art-type', d.TypesofArt);
                        
                    console.log('Circle ID:', index, 'Colors:', hexColorsForThisCircle);


                    // Add click event to open the modal
                    circle.on("click", function() {
                        // Modal logic
                        const modal = document.getElementById("myModal");
                        const modalImage = document.getElementById("modalImage");
                        const modalInfo = document.getElementById("modalInfo");
                        const span = document.getElementsByClassName("close")[0];

                        // Set modal content
                        modalImage.src = d.iiifthumburl; // Load the image
                        modalInfo.textContent = `Room: ${d.room}\nArt Type: ${d.TypesofArt}\nColors: ${hexColorsForThisCircle.join(', ')}`;
                        circle.on("click", function() {
                        let modalInfo = `${d.title_x}\nby: ${d.forwarddisplayname}\nYear: ${d.displaydate_x}`;
                        let site = d.site;
                        let description = d.description;
                        showModal(d.iiifthumburl, modalInfo, hexColorsForThisCircle, site, description);
                    });
                        // Display the modal
                        modal.style.display = "block";

                        // Close modal when clicking the close button or outside the modal
                        span.onclick = function() {
                            modal.style.display = "none";
                        }

                        window.onclick = function(event) {
                            if (event.target == modal) {
                                modal.style.display = "none";
                            }
                        }
                    });

                    // Log the color data for this circle
                    console.log('Circle ID:', index, 'Colors:', hexColorsForThisCircle);
                } else {
                    console.error("Error at index", index, "with URL:", d.iiifthumburl, "Error:", err);
                }
            });
        } else {
            console.warn("Room group not found for", d.room);
        }
    });
});
});

// Function to filter art by type
function filterArtByType(selectedArtType) {
d3.selectAll('circle')
    .style('display', function() {
        const artType = d3.select(this).attr('data-art-type');
        return (selectedArtType === 'all' || artType === selectedArtType) ? 'block' : 'none';
    });
}

// Add event listeners to toggle buttons
document.querySelectorAll('.tablinks').forEach(button => {
button.addEventListener('click', function() {
    // Remove the 'active' class from all buttons
    document.querySelectorAll('.tablinks').forEach(btn => btn.classList.remove('active'));
    
    // Add the 'active' class to the clicked button
    this.classList.add('active');
    
    const selectedArtType = this.getAttribute('data-value');
    filterArtByType(selectedArtType); // Call the filter function
});
});
   

// Function to open a tab and filter the art
function openTab(evt, tabName) {
var i, tabcontent, tablinks;

// Hide all tab content
tabcontent = document.getElementsByClassName("tabcontent");
for (i = 0; i < tabcontent.length; i++) {
tabcontent[i].style.display = "none";
}

// Remove 'active' class from all tab links
tablinks = document.getElementsByClassName("tablinks");
for (i = 0; i < tablinks.length; i++) {
tablinks[i].className = tablinks[i].className.replace(" active", "");
}

// Show the current tab content
var selectedTabContent = document.getElementById(tabName);
if (selectedTabContent) {
selectedTabContent.style.display = "block";
} else {
console.error(`No element with id '${tabName}' was found.`);
}

// Add 'active' class to the clicked tab/button
if (evt.currentTarget) {
evt.currentTarget.className += " active";
} else {
console.error("Event target is not available.");
}
}


