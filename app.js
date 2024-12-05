document.addEventListener('DOMContentLoaded', async () => {
    const currentDateElement = document.getElementById('currentDate');
    const videoContainer = document.getElementById('videoContainer');
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
            // 1. Buscar informações do canal pelo nome de usuário
            const channelResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${CHANNEL_USERNAME}&key=${API_KEY}`
            );
            const channelData = await channelResponse.json();

            if (!channelData.items || channelData.items.length === 0) {
                videoContainer.innerHTML = '<p>Canal não encontrado</p>';
                return;
            }

            const channelId = channelData.items[0].id;

            // 2. Buscar vídeos do canal
            const videoResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${MAX_RESULTS}&type=video&key=${API_KEY}`
            );
            const videoData = await videoResponse.json();

            if (!videoData.items || videoData.items.length === 0) {
                videoContainer.innerHTML = '<p>Nenhum Short encontrado</p>';
                return;
            }

            // 3. Selecionar um vídeo aleatório
            const randomVideo = videoData.items[Math.floor(Math.random() * videoData.items.length)];
            const videoId = randomVideo.id.videoId;
            currentVideoTitle = randomVideo.snippet.title;
            currentVideoDescription = randomVideo.snippet.description;
            currentVideoUrl = `https://www.youtube.com/shorts/${videoId}`;

            // Exibir o vídeo em formato vertical
            videoContainer.innerHTML = `
                <div class="video-title">${currentVideoTitle}</div>
                <iframe 
                    width="100%" 
                    height="400" 
                    src="https://www.youtube.com/embed/${videoId}?playsinline=1" 
                    frameborder="0" 
                    allowfullscreen>
                </iframe>
                <div class="video-description">${currentVideoDescription}</div>
            `;
        } catch (error) {
            console.error('Erro ao buscar vídeos:', error);
            videoContainer.innerHTML = '<p>Erro ao carregar vídeos</p>';
        }
    }

    // Configurar botão para ir ao canal
    channelButton.addEventListener('click', () => {
        window.open('https://www.youtube.com/@2010camillo/shorts', '_blank');
    });

    // Configurar botão para compartilhar no WhatsApp
    shareButton.addEventListener('click', () => {
        const shareText = `Assista este vídeo: ${currentVideoTitle}\n\n${currentVideoDescription}\n\nVeja aqui: ${currentVideoUrl}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappUrl, '_blank');
    });

    // Carregar Shorts
    fetchShortsFromChannel();
});
