const correctOrder = ["fiesta", "gb", "techno", "original", "pika"];
const confirmButton = document.getElementById("confirm");
const sourceList = document.querySelector("body > .nes-container ul#items");
  const bank = document.querySelector("#bank");
  const puzzleList = document.querySelector("#puzzle ul#items");
  const sourceItems = sourceList.querySelectorAll("li");
  const hint = document.getElementById("hint");
  
  window.addEventListener("DOMContentLoaded", () => {
  

  // Map img ids to hint text
  const hints = {
    original: "happy anywhere",
    pika: "fast paced",
    fiesta: "likes to chase",
    techno: "attention seeker",
    gb: "a bit slow"
  };

  sourceItems.forEach((item) => {
    const img = item.querySelector("img");

    // Hover event for hint on the list item
    item.addEventListener("mouseenter", () => {
      hint.textContent = hints[img.id] || "A mysterious Nyan!";
    });

    bank.addEventListener("mouseleave", () => {
      hint.textContent = "scroll over a nyan for a hint!";
    });

    item.onclick = () => {
      // Remove from source list
      item.remove();

      // Create a new li for the puzzle area
      const newLi = document.createElement("li");
      newLi.className = "nes-container is-rounded";
      newLi.appendChild(img);

      // Add click event to move back to source list
      img.onclick = () => {
        newLi.remove();
        item.appendChild(img);
        sourceList.appendChild(item);
        img.onclick = null;
      };

      puzzleList.appendChild(newLi);

      if (checkPuzzleOrder(puzzleList, correctOrder)) {
        confirmButton.classList.remove("is-disabled");
        confirmButton.classList.add("is-success");
        confirmButton.textContent = "success!";

        // Disable moving items by removing onclick from all images in puzzle
        puzzleList.querySelectorAll("li img").forEach(imgEl => {
          imgEl.onclick = null;
        });
      }
    };
  });
});

function checkPuzzleOrder(puzzleList, correctOrder) {
  const ids = Array.from(puzzleList.querySelectorAll("li img")).map(img => img.id);
  return ids.length === correctOrder.length && ids.every((id, i) => id === correctOrder[i]);
}

function success() {
  let resultDiv = document.getElementById("result");
  
  const imgs = Array.from(document.querySelectorAll("#puzzle ul#items li img"));
  imgs.forEach(img => {
    if (img.parentNode) img.parentNode.removeChild(img);
    img.onclick = null;
    img.classList.add("bounce-on-hover");
    resultDiv.appendChild(img);
  });
  resultDiv.style.paddingTop = "20%";

  resultDiv.innerHTML += "<br></br><p>going on an adventure!</p>";
  let puzzleDiv = document.getElementById("puzzle");
  let bankDiv = document.getElementById("bank");
  puzzleDiv.style.display = "none";
  bankDiv.style.display = "none";
  confirmButton.style.display = "none";
}

confirmButton.addEventListener("click", success);