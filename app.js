document.addEventListener('DOMContentLoaded', async () => {
    const currentDateElement = document.getElementById('currentDate');
    const videoContainer = document.getElementById('videoContainer');

    // Exibe a data atual
    const today = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    currentDateElement.textContent = `Hoje é ${today}`;

    // Configuração da API do YouTube
    const API_KEY = 'SUA_CHAVE_DE_API_AQUI'; // Substitua pela sua chave de API
    const CHANNEL_USERNAME = '2010camillo'; // Nome do canal (sem @)
    const MAX_RESULTS = 10;

    // Função para buscar vídeos do canal
    async function fetchVideosFromChannel() {
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
                videoContainer.innerHTML = '<p>Nenhum vídeo encontrado</p>';
                return;
            }

            // Selecionar um vídeo aleatório
            const randomVideo = videoData.items[Math.floor(Math.random() * videoData.items.length)];
            const videoId = randomVideo.id.videoId;
            const videoTitle = randomVideo.snippet.title;
            const videoDescription = randomVideo.snippet.description;

            // Exibir o vídeo
            videoContainer.innerHTML = `
                <h3>${videoTitle}</h3>
                <iframe 
                    width="560" 
                    height="315" 
                    src="https://www.youtube.com/embed/${videoId}" 
                    frameborder="0" 
                    allowfullscreen>
                </iframe>
                <p>${videoDescription}</p>
            `;
        } catch (error) {
            console.error('Erro ao buscar vídeos:', error);
            videoContainer.innerHTML = '<p>Erro ao carregar vídeos</p>';
        }
    }

    // Carregar vídeos
    fetchVideosFromChannel();
});
