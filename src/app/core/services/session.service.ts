import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  
  key = "S0F1A";

  constructor() { }

  public saveData(key: string, value: string) {
    sessionStorage.setItem(key, this.encrypt(value));
  }

  public getData(key: string) {
    let data = sessionStorage.getItem(key) || "";
    return this.decrypt(data);
  }
  public removeData(key: string) {
    sessionStorage.removeItem(key);
  }

  public clearData() {
    sessionStorage.clear();
  }

  private encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.key).toString();
  }

  private decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
  }
}
