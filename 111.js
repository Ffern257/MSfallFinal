let vibrantColors = [];

document.addEventListener('DOMContentLoaded', (event) => {
  function getVibrantColors(imgUrl) {
    return new Promise((resolve, reject) => {
      Vibrant.from(imgUrl).getPalette((err, palette) => {
        if (err) {
          console.error("Error retrieving vibrant colors:", err);
          reject(err);
          return;
        }

        const imageColors = Object.values(palette)
          .filter(swatch => swatch && typeof swatch.getHex === 'function')
          .map(swatch => swatch.getHex());
          
        console.log(imageColors);

        vibrantColors = vibrantColors.concat(imageColors);

        resolve(imageColors);
      });
    });
  }
  function filterImagesByStoredColors() {
    d3.selectAll("#image_container .img").each(function() {
        const imgColors = JSON.parse(this.dataset.colors || "[]");
        
        let isMatched = imgColors.some(color => vibrantColors.includes(color));

            d3.select(this).style("display", "none");
    });
  }

  function makeDots(polygon, numPoints) {
    const points = [];
    const xs = polygon.map(p => p[0]);
    const ys = polygon.map(p => p[1]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    function insidePolygon(pt, poly) {
        let inside = false;
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            const xi = poly[i][0], yi = poly[i][1];
            const xj = poly[j][0], yj = poly[j][1];
            const intersect = ((yi > pt[1]) !== (yj > pt[1])) && (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    while (points.length < numPoints) {
        const p = [
            minX + Math.random() * (maxX - minX),
            minY + Math.random() * (maxY - minY)
        ];
        if (insidePolygon(p, polygon)) {
            points.push(p);
        }
    }
    return points;
}
Promise.all([
    d3.xml("Plan.svg"),
    d3.xml("Isometric try .svg")
]).then(function(files) {
    const planDocument = files[0];
    const isometricDocument = files[1];
    

    // Add Plan.svg to the DOM
    const planNode = document.importNode(planDocument.documentElement, true);
    d3.select("#plan").node().appendChild(planNode);
    d3.select("#plan").classed("isometric", true);

    // Add Isometric try .svg to the DOM
    const isometricNode = document.importNode(isometricDocument.documentElement, true);
    d3.select("#decoration").node().appendChild(isometricNode);
    d3.select("#decoration").classed("isometric", true);
});

    const colorMap = {
      "sculpture": "rgb(244, 188, 94)",
      "photograph": "rgb(228, 167, 97)",
      "drawing": "rgb(71, 157, 166)",
      "painting": "rgb(55, 109, 253)",
      "decorative art": "rgb(91, 199,130)",
      "new media": "rgb(28, 152, 121)"
  };

  d3.csv("data.csv").then(function (data) {
    // 
 console.log("initail load",data.length)
    data.forEach(function (d) {
      const roomElement = d3.select("#plan #" + d.room);

      if (!roomElement.empty()) {
          const bbox = roomElement.node().getBBox();
          const polygon = [
              [bbox.x, bbox.y],
              [bbox.x + bbox.width, bbox.y],
              [bbox.x + bbox.width, bbox.y + bbox.height],
              [bbox.x, bbox.y + bbox.height]
          ];
          const dots = makeDots(polygon, Number(d.Amount));
          dots.forEach(dot => {
              roomElement.append("circle")
                  .attr("class", "dot")
                  .attr("cx", dot[0])
                  .attr("cy", dot[1])
                  .attr("r", 3)
                  .attr("fill", colorMap[d.TypesofArt])
                  .attr("data-type", d.TypesofArt);  // Add this line

                  if (vibrantColors.length) {
                    dotElement.attr("data-vibrant-colors", JSON.stringify(vibrantColors))
                  }
                  
          });
      }
  });

  const totalAmount = d3.sum(data, d => d.Amount);
  let typeTotals = {};
  data.forEach(d => {
      if (!typeTotals[d.TypesofArt]) {
          typeTotals[d.TypesofArt] = 0;
      }
      typeTotals[d.TypesofArt] += +d.Amount;
  });
// //Legend 
//   const totalDots = 100;
//   let typeDots = {};
//   for (const artType in typeTotals) {
//       typeDots[artType] = Math.round(totalDots * (typeTotals[artType] / totalAmount));
//   }

  // Dot Matrix result
  const svgDotMatrix = d3.select("#dot-matrix-container svg");
  let row = 0,
      col = 0;
  const dotSize = 15;

  for (const artType in typeDots) {
      const dots = typeDots[artType];
      for (let i = 0; i < dots; i++) {
          svgDotMatrix.append("circle")
              .attr("cx", col * (dotSize + 2) + (dotSize / 2))
              .attr("cy", row * (dotSize + 2) + (dotSize / 2))
              .attr("r", dotSize / 2)
              .attr("fill", colorMap[artType])
              .attr("stroke", "white");

          col++;
          if (col >= 10) {
              col = 0;
              row++;
          }
      }
  }
  
        function filterDotsByStoredColors() {
          console.log("filtering")
          d3.selectAll(".dot").each(function() {
              const dotColors = JSON.parse(this.dataset.colors || "[]"); 
              
              let isMatched = dotColors.some(color => vibrantColors.includes(color));
      
              if (isMatched) {
                  d3.select(this).attr("display", "block");
              } else {
                  d3.select(this).attr("display", "none");
              }
          });
      }
      
      function filterDotsByArtTypeAndColor(type, color) {
        d3.selectAll(".dot").each(function() {
            const dotType = d3.select(this).attr("data-type");
            const dotColors = JSON.parse(d3.select(this).attr("data-vibrant-colors") || "[]");
    
            // Check if the dot matches the selected type and has a similar color
            if ((dotType === type || type === "all") && dotColors.some(dotColor => isColorSimilar(dotColor, color))) {
                d3.select(this).attr("display", "block");
            } else {
                d3.select(this).attr("display", "none");
            }
        });
    }    

        // Function to check color similarity
        function isColorSimilar(hex1, hex2) {
          let threshold = 40;
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

        // Event listener for color picker changes
        function handleColorPickerEvent(event) {
          const currentColor = event.target.value;
          const selectedType = document.getElementById('artTypeDropdown').value;
          console.log(currentColor)
          filterDotsByArtTypeAndColor(selectedType, currentColor);
      }
      //add another function for dropdown
  
        // Adding color picker event listeners
        for (let i = 1; i <= 5; i++) {
          const colorPicker = document.getElementById(`colorPicker${i}`);
          if (colorPicker) {
            colorPicker.addEventListener('input', handleColorPickerEvent);
          } else {
            console.error(`colorPicker${i} is missing from the DOM.`);
          }
        }

        // Function to clear a color box
        window.clearBoxColor = function(boxNumber) {
          document.getElementById(`box${boxNumber}`).style.backgroundColor = '';
          document.getElementById(`colorPicker${boxNumber}`).value = "#ffffff";

          if (boxNumber === 1) {
            for (let i = 2; i <= 5; i++) deleteBox(i);
          }
        };

        // Function to delete a color box
  window.deleteBox = function(boxNumber) {
    for (let i = boxNumber; i <= 5; i++) {
      document.getElementById(`box${i}`).style.display = 'none';
      document.getElementById(`box${i}`).style.backgroundColor = '';
      document.getElementById(`colorPicker${i}`).value = "#ffffff";
    }
  };

  // Function to add a color box
  window.addColorBox = function() {
    if (document.getElementById(`box${currentBoxCount}`).style.backgroundColor !== "" && (currentBoxCount < 5)) {
      currentBoxCount++;
      document.getElementById('box' + currentBoxCount).style.display = 'block';
    } else {
      alert('Please add color');
    }
  };


        // Initial box count
        let currentBoxCount = 1;

        // Create color picker boxes
        function createColorPickerBoxes() {
          document.querySelectorAll(".box").forEach(box => {
            document.body.appendChild(box);
          });
        }

       
        function updateCombinedColorDisplay() {
          let selectedColors = [];
          for (let i = 1; i <= 5; i++) {
            let color = document.getElementById(`box${i}`).style.backgroundColor;
            if (color) selectedColors.push(color);
          }
      
          document.getElementById('combinedColorDisplay').style.background = selectedColors.length >= 2 ?
            `linear-gradient(to top, ${selectedColors.join(',')})` :
            (selectedColors.length === 1 ? selectedColors[0] : '');
        }
      
        // Function to update the stacked color boxes
        function updateStackedColorBox() {
          let stackedColors = [];
          for (let i = 1; i <= 5; i++) {
            let color = document.getElementById(`box${i}`).style.backgroundColor;
            if (color) stackedColors.push(color);
          }
      
          for (let i = 1; i <= 5; i++) {
            document.getElementById(`stackedBox${i}`).style.backgroundColor = stackedColors[i - 1] || 'transparent';
          }
        }
      
        // Adding event listeners for each color picker
        for (let i = 1; i <= 5; i++) {
          const colorPicker = document.getElementById(`colorPicker${i}`);
          if (!colorPicker) {
            console.error(`colorPicker${i} is missing from the DOM.`);
            continue;
          }
          colorPicker.addEventListener('input', event => {
            document.getElementById(`box${i}`).style.backgroundColor = event.target.value;
            updateCombinedColorDisplay();
            updateStackedColorBox();
          });
        }

        // Create color picker boxes on load
        createColorPickerBoxes();
      })
      .catch(error => {
          // handle the error appropriately
          console.error('Error:', error);
      });

 
    
  

    });