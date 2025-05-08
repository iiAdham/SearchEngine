import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from './services/notification.service';
declare var FinisherHeader: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'SearchEngine';
  loading: boolean = true;
  theme: string = 'light';
  initialized: boolean = false;
  isSidebarOpen: boolean = false;
  isSideMenuOpen: boolean = false;
  isSettingsOpen: boolean = false;
  duaas: string[] = [
    'اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
    'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ',
    'اللَّهُمَّ ثَبِّتْنِي بِالْقَوْلِ الثَّابِتِ فِي الْحَيَاةِ الدُّنْيَا وَفِي الْآخِرَةِ',
    'اللَّهُمَّ اجْعَلِ الْقُرْآنَ رَبِيعَ قَلْبِي وَنُورَ صَدْرِي وَجَلَاءَ حُزْنِي وَذَهَابَ هَمِّي',
    'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ، وَغَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ',
    'اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي',
    'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ',
    'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْفَقْرِ وَالْقِلَّةِ وَالذِّلَّةِ، وَأَعُوذُ بِكَ مِنْ أَنْ أَظْلِمَ أَوْ أُظْلَمَ',
    'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى',
    'اللَّهُمَّ إِنِّي أَسْأَلُكَ رِضَاكَ وَالْجَنَّةَ، وَأَعُوذُ بِكَ مِنْ سَخَطِكَ وَالنَّارِ',
    'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ زَوَالِ نِعْمَتِكَ، وَتَحَوُّلِ عَافِيَتِكَ، وَفُجَاءَةِ نِقْمَتِكَ، وَجَمِيعِ سَخَطِكَ',
    'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْبُخْلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ، وَأَعُوذُ بِكَ مِنْ أَنْ نُرَدَّ إِلَى أَرْذَلِ الْعُمُرِ، وَأَعُوذُ بِكَ مِنْ فِتْنَةِ الدُّنْيَا، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ',
    'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْهَرَمِ، وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، وَأَعُوذُ بِكَ مِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ',
    'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ',
    'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي',
    'اللَّهُمَّ اسْتُرْ عَوْرَاتِي، وَآمِنْ رَوْعَاتِي، وَاحْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي، وَعَنْ يَمِينِي وَعَنْ شِمَالِي، وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي',
    'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ، وَالْمُعَافَاةَ الدَّائِمَةَ فِي الدِّينِ وَالدُّنْيَا وَالآخِرَةِ',
    'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي، وَآمِنْ رَوْعَاتِي',
    'اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي، وَعَنْ يَمِينِي وَعَنْ شِمَالِي، وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي'
  ];

  // Theme configuration settings
  lightThemeConfig: any = {
    background: '#8F87F1',
    particles: [
      "#F7374F",
      "#FFF2F2",
      "#FFD0C7",
      "#E69DB8"
    ]
  };

  darkThemeConfig: any = {
    background: '#201e30',
    particles: [
      "#fbfcca",
      "#d7f3fe",
      "#ffd0a7"
    ]
  };

  constructor(private toastr: ToastrService, private notificationService: NotificationService) { }

  showRandomDuaa() {
    const randomIndex = Math.floor(Math.random() * this.duaas.length);
    const duaa = this.duaas[randomIndex];
    setTimeout(() => {
      this.notificationService.addNotification('دعاء اليوم', duaa);
    }, 5000);
  }

  getRandomInterval(): number {
    const min = 60000; // 1 minute Minumum
    const max = 90000; // 1.5 minute Maximum
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  ngOnInit(): void {
    this.showRandomDuaa();

    // Optionally, keep showing a new duaa every 2–5 minutes randomly
    setInterval(() => {
      this.showRandomDuaa();
    }, this.getRandomInterval());

    setInterval(() => {
      this.loading = false;
    }, 1000);

    // Load saved theme configurations
    this.loadThemeSettings();

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.theme = savedTheme;
    } else {
      this.theme = 'light'; // Light as default
    }

    const dot = document.querySelector('.cursor-dot') as HTMLElement;

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;

    if (!this.initialized) {
      dot.style.top = `-20px`;
      dot.style.left = `-20px`;
    }

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    if (!this.initialized) {
      dot.style.top = `0`;
      dot.style.left = `0`;
      this.initialized = true;
    }
    const animate = () => {
      dot.style.top = `0`;
      dot.style.left = `0`;
      dotX += (mouseX - dotX) * 0.1; // control lag here (0.1 is 10%)
      dotY += (mouseY - dotY) * 0.1;
      dot.style.transform = `translate(${dotX}px, ${dotY}px)`;

      requestAnimationFrame(animate);
    };

    animate();
  }

  loadThemeSettings(): void {
    const savedLightTheme = localStorage.getItem('lightThemeSettings');
    const savedDarkTheme = localStorage.getItem('darkThemeSettings');

    if (savedLightTheme) {
      this.lightThemeConfig = JSON.parse(savedLightTheme);
    }

    if (savedDarkTheme) {
      this.darkThemeConfig = JSON.parse(savedDarkTheme);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initParticleEffect();
    }, 1000);
  }

  @ViewChild('transitionOverlay', { static: false }) transitionOverlay!: ElementRef;

  // Toggle Theme
  toggleTheme() {
    const overlay = this.transitionOverlay.nativeElement as HTMLElement;

    overlay.style.setProperty('--overlay-color', this.theme === 'light' ? '#201e30' : 'var(--main-color)');
    overlay.style.zIndex = '9999';
    overlay.style.opacity = '1';
    overlay.style.transform = 'translateX(0)';

    const slideDirection = this.theme === 'light' ? '100%' : '-100%';

    setTimeout(() => {
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(this.theme);

      overlay.style.setProperty('--overlay-color', this.theme === 'light' ? '#201e30' : 'var(--main-color)');
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', this.theme);
    }, 600);

    setTimeout(() => {
      overlay.style.transform = `translateX(${slideDirection})`;
      overlay.style.opacity = '0';
      overlay.style.zIndex = '-1';
    }, 600);

    setTimeout(() => {
      this.initParticleEffect();
    }, 600);
  }

  // Background Configurations
  initParticleEffect() {
    // Get the current theme configuration
    const config = this.theme === 'light' ?
      this.getFinisherConfig('light') :
      this.getFinisherConfig('dark');

    const finisherElement = document.getElementById(`finisher-header-${this.theme}`);

    if (finisherElement && typeof FinisherHeader !== 'undefined') {
      new FinisherHeader(config);
    }
  }

  // Generate FinisherHeader configuration based on theme settings
  getFinisherConfig(themeName: string): any {
    if (themeName === 'light') {
      return {
        "count": 12,
        "size": {
          "min": 1300,
          "max": 1500,
          "pulse": 0
        },
        "speed": {
          "x": {
            "min": 0.6,
            "max": 3
          },
          "y": {
            "min": 0.6,
            "max": 3
          }
        },
        "colors": {
          "background": this.lightThemeConfig.background,
          "particles": this.lightThemeConfig.particles
        },
        "blending": "lighten",
        "opacity": {
          "center": 0.6,
          "edge": 0
        },
        "skew": -2,
        "shapes": ["c"]
      };
    } else {
      return {
        "count": 100,
        "size": {
          "min": 2,
          "max": 8,
          "pulse": 0
        },
        "speed": {
          "x": {
            "min": 0,
            "max": 0.4
          },
          "y": {
            "min": 0,
            "max": 0.6
          }
        },
        "colors": {
          "background": this.darkThemeConfig.background,
          "particles": this.darkThemeConfig.particles
        },
        "blending": "overlay",
        "opacity": {
          "center": 1,
          "edge": 0
        },
        "skew": -2,
        "shapes": ["c"]
      };
    }
  }

  openNotificationSidebar(): void {
    this.isSidebarOpen = true;
  }
  closeNotificationSidebar(): void {
    this.isSidebarOpen = false;
  }

  openHistorySidebar(): void {
    this.isSideMenuOpen = true;
  }
  closeHistorySidebar(): void {
    this.isSideMenuOpen = false;
  }

  openSettingsModal(): void {
    this.isSettingsOpen = true;
  }

  closeSettingsModal(): void {
    this.isSettingsOpen = false;
  }

  saveSettings(settings: any): void {
    // Update theme configurations
    if (settings.light) {
      this.lightThemeConfig = settings.light;
    }

    if (settings.dark) {
      this.darkThemeConfig = settings.dark;
    }

    // Initialize particle effect with new settings
    this.initParticleEffect();
  }
}
