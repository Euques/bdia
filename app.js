document.addEventListener('DOMContentLoaded', async () => {
    const currentDateElement = document.getElementById('currentDate');
    const videoContainer = document.getElementById('videoContainer');
    const textContainer = document.getElementById('textContainer');
    const channelButton = document.getElementById('channelButton');
    const shareButton = document.getElementById('shareButton');
    const reloadButton = document.getElementById('reloadButton');

    // Exibe a data atual
    const today = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    currentDateElement.textContent = `Hoje é ${today}`;

    // Configuração da API do YouTube
    const API_KEY = 'AIzaSyC1te1WStxSaMTSAyaM88TUWAAExXCMqJU'; 
    //const API_KEY = 'AIzaSyBeieToxa_uuTozLLOTB2_2He59l4Xt-eU';
    const CHANNEL_USERNAME = '2010camillo'; // Nome do canal (sem @)
    const MAX_RESULTS = 100;

    let videos = []; // Array para armazenar vídeos
    let currentVideoIndex = -1;

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

            // Armazena vídeos
            videos = videoData.items.map(video => ({
                id: video.id.videoId,
                title: video.snippet.title,
                description: video.snippet.description
            }));

            // Exibe o vídeo mais recente
            displayVideo(0); // Primeiro vídeo (mais recente)
        } catch (error) {
            console.error('Erro ao buscar vídeos:', error);
            videoContainer.innerHTML = '<p>Erro ao carregar vídeos</p>';
        }
    }

    function displayVideo(index) {
        if (!videos || videos.length === 0 || index < 0 || index >= videos.length) return;

        const video = videos[index];
        currentVideoIndex = index;

        videoContainer.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${video.id}?autoplay=1&playsinline=1&rel=0" 
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
        if (currentVideoIndex === -1) return;

        const video = videos[currentVideoIndex];
        const shareText = `Bom Dia: ${video.title}\n\n${video.description}\n\nVeja aqui: https://www.youtube.com/shorts/${video.id}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappUrl, '_blank');
    });

    reloadButton.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * videos.length);
        displayVideo(randomIndex);
    });

    fetchShortsFromChannel();
});
