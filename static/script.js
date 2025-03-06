function updateFaders() {
    fetch('/api/audio-sessions')
        .then(response => response.json())
        .then(data => {
            console.log('Received audio sessions:', data);
            const container = document.getElementById('faders-container');
            const existingFaders = new Set();
            
            data.forEach(session => {
                const faderId = `fader-${session.index}`;
                existingFaders.add(faderId);
                
                let faderContainer = document.getElementById(faderId);
                
                if (!faderContainer) {
                    console.log('Creating new fader for:', session.name);
                    faderContainer = document.createElement('div');
                    faderContainer.id = faderId;
                    faderContainer.className = 'fader-container';
                    
                    const appName = document.createElement('div');
                    appName.className = 'app-name';
                    appName.textContent = session.name;
                    
                    const volumeDisplay = document.createElement('div');
                    volumeDisplay.className = 'volume-display';
                    volumeDisplay.textContent = `${Math.round(session.volume * 100)}%`;
                    
                    const fader = document.createElement('input');
                    fader.type = 'range';
                    fader.min = 0;
                    fader.max = 1;
                    fader.step = 0.01;
                    fader.className = 'fader';
                    fader.value = session.volume;
                    
                    const muteButton = document.createElement('button');
                    muteButton.className = session.muted ? 'mute-button muted' : 'mute-button';
                    muteButton.textContent = 'MUTE';
                    
                    // Volume change handler
                    fader.addEventListener('change', (e) => {
                        const volume = parseFloat(e.target.value);
                        console.log('Setting volume:', volume, 'for index:', session.index);
                        
                        fetch('/api/set-volume', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                index: session.index,
                                volume: volume
                            })
                        })
                        .then(response => response.json())
                        .then(result => {
                            console.log('Volume change result:', result);
                            if (result.success) {
                                volumeDisplay.textContent = `${Math.round(volume * 100)}%`;
                            }
                        })
                        .catch(error => console.error('Volume change error:', error));
                    });
                    
                    // Mute button handler
                    muteButton.addEventListener('click', () => {
                        console.log('Toggling mute for index:', session.index);
                        
                        fetch('/api/toggle-mute', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                index: session.index
                            })
                        })
                        .then(response => response.json())
                        .then(result => {
                            console.log('Mute toggle result:', result);
                            if (result.success) {
                                muteButton.classList.toggle('muted');
                            }
                        })
                        .catch(error => console.error('Mute toggle error:', error));
                    });
                    
                    faderContainer.appendChild(appName);
                    faderContainer.appendChild(volumeDisplay);
                    faderContainer.appendChild(fader);
                    faderContainer.appendChild(muteButton);
                    container.appendChild(faderContainer);
                }
                
                // Update existing fader values
                const fader = faderContainer.querySelector('.fader');
                const volumeDisplay = faderContainer.querySelector('.volume-display');
                const muteButton = faderContainer.querySelector('.mute-button');
                
                if (fader.value !== session.volume.toString()) {
                    fader.value = session.volume;
                    volumeDisplay.textContent = `${Math.round(session.volume * 100)}%`;
                }
                
                muteButton.classList.toggle('muted', session.muted);
            });
            
            // Remove faders for closed applications
            Array.from(container.children).forEach(child => {
                if (!existingFaders.has(child.id)) {
                    container.removeChild(child);
                }
            });
        })
        .catch(error => console.error('Error fetching audio sessions:', error));
}

// Update faders every second
setInterval(updateFaders, 1000);
updateFaders();
