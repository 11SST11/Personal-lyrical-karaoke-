document.getElementById('fetchLyrics').addEventListener('click', function() {
    const song = document.getElementById('song').value.trim();
    const singer = document.getElementById('singer').value.trim();
    const lyricsContainer = document.getElementById('lyrics');
    const errorContainer = document.getElementById('error');

    lyricsContainer.innerHTML = '';
    errorContainer.innerHTML = '';

    if (song === '' || singer === '') {
        errorContainer.innerText = 'Please provide both song and singer names.';
        return;
    }

    fetch(`https://api.lyrics.ovh/v1/${singer}/${song}`)
        .then(response => response.json())
        .then(data => {
            if (data.lyrics) {
                lyricsContainer.innerText = data.lyrics;
            } else {
                errorContainer.innerText = 'Lyrics not found.';
            }
        })
        .catch(error => {
            errorContainer.innerText = 'An error occurred while fetching the lyrics.';
            console.error('Error fetching lyrics:', error);
        });
});