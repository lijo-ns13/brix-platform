import skillModel, { ISkill } from "../../../shared/models/skill.model";
import { ISkillRepository } from "../interfaces/ISkillRepository";
export class SkillRepository implements ISkillRepository {
  async create(skill: string): Promise<ISkill> {
    const newSkill = new skillModel({
      title: skill.toLowerCase(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await newSkill.save();
  }

  async update(id: string, updates: Partial<ISkill>): Promise<ISkill | null> {
    return await skillModel.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
  }

  async delete(id: string): Promise<boolean> {
    const result = await skillModel.findByIdAndDelete(id);
    return !!result;
  }

  async getAll(): Promise<ISkill[]> {
    return await skillModel.find().sort({ createdAt: -1 });
  }

  async getById(id: string): Promise<ISkill | null> {
    return await skillModel.findById(id);
  }
  async getByTitle(title: string): Promise<ISkill | null> {
    return await skillModel.findOne({ title: title });
  }
}
