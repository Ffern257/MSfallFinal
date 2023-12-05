document.addEventListener('DOMContentLoaded', (event) => {
  function getVibrantColors(imgUrl) {
    return new Promise((resolve, reject) => {
      Vibrant.from(imgUrl).getPalette((err, palette) => {
        if (err) {
          reject(err);
          return;
        }

        const imageColors = [];
        for (let swatch in palette) {
          if (palette[swatch] && typeof palette[swatch].getHex === 'function') {
            const hex = palette[swatch].getHex();
            imageColors.push(hex);
          }
        }
        console.log(imageColors);
        resolve(imageColors);
      });
    });
  }

  d3.csv("data.csv").then(loadImageData);

  function loadImageData(data) {
    const promises = data.slice(0, 1000).map(d => {
      return fetch(d.iiifthumburl)
        .then(response => {
          if (response.status !== 404) {
            return getVibrantColors(d.iiifthumburl).then(colors => {
              return {
                imageUrl: d.iiifthumburl,
                colors: colors
              };
            });
          }
        });
    });

    Promise.all(promises)
      .then(results => {
        results.forEach(result => {
          if (result) {
            const imgContainer = d3.select("#image_container")
              .append("div")
              .attr("class", "img-container");

            const imgElement = imgContainer.append("img")
              .attr("src", result.imageUrl)
              .attr("class", "img")
              .attr("data-colors", JSON.stringify(result.colors));
          }
        });

        // Function to filter images by color
        function filterImagesByColor(color) {
          d3.selectAll("#image_container .img").each(function () {
            const imgColors = JSON.parse(this.dataset.colors || "[]");

            let similarity = 0;

            imgColors.forEach(imgColor => {
              if (isColorSimilar(color, imgColor)) {
                similarity++;
              }
            });

            const similarityThreshold = 3;

            if (similarity >= similarityThreshold) {
              d3.select(this).style("display", "block");
            } else {
              d3.select(this).style("display", "none");
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
          filterImagesByColor(currentColor);
        }

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

        // Update combined color display
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
          });
        }

        // Create color picker boxes on load
        createColorPickerBoxes();
      })
      .catch(error => {
      });
  }
});
