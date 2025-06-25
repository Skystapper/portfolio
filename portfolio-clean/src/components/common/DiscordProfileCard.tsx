import { CSSProperties, useEffect, useRef, useState } from 'react';
import styles from './DiscordProfileCard.module.css';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { Icon } from '@iconify/react';
import { profileEffects, avatarDecorations } from './discordAssets';

// Social icons with premium Iconify sets
const socialIcons = [
  {
    name: 'Twitter',
    url: 'https://twitter.com/',
    icon: 'skill-icons:twitter',
    color: '#1DA1F2',
    cursorEffect: 'twitter'
  },
  {
    name: 'Telegram',
    url: 'https://t.me/',
    icon: 'logos:telegram',
    color: '#26A5E4',
    cursorEffect: 'telegram'
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/',
    icon: 'skill-icons:instagram',
    color: '#E4405F',
    cursorEffect: 'instagram'
  },
  {
    name: 'Discord',
    url: 'https://discord.com/users/908657241505280021',
    icon: 'logos:discord-icon',
    color: '#5865F2',
    cursorEffect: 'discord'
  }
];

export default function DiscordProfileCard() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [name, setName] = useState("R.ked");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showEmailOptions, setShowEmailOptions] = useState(false);
  const bioTextRef = useRef<HTMLDivElement>(null);
  const usernameRef = useRef<HTMLHeadingElement>(null);
  const emojiRef = useRef<SVGSVGElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [currentEffectKey, setCurrentEffectKey] = useState('lofi-girl-study-break');
  const [currentAvatarDecoration, setCurrentAvatarDecoration] = useState(avatarDecorations[16]); // default to lofi-girl-study-break and matching decoration
  
  // BIO TEXT MESSAGES
  const bioMessages = [
    "In the end everything exist solely to help us kill some time until we die",
    "Creative coder building immersive web experiences",
    "Turning caffeine into code since 2019",
    "Debugging the universe one line at a time",
    "404: Free time not found"
  ];
  
  // Recipient email address
  const recipientEmail = "skystapper@gmail.com";
  
  // Pre-filled subject and body for email
  const getEmailSubject = () => {
    return `Hey R.ked, I saw your amazing portfolio and wanted to reach out`;
  };
  
  const getEmailBody = () => {
    return `Hi R.ked,

I just checked out your portfolio and I'm really impressed with your work. I particularly liked the animations and interactive elements.

I'd like to discuss a potential project/collaboration. Here's a bit about what I'm looking for:
[Your project details here]

Looking forward to hearing back from you!

Best regards,
${name || "[Your name]"}
${email || "[Your email]"}
`;
  };
  
  // Create mailto URL with encoded subject and body
  const createMailtoUrl = () => {
    const subject = encodeURIComponent(getEmailSubject());
    const body = encodeURIComponent(getEmailBody());
    return `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
  };
  
  // Handle Gmail click - open Gmail compose with pre-filled content
  const handleGmailClick = () => {
    const baseUrl = "https://mail.google.com/mail/?view=cm";
    const to = `&to=${recipientEmail}`;
    const subject = `&su=${encodeURIComponent(getEmailSubject())}`;
    const body = `&body=${encodeURIComponent(getEmailBody())}`;
    
    window.open(`${baseUrl}${to}${subject}${body}`, '_blank');
    setShowEmailOptions(false);
  };
  
  // Handle Outlook click - open Outlook compose with pre-filled content
  const handleOutlookClick = () => {
    const baseUrl = "https://outlook.live.com/mail/0/deeplink/compose";
    const to = `&to=${recipientEmail}`;
    const subject = `&subject=${encodeURIComponent(getEmailSubject())}`;
    const body = `&body=${encodeURIComponent(getEmailBody())}`;
    
    window.open(`${baseUrl}?${to}${subject}${body}`, '_blank');
    setShowEmailOptions(false);
  };
  
  // Handle default mail client click - use mailto protocol
  const handleDefaultMailClick = () => {
    window.location.href = createMailtoUrl();
    setShowEmailOptions(false);
  };
  
  // Toggle email options display
  const toggleEmailOptions = () => {
    setShowEmailOptions(prev => !prev);
  };

  const handleMaximize = () => {
    if (!cardRef.current) return;
    
    setIsMaximized(prev => !prev);
    
    if (!isMaximized) {
      // Maximize animation
      gsap.to(cardRef.current, {
        width: '600px',
        height: 'auto',
        duration: 0.5,
        ease: 'power2.inOut'
      });
      
      // Transform header
      if (headerRef.current) {
        gsap.to(headerRef.current.querySelector('.banner__68edb'), {
          height: '210px',
          minHeight: '210px',
          duration: 0.5,
          ease: 'power2.inOut'
        });
      }
      
      // Transform avatar - Updated position values
      if (avatarRef.current) {
        gsap.to(avatarRef.current, {
          width: '120px',
          height: '120px',
          left: '24px',
          top: '145px',
          duration: 0.5,
          ease: 'power2.inOut'
        });
      }
    } else {
      // Minimize animation
      gsap.to(cardRef.current, {
        width: '300px',
        height: 'auto',
        duration: 0.5,
        ease: 'power2.inOut'
      });
      
      // Transform header back
      if (headerRef.current) {
        gsap.to(headerRef.current.querySelector('.banner__68edb'), {
          height: '105px',
          minHeight: '105px',
          duration: 0.5,
          ease: 'power2.inOut'
        });
      }
      
      // Transform avatar back - Original position values
      if (avatarRef.current) {
        gsap.to(avatarRef.current, {
          width: '80px',
          height: '80px',
          left: '16px',
          top: '61px',
          duration: 0.5,
          ease: 'power2.inOut'
        });
      }
    }
  };

  const handleCloseMaximized = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMaximized(false);
    
    // Run minimize animations
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        width: '300px',
        height: 'auto',
        duration: 0.5,
        ease: 'power2.inOut'
      });
    }
    
    if (headerRef.current) {
      gsap.to(headerRef.current.querySelector('.banner__68edb'), {
        height: '105px',
        minHeight: '105px',
        duration: 0.5,
        ease: 'power2.inOut'
      });
    }
    
    if (avatarRef.current) {
      gsap.to(avatarRef.current, {
        width: '80px',
        height: '80px',
        left: '16px',
        top: '61px',
        duration: 0.5,
        ease: 'power2.inOut'
      });
    }
  };

  // Simple cursor effects without magnetic interference
  const handleSocialIconWrapperHover = (e: React.MouseEvent<HTMLDivElement>, icon: typeof socialIcons[0]) => {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follow');

    if (cursor && follower) {
      // Set specific social platform effect
      cursor.setAttribute('data-effect', 'social-hover');
      follower.setAttribute('data-effect', `social-${icon.cursorEffect}`);
    }
  };

  const handleSocialIconWrapperLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follow');
    
    if (cursor && follower) {
      // Reset cursor effects
      cursor.setAttribute('data-effect', 'default');
      follower.setAttribute('data-effect', 'default');
    }
  };

  // Helper to filter out malformed URLs (e.g., .../intro.png/intro.png)
  function isValidEffectUrl(url: string) {
    const parts = url.split('/');
    if (parts.length < 2) return true;
    const last = parts[parts.length - 1];
    const secondLast = parts[parts.length - 2];
    return last !== secondLast;
  }

  // Helper to get the intro url for a given effect key
  function getIntroUrl(effectKey: string): string | undefined {
    const urls = (profileEffects as Record<string, string[]>)[effectKey] || [];
    return urls.find((url) => url.includes('intro') && isValidEffectUrl(url) && !url.includes('thumbnail'));
  }

  // Handler for banner click: randomize profile effect, but not the current intro
  const handleBannerClick = () => {
    const effectKeys = Object.keys(profileEffects);
    const currentIntro = getIntroUrl(currentEffectKey);
    const filteredKeys = effectKeys.filter((key) => {
      const intro = getIntroUrl(key);
      return intro && intro !== currentIntro;
    });
    if (filteredKeys.length === 0) return; // fallback: do nothing if only one effect
    const randomKey = filteredKeys[Math.floor(Math.random() * filteredKeys.length)];
    setCurrentEffectKey(randomKey);
  };

  // Handler for avatar click: randomize avatar decoration
  const handleAvatarClick = () => {
    let randomUrl = currentAvatarDecoration;
    while (randomUrl === currentAvatarDecoration && avatarDecorations.length > 1) {
      randomUrl = avatarDecorations[Math.floor(Math.random() * avatarDecorations.length)];
    }
    setCurrentAvatarDecoration(randomUrl);
  };

  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(TextPlugin, ScrambleTextPlugin, SplitText, DrawSVGPlugin);
    
    // Ensure the wrapper has the required class for cursor detection
    if (wrapperRef.current) {
      wrapperRef.current.classList.add('discordProfileWrapper');
    }
    
    // Scroll-based animation speed control
    let scrollSpeed = 1;
    let lastScrollY = window.scrollY;
    let scrollDirection = 0;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);
      scrollDirection = currentScrollY > lastScrollY ? 1 : -1;
      
      // Calculate speed multiplier based on scroll velocity
      scrollSpeed = Math.min(1 + (scrollDelta * 0.1), 3);
      
      // Apply speed to iconify elements (if they have CSS animations)
      const iconifyElements = document.querySelectorAll('.iconify');
      iconifyElements.forEach((element: any) => {
        if (element.style) {
          element.style.animationDuration = `${1 / scrollSpeed}s`;
          element.style.animationTimingFunction = 'ease-out';
        }
      });
      
      // Gradually return to normal speed
      setTimeout(() => {
        scrollSpeed = Math.max(scrollSpeed * 0.95, 1);
        iconifyElements.forEach((element: any) => {
          if (element.style) {
            element.style.animationDuration = `${1 / scrollSpeed}s`;
          }
        });
      }, 100);
      
      lastScrollY = currentScrollY;
    };
    
    // Throttled scroll listener
    let scrollTimeout: NodeJS.Timeout;
    const throttledScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 16); // ~60fps
    };
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
      
      // Preload bio message heights to prevent layout shifts
      if (bioTextRef.current) {
      // Force the bio container to take the height of the tallest message
      const tempDiv = document.createElement('div');
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.position = 'absolute';
      tempDiv.style.width = bioTextRef.current.clientWidth + 'px';
      tempDiv.style.fontSize = '14px';
      tempDiv.style.lineHeight = '18px';
      tempDiv.style.padding = '8px';
      document.body.appendChild(tempDiv);
      
      // Find the tallest possible text
      let maxHeight = 0;
      bioMessages.forEach(message => {
        tempDiv.textContent = message;
        const height = tempDiv.clientHeight;
        maxHeight = Math.max(maxHeight, height);
      });
      
      // Clean up
      document.body.removeChild(tempDiv);
      
      // Make sure we never have layout shifts by fixing the height in the CSS
      bioTextRef.current.style.height = '72px';
    }
    
    // USERNAME ANIMATION - SPLITTEXT WITH STAGGER
    if (usernameRef.current) {
      // Reset any previous split
      const split = new SplitText(usernameRef.current, { 
        type: "chars,words",
        charsClass: "char-reveal", 
        wordsClass: "word-reveal" 
      });
      
      // Initial letter animation with stagger
      gsap.from(split.chars, {
        opacity: 0,
        scale: 0,
        y: 80,
        rotationX: 180,
        transformOrigin: "0% 50% -50",
        stagger: 0.05,
        duration: 0.8,
        ease: "back.out(1.7)",
        onComplete: () => {
          // After initial animation, set up a repeating effect
          const tl = gsap.timeline({repeat: -1, repeatDelay: 5});
          
          // Highlight each character
          tl.to(split.chars, {
            color: "#9b59b6",
            textShadow: "0 0 20px rgba(155, 89, 182, 0.8)",
            stagger: {
              each: 0.2,
              from: "start",
              grid: "auto",
              ease: "sine.inOut"
            },
            duration: 0.3, 
            ease: "power4.inOut"
          })
          // Return to original color
          .to(split.chars, {
            color: "white",
            textShadow: "none",
            stagger: {
              each: 0.1,
              from: "end",
              grid: "auto"
            },
            duration: 0.2,
            ease: "power4.inOut"
          }, "+=0.2");
        }
      });
    }
    
    // BIO TEXT ANIMATION - SCRAMBLETEXT
    let currentBioIndex = 0;
    
    const animateBioText = () => {
      if (!bioTextRef.current) return;
      
      // Get next bio message
      const nextIndex = (currentBioIndex + 1) % bioMessages.length;
      const nextMessage = bioMessages[nextIndex];
      currentBioIndex = nextIndex;
      
      // Create a hidden element to test if the text would cause overflow
      const testElement = document.createElement('div');
      testElement.style.visibility = 'hidden';
      testElement.style.position = 'absolute';
      testElement.style.width = bioTextRef.current.clientWidth + 'px';
      testElement.style.fontSize = '14px';
      testElement.style.lineHeight = '18px';
      testElement.style.padding = '8px';
      testElement.textContent = nextMessage;
      document.body.appendChild(testElement);
      
      // Check if there's potential overflow
      const willOverflow = testElement.clientHeight > 72;
      document.body.removeChild(testElement);
      
      // Use ScrambleTextPlugin for an impressive text transition
      gsap.to(bioTextRef.current, {
        duration: 0.9,
        scrambleText: {
          text: nextMessage,
          chars: "0123456789!@#$%^&*()_+<>?:|{}[],./-=",
          speed: 0.4,
          revealDelay: 0.5,
          newClass: "scramble-active"
        },
        ease: "none",
        onComplete: () => {
          // Highlight important words
          if (bioTextRef.current) {
            const text = bioTextRef.current.textContent || "";
            const words = text.split(" ");
            const importantWordIndex = Math.floor(Math.random() * words.length);
            
            const importantWord = words[importantWordIndex];
            const beforeWord = words.slice(0, importantWordIndex).join(" ");
            const afterWord = words.slice(importantWordIndex + 1).join(" ");
            
            // Highlight a random word
            bioTextRef.current.innerHTML = beforeWord + 
              (beforeWord ? " " : "") + 
              `<span class="highlight">${importantWord}</span>` + 
              (afterWord ? " " : "") + 
              afterWord;
              
            // Add scrollbar indicator if text would overflow
            if (willOverflow) {
              bioTextRef.current.style.maskImage = 'linear-gradient(to bottom, black 70%, transparent 98%)';
            } else {
              bioTextRef.current.style.maskImage = 'none';
            }
              
            // Add CSS for highlight
            const style = document.createElement('style');
            style.innerHTML = `
              .highlight {
                color: #ff9ff3;
                font-weight: bold;
                text-shadow: 0 0 10px rgba(255, 159, 243, 0.5);
              }
              .scramble-active {
                color: #74b9ff;
              }
            `;
            document.head.appendChild(style);
          }
          
          // Schedule next animation
          gsap.delayedCall(5, animateBioText);
        }
      });
    };
    
    // Start the bio animation loop
    gsap.delayedCall(2, animateBioText);
    
    // PLACEHOLDER TEXT - TEXT PLUGIN WITH TYPEWRITER
    const placeholderMessages = [
      "Message @R.ked",
      "Send project inquiry",
      "Let's connect",
      "Discuss collaboration",
      "Share your ideas"
    ];
    
    let currentPlaceholderIndex = 0;
    
    const animatePlaceholder = () => {
      if (!placeholderRef.current) return;
      
      const nextIndex = (currentPlaceholderIndex + 1) % placeholderMessages.length;
      const nextMessage = placeholderMessages[nextIndex];
      currentPlaceholderIndex = nextIndex;
      
      // Realistic typewriter sequence with TextPlugin
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.delayedCall(4, animatePlaceholder);
        }
      });
      
      // Step 1: Clear existing text with typewriter delete effect
      tl.to(placeholderRef.current, {
        duration: 1.5,
        text: {
          value: "",
          delimiter: "",
          speed: 10
        },
        ease: "none"
      });
      
      // Step 2: Type out new message with cursor blinking effect
      tl.to(placeholderRef.current, {
        duration: 2,
        text: {
          value: nextMessage + " |",
          type: "diff",
          speed: 40,
          padSpace: true,
          delimiter: ""
        },
        ease: "none",
        repeat: 4,
        repeatRefresh: true,
        onRepeat: () => {
          // Toggle cursor visibility for blinking effect
          const currentText = placeholderRef.current?.textContent || "";
          if (currentText.endsWith(" |")) {
            placeholderRef.current!.textContent = currentText.substring(0, currentText.length - 2);
          } else {
            placeholderRef.current!.textContent = currentText + " |";
          }
        }
      });
      
      // Step 3: Remove cursor from last character
      tl.to(placeholderRef.current, {
        text: nextMessage,
        duration: 0.1
      });
    };
    
    // Start the placeholder animation
    gsap.delayedCall(1, animatePlaceholder);
    
    // EMOJI SVG ANIMATION
    const emojis = [
      // Happy face
      { d: "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14 M9 9H9.01 M15 9H15.01" },
      // Sad face
      { d: "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z M8 15C8 15 9.5 13 12 13C14.5 13 16 15 16 15 M9 9H9.01 M15 9H15.01" },
      // Surprised face
      { d: "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z M12 15.5C12.8284 15.5 13.5 14.8284 13.5 14C13.5 13.1716 12.8284 12.5 12 12.5C11.1716 12.5 10.5 13.1716 10.5 14C10.5 14.8284 11.1716 15.5 12 15.5Z M9 9H9.01 M15 9H15.01" },
      // Wink face
      { d: "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14 M9 9H9.01 M15 9C15 9 15 9.2 15 9.5C15 9.8 14.8 10 14.5 10C14.2 10 14 9.8 14 9.5C14 9.2 14.2 9 14.5 9C14.8 9 15 9 15 9Z" },
      // Cool face
      { d: "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14 M7 8C7 8 9 10 11 8 M13 8C13 8 15 10 17 8" }
    ];
    
    let currentEmojiIndex = 0;
    
    const animateEmoji = () => {
      if (!emojiRef.current) return;
      
      currentEmojiIndex = (currentEmojiIndex + 1) % emojis.length;
      const nextEmoji = emojis[currentEmojiIndex];
      
      // Fun pop and rotate transition
      gsap.to(emojiRef.current, {
        scale: 0,
        rotation: 360,
        opacity: 0,
        duration: 0.4,
        ease: "back.in(1.7)",
        onComplete: () => {
          // Update svg path
          const paths = emojiRef.current?.querySelectorAll('path');
          if (paths && paths.length > 0) {
            paths[0].setAttribute('d', nextEmoji.d);
          }
          
          // Pop back in
          gsap.to(emojiRef.current, {
            scale: 1.2,
            rotation: 0,
            opacity: 1,
            duration: 0.6,
            ease: "elastic.out(1, 0.3)",
            onComplete: () => {
              // Scale back to normal
              gsap.to(emojiRef.current, {
                scale: 1,
                duration: 0.2
              });
            }
          });
        }
      });
      
      // Schedule next animation
      gsap.delayedCall(7, animateEmoji);
    };
    
    // Start emoji animation
    gsap.delayedCall(3, animateEmoji);
    
    // Cleanup function for scroll listener
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <div className={styles.discordProfileWrapper} ref={wrapperRef}>
      {/* Add SVG masks */}
      <svg style={{position: 'absolute', pointerEvents: 'none', top: '-999999px', left: '-999999px'}} aria-hidden="true">
            <defs>
                <mask id="svg-mask-avatar-default" maskContentUnits="objectBoundingBox" viewBox="0 0 1 1">
                    <circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle>
          </mask>
          <mask id="svg-mask-avatar-status-round-16" maskContentUnits="objectBoundingBox" viewBox="0 0 1 1">
                    <circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle>
                    <circle fill="black" cx="0.8125" cy="0.8125" r="0.3125"></circle>
          </mask>
          <mask id="svg-mask-avatar-decoration-status-round-16" maskContentUnits="objectBoundingBox" viewBox="0 0 1 1">
                    <rect fill="white" x="0" y="0" width="100%" height="100%"></rect>
                    <circle fill="black" cx="0.7604166666666667" cy="0.7604166666666667" r="0.2604166666666667"></circle>
          </mask>
          <mask id="svg-mask-avatar-status-round-80" maskContentUnits="objectBoundingBox" viewBox="0 0 1 1">
                    <circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle>
                    <circle fill="black" cx="0.85" cy="0.85" r="0.175"></circle>
          </mask>
          <mask id="svg-mask-avatar-decoration-status-round-80" maskContentUnits="objectBoundingBox" viewBox="0 0 1 1">
                    <rect fill="white" x="0" y="0" width="100%" height="100%"></rect>
                    <circle fill="black" cx="0.7916666666666667" cy="0.7916666666666667" r="0.14583333333333334"></circle>
          </mask>
          <mask id="svg-mask-status-online" maskContentUnits="objectBoundingBox" viewBox="0 0 1 1">
                    <circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle>
                </mask>
          <mask id="svg-mask-avatar-status-round-120" maskContentUnits="objectBoundingBox" viewBox="0 0 1 1">
            <circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle>
            <circle fill="black" cx="0.8333333333333334" cy="0.8333333333333334" r="0.16666666666666666"></circle>
          </mask>
            </defs>
        </svg>
      <div className={styles.previewsContainerInner_c50f62}>
        <div className={styles.column__5a2c6}>
          <div 
            ref={cardRef}
            className={`${styles.outer_c0bea0} ${styles.themeDark} ${styles.themeDarker} ${styles.imagesDark} ${styles.userProfilePopout} ${styles.container__5a2c6} ${isMaximized ? styles.maximized : ''}`} 
            style={{
              "--profile-gradient-primary-color": "hsla(271, 82.2%, 8.8%, 0.95)", 
              "--profile-gradient-secondary-color": "hsla(270, 100%, 66.9%, 0.8)", 
              "--profile-gradient-overlay-color": "rgba(0, 0, 0, 0.6)", 
              "--profile-gradient-button-color": "hsla(267, 18.9%, 41.6%, 1)",
              transformStyle: "preserve-3d",
              perspective: "1000px",
              border: "none",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
              borderRadius: "12px",
              overflow: "hidden",
              width: "300px",
              transition: "width 0.5s ease"
            } as CSSProperties}
          >
            <div className={styles.inner_c0bea0}>
              <header ref={headerRef} className={styles.header__5a2c6}>
                <svg className={styles.mask__68edb} viewBox={isMaximized ? "0 0 600 210" : "0 0 300 105"} style={{
                  minWidth: isMaximized ? "600px" : "300px", 
                  minHeight: isMaximized ? "210px" : "105px"
                }}>
                  <mask id={isMaximized ? "uid_max" : "uid_min"}>
                                    <rect fill="white" x="0" y="0" width="100%" height="100%"></rect>
                    <circle fill="black" cx={isMaximized ? "84" : "56"} cy={isMaximized ? "205" : "101"} r={isMaximized ? "68" : "46"}></circle>
                                </mask>
                  <foreignObject x="0" y="0" width="100%" height="100%" overflow="visible" mask={`url(#${isMaximized ? "uid_max" : "uid_min"})`}>
                    <div className={styles.banner__68edb} style={{
                      height: isMaximized ? "210px" : "105px",
                      minHeight: isMaximized ? "210px" : "105px"
                    }} onClick={handleBannerClick}></div>
                                </foreignObject>
                            </svg>
                
                {isMaximized && (
                  <div className={styles.closeButton} onClick={handleCloseMaximized}>
                    <Icon 
                      icon="material-symbols:close-rounded" 
                      width="24" 
                      height="24" 
                      style={{ color: 'white' }}
                    />
                  </div>
                )}
                
                <div ref={avatarRef} className={styles.avatar_d28e10} onClick={handleAvatarClick} style={{cursor: 'pointer'}}>
                  <div className={`${styles.wrapper__44b0c} ${isMaximized ? styles.withReactReply__75742 : ''}`} role="img" aria-label="r.ked, Online" style={{
                    width: isMaximized ? "120px" : "80px",
                    height: isMaximized ? "120px" : "80px"
                  }}>
                    <svg 
                      width={isMaximized ? "162" : "108"} 
                      height={isMaximized ? "144" : "96"} 
                      viewBox={`0 0 ${isMaximized ? "162" : "108"} ${isMaximized ? "144" : "96"}`} 
                      className={styles.avatarDecoration__44b0c}
                      style={{ zIndex: 1 }}
                    >
                      <foreignObject x="0" y="0" width={isMaximized ? "512" : "96"} height={isMaximized ? "512" : "96"} mask={`url(#svg-mask-avatar-decoration-status-round-${isMaximized ? "120" : "80"})`}>
                        <div className={styles.avatarStack__44b0c}>
                          <img alt=" " src={`${currentAvatarDecoration}?size=${isMaximized ? "512" : "96"}&passthrough=true`} style={{
                            width: isMaximized ? "144px" : "96px",
                            height: isMaximized ? "144px" : "96px"
                          }} />
                        </div>
                      </foreignObject>
                    </svg>
                    <svg width={isMaximized ? "138" : "92"} height={isMaximized ? "138" : "92"} viewBox={`0 0 ${isMaximized ? "138" : "92"} ${isMaximized ? "138" : "92"}`} className={`${styles.mask__44b0c} ${styles.svg__44b0c}`}>
                      <foreignObject x="0" y="0" width={isMaximized ? "120" : "80"} height={isMaximized ? "120" : "80"} mask={`url(#svg-mask-avatar-status-round-${isMaximized ? "120" : "80"})`}>
                        <div className={styles.avatarStack__44b0c}>
                          <img alt=" " className={styles.avatar__44b0c} aria-hidden="true" src={`https://cdn.discordapp.com/avatars/908657241505280021/a_771c5b89e3e9ab01ff39200bcf0d8a79.gif?size=${isMaximized ? "128" : "80"}`} />
                                            </div>
                                        </foreignObject>
                      <circle fill="black" r={isMaximized ? "20" : "14"} cx={isMaximized ? "100" : "68"} cy={isMaximized ? "100" : "68"} style={{opacity: 0.45}}></circle>
                      <rect 
                        width={isMaximized ? "24" : "16"} 
                        height={isMaximized ? "24" : "16"} 
                        x={isMaximized ? "88" : "60"} 
                        y={isMaximized ? "88" : "60"} 
                        fill="#43a25a" 
                        mask="url(#svg-mask-status-online)" 
                        className={styles.pointerEvents__44b0c}
                        style={{ zIndex: 3 }}
                      ></rect>
                                    </svg>
                                </div>
                            </div>
                        </header>
              
              <div ref={bodyRef} className={styles.body__5be3e}>
                <div className={styles.container__63ed3}>
                  <div className={styles.usernameRow__63ed3}>
                    <h2 
                      ref={usernameRef}
                      className={`${styles.defaultColor__4bd52} ${styles['heading-lg/bold_cf4812']} ${styles.defaultColor__5345c} ${styles.nickname__63ed3}`} 
                      data-text-variant="heading-lg/bold"
                    >R.ked</h2>
                                </div>
                  <div className={styles.tags__63ed3}>
                    <div className={`${styles.info_f4bc97} ${styles.userTag__63ed3}`}>
                      <span className={styles.userTagUsername__63ed3}>r.ked</span>
                                    </div>
                    <div className={styles.container__8061a} aria-label="User Badges" role="group">
                                        <div aria-label="Originally known as R.ked#1207">
                        <a className={`${styles.anchor_edefb8} ${styles.anchorUnderlineOnHover_edefb8}`} role="button" tabIndex={0}>
                          <img alt=" " aria-hidden="true" className={styles.badge__8061a} 
                                src="https://cdn.discordapp.com/badge-icons/6de6d34650760ba5551a79732e98ed60.png" />
                                            </a>
                                        </div>
                      <span style={{display: "none"}}></span>
                                    </div>
                                </div>
                            </div>
                            <div>
                  <div 
                    ref={bioTextRef}
                    className={styles['text-sm/normal_cf4812']}
                  >
                                    In the end everything exist solely to help us kill some time until we die
                                </div>
                            </div>
                
                {isMaximized && (
                  <div className={styles.contactForm}>
                    <div className={styles.emailOptionsWrapper}>
                      <button 
                        type="button" 
                        className={`${styles.emailProviderButton} ${styles.gmailButton} emailProviderButton`}
                        onClick={handleGmailClick}
                      >
                        <Icon icon="logos:google-gmail" width="20" height="20" />
                        <span>Mail with Gmail</span>
                      </button>
                      
                      <button 
                        type="button" 
                        className={`${styles.emailProviderButton} emailProviderButton`}
                        onClick={handleOutlookClick}
                      >
                        <Icon icon="logos:microsoft-icon" width="20" height="20" />
                        <span>Mail with Outlook</span>
                      </button>
                      
                      <button 
                        type="button" 
                        className={`${styles.emailProviderButton} emailProviderButton`}
                        onClick={handleDefaultMailClick}
                      >
                        <Icon icon="material-symbols:alternate-email" width="20" height="20" />
                        <span>Use default mail app</span>
                      </button>
                    </div>

                    <div className={styles.dividerText}>
                      <span>or connect via</span>
                    </div>
                    
                    <div className={styles.socialIconsGrid}>
                      {socialIcons.map((icon, index) => (
                        <a 
                          key={index}
                          href={icon.url} 
                          className={`${styles.socialIcon} socialIcon`}
                          style={{ 
                            '--icon-color': icon.color, 
                            borderColor: `${icon.color}20` 
                          } as CSSProperties}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div
                            className={`${styles.iconWrapper} DiscordProfileCard_iconWrapper__v9Tuo`}
                            onMouseEnter={(e) => handleSocialIconWrapperHover(e, icon)}
                            onMouseLeave={handleSocialIconWrapperLeave}
                          >
                            <Icon 
                              icon={icon.icon} 
                              width="32" 
                              height="32" 
                              className={styles.iconify}
                            />
                          </div>
                          <span style={{ color: icon.color }}>{icon.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                        </div>
              
              <footer className={styles.footer__5be3e}>
                <div className={styles.container_a99829} style={{ border: "none", background: "rgba(97, 23, 167, 0.5)" }} onClick={handleMaximize}>
                  <div 
                    ref={placeholderRef}
                    className={styles.placeholder__1b31f}
                  >
                    Message @R.ked
                  </div>
                  <div className={styles.emojiButton}>
                    <svg 
                      ref={emojiRef}
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 9H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15 9H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </div>
                        </footer>
              
              <div className={styles.profileEffects__01370}>
                <div 
                  className={styles.inner__01370}
                  key={currentEffectKey}
                >
                  {(((profileEffects as Record<string, string[]>)[currentEffectKey] || [])
                    .filter((url: string) => !url.includes('thumbnail'))
                    .filter(isValidEffectUrl)
                    .sort((a: string, b: string) => {
                      const aIntro = a.includes('intro');
                      const bIntro = b.includes('intro');
                      if (aIntro && !bIntro) return -1;
                      if (!aIntro && bIntro) return 1;
                      return 0;
                    })
                  ).map((url: string) => (
                    <img
                      key={`${currentEffectKey}-${url}`}
                      alt={currentEffectKey + ' effect'}
                      src={url}
                        className={styles.effect__01370} 
                    style={{top: "0px", left: "0px"}} 
                  />
                  ))}
                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  );
} 