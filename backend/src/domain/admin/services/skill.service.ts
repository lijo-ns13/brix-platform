import { ISkillRepository } from "../interfaces/ISkillRepository";
import { ISkill } from "../../../shared/models/skill.model";

export class SkillService {
  constructor(private readonly repository: ISkillRepository) {}

  async create(title: string): Promise<ISkill> {
    if (!title.trim()) {
      throw new Error("Skill title cannot be empty");
    }
    return this.repository.create(title);
  }

  async update(id: string, updates: Partial<ISkill>): Promise<ISkill> {
    if (updates.title && !updates.title.trim()) {
      throw new Error("Skill title cannot be empty");
    }

    const updated = await this.repository.update(id, updates);
    if (!updated) {
      throw new Error("Skill not found");
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const exists = await this.repository.getById(id);
    if (!exists) {
      throw new Error("Skill not found");
    }

    const success = await this.repository.delete(id);
    if (!success) {
      throw new Error("Failed to delete skill");
    }
  }

  async getAll(): Promise<ISkill[]> {
    return this.repository.getAll();
  }

  async getById(id: string): Promise<ISkill> {
    const skill = await this.repository.getById(id);
    if (!skill) {
      throw new Error("Skill not found");
    }
    return skill;
  }
}
