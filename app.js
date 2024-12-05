document.addEventListener('DOMContentLoaded', async () => {
    const currentDateElement = document.getElementById('currentDate');
    const videoContainer = document.getElementById('videoContainer');
    const textContainer = document.getElementById('textContainer');
    const channelButton = document.getElementById('channelButton');
    const shareButton = document.getElementById('shareButton');

    // Exibe a data atual
    const today = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    currentDateElement.textContent = `Hoje é ${today}`;

    // Configuração da API do YouTube
    const API_KEY = 'AIzaSyC1te1WStxSaMTSAyaM88TUWAAExXCMqJU'; // Substitua pela sua chave de API
    const CHANNEL_USERNAME = '2010camillo'; // Nome do canal (sem @)
    const MAX_RESULTS = 50;

    let currentVideoTitle = '';
    let currentVideoDescription = '';
    let currentVideoUrl = '';

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

            // Pega o vídeo mais recente
            const latestVideo = videoData.items[0]; // Primeira posição sempre será o mais recente
            const videoId = latestVideo.id.videoId;
            currentVideoTitle = latestVideo.snippet.title;
            currentVideoDescription = latestVideo.snippet.description;
            currentVideoUrl = `https://www.youtube.com/shorts/${videoId}`;

            videoContainer.innerHTML = `
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1" 
                    frameborder="0" 
                    allow="autoplay; fullscreen">
                </iframe>
            `;

            textContainer.querySelector('.video-title').textContent = currentVideoTitle;
            textContainer.querySelector('.video-description').textContent = currentVideoDescription;
        } catch (error) {
            console.error('Erro ao buscar vídeos:', error);
            videoContainer.innerHTML = '<p>Erro ao carregar vídeos</p>';
        }
    }

    channelButton.addEventListener('click', () => {
        window.open('https://www.youtube.com/@2010camillo/shorts', '_blank');
    });

    shareButton.addEventListener('click', () => {
        const shareText = `Assista este vídeo: ${currentVideoTitle}\n\n${currentVideoDescription}\n\nVeja aqui: ${currentVideoUrl}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappUrl, '_blank');
    });

    fetchShortsFromChannel();
});
