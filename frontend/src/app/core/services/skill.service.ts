import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Skill } from "../models/skill.model";
import { environment } from "@/environments/environment";
import { getMockProjects } from "../mocks/project.mock";


@Injectable({
    providedIn: 'root'
})
export class SkillService {
    private http = inject(HttpClient);

    skills = signal<Skill[]>([]);
    isLoading = signal<boolean>(false);

    loadSkills(): void {
        this.isLoading.set(true);
        this.http.get<Skill[]>(`${environment.apiUrl}/skills`).subscribe({
            next: (skills) => {
                this.skills.set(skills.length > 0 ? skills : this.getMockSkills());
                this.isLoading.set(false);
            },
            error: () => {
                this.skills.set(this.getMockSkills());
                this.isLoading.set(false);
            }
        });
    }

    private getMockSkills(): Skill[] {
        const skillMap = new Map<string, Skill>();

        for (const project of getMockProjects()) {
            for (const skill of project.skills) {
                const existingSkill = skillMap.get(skill.slug);

                if (existingSkill) {
                    existingSkill.usageCount += 1;
                    continue;
                }

                skillMap.set(skill.slug, {
                    ...skill,
                    usageCount: 1
                });
            }
        }

        return Array.from(skillMap.values())
            .sort((first, second) => second.usageCount - first.usageCount || first.name.localeCompare(second.name));
    }
}