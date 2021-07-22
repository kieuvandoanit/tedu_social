import { Route } from "@core/interfaces";
import { authMiddleware, validationMiddleware } from "@core/middleware";
import { Router } from "express";
import CreateProfileDto from "./dtos/create_profile.dto";
import AddExperienceDto from './dtos/add_experience.dto';
import ProfileController from "./profile.controller";
import AddEducationDto from "./dtos/add_education.dto";

class ProfileRoute implements Route{
    public path = "/api/v1/profile";
    public router = Router();
    public profileController = new ProfileController();

    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.get(`${this.path}`, this.profileController.getAllProfiles);
        this.router.get(`${this.path}/user/:id`, this.profileController.getByUserId);
        this.router.get(`${this.path}/me`,authMiddleware, this.profileController.getCurrentProfile);
        this.router.post(`${this.path}`, authMiddleware,validationMiddleware(CreateProfileDto), this.profileController.createProfile);
        this.router.delete(`${this.path}/:id`,authMiddleware,this.profileController.deleteProfile);
        this.router.put(`${this.path}/experience`, authMiddleware, validationMiddleware(AddExperienceDto), this.profileController.createExperience);
        this.router.delete(`${this.path}/experience/:exp_id`,authMiddleware,this.profileController.deleteExperience);
        this.router.put(`${this.path}/education`, authMiddleware, validationMiddleware(AddEducationDto), this.profileController.createEducation);
        this.router.delete(`${this.path}/education/:edu_id`,authMiddleware,this.profileController.deleteEducation);
    }
}

export default ProfileRoute;

function addExperienceDto(addExperienceDto: any): import("express-serve-static-core").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> {
    throw new Error("Function not implemented.");
}
