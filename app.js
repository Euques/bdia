document.addEventListener('DOMContentLoaded', async () => {
    const currentDateElement = document.getElementById('currentDate');
    const videoContainer = document.getElementById('videoContainer');
    const textContainer = document.getElementById('textContainer');
    const channelButton = document.getElementById('channelButton');
    const shareButton = document.getElementById('shareButton');
    const reloadButton = document.getElementById('reloadButton');

    const API_KEY = 'AIzaSyC1te1WStxSaMTSAyaM88TUWAAExXCMqJU'; // Substitua pela sua chave
    const CHANNEL_USERNAME = '2010camillo';
    const MAX_RESULTS = 50;

    let videoList = [];
    let currentVideoIndex = -1;

    // Exibe a data atual
    const today = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    currentDateElement.textContent = `Hoje é ${today}`;

    // Função para buscar vídeos do canal
    async function fetchShortsFromChannel() {
        try {
            const channelResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${CHANNEL_USERNAME}&key=${API_KEY}`
            );
            const channelData = await channelResponse.json();
            if (!channelData.items || channelData.items.length === 0) {
                videoContainer.innerHTML = '<p>Canal não encontrado</p>';
                return;
            }

            const channelId = channelData.items[0].id;

            const videoResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${MAX_RESULTS}&type=video&order=date&key=${API_KEY}`
            );
            const videoData = await videoResponse.json();

            if (!videoData.items || videoData.items.length === 0) {
                videoContainer.innerHTML = '<p>Nenhum Short encontrado</p>';
                return;
            }

            videoList = videoData.items.map(item => ({
                id: item.id.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
            }));

            loadRandomVideo();
        } catch (error) {
            console.error('Erro ao buscar vídeos:', error);
            videoContainer.innerHTML = '<p>Erro ao carregar vídeos</p>';
        }
    }

    // Carrega um vídeo aleatório
    function loadRandomVideo() {
        if (videoList.length === 0) return;

        currentVideoIndex = Math.floor(Math.random() * videoList.length);
        const video = videoList[currentVideoIndex];
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

    channelButton.addEventListener('click', () => {
        window.open('https://www.youtube.com/@2010camillo/shorts', '_blank');
    });

    shareButton.addEventListener('click', () => {
        const video = videoList[currentVideoIndex];
        const shareText = `Assista este vídeo: ${video.title}\n\n${video.description}\n\nVeja aqui: https://www.youtube.com/shorts/${video.id}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappUrl, '_blank');
    });

    reloadButton.addEventListener('click', () => {
        loadRandomVideo();
    });

    fetchShortsFromChannel();
});
