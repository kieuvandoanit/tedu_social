import { IPagination } from "@core/interfaces";
import { NextFunction, Request, Response} from "express";
import CreatePostDto from "./dtos/create_post.dto";
import { ILike, IPost } from "./posts.interface";
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
            const posts:IPost[] = await this.postService.getAllPosts();
            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }

    }

    public getPostById = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const id = req.params.id;
            const post:IPost = await this.postService.getPostById(id);
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

    public deletePost = async(req: Request, res: Response, next: NextFunction)=>{
        try {
            const userId = req.user.id;
            const postId = req.params.id;
            const post = await this.postService.deletePost(userId, postId);
            res.status(200).json(post);
        } catch (error) {
            next(error);
        }
    }

    public likePost = async(req: Request, res: Response, next: NextFunction)=>{
        try {
            const postId = req.params.id;
            const likes = await this.postService.likePost(req.user.id,postId);
            res.status(200).json(likes);
        } catch (error) {
            next(error);
        }
    }
    public unlikePost = async(req: Request, res: Response, next: NextFunction)=>{
        try {
            const postId = req.params.id;
            const likes = await this.postService.unlikePost(req.user.id,postId);
            res.status(200).json(likes);
        } catch (error) {
            next(error);
        }
    }

    public addComment = async(req: Request, res: Response, next: NextFunction)=>{
        try {
            const postId = req.params.id;
            const comment = await this.postService.addComment({
                text: req.body.text,
                userId: req.user.id,
                postId: postId,
            });

            res.status(200).json(comment);
        } catch (error) {
            next(error);
        }
    }

    public removeComment = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const postId = req.params.id;
            const userId = req.user.id;
            const commentId = req.params.comment_id;

            const result = await this.postService.removeComment(commentId, postId, userId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}