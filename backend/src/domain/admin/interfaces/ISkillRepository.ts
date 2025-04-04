import { ISkill } from "../../../shared/models/skill.model";

export interface ISkillRepository {
  create(skill: string): Promise<ISkill>;
  update(id: string, skill: Partial<ISkill>): Promise<ISkill | null>;
  delete(id: string): Promise<boolean>;
  getAll(): Promise<ISkill[]>;
  getById(id: string): Promise<ISkill | null>;
}
