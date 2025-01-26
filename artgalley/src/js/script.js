class ArtGallery {
  constructor() {
    this.artworks = [];
    this.currentIndex = 0;
    this.frame = document.querySelector('.artwork-frame');
    this.title = document.getElementById('artwork-title');
    this.description = document.getElementById('artwork-description');
    this.isTransitioning = false;
    
    this.autoSlideInterval = null;
    this.isDragging = false;
    this.startPos = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;
    
    // Event listeners
    document.querySelector('.prev-btn').addEventListener('click', () => this.navigate(-1));
    document.querySelector('.next-btn').addEventListener('click', () => this.navigate(1));
    
    // Add modal elements
    this.createModal();
    
    // Start auto-slide
    this.startAutoSlide();
    
    // Add drag functionality
    this.frame.addEventListener('mousedown', this.dragStart.bind(this));
    this.frame.addEventListener('mousemove', this.drag.bind(this));
    this.frame.addEventListener('mouseup', this.dragEnd.bind(this));
    this.frame.addEventListener('mouseleave', this.dragEnd.bind(this));
    
    // Touch events
    this.frame.addEventListener('touchstart', this.dragStart.bind(this));
    this.frame.addEventListener('touchmove', this.drag.bind(this));
    this.frame.addEventListener('touchend', this.dragEnd.bind(this));
    
    // Initialize gallery
    this.loadArtworks();
    
    // Initialize audio player
    this.initAudioPlayer();
  }

  loadArtworks() {
    // Add your artwork data here
    this.artworks = [
      {
        src: './img/pic1.jpeg',
        title: 'Artwork 1',
        description: 'Description of artwork 1'
      },
      {
        src: './img/pic2.jpeg',
        title: 'Artwork 2',
        description: 'Description of artwork 2'
      }, 
      {
        src: './img/pic3.jpeg',
        title: 'Artwork 3',
        description: 'Description of artwork 3'
      },
      {
        src: './img/pic4.jpeg',
        title: 'Artwork 4',
        description: 'Description of artwork 4'
      },
      {
        src: './img/pic5.jpeg',
        title: 'Artwork 5',
        description: 'Description of artwork 5'
      },
      {
        src: './img/pic6.jpeg',
        title: 'Artwork 6',
        description: 'Description of artwork 6'
      },
      {
        src: './img/pic7.jpeg',
        title: 'Artwork 7',
        description: 'Description of artwork 7'
      },
      {
        src: './img/pic8.jpeg',
        title: 'Artwork 8',
        description: 'Description of artwork 8'
      },
      {
        src: './img/pic9.jpeg',
        title: 'Artwork 9',
        description: 'Description of artwork 9'
      },
      {
        src: './img/pic10.jpeg',
        title: 'Artwork 10',
        description: 'Description of artwork 10'
      },
      // Add more artworks as needed
    ];
    
    this.displayCurrentArtwork();
  }

  displayCurrentArtwork() {
    if (this.isTransitioning) return;
    
    const artwork = this.artworks[this.currentIndex];
    const newImg = document.createElement('img');
    newImg.src = artwork.src;
    newImg.alt = artwork.title;
    newImg.style.opacity = '0';
    newImg.style.transition = 'opacity 0.5s ease-in-out';
    
    // Add click handler for enlargement
    newImg.addEventListener('click', () => this.showModal(artwork));
    
    // Fade out current image if it exists
    const currentImg = this.frame.querySelector('img');
    if (currentImg) {
      currentImg.style.opacity = '0';
    }
    
    this.isTransitioning = true;
    
    setTimeout(() => {
      this.frame.innerHTML = '';
      this.frame.appendChild(newImg);
      
      // Trigger reflow
      newImg.offsetHeight;
      
      // Fade in new image
      newImg.style.opacity = '1';
      
      setTimeout(() => {
        this.isTransitioning = false;
      }, 500);
    }, currentImg ? 500 : 0);
    
    // Update info with fade effect
    this.updateInfo(artwork);
  }

  updateInfo(artwork) {
    // Fade out
    this.title.style.opacity = '0';
    this.description.style.opacity = '0';
    
    setTimeout(() => {
      this.title.textContent = artwork.title;
      this.description.textContent = artwork.description;
      
      // Fade in
      this.title.style.opacity = '1';
      this.description.style.opacity = '1';
    }, 250);
  }

  navigate(direction) {
    if (this.isTransitioning) return;
    
    this.currentIndex = (this.currentIndex + direction + this.artworks.length) % this.artworks.length;
    this.displayCurrentArtwork();
  }

  addFloatingEffect(img) {
    let floating = true;
    let position = 0;
    const speed = 0.5;
    
    const float = () => {
      if (!floating) return;
      
      position += speed;
      img.style.transform = `translateY(${Math.sin(position * 0.05) * 10}px)`;
      requestAnimationFrame(float);
    };
    
    float();
    
    // Clean up when image changes
    img.addEventListener('remove', () => {
      floating = false;
    });
  }

  createModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <button class="close-modal">&times;</button>
      <img src="" alt="" />
      <div class="modal-info">
        <h2></h2>
        <p></p>
      </div>
    `;
    document.body.appendChild(modal);
    
    this.modal = modal;
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => this.closeModal());
  }

  startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      if (!this.isDragging && !this.isTransitioning) {
        this.navigate(1);
      }
    }, 5000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  dragStart(e) {
    if (this.isTransitioning) return;
    
    this.isDragging = true;
    this.frame.classList.add('dragging');
    this.startPos = this.getPositionX(e);
    this.stopAutoSlide();
  }

  drag(e) {
    if (!this.isDragging || this.isTransitioning) return;
    
    const currentPosition = this.getPositionX(e);
    const diff = currentPosition - this.startPos;
    
    if (Math.abs(diff) > 100) {
      this.isDragging = false;
      this.frame.classList.remove('dragging');
      if (diff > 0) {
        this.navigate(-1);
      } else {
        this.navigate(1);
      }
    }
  }

  dragEnd() {
    this.isDragging = false;
    this.frame.classList.remove('dragging');
    this.startAutoSlide();
  }

  getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  }

  showModal(artwork) {
    const modalImg = this.modal.querySelector('img');
    const modalTitle = this.modal.querySelector('h2');
    const modalDesc = this.modal.querySelector('p');
    
    modalImg.src = artwork.src;
    modalImg.alt = artwork.title;
    modalTitle.textContent = artwork.title;
    modalDesc.textContent = artwork.description;
    
    this.modal.classList.add('active');
    this.stopAutoSlide();
  }

  closeModal() {
    this.modal.classList.remove('active');
    this.startAutoSlide();
  }

  initAudioPlayer() {
    const audio = document.getElementById('background-music');
    const musicBtn = document.getElementById('music-toggle');
    
    musicBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        musicBtn.classList.add('playing');
      } else {
        audio.pause();
        musicBtn.classList.remove('playing');
      }
    });

    // Optional: Start playing when user interacts with the page
    document.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        musicBtn.classList.add('playing');
      }
    }, { once: true });
  }
}

// Initialize gallery when page loads
window.addEventListener('DOMContentLoaded', () => {
  new ArtGallery();
});
