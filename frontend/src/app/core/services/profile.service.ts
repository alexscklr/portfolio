import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { Profile, LegalNotice } from '../models';
import { getMockLegalNotice, getMockProfile } from '../mocks/profile.mock';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/profile`;
  private languageService = inject(LanguageService);

  profile = signal<Profile | null>(null);
  legalNotice = signal<LegalNotice | null>(null);
  isLoading = signal<boolean>(false);

  loadProfile(): void {
    const language = this.languageService.currentLanguage();
    if (environment.dataSource === 'frontend-mock') {
      this.profile.set(getMockProfile(language));
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.http.get<Profile>(this.apiUrl, {
      params: { lang: language }
    }).subscribe({
      next: data => {
        this.profile.set(data);
        this.isLoading.set(false);
      },
      error: err => {
        console.error('Fehler beim Laden des Profils:', err);
        this.profile.set(null);
        this.isLoading.set(false);
      },
    });
  }

  loadLegalNotice(): void {
    const language = this.languageService.currentLanguage();
    if (environment.dataSource === 'frontend-mock') {
      this.legalNotice.set(getMockLegalNotice(language));
      return;
    }

    this.http.get<LegalNotice>(`${this.apiUrl}/legal`, {
      params: { lang: language }
    }).subscribe({
      next: data => {
        this.legalNotice.set(data);
      },
      error: err => {
        console.error('Fehler beim Laden des Impressums:', err);
        this.legalNotice.set(null);
      },
    });
  }
}
