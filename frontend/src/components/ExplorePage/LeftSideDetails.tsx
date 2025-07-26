/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Avatar,
  Button,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import ReplyIcon from "@mui/icons-material/Reply";

interface Comment {
  id: string;
  author: string;
  text: string;
  replies?: Comment[];
}

interface LeftSideDetailProps {
  data: any;
  onClose: () => void;
}

const LeftSideDetail: React.FC<LeftSideDetailProps> = ({ data, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([
    { id: "1", author: "User1", text: "Nice NFT! 🔥" },
    { id: "2", author: "User2", text: "Where can I buy this?" },
    { id: "3", author: "User3", text: "This is amazing artwork!" },
    { id: "4", author: "User4", text: "How was this created?" },
    { id: "5", author: "User5", text: "The colors are fantastic!" },
  ]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const commentsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new comments are added
  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: "CurrentUser",
        text: newComment,
      };
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  const handleAddReply = (parentId: string) => {
    if (replyText.trim()) {
      const updatedComments = comments.map((comment) => {
        if (comment.id === parentId) {
          const reply: Comment = {
            id: `${parentId}-${Date.now()}`,
            author: "CurrentUser",
            text: replyText,
          };
          return {
            ...comment,
            replies: [...(comment.replies || []), reply],
          };
        }
        return comment;
      });
      setComments(updatedComments);
      setReplyText("");
      setReplyingTo(null);
    }
  };

  return (
    <Box
      sx={{
        width: "40%",
        minWidth: "300px",
        padding: 2,
        borderRight: "1px solid #ddd",
        backgroundColor: "#fff",
        borderRadius: "20px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: "calc(100vh - 100px)", // Set a maximum height for the container
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: "#000",
        }}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>

      <Typography variant="h6" sx={{ mb: 2 }}>
        {data?.title || "NFT Detail"}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <img
          src={data?.image}
          alt={data?.title}
          style={{ width: "100%", borderRadius: 8 }}
        />
      </Box>

      <Typography variant="body2">❤️ 100 Likes</Typography>
      <Typography variant="body2">💬 {comments.length} Comments</Typography>

      <Box
        ref={commentsContainerRef}
        mt={2}
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          maxHeight: "400px", // Fixed height for comments section
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
        }}
      >
        <Typography variant="subtitle2" gutterBottom>
          Comments
        </Typography>

        {comments.map((comment) => (
          <Box
            key={comment.id}
            sx={{ mb: 2, borderBottom: "1px solid #eee", pb: 1 }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Avatar sx={{ width: 24, height: 24 }}>
                {comment.author.charAt(0)}
              </Avatar>
              <Typography variant="subtitle2">{comment.author}</Typography>
            </Stack>
            <Typography variant="body2" sx={{ ml: 4 }}>
              {comment.text}
            </Typography>

            <Button
              size="small"
              startIcon={<ReplyIcon fontSize="small" />}
              onClick={() => {
                setReplyingTo(replyingTo === comment.id ? null : comment.id);
                // Scroll to the reply input when clicked
                setTimeout(() => {
                  commentsContainerRef.current?.scrollTo({
                    top: commentsContainerRef.current.scrollHeight,
                    behavior: "smooth",
                  });
                }, 100);
              }}
              sx={{ ml: 4, mt: 0.5 }}
            >
              Reply
            </Button>

            {replyingTo === comment.id && (
              <Box sx={{ ml: 4, mt: 1, display: "flex", alignItems: "center" }}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  sx={{ mr: 1 }}
                />
                <IconButton onClick={() => handleAddReply(comment.id)}>
                  <SendIcon />
                </IconButton>
              </Box>
            )}

            {comment.replies?.map((reply) => (
              <Box
                key={reply.id}
                sx={{ ml: 4, mt: 1, pl: 2, borderLeft: "2px solid #ddd" }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: 0.5 }}
                >
                  <Avatar sx={{ width: 24, height: 24 }}>
                    {reply.author.charAt(0)}
                  </Avatar>
                  <Typography variant="subtitle2">{reply.author}</Typography>
                </Stack>
                <Typography variant="body2" sx={{ ml: 4 }}>
                  {reply.text}
                </Typography>
              </Box>
            ))}
          </Box>
        ))}
        <div ref={commentsEndRef} />
      </Box>

      <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #ddd" }}>
        <Typography variant="subtitle2" gutterBottom>
          Add a comment
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddComment();
              }
            }}
            sx={{ mr: 1 }}
          />
          <IconButton onClick={handleAddComment}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default LeftSideDetail;