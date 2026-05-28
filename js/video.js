/**
 * INDUSTRIAL VIDEO ENGINE v7.0
 */
const modal = document.getElementById('videoModal');
const player = document.getElementById('industrialPlayer');
const playBtn = document.getElementById('playBtn');
const progressBar = document.getElementById('videoProgress');
const mTitle = document.getElementById('modalVideoTitle');
const mDesc = document.getElementById('modalVideoDesc');

function openVideoModal(url, title, desc) {
    player.src = url;
    mTitle.innerText = title;
    mDesc.innerText = desc;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    player.play();
    updatePlayIcon();
}

function closeVideoModal() {
    player.pause();
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function togglePlay() {
    if (player.paused) {
        player.play();
    } else {
        player.pause();
    }
    updatePlayIcon();
}

function updatePlayIcon() {
    const icon = playBtn.querySelector('i');
    icon.className = player.paused ? 'fas fa-play' : 'fas fa-pause';
}

function skipVideo(seconds) {
    player.currentTime += seconds;
}

// Atualizar Barra de Progresso
player.ontimeupdate = () => {
    const percentage = (player.currentTime / player.duration) * 100;
    progressBar.style.width = percentage + '%';
};

// Fechar no ESC
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") closeVideoModal();
});
