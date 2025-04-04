import { Request, Response } from "express";
import { SkillService } from "../services/skill.service";

export class SkillController {
  constructor(private readonly service: SkillService) {}

  async create(req: Request, res: Response) {
    try {
      const skill = await this.service.create(req.body.title);
      res.status(201).json(skill);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const skill = await this.service.update(req.params.id, req.body);
      res.json(skill);
    } catch (error: any) {
      const status = error.message.includes("not found") ? 404 : 400;
      res.status(status).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.service.delete(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      const status = error.message.includes("not found") ? 404 : 400;
      res.status(status).json({ error: error.message });
    }
  }

  async getAll(_req: Request, res: Response) {
    try {
      const skills = await this.service.getAll();
      res.json(skills);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const skill = await this.service.getById(req.params.id);
      res.json(skill);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
