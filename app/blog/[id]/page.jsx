"use client";

import Navbar from "@/components/common/Navbar";
import axios from "axios";
import { title } from "process";
import React, { useEffect, useState } from "react";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";





const page = ({ params }) => {
  const { data: session, status } = useSession();
  const [blog, setBlog] = useState();
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [commentArray, setCommentArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  const getComments = async () => {
    try {
      const res = await axios.get(`/api/get-comments/${params.id}`);
      console.log(res.data);
      setCommentArray(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getBlog = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/get-blog/${params.id}`);
      console.log(res.data);
      setBlog(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlog();
  }, []);

  useEffect(() => {
    getComments();
  }, [comment]);

  const createComment = async (e) => {
    e.preventDefault();
    setCommentLoading(true);
    try {
      console.log(name);
      const res = await axios.post("/api/create-comment", {
        content: comment,
        name: name,
        blogId: params.id,
        authorId: session?.user?.id || "",
      });
      alert("comment added");
    } catch (error) {
      console.log(error);
      alert("error");
    } finally {
      setCommentLoading(false);
      setComment("");
    }
  };

  return (
    <>
      <Navbar />
      {
        loading ? (
          <div className="m-10 text-3xl">
            Loading...
          </div>
        ) : (
          <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
            <article className="prose prose-gray mx-auto dark:prose-invert">
              <div className="space-y-2 not-prose">
                <h1 className="font-serif">
                  {blog?.title}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <UserIcon className="h-4 w-4" />
                    
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{blog?.createdAt}</span>
                  </div>
                </div>
              </div>
              <div dangerouslySetInnerHTML={{ __html: blog?.content ?? "" }} ></div>
            </article>
            <br />
            <div className="">
              <div className="mt-12 border-t pt-6">
                <h2 className="text-2xl font-bold">Comments</h2>
                <div className="mt-6 space-y-6">
                  {commentArray.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-4">
                      <Avatar className="h-10 w-10 shrink-0 border">
                        <AvatarImage alt="@shadcn" src="/placeholder-user.jpg" />
                        <AvatarFallback>AC</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{comment.name}</div>

                        </div>
                        <p>
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-12 border-t pt-6">
                <h2 className="text-2xl font-bold">Leave a Comment</h2>
                {status === "authenticated" && (
                  <form className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"></div>
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Your name" onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="comment">Comment</Label>
                      <Textarea
                        id="comment"
                        placeholder="Your comment"
                        rows={5}
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                      />
                    </div>
                    <Button
                      className="w-full sm:w-auto"
                      type="submit"
                      onClick={createComment}
                      disabled={commentLoading}
                    >
                      {commentLoading ? "Loading" : "Submit"}
                    </Button>
                  </form>
                )}
              </div>
            </div>

          </div>
        )
      }

    </>
  );
};

export default page;

function CalendarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
