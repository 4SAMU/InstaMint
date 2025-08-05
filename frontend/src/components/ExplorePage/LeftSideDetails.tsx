/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Button,
  Stack,
  InputBase,
  Theme, // Import Theme for SxProps
} from "@mui/material";
import { SxProps } from "@mui/system"; // Import SxProps
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import ReplyIcon from "@mui/icons-material/Reply";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface UserDisplay {
  name: string;
  initial: string;
}

interface Reply {
  _id?: string;
  id?: string;
  user: string;
  username: string;
  text: string;
  createdAt?: Date;
}

interface Comment {
  _id: string;
  id: string;
  user: string;
  username: string;
  text: string;
  replies?: Reply[];
  createdAt?: Date;
}

interface LeftSideDetailProps {
  data: any;
  onClose: () => void;
  sx?: SxProps<Theme>; // <-- Add sx prop here
}

const LeftSideDetail: React.FC<LeftSideDetailProps> = ({
  data,
  onClose,
  sx, // <-- Destructure sx from props
}) => {
  console.log(data);
  const { isLoggedIn, user } = useAuth();

  // States
  const [comments, setComments] = useState<Comment[]>(data?.comments || []);
  const [newComment, setNewComment] = useState("");
  const [activeReplyBox, setActiveReplyBox] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<{ [key: string]: string }>({});
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const [likesCount, setLikesCount] = useState<number>(
    data?.likes?.length || 0
  );
  const [liked, setLiked] = useState<boolean>(
    data?.likes?.some((uid: string) => uid === (user?._id || user?.id)) || false
  );

  // Reset states whenever new NFT/image is loaded
  useEffect(() => {
    if (data) {
      setComments(data?.comments || []);
      setNewComment("");
      setActiveReplyBox(null);
      setReplyTexts({});
      setLikesCount(data?.likes?.length || 0);
      setLiked(
        data?.likes?.some((uid: string) => uid === (user?._id || user?.id)) ||
          false
      );
    }
  }, [data, user]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const getUserDisplay = (username?: string): UserDisplay => {
    if (!username) return { name: "Unknown", initial: "U" };
    return { name: username, initial: username.charAt(0).toUpperCase() };
  };

  const handleAddComment = async () => {
    if (!user?._id && !user?.id) {
      toast.error("error adding a comment, please try again");
      return;
    }
    try {
      const res = await fetch(`/api/nft/${data._id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newComment,
          userId: user._id || user.id,
        }),
      });
      const { comments } = await res.json();
      setComments(comments);
      setNewComment("");
    } catch (err) {
      console.error("Add Comment Error", err);
    }
  };

  const handleAddReply = async (parentId: string) => {
    const text = replyTexts[parentId];
    if (!user?._id && !user?.id) {
      toast.error("error adding a reply, please try again");
      return;
    }
    try {
      const res = await fetch(`/api/nft/${data._id || data.tokenId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentId: parentId,
          text,
          userId: user.id || user._id,
        }),
      });
      const { comments } = await res.json();
      setComments(comments);
      setReplyTexts((prev) => ({ ...prev, [parentId]: "" }));
      setActiveReplyBox(null);
    } catch (err) {
      console.error("Reply Error", err);
    }
  };

  const handleLike = async () => {
    if (!user?._id && !user?.id) {
      toast.error("Please login to like");
      return;
    }
    try {
      const res = await fetch(`/api/nft/${data._id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id || user.id }),
      });

      const result = await res.json();
      if (result.success) {
        setLikesCount(result.likesCount);
        setLiked(result.liked);
      }
    } catch (err) {
      console.error("Like Error", err);
    }
  };

  if (!data) return null;

  return (
    <Box
      sx={{
        width: "45%", // This will be overridden by the prop if provided
        minWidth: "400px",
        padding: 2,
        borderRight: "1px solid #ddd",
        backgroundColor: "#fff",
        borderRadius: "20px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "1000px",
        ...sx, // <-- Spread the incoming sx prop here. It will merge/override
      }}
    >
      {/* Close button */}
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 8, right: 8, color: "#000" }}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>

      {/* NFT Title */}
      <Typography variant="h6" sx={{ mb: 1, height: "35px" }}>
        {data?.metadata?.name || ""}
      </Typography>

      {/* NFT Image */}
      <Box
        sx={{
          mb: 2,
          position: "relative", // Needed for absolute positioning of the background
          borderRadius: "10px",
          width: "100%",
          maxWidth: "400px",
          maxHeight: "500px",
          overflow: "hidden", // To ensure the blurred edges don't spill out
        }}
      >
        {/* Blurred Background Layer */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${data?.metadata?.image})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            filter: "blur(2.5px)",
            zIndex: 0,
          }}
        />

        {/* Main Image Layer (on top) */}
        <img
          src={data?.metadata?.image}
          alt={data?.metadata?.name}
          style={{
            width: "100%",
            borderRadius: "10px",
            maxHeight: "500px",
            objectFit: "contain",
            position: "relative",
            zIndex: 1,
          }}
        />
      </Box>

      {/* Description */}
      <Typography variant="body2" sx={{ mb: 2 }}>
        {data?.metadata?.description || "No description available"}
      </Typography>

      {/* Likes and Comments */}
      <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
        <IconButton onClick={handleLike}>
          {liked ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon sx={{ color: "grey.600" }} />
          )}
        </IconButton>
        <Typography variant="body2">{likesCount} Likes</Typography>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Typography variant="body2">
          💬 {comments?.length || 0} Comments
        </Typography>
      </Stack>

      {/* Comments Section */}
      <Box
        mt={2}
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          maxHeight: "400px",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": { background: "#555" },
        }}
      >
        <Typography variant="subtitle2" gutterBottom>
          Comments
        </Typography>

        {comments?.map((comment) => {
          const { name, initial } = getUserDisplay(comment.username);
          const isReplying = activeReplyBox === comment._id;

          return (
            <Box
              key={comment._id}
              sx={{ mb: 2, borderBottom: "1px solid #eee", pb: 1 }}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Avatar sx={{ width: 24, height: 24 }}>{initial}</Avatar>
                <Typography variant="subtitle2">{name}</Typography>
              </Stack>

              <Typography variant="body2" sx={{ ml: 4 }}>
                {comment.text}
              </Typography>

              {isLoggedIn && (
                <>
                  <Button
                    size="small"
                    startIcon={<ReplyIcon fontSize="small" />}
                    onClick={() =>
                      setActiveReplyBox(isReplying ? null : comment._id)
                    }
                    sx={{ ml: 4, mt: 0.5 }}
                  >
                    {isReplying ? "Cancel" : "Reply"}
                  </Button>

                  {isReplying && (
                    <Box
                      sx={{
                        ml: 4,
                        mt: 1,
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #ccc",
                        borderRadius: "20px",
                        padding: "4px 8px",
                      }}
                    >
                      <InputBase
                        placeholder="Write a reply..."
                        value={replyTexts[comment._id] || ""}
                        onChange={(e) =>
                          setReplyTexts((prev) => ({
                            ...prev,
                            [comment._id]: e.target.value,
                          }))
                        }
                        sx={{ flex: 1, ml: 1 }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleAddReply(comment._id);
                        }}
                      />
                      <IconButton
                        onClick={() => handleAddReply(comment._id)}
                        disabled={!replyTexts[comment._id]?.trim()}
                      >
                        <SendIcon />
                      </IconButton>
                    </Box>
                  )}
                </>
              )}

              {comment.replies?.map((reply, idx) => {
                const { name: replyName, initial: replyInitial } =
                  getUserDisplay(reply.username);
                return (
                  <Box
                    key={idx}
                    sx={{
                      ml: 4,
                      mt: 1,
                      pl: 2,
                      borderLeft: "2px solid #ddd",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mb: 0.5 }}
                    >
                      <Avatar sx={{ width: 24, height: 24 }}>
                        {replyInitial}
                      </Avatar>
                      <Typography variant="subtitle2">{replyName}</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ ml: 4 }}>
                      {reply.text}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          );
        })}
        <div ref={commentsEndRef} />
      </Box>

      {isLoggedIn && (
        <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #ddd" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ccc",
              borderRadius: "25px",
              padding: "4px 8px",
              backgroundColor: "#fff",
            }}
          >
            <InputBase
              placeholder="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ flex: 1, ml: 1 }}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleAddComment();
              }}
            />
            <IconButton
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              sx={{ color: newComment.trim() ? "primary.main" : "grey.500" }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LeftSideDetail;
