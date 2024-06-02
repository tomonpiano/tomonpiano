window.onload = function() {
  const VF = Vex.Flow;
  const div = document.getElementById('note-container');
  const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
  const pitches = ['c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5', 'd/5', 'e/5', 'f/5', 'g/5', 'a/5'];
  let currentPitch = '';
  let score = 0;
  let round = 0;
  const totalRounds = 10;
  let shuffledPitches = [];

  const containerWidth = 300;
  const staveWidth = 100;
  const staveScale = 1.5; // Scale factor for both width and height

  renderer.resize(containerWidth, 200 * staveScale);
  const context = renderer.getContext();
  context.scale(staveScale, staveScale); // Scale both width and height

  context.setFont('Arial', 10, '').setBackgroundFillStyle('#eed');

  const stave = new VF.Stave((containerWidth / staveScale - staveWidth) / 2, 50 / staveScale, staveWidth);
  stave.addClef('treble').setContext(context).draw();

  function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
  }

  function renderNote() {
      context.clear();
      context.scale(staveScale, staveScale); // Apply the scale again after clearing
      stave.setContext(context).draw();

      currentPitch = shuffledPitches[round];
      const notes = [
          new VF.StaveNote({
              keys: [currentPitch],
              duration: 'q'
          })
      ];

      const voice = new VF.Voice({
          num_beats: 1,
          beat_value: 4
      });

      voice.addTickables(notes);

      const formatter = new VF.Formatter().joinVoices([voice]).format([voice], staveWidth);

      voice.draw(context, stave);
  }

  function handleGuess(event) {
      const guessedNote = event.target.getAttribute('data-note') + '/4';
      const correctNote = currentPitch.split('/')[0] + '/4';

      if (guessedNote === correctNote) {
          event.target.classList.add('correct');
          score++;
          setTimeout(() => {
              event.target.classList.remove('correct');
              nextRound();
          }, 1000);
      } else {
          event.target.classList.add('incorrect');
          showMessage('Try again');
          setTimeout(() => {
              event.target.classList.remove('incorrect');
              clearMessage();
          }, 1000);
      }
  }

  function nextRound() {
      round++;
      updateScore();
      if (round < totalRounds) {
          renderNote();
      } else {
          endGame();
      }
  }

  function updateScore() {
      document.getElementById('score').innerText = `Score: ${score} / ${totalRounds}`;
  }

  function showMessage(message) {
      document.getElementById('message').innerText = message;
  }

  function clearMessage() {
      document.getElementById('message').innerText = '';
  }

  function endGame() {
      showMessage(`Game over! You scored ${score} out of ${totalRounds}.`);
      document.getElementById('restart-button').style.display = 'block';
  }

  function resetGame() {
      score = 0;
      round = 0;
      clearMessage();
      updateScore();
      shuffledPitches = shuffleArray([...pitches]);
      document.getElementById('restart-button').style.display = 'none';
      renderNote();
  }

  document.getElementById('restart-button').addEventListener('click', resetGame);

  document.querySelectorAll('.guess-button').forEach(button => {
      button.addEventListener('click', handleGuess);
  });

  // Initial render
  resetGame();
};
