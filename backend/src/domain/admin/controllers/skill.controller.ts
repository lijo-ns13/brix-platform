import { Request, Response } from "express";
import { SkillService } from "../services/skill.service";
import { HTTP_STATUS_CODES } from "../../../shared/constants/httpStatusCode";

export class SkillController {
  constructor(private readonly service: SkillService) {}

  async create(req: Request, res: Response) {
    try {
      const skill = await this.service.create(req.body.title);
      res.status(HTTP_STATUS_CODES.CREATED).json(skill);
    } catch (error: any) {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const skill = await this.service.update(req.params.id, req.body);
      res.status(HTTP_STATUS_CODES.OK).json(skill);
    } catch (error: any) {
      // const status = error.message.includes("not found") ? 404 : 400;
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.service.delete(req.params.id);
      res.status(HTTP_STATUS_CODES.OK).send();
    } catch (error: any) {
      // const status = error.message.includes("not found") ? 404 : 400;
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
    }
  }

  async getAll(_req: Request, res: Response) {
    try {
      const skills = await this.service.getAll();
      res.status(HTTP_STATUS_CODES.OK).json(skills);
    } catch (error: any) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const skill = await this.service.getById(req.params.id);
      res.status(HTTP_STATUS_CODES.OK).json(skill);
    } catch (error: any) {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
    }
  }
}
