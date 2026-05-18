document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Glass Effect & Parallax Hero
    const navbar = document.getElementById('navbar');
    const heroVideo = document.getElementById('hero-video-wrapper');
    const heroContent = document.querySelector('.hero-content');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Navbar
        if (scrolled > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hero Parallax (only performant transforms)
        if (scrolled < window.innerHeight) {
            heroVideo.style.transform = `translate3d(0, ${scrolled * 0.4}px, 0)`;
            heroContent.style.transform = `translate3d(0, ${scrolled * 0.2}px, 0)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 1.5;
        }
    }, { passive: true });

    // 2. Hero Headline Word-by-Word Reveal
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
        const text = heroTitle.innerText;
        heroTitle.innerHTML = ''; // Clear existing
        
        const words = text.split(' ');
        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.className = 'word';
            span.innerText = word + ' ';
            // Stagger delay using standard JS approach, to keep inline CSS clean
            span.style.transition = `all 0.8s cubic-bezier(0.23, 1, 0.32, 1) ${0.1 + index * 0.15}s`;
            heroTitle.appendChild(span);
        });

    }

    // 3. Scroll Reveal with Intersection Observer
    const revealElements = document.querySelectorAll('.reveal-up');
    
    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            
            // Close all
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('open');
            });

            // Toggle current
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });

    // 5. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 6. Micro-Interaction: Yacht Card Tilt (Optional 3D effect emulation)
    // Adding slight physics interaction to cards on desktop
    if (window.innerWidth > 1024) {
        const cards = document.querySelectorAll('.yacht-card, .exp-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                // Keep movement subtle for luxury feel
                card.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0)';
            });
        });
    }
    // 7. Preloader Boot Sequence
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            // Start hero animation after preloader
            setTimeout(() => {
                document.querySelectorAll('.hero-title .word').forEach(el => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                });
            }, 500);
        }, 2200); // 2.2s for cinematic boot
    }

    // 8. Custom Cursor (Desktop only)
    if (window.innerWidth > 768 && window.matchMedia("(pointer: fine)").matches) {
        const dot = document.getElementById('cursor-dot');
        const ring = document.getElementById('cursor-ring');
        
        if (dot && ring) {
            let mouseX = window.innerWidth / 2;
            let mouseY = window.innerHeight / 2;
            let ringX = mouseX;
            let ringY = mouseY;
            
            window.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
            });
            
            // Lerp animation for ring
            const render = () => {
                ringX += (mouseX - ringX) * 0.15;
                ringY += (mouseY - ringY) * 0.15;
                ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
                requestAnimationFrame(render);
            };
            requestAnimationFrame(render);
            
            // Hover effect on interactables
            const interactables = document.querySelectorAll('a, button, .yacht-card, .exp-card');
            interactables.forEach(el => {
                el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
                el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
            });
        }
    }

    // 9. Magnetic Buttons (Sticky CTA and Nav CTA)
    const magneticBtns = document.querySelectorAll('.sticky-whatsapp, .nav-cta');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Magnetic pull strength
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.1)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = ''; // reset to CSS defined transform
        });
    });
    // 10. Horizontal Scroll Journey
    const journeyContainer = document.getElementById('journey-container');
    const journeyTrack = document.getElementById('journey-track');
    
    if (journeyContainer && journeyTrack) {
        window.addEventListener('scroll', () => {
            const rect = journeyContainer.getBoundingClientRect();
            // Calculate progress (0 at top, 1 at bottom of the scrollable area)
            // rect.top is 0 when container hits the top of viewport
            // The scrollable distance is container height - viewport height
            const scrollDistance = rect.height - window.innerHeight;
            let scrollProgress = -rect.top / scrollDistance;
            
            if (scrollProgress >= 0 && scrollProgress <= 1) {
                // We are inside the pinned section
                const maxScrollX = journeyTrack.scrollWidth - window.innerWidth;
                journeyTrack.style.transform = `translate3d(-${scrollProgress * maxScrollX}px, 0, 0)`;
            } else if (scrollProgress < 0) {
                journeyTrack.style.transform = `translate3d(0, 0, 0)`;
            } else if (scrollProgress > 1) {
                const maxScrollX = journeyTrack.scrollWidth - window.innerWidth;
                journeyTrack.style.transform = `translate3d(-${maxScrollX}px, 0, 0)`;
            }
        }, { passive: true });
    }

    // 11. Editorial Hover Image Reveal
    const addonItems = document.querySelectorAll('.addon-item');
    const hoverReveal = document.getElementById('hover-image-reveal');
    const hoverImage = document.getElementById('hover-image');
    
    if (addonItems.length > 0 && hoverReveal && hoverImage) {
        let hoverX = window.innerWidth / 2;
        let hoverY = window.innerHeight / 2;
        let targetX = hoverX;
        let targetY = hoverY;
        
        window.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
        });
        
        const renderHover = () => {
            hoverX += (targetX - hoverX) * 0.1;
            hoverY += (targetY - hoverY) * 0.1;
            
            hoverReveal.style.left = `${hoverX}px`;
            hoverReveal.style.top = `${hoverY}px`;
            
            requestAnimationFrame(renderHover);
        };
        requestAnimationFrame(renderHover);
        
        addonItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const imgUrl = item.getAttribute('data-image');
                if (imgUrl) {
                    hoverImage.src = imgUrl;
                    hoverReveal.classList.add('active');
                }
            });
            item.addEventListener('mouseleave', () => {
                hoverReveal.classList.remove('active');
            });
        });
    }

    // 12. Background Audio Toggle
    const bgAudio = document.getElementById('bg-audio');
    const soundToggle = document.getElementById('sound-toggle');
    
    if (bgAudio && soundToggle) {
        const soundText = soundToggle.querySelector('.sound-text');
        let isPlaying = false;

        soundToggle.addEventListener('click', () => {
            if (isPlaying) {
                bgAudio.pause();
                soundToggle.classList.remove('playing');
                soundText.textContent = 'SOUND OFF';
            } else {
                bgAudio.play().catch(error => {
                    console.log('Audio play failed:', error);
                });
                soundToggle.classList.add('playing');
                soundText.textContent = 'SOUND ON';
            }
            isPlaying = !isPlaying;
        });
    }
});
