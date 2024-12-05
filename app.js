document.addEventListener('DOMContentLoaded', async () => {
    const currentDateElement = document.getElementById('currentDate');
    const videoContainer = document.getElementById('videoContainer');
    
    // Exibe a data atual
    const today = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    currentDateElement.textContent = `Hoje é ${today}`;
    
    // Função para carregar vídeos
    async function loadVideos() {
        try {
            const response = await fetch('videos.json');
            const videos = await response.json();

            // Simula pegar vídeo definido por admin (no futuro)
            const adminSelectedVideo = null; // Pode ser substituído pelo ID do vídeo
            let selectedVideo;

            if (adminSelectedVideo) {
                selectedVideo = videos.find(video => video.id === adminSelectedVideo);
            } else {
                selectedVideo = videos[Math.floor(Math.random() * videos.length)];
            }

            // Exibe o vídeo
            if (selectedVideo) {
                videoContainer.innerHTML = `
                    <h3>${selectedVideo.title}</h3>
                    <iframe 
                        width="560" 
                        height="315" 
                        src="https://www.youtube.com/embed/${selectedVideo.id}" 
                        frameborder="0" 
                        allowfullscreen>
                    </iframe>
                `;
            } else {
                videoContainer.innerHTML = '<p>Nenhum vídeo disponível</p>';
            }
        } catch (error) {
            console.error('Erro ao carregar vídeos:', error);
            videoContainer.innerHTML = '<p>Erro ao carregar vídeos</p>';
        }
    }

    // Carrega vídeos
    loadVideos();
});
