import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';

import { LanguageService } from '../../core/services/language.service';
import { ApiService } from 'src/app/core/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommunicationService } from 'src/app/core/services/communication.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

/**
 * Topbar Component
 */
export class TopbarComponent implements OnInit {

  mode: string | undefined;
  element: any;
  flagvalue: any;
  cookieValue: any;
  countryName: any;
  valueset: any;
  user: any = { name: "Admin", email: "admin@asiatel.com" };

  @Output() mobileMenuButtonClicked = new EventEmitter();
  iframeSrc: SafeUrl | undefined;
  password: string | null;

  constructor(
    private router: Router,
    public languageService: LanguageService,
    public _cookiesService: CookieService,
    public translate: TranslateService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    private com: CommunicationService,
    private sanitizer: DomSanitizer,) {

    this.user = JSON.parse(localStorage.getItem("profile") || '{}');
    console.log("profile3",this.user);
    this.password = localStorage.getItem('password');

    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`https://365smartconnect.asiamediatel.com/dialer/js_sip-dialpad.html?uri=sip:` + this.user.agent.extension + `@20.212.144.167&uname=` + this.user.agent.extension + `@20.212.144.167&password=` + this.password + `&stun=stun:stun.l.google.com:19302`);

  }

  /***
   * Language Listing
   */
  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
    { text: 'German', flag: 'assets/images/flags/germany.jpg', lang: 'de' },
    { text: 'Italian', flag: 'assets/images/flags/italy.jpg', lang: 'it' },
    { text: 'Russian', flag: 'assets/images/flags/russia.jpg', lang: 'ru' },
  ];

  @Output() settingsButtonClicked = new EventEmitter();

  ngOnInit(): void {

    // Cookies wise Language set
    this.cookieValue = this._cookiesService.get('lang');
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.jpg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }


    this.com.getProfile.subscribe(
      res=>{
        if(res){
        this.user=res;
        }
      }
    )

  }


  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Logout the user
   */
  logout() {
    this.spinner.show();
    this.apiService.get("auth/logout").subscribe(
      res => {
        this.spinner.hide();
        localStorage.clear();
        this.toastr.success("Logout successful.", "Success");
        this.router.navigate(['/auth/login']);
      },
      err => {
        this.spinner.hide();
        this.router.navigate(['/auth/login']);
        this.toastr.error("Logout failed!", "Failed");
      }
    )

  }

}
