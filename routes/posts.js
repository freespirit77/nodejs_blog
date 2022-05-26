const express = require("express");
const Posts = require("../schemas/post");
const router = express.Router();

// * 게시글 상세조회
router.get("/posts/:postId", async (req, res) => {
    const { postId } = req.params;
    const post = await Posts.findOne({ postId });
    res.json({ post });
});

// * 게시글 삭제 (비밀번호 확인 후 삭제)
router.delete("/posts/:postId", async (req, res) => {
    const { postId } = req.params;
    const {postPw} = req.body; 
    
    console.log(postId);
    
    const existsPost = await Posts.findOne({ postId : Number(postId) });

    if (existsPost&& (existsPost.postPw==postPw)) {
      await Posts.deleteOne({ postId : Number(postId)});
      console.log("삭제");
      res.json({ result: "success" });
    } else if (!existsPost){
        return res.status(400).json({success: false, errorMessage: "삭제할 게시글이 없습니다."});
    } else {
        return res.status(400).json({success: false, errorMessage: "게시글의 비밀번호가 일치하지 않습니다."});
    }
    
});

// * 게시글 수정 API 
router.put("/posts/:postId", async (req, res)=>{
    const {postId} = req.params; 
    const {title, content, postPw} = req.body; 

    const existsPost = await Posts.findOne({postId: Number(postId)});
    // console.log("postId : ",postId);
    // console.log(existsPost);
    // console.log("입력받은 값 : ",postPw);
    // console.log(existsPost.postPw);

    if(existsPost&& (existsPost.postPw==postPw)){
        await Posts.updateOne({postId: Number(postId)}, { $set: {title, content} });
        res.json({ result: "success" });
    } else if (!existsPost){
        return res.status(400).json({success: false, errorMessage: "수정할 게시글이 없습니다."});
    } else {
        return res.status(400).json({success: false, errorMessage: "게시글의 비밀번호가 일치하지 않습니다."});
    } 
  });


// * 게시글 전체 목록 조회 (최신순으로)
router.get("/posts", async (req, res, next) => {
    const posts = await Posts.find();
    posts.sort((a,b)=> (a.editDate > b.editDate) ? -1: 1)
    res.json({ 
        post : posts.map((post) => {
            return {
                postsId : post.postId,
                title: post.title,
                editor : post.editor,
                editDate : post.editDate,
            }
        })
    });
});

// * 게시글 등록 
router.post("/posts", async (req,res)=> {
    // const goodsId = req.body.goodsId;   // 보통은 서버에서 만들어줌. 이건 테스트용도
    const {postId, title, editor, postPw, content} = req.body; 
    const posts = await Posts.find({postId}); 
    
    if(posts.length){
      return res.status(400).json({success: false, errorMessage: "해당 번호에 이미 게시글이 등록되어 있습니다."});
    } 

    const createdPosts = await Posts.create({
        postId, 
        title, 
        editor, 
        postPw, 
        content,
    });

    res.json({posts : createdPosts});
  });

module.exports = router;