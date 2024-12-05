
document.addEventListener('DOMContentLoaded', async () => {
    const currentDateElement = document.getElementById('currentDate');
    const videoContainer = document.getElementById('videoContainer');

    // Exibe a data atual
    const today = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    currentDateElement.textContent = `Hoje é ${today}`;

    // Configuração da API do YouTube
    const API_KEY = 'AIzaSyC1te1WStxSaMTSAyaM88TUWAAExXCMqJU'; // Substitua pela sua chave de API
    const CHANNEL_USERNAME = '2010camillo'; // Nome do canal (sem @)
    const MAX_RESULTS = 50; // Número maior para aumentar a chance de encontrar Shorts

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
                videoContainer.innerHTML = '<p>Nenhum vídeo encontrado</p>';
                return;
            }

            // 3. Filtrar vídeos curtos (Shorts)
            const videoDetailsPromises = videoData.items.map(async (item) => {
                const videoId = item.id.videoId;

                const detailsResponse = await fetch(
                    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${API_KEY}`
                );
                const detailsData = await detailsResponse.json();

                if (detailsData.items.length > 0) {
                    const duration = detailsData.items[0].contentDetails.duration;

                    // Converter duração de ISO 8601 (PT#M#S) para segundos
                    const match = duration.match(/PT(\d+M)?(\d+S)?/);
                    const minutes = match[1] ? parseInt(match[1].replace('M', '')) : 0;
                    const seconds = match[2] ? parseInt(match[2].replace('S', '')) : 0;
                    const totalSeconds = minutes * 60 + seconds;

                    return totalSeconds <= 60 ? item : null; // Retorna só Shorts
                }

                return null;
            });

            const videos = (await Promise.all(videoDetailsPromises)).filter((video) => video !== null);

            if (videos.length === 0) {
                videoContainer.innerHTML = '<p>Nenhum Short encontrado</p>';
                return;
            }

            // 4. Selecionar um Short aleatório
            const randomVideo = videos[Math.floor(Math.random() * videos.length)];
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

    // Carregar Shorts
    fetchShortsFromChannel();
});

