import { Component, AfterViewInit, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';


import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent implements AfterViewInit {
  constructor (@Inject(PLATFORM_ID) private platformId: Object){

  }


  @ViewChild('finalNav') finalNav!: ElementRef<HTMLElement>;
  @ViewChild('sideLink1') sideLink1!: ElementRef<HTMLElement>;
  @ViewChild('sideLink2') sideLink2!: ElementRef<HTMLElement>;
  @ViewChild('sideLink3') sideLink3!: ElementRef<HTMLElement>;
  @ViewChild('findText') findText!: ElementRef<HTMLElement>;
  @ViewChild('imageContainer') imageContainer!: ElementRef<HTMLElement>;
  @ViewChild('logoAdel') logoAdel!: ElementRef<HTMLElement>;
  @ViewChild('logoShalaby') logoShalaby!: ElementRef<HTMLElement>;
  @ViewChild('orangeTop') orangeTop!: ElementRef<HTMLElement>;
  @ViewChild('orangeBottom') orangeBottom!: ElementRef<HTMLElement>;
  @ViewChild('nextSection') nextSection!: ElementRef<HTMLElement>;


  @ViewChild('laptopSection') laptopSection!: ElementRef<HTMLElement>;


  @ViewChild('img1') img1!: ElementRef<HTMLVideoElement>;
  @ViewChild('img2') img2!: ElementRef<HTMLVideoElement>;
  @ViewChild('img3') img3!: ElementRef<HTMLVideoElement>;
  @ViewChild('img4') img4!: ElementRef<HTMLVideoElement>;
  @ViewChild('img5') img5!: ElementRef<HTMLVideoElement>;

  

  private allVideos: HTMLVideoElement[] = [];
private sections: HTMLElement[] = [];
  private animating: boolean = false;

  ngAfterViewInit(): void {

    gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

    if (!this.imageContainer || !this.img1 || !this.laptopSection) {
      console.error("العناصر غير موجودة! (تأكد من وجود #laptopSection)");
      return;
    }


    this.allVideos = [
      this.img1.nativeElement,
      this.img2.nativeElement,
      this.img3.nativeElement,
      this.img4.nativeElement,
      this.img5.nativeElement 
    ];

    
this.sections = gsap.utils.toArray<HTMLElement>('.full-section'); 

    // ScrollTrigger.observe({
    //   type: "wheel,touch", 
    //   onUp: () => this.goToPreviousSection(),
    //   onDown: () => this.goToNextSection(),
    //   tolerance: 10, 
    //   preventDefault: true
    // });

    this.muteAllVideos(); 


    this.playVideos();


    this.setupScrollSoundControl();


    setInterval(this.forcePlayOnTick.bind(this), 100); 


    this.startIntroAnimation();
    this.entranceAnimation();

gsap.timeline({
  scrollTrigger: {
    trigger: ".next-section",
    start: "top top",
    end: "+=100", 
    scrub: 1,
    pin: true,

  }
})
.to(".imag", { width:"60px", height:"80px" , right: "-20%", top:"3%" })
.to(".logo-shalaby", { opacity: 0 ,  })
.to(".next-section", { overflow:"visible"  })
.to(".logo-shalaby-overlay", { display:"flex",  width: "190px", height: "63px" , marginLeft:"auto", marginRight:"auto",  top:"17%" , marginBottom:"20px"})
.to(".content", { top:"41%" ,  bottom:"auto" , overflow:"hidden", fontSize:"20px"  ,  })
.to(".content p", {  fontSize:"25px"  ,  })
.to(".btn", { top:"32%" ,  bottom:"auto" , overflow:"hidden",   right: "9%" , height:"auto", background:"transparent" , border:"1px solid #ffffff73",  })
.to(".final-nav", { right: "auto", transition: "all 1.5s ease",  })
.to(".product-cards-container", { opacity: 1 });

// ScrollTrigger.create({
//   snap: 2 / (this.sections.length - 1) 
// });
  }

entranceAnimation(): void {
    if (isPlatformBrowser(this.platformId)) {
      gsap.to(".imag", {
        // top: "10vh",
        x: "-52vw",
        y: "15vw",
        // right:"-63%",
        // height: "500px",
        duration: 1.5,
        scrollTrigger: {
          trigger: ".imag",
          start: "top 80%",
          scrub: 1,
        }
      });
      gsap.to(".content", {
        y: "-10vw",
        duration: 1.5,
            Opacity: 1,
        scrollTrigger: {
          trigger: ".imag",
          start: "top 35%",
          scrub: 1,
      
        }
      });

    }

}
goToSection(index: number): void {
    if (this.animating || index < 0 || index >= this.sections.length) return; 

    this.animating = true; 

    gsap.to(window, {
      scrollTo: { y: this.sections[index], autoKill: false },
      duration: 0.5, 
      ease: "power2.inOut",
      onComplete: () => {

        gsap.delayedCall(0.5, () => this.animating = false); 
      }
    });
  }

  goToNextSection(): void {
    const currentSectionIndex = this.getCurrentSectionIndex();
    this.goToSection(currentSectionIndex + 1);
  }

  goToPreviousSection(): void {
    const currentSectionIndex = this.getCurrentSectionIndex();
    this.goToSection(currentSectionIndex - 1);
  }


  getCurrentSectionIndex(): number {
    let index = 0;
    const scrollY = window.scrollY;
    this.sections.forEach((section, i) => {
      if (section.offsetTop <= scrollY + window.innerHeight / 2) {
        index = i;
      }
    });
    return index;
  }




  playVideos(): void {
    try {
      this.allVideos.forEach(video => {
        if (video) {
          video.currentTime = 0;
          video.play().catch(e => console.warn("Video play failed", e));
        }
      });
    } catch(e) {
      console.error("Error playing videos", e);
    }
  }


  setupScrollSoundControl(): void {
    ScrollTrigger.create({
      trigger: this.laptopSection.nativeElement, 
      start: 'top top',
      end: 'bottom top', 

      onLeave: () => this.muteAllVideos(),     
      onEnterBack: () => this.unmuteAllVideos() 
    });
  }

 
  forcePlayOnTick(): void {
    if (!this.img1 || !this.img1.nativeElement) return;

    try {

      if (this.img1.nativeElement.paused) this.img1.nativeElement.play();


      if (this.img2.nativeElement.paused) this.img2.nativeElement.play();
      if (this.img3.nativeElement.paused) this.img3.nativeElement.play();
      if (this.img4.nativeElement.paused) this.img4.nativeElement.play();
      if (this.img5.nativeElement.paused) this.img5.nativeElement.play(); 

    } catch (e) {

    }
  }


  syncVideos(): void {
    try {
      const masterTime = this.img1.nativeElement.currentTime;
      console.log(`Syncing videos to master time: ${masterTime}`);


      this.img2.nativeElement.currentTime = masterTime;
      this.img3.nativeElement.currentTime = masterTime;
      this.img4.nativeElement.currentTime = masterTime;
      this.img5.nativeElement.currentTime = masterTime; 

      this.forcePlayOnTick();

    } catch (e) {
      console.error("Error syncing videos:", e);
    }
  }


  muteAllVideos(): void {
    console.log("Muting videos...");
    this.allVideos.forEach(video => { if (video) video.muted = true });
  }
  unmuteAllVideos(): void { 
    console.log("Unmuting video 1 ONLY...");


    if (this.img2 && this.img2.nativeElement) this.img2.nativeElement.muted = true;
    if (this.img3 && this.img3.nativeElement) this.img3.nativeElement.muted = true;
    if (this.img4 && this.img4.nativeElement) this.img4.nativeElement.muted = true;
    if (this.img5 && this.img5.nativeElement) this.img5.nativeElement.muted = true;


    if (this.img1 && this.img1.nativeElement) {
      this.img1.nativeElement.muted = true;
    }
  }


  startIntroAnimation(): void {


    gsap.set(this.finalNav.nativeElement, { opacity: 0 });
    gsap.set(this.sideLink1.nativeElement, { opacity: 0, y: 10 });
    gsap.set(this.sideLink2.nativeElement, { opacity: 0, y: 10 });
    gsap.set(this.sideLink3.nativeElement, { opacity: 0, y: 10 });
    gsap.set(this.findText.nativeElement, { opacity: 0, y: 10 });
    gsap.set(this.imageContainer.nativeElement, { opacity: 0 });
    gsap.set(this.logoAdel.nativeElement, { opacity: 0, y: 10 });
    gsap.set(this.logoShalaby.nativeElement, { opacity: 0, y: 10 });
    gsap.set([this.img2.nativeElement, this.img3.nativeElement , this.img4.nativeElement, this.img5.nativeElement], { display: 'none', opacity: 0 }); 
    gsap.set(this.orangeTop.nativeElement, { yPercent: -900 });
    gsap.set(this.orangeBottom.nativeElement, { yPercent: 100 });


    const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.6 } });


    tl.to(this.imageContainer.nativeElement, { opacity: 1, duration: 0.3 }, 0.5)
      .add(() => this.unmuteAllVideos(), 0.7) 
      .to([this.sideLink1.nativeElement, this.findText.nativeElement, this.logoAdel.nativeElement],
          { opacity: 1, y: 0, stagger: 0.2 }, 0.7)
      .to(this.sideLink2.nativeElement, { opacity: 1, y: 0 }, 1.5)
      .to(this.sideLink3.nativeElement, { opacity: 1, y: 0 }, 1.7)
      .to(this.imageContainer.nativeElement, {
        top: '50%', 
        height: '300px', 
        duration: 0.8
      }, 2.0)
      .to(this.imageContainer.nativeElement, {
        left: 'auto', 
        width: '100%', 
        duration: 1.0
      }, 3.0)


      .add(() => {
        this.syncVideos();
      }, 3.2) 


      .to([this.img2.nativeElement, this.img3.nativeElement , this.img4.nativeElement, this.img5.nativeElement], { 
        display: 'block',
        opacity: 1,
        duration: 0.5
      }, 3.2) 


      .to(this.logoAdel.nativeElement, { opacity: 0, duration: 0.3 }, 3.0)
      .to(this.logoShalaby.nativeElement, { opacity: 1, y: 0, duration: 0.6 }, 3.5)
      .to(this.orangeBottom.nativeElement, { yPercent: 0, duration: 0.7 }, 3.5)
      .to(this.orangeTop.nativeElement, { yPercent: 0, duration: 0.7 }, 4.0)
      .to(this.finalNav.nativeElement, { opacity: 1, duration: 0.5 }, 4.3);


    tl.to(window, {
      duration: 0, 
      scrollTo: ".next-section",
      delay: 0.5 
    });




    gsap.to(this.logoShalaby.nativeElement, {
      y: () => {
        const logoRect = this.logoShalaby.nativeElement.getBoundingClientRect();
        const initialLogoTopDoc = window.scrollY + logoRect.top;
        const nextSectionRect = this.nextSection.nativeElement.getBoundingClientRect();
        const nextSectionTopDoc = window.scrollY + nextSectionRect.top;
        const targetLogoTopDoc = nextSectionTopDoc + (nextSectionRect.height / 2) - (logoRect.height / 2);
        const translationY = targetLogoTopDoc - initialLogoTopDoc;
        return translationY;
      },
      duration: 1.5,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      left: "auto",
          bottom: "0",
      width: "100%",
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: this.laptopSection.nativeElement,
        start: "bottom top",
        end: "bottom center",
        scrub: 2.0, 
       
      }
      
    });
    
  }









  




} 