import { IPagination } from "@core/interfaces";
import { NextFunction, Request, Response} from "express";
import CreatePostDto from "./dtos/create_post.dto";
import { IPost } from "./posts.interface";
import PostService from "./posts.service";

export default class PostsController{
    private postService = new PostService();

    public createPost = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const model: CreatePostDto = req.body;
            const userId = req.user.id;
            const result = await this.postService.createPost(userId, model);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    public updatePost = async (req: Request, res: Response, next: NextFunction) =>{
        try{ 
            const postId = req.params.id;
            const model: CreatePostDto = req.body;
            const result = await this.postService.updatePost(postId, model);
            res.status(200).json(result);
        }catch(error){
            next(error);
        }
    }

    public getAllPosts = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const posts = await this.postService.getAllPosts();
            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }

    }

    public getPostById = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const id = req.params.id;
            const post = await this.postService.getPostById(id);
            res.status(200).json(post);
        } catch (error) {
            next(error);
        }
    }

    public getAllPaging = async(req: Request, res: Response, next: NextFunction)=>{
        try {
            const keyword = req.query.keyword || '';
            const page = Number(req.params.page);
            const posts : IPagination<IPost> = await this.postService.getAllPaging(keyword.toString(), page);
            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }
        
    }
}