// js/game.js

async function loadMoveAbilities() {
  try {
      const response = await fetch('/players/south/pseudo-legal-move-abilities.json');
      const data = await response.json();
      return data; // Returns the loaded JSON data
  } catch (error) {
      console.error('Error loading move abilities:', error);
  }
}

function highlightMoves(coordinate, pieceCode, moveAbilities) {
  clearHighlights();

  if (moveAbilities[pieceCode] && moveAbilities[pieceCode][coordinate]) {
      const possibleMoves = moveAbilities[pieceCode][coordinate];
      for (const targetCoord in possibleMoves) {
          const targetSquare = document.querySelector(`[data-coordinate="${targetCoord}"]`);
          const conditionsMet = checkConditions(possibleMoves[targetCoord]["-"].conditions, moveAbilities);
          const captureConditions = possibleMoves[targetCoord]["x"] ? possibleMoves[targetCoord]["x"].conditions : null;
          if (conditionsMet || (captureConditions && checkConditions(captureConditions, moveAbilities))) {
              targetSquare.classList.add('focus'); // Highlight the square
          }
      }
  }
}

function checkConditions(conditions, moveAbilities) {
  for (let coord in conditions) {
    let condition = conditions[coord];
    let square = document.querySelector(`[data-coordinate="${coord}"]`);
    let piece = square.querySelector('.piece');

    switch (condition) {
      case "free":
        if (piece) return false;
        break;
      case "enemy":
        if (!piece || piece.dataset.code in moveAbilities) return false;
        break;
      case "occupied":
        if (!piece) return false;
        break;
      default:
        console.error("Unknown condition:", condition);
        return false;
    }
  }
  return true;
}

function clearHighlights() {
  document.querySelectorAll('.square').forEach(square => {
      square.classList.remove('focus');
  });
}

async function initializeGame() {
  const moveAbilitiesData = await loadMoveAbilities();
  if (moveAbilitiesData) {
      const squares = document.querySelectorAll('.square');

      squares.forEach(square => {
          square.addEventListener('mouseenter', function() {
              const piece = this.querySelector('.piece');
              if (piece) {
                  highlightMoves(this.dataset.coordinate, piece.dataset.code, moveAbilitiesData);
              }
          });
          square.addEventListener('mouseleave', clearHighlights);
      });
  }
}

// Expose the initializeGame function to be callable after module is loaded
export { initializeGame };
