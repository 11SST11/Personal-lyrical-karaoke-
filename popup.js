// document.getElementById('fetchLyrics').addEventListener('click', function() {
//     const song = document.getElementById('song').value.trim();
//     const singer = document.getElementById('singer').value.trim();
//     const lyricsContainer = document.getElementById('lyrics');
//     const errorContainer = document.getElementById('error');

//     lyricsContainer.innerHTML = '';
//     errorContainer.innerHTML = '';

//     if (song === '' || singer === '') {
//         errorContainer.innerText = 'Please provide both song and singer names.';
//         return;
//     }

//     fetch(`https://api.lyrics.ovh/v1/${singer}/${song}`)
//         .then(response => response.json())
//         .then(data => {
//             if (data.lyrics) {
//                 lyricsContainer.innerText = data.lyrics;
//             } else {
//                 errorContainer.innerText = 'Lyrics not found.';
//             }
//         })
//         .catch(error => {
//             errorContainer.innerText = 'An error occurred while fetching the lyrics.';
//             console.error('Error fetching lyrics:', error);
//         });
// });
document.addEventListener('DOMContentLoaded', function() {
    const songInput = document.getElementById('song');
    const singerInput = document.getElementById('singer');
    const fetchLyricsButton = document.getElementById('fetchLyrics');
    const saveLyricsButton = document.getElementById('saveLyrics');
    const viewSavedLyricsButton = document.getElementById('viewSavedLyrics');
    const copyLyricsButton = document.getElementById('copyLyrics');
    const toggleModeButton = document.getElementById('toggleMode');
    const lyricsContainer = document.getElementById('lyrics');
    const errorContainer = document.getElementById('error');
    const savedLyricsContainer = document.getElementById('savedLyricsContainer');
    const savedLyricsList = document.getElementById('savedLyricsList');
    const closeSavedLyricsButton = document.getElementById('closeSavedLyrics');
    const songSuggestions = document.getElementById('songSuggestions');
    const singerSuggestions = document.getElementById('singerSuggestions');

    let isDarkMode = false;
    let savedLyrics = [];

    fetchLyricsButton.addEventListener('click', fetchLyrics);
    saveLyricsButton.addEventListener('click', saveLyrics);
    viewSavedLyricsButton.addEventListener('click', viewSavedLyrics);
    copyLyricsButton.addEventListener('click', copyLyrics);
    toggleModeButton.addEventListener('click', toggleMode);
    closeSavedLyricsButton.addEventListener('click', () => savedLyricsContainer.classList.add('hidden'));

    songInput.addEventListener('input', () => fetchSuggestions(songInput.value, 'song', songSuggestions));
    singerInput.addEventListener('input', () => fetchSuggestions(singerInput.value, 'singer', singerSuggestions));

    songSuggestions.addEventListener('click', (e) => selectSuggestion(e, songInput, songSuggestions));
    singerSuggestions.addEventListener('click', (e) => selectSuggestion(e, singerInput, singerSuggestions));

    function fetchLyrics() {
        const song = songInput.value.trim();
        const singer = singerInput.value.trim();

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
    }

    function saveLyrics() {
        const song = songInput.value.trim();
        const singer = singerInput.value.trim();
        const lyrics = lyricsContainer.innerText.trim();

        if (!song || !singer || !lyrics) {
            errorContainer.innerText = 'No lyrics to save.';
            return;
        }

        const lyricData = { song, singer, lyrics };
        savedLyrics.push(lyricData);
        chrome.storage.sync.set({ savedLyrics }, () => {
            errorContainer.innerText = 'Lyrics saved successfully.';
        });
    }

    function viewSavedLyrics() {
        savedLyricsContainer.classList.remove('hidden');
        savedLyricsList.innerHTML = '';

        chrome.storage.sync.get('savedLyrics', (data) => {
            savedLyrics = data.savedLyrics || [];
            savedLyrics.forEach((lyric) => {
                const lyricElement = document.createElement('div');
                lyricElement.innerHTML = `<strong>${lyric.song}</strong> by ${lyric.singer}<br>${lyric.lyrics}<hr>`;
                savedLyricsList.appendChild(lyricElement);
            });
        });
    }

    function copyLyrics() {
        const lyrics = lyricsContainer.innerText.trim();
        if (!lyrics) {
            errorContainer.innerText = 'No lyrics to copy.';
            return;
        }

        navigator.clipboard.writeText(lyrics).then(() => {
            errorContainer.innerText = 'Lyrics copied to clipboard.';
        }).catch(error => {
            errorContainer.innerText = 'Failed to copy lyrics.';
            console.error('Error copying lyrics:', error);
        });
    }

    function toggleMode() {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode', isDarkMode);
        toggleModeButton.innerText = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }

    function fetchSuggestions(query, type, suggestionsContainer) {
        if (query.length < 2) {
            suggestionsContainer.innerHTML = '';
            return;
        }

        // Mock API call for suggestions
        const suggestions = [
            `${query} Suggestion 1`,
            `${query} Suggestion 2`,
            `${query} Suggestion 3`
        ];

        suggestionsContainer.innerHTML = '';
        suggestions.forEach(suggestion => {
            const suggestionElement = document.createElement('div');
            suggestionElement.innerText = suggestion;
            suggestionsContainer.appendChild(suggestionElement);
        });
    }

    function selectSuggestion(event, inputElement, suggestionsContainer) {
        inputElement.value = event.target.innerText;
        suggestionsContainer.innerHTML = '';
    }
});