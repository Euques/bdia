document.addEventListener('DOMContentLoaded', async () => {
    const currentDateElement = document.getElementById('currentDate');
    const videoContainer = document.getElementById('videoContainer');
    const textContainer = document.getElementById('textContainer');
    const channelButton = document.getElementById('channelButton');
    const shareButton = document.getElementById('shareButton');
    const randomButton = document.getElementById('randomButton');

    const API_KEY = 'AIzaSyC1te1WStxSaMTSAyaM88TUWAAExXCMqJU'; // Substitua pela sua chave
    const CHANNEL_USERNAME = '2010camillo';
    const MAX_RESULTS = 50;

    let videos = [];
    let currentVideoIndex = 0;

    const today = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    currentDateElement.textContent = `Hoje é ${today}`;

    async function fetchShortsFromChannel() {
        try {
            const channelResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${CHANNEL_USERNAME}&key=${API_KEY}`
            );
            const channelData = await channelResponse.json();
            const channelId = channelData.items[0].id;

            const videoResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${MAX_RESULTS}&type=video&order=date&key=${API_KEY}`
            );
            const videoData = await videoResponse.json();

            videos = videoData.items.map(item => ({
                id: item.id.videoId,
                title: item.snippet.title,
                description: item.snippet.description
            }));

            loadVideo(0); // Carregar o último vídeo
        } catch (error) {
            console.error('Erro ao buscar vídeos:', error);
            videoContainer.innerHTML = '<p>Erro ao carregar vídeos</p>';
        }
    }

    function loadVideo(index) {
        currentVideoIndex = index;
        const video = videos[index];

        videoContainer.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${video.id}?autoplay=1&playsinline=1" 
                frameborder="0" 
                allow="autoplay; fullscreen">
            </iframe>
        `;
        textContainer.querySelector('.video-title').textContent = video.title;
        textContainer.querySelector('.video-description').textContent = video.description;
    }

    randomButton.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * videos.length);
        loadVideo(randomIndex);
    });

    channelButton.addEventListener('click', () => {
        window.open(`https://www.youtube.com/@${CHANNEL_USERNAME}/shorts`, '_blank');
    });

    shareButton.addEventListener('click', () => {
        const currentVideo = videos[currentVideoIndex];
        const shareText = `Assista este vídeo: ${currentVideo.title}\n\n${currentVideo.description}\n\nVeja aqui: https://www.youtube.com/shorts/${currentVideo.id}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappUrl, '_blank');
    });

    fetchShortsFromChannel();
});
