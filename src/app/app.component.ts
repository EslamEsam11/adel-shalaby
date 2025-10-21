import { Component, AfterViewInit, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

// 1. (تعديل) نستدعي الإضافتين
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // <-- إضافة ضرورية

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

  // --- (ViewChilds للعناصر العادية) ---
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

  // (جديد) بنجيب السكشن نفسه عشان نراقبه
  @ViewChild('laptopSection') laptopSection!: ElementRef<HTMLElement>;

  // --- (ViewChilds للفيديوهات) ---
  @ViewChild('img1') img1!: ElementRef<HTMLVideoElement>;
  @ViewChild('img2') img2!: ElementRef<HTMLVideoElement>;
  @ViewChild('img3') img3!: ElementRef<HTMLVideoElement>;
  @ViewChild('img4') img4!: ElementRef<HTMLVideoElement>;
  @ViewChild('img5') img5!: ElementRef<HTMLVideoElement>;

  
  // (جديد) مصفوفة لحفظ كل الفيديوهات
  private allVideos: HTMLVideoElement[] = [];
private sections: HTMLElement[] = [];
  private animating: boolean = false;

  ngAfterViewInit(): void {
    // 2. (تعديل) نسجل الإضافتين
    gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

    if (!this.imageContainer || !this.img1 || !this.laptopSection) {
      console.error("العناصر غير موجودة! (تأكد من وجود #laptopSection)");
      return;
    }

    // (جديد) نجمع الفيديوهات في مصفوفة لسهولة التحكم
    this.allVideos = [
      this.img1.nativeElement,
      this.img2.nativeElement,
      this.img3.nativeElement,
      this.img4.nativeElement,
      this.img5.nativeElement // تمت إضافة الخامس
    ];

    
this.sections = gsap.utils.toArray<HTMLElement>('.full-section'); // اسم الكلاس بتاع السكاشن

    // ScrollTrigger.observe({
    //   type: "wheel,touch", // اسمع للماوس واللمس
    //   onUp: () => this.goToPreviousSection(),
    //   onDown: () => this.goToNextSection(),
    //   tolerance: 10, // مسافة صغيرة قبل ما يعتبرها حركة
    //   preventDefault: true // (مهم) يمنع السكرول الطبيعي
    // });
    // 3. (تعديل) يجب كتم صوت جميع الفيديوهات لضمان التشغيل التلقائي
    this.muteAllVideos(); // <-- دالة جديدة لضمان كتم الكل

    // 4. (تعديل) نشغل كل الفيديوهات (مهم عشان المتصفح يوقفهم)
    this.playVideos();

    // 5. (جديد) نجهز مراقب السكرول (عشان الصوت)
    this.setupScrollSoundControl();

    // 6. (تعديل) نستخدم "setInterval" ولكن بدالة جديدة
    setInterval(this.forcePlayOnTick.bind(this), 100); // (100 ميللي ثانية = 10 مرات في الثانية)

    // 7. نبدأ الأنيميشن الرئيسي
    this.startIntroAnimation();
    this.entranceAnimation();

gsap.timeline({
  scrollTrigger: {
    trigger: ".next-section",
    start: "top top",
    end: "+=10", // ثبت السكشن لمسافة 2000 بكسل من السكرول
    scrub: 1,
    pin: true,
     // <--- ثبت السكشن ده
    // عشان ميضيفش مسافة وهمية بعده
  }
})
.to(".imag", { width:"60px", height:"80px" , right: "-5%", top:"7%" })
.to(".logo-shalaby", { opacity: 0 ,  })
.to(".logo-shalaby-overlay", { display:"flex",  width: "200px", height: "80px" , marginLeft:"auto", marginRight:"auto",  })
.to(".content", { top:"40%" ,  bottom:"auto" , overflow:"hidden",   })
.to(".btn", { top:"32%" ,  bottom:"auto" , overflow:"hidden",   right: "25%" , height:"auto", background:"transparent" , border:"1px solid #ffffff73",  })
.to(".final-nav", { right: "auto", transition: "all 1.5s ease",  })
.to(".product-cards-container", { opacity: 1 });

// ScrollTrigger.create({
//   snap: 2 / (this.sections.length - 1) // اقفز بنسبة كل سكشن
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
          start: "top 80%",
          scrub: 1,
      
        }
      });

    }

}
goToSection(index: number): void {
    if (this.animating || index < 0 || index >= this.sections.length) return; // لو الأنيميشن شغال أو الرقم غلط، متعملش حاجة

    this.animating = true; // علّم إن الأنيميشن بدأ

    gsap.to(window, {
      scrollTo: { y: this.sections[index], autoKill: false },
      duration: 0.5, // مدة حركة القفز
      ease: "power2.inOut",
      onComplete: () => {
        // لما الأنيميشن يخلص، اسمح بحركة جديدة
        gsap.delayedCall(0.5, () => this.animating = false); // استنى نص ثانية زيادة
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

  // دالة بسيطة لمعرفة السكشن الحالي (ممكن تحتاج تعديل حسب تصميمك)
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



  // (جديد) دالة تشغيل الفيديوهات
  playVideos(): void {
    try {
      this.allVideos.forEach(video => {
        if (video) {
          video.currentTime = 0; // نبدأ من الصفر
          video.play().catch(e => console.warn("Video play failed", e));
        }
      });
    } catch(e) {
      console.error("Error playing videos", e);
    }
  }

  // (جديد) دالة مراقبة السكرول للصوت
  setupScrollSoundControl(): void {
    ScrollTrigger.create({
      trigger: this.laptopSection.nativeElement, // راقب السكشن ده
      start: 'top top',
      end: 'bottom top', // أول ما يخرج من فوق

      onLeave: () => this.muteAllVideos(),     // لما نخرج -> اكتم الصوت
      onEnterBack: () => this.unmuteAllVideos() // لما نرجع -> افتح الصوت (الفيديو الأول فقط حسب الكود الحالي)
    });
  }

  // (تعديل) الدالة دي هتجبر الفيديوهات تشتغل (من غير ما تلمس الوقت)
  forcePlayOnTick(): void {
    if (!this.img1 || !this.img1.nativeElement) return;

    try {
      // 1. (مهم جداً) بنتأكد إن الفيديو الرئيسي شغال
      if (this.img1.nativeElement.paused) this.img1.nativeElement.play();

      // 2. (مهم جداً) بنتأكد إن باقي الفيديوهات شغالة
      if (this.img2.nativeElement.paused) this.img2.nativeElement.play();
      if (this.img3.nativeElement.paused) this.img3.nativeElement.play();
      if (this.img4.nativeElement.paused) this.img4.nativeElement.play();
      if (this.img5.nativeElement.paused) this.img5.nativeElement.play(); // تمت إضافة الخامس

    } catch (e) {
      // (عادي يحصل أخطاء بسيطة هنا لو الفيديو لسه بيحمل)
    }
  }

  // (تعديل) الدالة دي هتظبط الوقت (مرة واحدة بس)
  syncVideos(): void {
    try {
      const masterTime = this.img1.nativeElement.currentTime;
      console.log(`Syncing videos to master time: ${masterTime}`);

      // 1. طبّق الوقت ده على باقي الفيديوهات (مرة واحدة)
      this.img2.nativeElement.currentTime = masterTime;
      this.img3.nativeElement.currentTime = masterTime;
      this.img4.nativeElement.currentTime = masterTime;
      this.img5.nativeElement.currentTime = masterTime; // تمت إضافة الخامس

      // 2. (احتياطي) نتأكد إنهم شغالين
      this.forcePlayOnTick();

    } catch (e) {
      console.error("Error syncing videos:", e);
    }
  }

  // دوال التحكم في الصوت (كما هي في الكود المرسل)
  muteAllVideos(): void {
    console.log("Muting videos...");
    this.allVideos.forEach(video => { if (video) video.muted = true });
  }
  unmuteAllVideos(): void { // هذه الدالة تفتح صوت الفيديو الأول فقط
    console.log("Unmuting video 1 ONLY...");

    // نتأكد إن الباقي مقفول
    if (this.img2 && this.img2.nativeElement) this.img2.nativeElement.muted = true;
    if (this.img3 && this.img3.nativeElement) this.img3.nativeElement.muted = true;
    if (this.img4 && this.img4.nativeElement) this.img4.nativeElement.muted = true;
    if (this.img5 && this.img5.nativeElement) this.img5.nativeElement.muted = true; // تمت إضافة الخامس

    // نفتح الفيديو الأول بس
    if (this.img1 && this.img1.nativeElement) {
      this.img1.nativeElement.muted = false;
    }
  }


  startIntroAnimation(): void {

    // ... (كل كود الـ .set() كما هو مع إضافة img5)
    gsap.set(this.finalNav.nativeElement, { opacity: 0 });
    gsap.set(this.sideLink1.nativeElement, { opacity: 0, y: 10 });
    gsap.set(this.sideLink2.nativeElement, { opacity: 0, y: 10 });
    gsap.set(this.sideLink3.nativeElement, { opacity: 0, y: 10 });
    gsap.set(this.findText.nativeElement, { opacity: 0, y: 10 });
    gsap.set(this.imageContainer.nativeElement, { opacity: 0 });
    gsap.set(this.logoAdel.nativeElement, { opacity: 0, y: 10 });
    gsap.set(this.logoShalaby.nativeElement, { opacity: 0, y: 10 });
    gsap.set([this.img2.nativeElement, this.img3.nativeElement , this.img4.nativeElement, this.img5.nativeElement], { display: 'none', opacity: 0 }); // تمت إضافة الخامس
    gsap.set(this.orangeTop.nativeElement, { yPercent: -100 });
    gsap.set(this.orangeBottom.nativeElement, { yPercent: 100 });

    // إنشاء الـ Timeline
    const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.6 } });

    // ... (كل الـ Timeline بتاع الأنيميشن كما هو مع تعديل التوقيتات)
    tl.to(this.imageContainer.nativeElement, { opacity: 1, duration: 0.3 }, 0.5)
      .add(() => this.unmuteAllVideos(), 0.7) // فتح صوت الفيديو الأول
      .to([this.sideLink1.nativeElement, this.findText.nativeElement, this.logoAdel.nativeElement],
          { opacity: 1, y: 0, stagger: 0.2 }, 0.7)
      .to(this.sideLink2.nativeElement, { opacity: 1, y: 0 }, 1.5)
      .to(this.sideLink3.nativeElement, { opacity: 1, y: 0 }, 1.7)
      .to(this.imageContainer.nativeElement, {
        top: '50%', // (من الكود المرسل)
        height: '300px', // (من الكود المرسل)
        duration: 0.8
      }, 2.0)
      .to(this.imageContainer.nativeElement, {
        left: 'auto', // (من الكود المرسل)
        width: '100%', // (من الكود المرسل)
        duration: 1.0
      }, 3.0)

      // --- (هنا التعديل) ---
      // 1. نضيف استدعاء دالة المزامنة
      .add(() => {
        this.syncVideos();
      }, 3.2) // 2. (تعديل التوقيت) ليطابق لحظة الظهور

      // 3. هذا هو السطر الصحيح لإظهارهم
      .to([this.img2.nativeElement, this.img3.nativeElement , this.img4.nativeElement, this.img5.nativeElement], { // تمت إضافة الخامس
        display: 'block',
        opacity: 1,
        duration: 0.5
      }, 3.2) // 4. (تعديل التوقيت)
      // --- (نهاية التعديل) ---

      .to(this.logoAdel.nativeElement, { opacity: 0, duration: 0.3 }, 3.0)
      .to(this.logoShalaby.nativeElement, { opacity: 1, y: 0, duration: 0.6 }, 3.5)
      .to(this.orangeBottom.nativeElement, { yPercent: 0, duration: 0.7 }, 3.5)
      .to(this.orangeTop.nativeElement, { yPercent: 0, duration: 0.7 }, 4.0)
      .to(this.finalNav.nativeElement, { opacity: 1, duration: 0.5 }, 4.3);

    // ###################################################
    // ### (هذا هو التعديل المطلوب لـ "سحبة واحدة") ###
    // ###################################################
    tl.to(window, {
      duration: 0, // <-- المدة صفر تعني "فوري"
      scrollTo: ".next-section",
      delay: 0.5 // <-- ممكن تقلل أو تلغي التأخير ده لو عايز
    });
    // ###################################################


    // (أنيميشن اللوجو المرتبط بالسكرول - بدون تغيير)
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
        scrub: 2.0, // (ده التوقيت اللي إنت كاتبه)
        // markers: true,
      }
    });
  }









  




} // نهاية الكلاس (تأكد من عدم وجود كود إضافي هنا بالخطأ)