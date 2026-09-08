import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Profile, LegalNotice } from '../models';
import { mockLegalNotice, mockProfile } from '../mocks/profile.mock';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/profile`;

  profile = signal<Profile | null>(null);
  legalNotice = signal<LegalNotice | null>(null);
  isLoading = signal<boolean>(false);

  loadProfile(): void {
    this.isLoading.set(true);
    this.http.get<Profile>(this.apiUrl).subscribe({
      next: data => {
        this.profile.set(data);
        this.isLoading.set(false);
      },
      error: err => {
        console.error('Fehler beim Laden des Profils:', err);
        if (!environment.production) {
          this.profile.set(mockProfile);
        }
        this.isLoading.set(false);
      },
    });
  }

  loadLegalNotice(): void {
    this.http.get<LegalNotice>(`${this.apiUrl}/legal`).subscribe({
      next: data => {
        this.legalNotice.set(data);
      },
      error: err => {
        console.error('Fehler beim Laden des Impressums:', err);
        if (!environment.production) {
          this.legalNotice.set(mockLegalNotice);
        }
      },
    });
  }
}
