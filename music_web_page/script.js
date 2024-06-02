window.onload = function() {
  const VF = Vex.Flow;
  const div = document.getElementById('note-container');
  const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
  const pitches = ['c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5'];
  let currentPitch = '';

  const containerWidth = div.offsetWidth;
  const staveHeight = 200; // Height of the rendering area
  const staveScaleY = 2.5; // Scale factor for height
  const staveScaleX = 2.5
  const staveWidth = 100
  const staveXpos = 25;
  const staveYpos = 0;

  renderer.resize(containerWidth, staveHeight);
  const context = renderer.getContext();
  context.scale(2, staveScaleY); // Scale the stave height

  context.setFont('Arial', 10, '').setBackgroundFillStyle('#eed');

  const stave = new VF.Stave(staveXpos, staveYpos, staveWidth); // Adjust the y-coordinate to position the stave correctly
  stave.addClef('treble').setContext(context).draw();

  function renderNote() {
      context.clear();
      context.scale(2,2 ); // Apply the scale again after clearing
      stave.setContext(context).draw();

      currentPitch = pitches[Math.floor(Math.random() * pitches.length)];
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

      const formatter = new VF.Formatter().joinVoices([voice]).format([voice], containerWidth);

      voice.draw(context, stave);
  }

  function handleGuess(event) {
      const guessedNote = event.target.getAttribute('data-note') + '/4';
      const correctNote = currentPitch.split('/')[0] + '/4';

      if (guessedNote === correctNote) {
          event.target.classList.add('correct');
          setTimeout(() => {
              event.target.classList.remove('correct');
              renderNote();
              clearMessage();
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

  function showMessage(message) {
      document.getElementById('message').innerText = message;
  }

  function clearMessage() {
      document.getElementById('message').innerText = '';
  }

  document.querySelectorAll('.guess-button').forEach(button => {
      button.addEventListener('click', handleGuess);
  });

  // Initial render
  renderNote();
};
