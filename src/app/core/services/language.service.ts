import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class LanguageService {

  public languages: string[] = ['en', 'fr', 'ar'];

  constructor(public translate: TranslateService, private cookieService: CookieService) {
    let browserLang: any;
    this.translate.addLangs(this.languages);
    
    if (this.cookieService.check('lang')) {
      browserLang = this.cookieService.get('lang');
    } else {
      browserLang = translate.getBrowserLang();
    }
    
    // Default to 'en' if the identified language is not supported
    const useLang = browserLang?.match(/en|fr|ar/) ? browserLang : 'en';
    translate.use(useLang);
  }

  /***
   * Cookie Language set
   */
  public setLanguage(lang: any) {
    this.translate.use(lang);
    this.cookieService.set('lang', lang);
  }

}
