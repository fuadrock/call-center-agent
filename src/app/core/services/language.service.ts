import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {

  public languages: string[] = ['en', 'es', 'de', 'it', 'ru'];

  constructor() {


  }

  /***
   * Cookie Language set
   */
  public setLanguage(lang: any) {

  }

}
