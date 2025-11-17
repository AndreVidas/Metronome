    const tapButton = document.getElementById('tapButton');
    const stopButton = document.getElementById('stopButton');
    const tempoDisplay = document.getElementById('tempo');
    const vollumeRange = document.getElementById('volume');
    const tripletButton = document.getElementById('tripletButton');

    let tapTimes = [];
    let lastTapTime = 0;
    let bpm = null;
    let metronomeInterval = null;
    let isTripletMode = false;

    // Web Audio context
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playBeep(frequency) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.frequency.value = frequency;
      osc.type = 'sine';
      gain.gain.setValueAtTime(volume.value / 100, audioCtx.currentTime);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    }

    function startMetronome(bpm) {
      stopMetronome(false);
      const interval = 60000 / bpm;

    if (!isTripletMode) {
        // normal metronome
        playBeep(440);
        metronomeInterval = setInterval(() => playBeep(440), interval);
    } else {
        // triplet mode
        metronomeInterval = setInterval(() => {
        playBeep(440); // main beat
        setTimeout(() => playBeep(560), interval / 3);     // 1st triplet
        setTimeout(() => playBeep(560), (2 * interval) / 3); // 2nd triplet
        }, interval);
        playBeep(440);
        setTimeout(() => playBeep(560), interval / 3);     // 1st triplet
        setTimeout(() => playBeep(560), (2 * interval) / 3); // 2nd triplet
    }
      
}

    function stopMetronome(click) {
      if(click === true){
        tempoDisplay.textContent = "—";
      }

      if (metronomeInterval) {
        clearInterval(metronomeInterval);
        metronomeInterval = null;
      }
    }

    tripletButton.addEventListener('click', () => {
        isTripletMode = !isTripletMode;
        tripletButton.textContent = isTripletMode ? "Triplets: On" : "Triplets: Off";
        if(bpm) {startMetronome(bpm)};
    });

    tapButton.addEventListener('click', () => {
      const now = Date.now();

      // set time in milliseconds to where the metronome tap observer is reset
      if (now - lastTapTime > 1500) {
        tapTimes = [];
      }

      tapTimes.push(now);
      lastTapTime = now;

      if (tapTimes.length >= 2) {
        const intervals = [];
        for (let i = 1; i < tapTimes.length; i++) {
          intervals.push(tapTimes[i] - tapTimes[i - 1]);
        }

        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        bpm = Math.round(60000 / avgInterval);
        tempoDisplay.textContent = bpm;

        startMetronome(bpm);
      }
    });

    stopButton.addEventListener('click', function (e){
        bpm = null;
        stopMetronome(true);
    });
    
