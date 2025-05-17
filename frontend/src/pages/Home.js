import { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Box,
  Button,
  Divider,
  Chip,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Delete,
  Edit,
  Favorite,
  FavoriteBorder,
  Home,
  Search,
  Explore,
  MovieCreation,
  Chat,
  AddBox,
  Person,
  Notifications,
  MoreHoriz,
  BookmarkBorder,
  SendOutlined,
  ChatBubbleOutline,
} from "@mui/icons-material";
import "swiper/css";

import Leftsidebar from "../components/homepage/Leftsidebar";
import StatusViewer from "../components/homepage/StatusViewer";
import RightSidebar from "../components/homepage/Rightsidebar";
import RenderStatusBar from "../components/homepage/RenderStatusBar";

export default function InstagramHomeFeed() {
  const [comments, setComments] = useState({});
  const [newCommentText, setNewCommentText] = useState({});
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [likeStatus, setLikeStatus] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [followStatus, setFollowStatus] = useState({});
  const [activeTab, setActiveTab] = useState("following");
  const BASE_URL = "http://localhost:9090";
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState([]);
  const [openStatus, setOpenStatus] = useState(null);
  const handleOpenStatus = (status) => setOpenStatus(status);
  const handleCloseStatus = () => setOpenStatus(null);
  const [editingStatus, setEditingStatus] = useState(null);
  const [showAllComments, setShowAllComments] = useState({});

  useEffect(() => {
    loadPosts();
  }, [activeTab]);

  const loadPosts = () => {
    const endpoint =
      activeTab === "all"
        ? "/posts/all"
        : activeTab === "my"
        ? "/posts/my"
        : "/posts/following";

    axios.get(endpoint).then((res) => {
      setPosts(res.data);
      res.data.forEach((post) => {
        axios.get(`/comments/${post.id}`).then((res) => {
          setComments((prev) => ({ ...prev, [post.id]: res.data }));
        });
        axios.get(`/posts/${post.id}/like-status`).then((res) => {
          setLikeStatus((prev) => ({ ...prev, [post.id]: res.data }));
        });
      });
    });

    axios.get("/users/all").then((res) => {
      setAllUsers(res.data);
      res.data.forEach((u) => {
        if (u.email !== user?.email) {
          axios.get(`/follow/status/${u.id}`).then((statusRes) => {
            setFollowStatus((prev) => ({
              ...prev,
              [u.id]: statusRes.data.status,
            }));
          });
        }
      });
    });
  };

  const handleCommentSubmit = (postId) => {
    const content = newCommentText[postId];
    if (!content) return;

    axios.post(`/comments/${postId}`, { content }).then((res) => {
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), res.data],
      }));
      setNewCommentText((prev) => ({ ...prev, [postId]: "" }));
    });
  };

  const handleDelete = (commentId, postId) => {
    axios.delete(`/comments/${commentId}`).then(() => {
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((c) => c.id !== commentId),
      }));
    });
  };

  const handleEdit = (comment) => {
    setEditCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = (commentId, postId) => {
    axios
      .put(`/comments/${commentId}`, { content: editContent })
      .then((res) => {
        setComments((prev) => ({
          ...prev,
          [postId]: prev[postId].map((c) =>
            c.id === commentId ? res.data : c
          ),
        }));
        setEditCommentId(null);
        setEditContent("");
      });
  };

  const toggleLike = (postId) => {
    axios.post(`/posts/${postId}/like`).then(() => {
      axios.get(`/posts/${postId}/like-status`).then((res) => {
        setLikeStatus((prev) => ({ ...prev, [postId]: res.data }));
      });
    });
  };

  const handleFollowRequest = (userId) => {
    axios.post(`/follow/${userId}`).then(() => {
      setFollowStatus((prev) => ({ ...prev, [userId]: "PENDING" }));
    });
  };

  const handleUnfollow = (userId) => {
    axios.delete(`/follow/${userId}`).then(() => {
      setFollowStatus((prev) => ({ ...prev, [userId]: "NONE" }));
    });
  };

  useEffect(() => {
    loadStatuses();
  }, []);

  const loadStatuses = () => {
    axios.get("/status").then((res) => setStatuses(res.data));
  };

  const handleDeleteStatus = (id) => {
    axios.delete(`/status/${id}`).then(() => loadStatuses());
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
        background: "#F5F5F5",
      }}
    >
      <StatusViewer
        status={editingStatus || openStatus}
        onClose={() => {
          setOpenStatus(null);
          setEditingStatus(null);
        }}
        duration={5000}
        refreshStatuses={loadStatuses}
        isEditing={!!editingStatus}
      />

      {/* Right Sidebar */}
      <RightSidebar
        user={user}
        allUsers={allUsers}
        followStatus={followStatus}
        handleFollowRequest={handleFollowRequest}
        handleUnfollow={handleUnfollow}
      />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          maxWidth: 650,
          mx: "auto",
          my: 2,
          p: { xs: 1, md: 2 },
          width: "100%",
        }}
      >
        {/* Feed Tabs */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            borderBottom: "1px solid #FFCDD2",
            mb: 3,
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          {["following", "all", "my"].map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              sx={{
                textTransform: "none",
                color: activeTab === tab ? "#FF0000" : "#606060",
                borderBottom: activeTab === tab ? "2px solid #FF0000" : "none",
                borderRadius: 0,
                px: 3,
                py: 1.8,
                fontWeight: activeTab === tab ? 600 : 400,
                fontSize: "0.9rem",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "transparent",
                  color: activeTab === tab ? "#FF0000" : "#212121",
                },
              }}
            >
              {tab === "following"
                ? "Following"
                : tab === "all"
                ? "Explore"
                : "My Posts"}
            </Button>
          ))}
        </Box>

        {/* Status Bar with redesigned look */}
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            mb: 3,
            p: 2,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            border: "1px solid #FFCDD2",
          }}
        >
          <RenderStatusBar
            statuses={statuses}
            user={user}
            handleOpenStatus={setOpenStatus}
            handleDeleteStatus={handleDeleteStatus}
            handleEditStatus={setEditingStatus}
          />
        </Box>

        {/* Posts Feed */}
        <Box sx={{ maxWidth: 650, mx: "auto" }}>
          {posts.map((post) => (
            <Card
              key={post.id}
              sx={{
                mb: 4,
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                borderRadius: "12px",
                overflow: "hidden",
                transition: "transform 0.2s ease",
                backgroundColor: "#FFFFFF",
                border: "1px solid #FFCDD2",
                "&:hover": {
                  transform: "translateY(-3px)",
                },
              }}
            >
              {/* Post Header with modern styling */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  borderBottom: "1px solid #FFCDD2",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      mr: 1.5,
                      width: 38,
                      height: 38,
                      border: "2px solid #FFCDD2",
                      bgcolor: "#FF0000",
                      color: "#FFFFFF",
                    }}
                    src={
                      post.user.profileImage
                        ? `http://localhost:9090${post.user.profileImage}`
                        : undefined
                    }
                    alt={post.user.username}
                  >
                    {!post.user.profileImage &&
                      post.user.username?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" color="#212121">
                      {post.user.username}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#606060", display: "block", mt: -0.3 }}
                    >
                      {post.location || "Somewhere cool"}
                    </Typography>
                  </Box>
                </Box>
                <IconButton size="small" sx={{ color: "#606060" }}>
                  <MoreHoriz />
                </IconButton>
              </Box>

              {/* Media with improved styling */}
              {post.mediaPaths?.length > 0 && (
                <Swiper
                  spaceBetween={0}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                >
                  {post.mediaPaths.map((path, index) => (
                    <SwiperSlide key={index}>
                      {path.toLowerCase().endsWith(".mp4") ? (
                        <video
                          src={`${BASE_URL}${path}`}
                          controls
                          style={{
                            width: "100%",
                            height: "auto",
                            maxHeight: 650,
                            objectFit: "cover",
                            backgroundColor: "#000",
                          }}
                        />
                      ) : (
                        <img
                          src={`${BASE_URL}${path}`}
                          alt={`media-${index}`}
                          style={{
                            width: "100%",
                            height: "auto",
                            maxHeight: 650,
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}

              {/* Action Buttons */}
              <Box sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      onClick={() => toggleLike(post.id)}
                      sx={{
                        p: 1,
                        transition: "transform 0.2s ease",
                        "&:hover": { transform: "scale(1.1)", color: "#FF0000" },
                      }}
                    >
                      {likeStatus[post.id]?.liked ? (
                        <Favorite
                          sx={{ color: "#FF0000", fontSize: "1.8rem" }}
                        />
                      ) : (
                        <FavoriteBorder sx={{ fontSize: "1.8rem", color: "#606060" }} />
                      )}
                    </IconButton>
                    <IconButton
                      sx={{
                        p: 1,
                        transition: "transform 0.2s ease",
                        "&:hover": { transform: "scale(1.1)", color: "#FF0000" },
                      }}
                    >
                      <ChatBubbleOutline sx={{ fontSize: "1.8rem", color: "#606060" }} />
                    </IconButton>
                    <IconButton
                      sx={{
                        p: 1,
                        transition: "transform 0.2s ease",
                        "&:hover": { transform: "scale(1.1)", color: "#FF0000" },
                      }}
                    >
                      <SendOutlined sx={{ fontSize: "1.8rem", color: "#606060" }} />
                    </IconButton>
                  </Box>
                  <IconButton
                    sx={{
                      p: 1,
                      transition: "transform 0.2s ease",
                      "&:hover": { transform: "scale(1.1)", color: "#FF0000" },
                    }}
                  >
                    <BookmarkBorder sx={{ fontSize: "1.8rem", color: "#606060" }} />
                  </IconButton>
                </Box>

                {/* Like Count with better styling */}
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ mt: 1.5, fontSize: "0.95rem", color: "#212121" }}
                >
                  {likeStatus[post.id]?.likeCount || 0}{" "}
                  {likeStatus[post.id]?.likeCount === 1 ? "like" : "likes"}
                </Typography>

                {/* Caption with better styling */}
                <Box sx={{ mt: 1.5 }}>
                  <Typography variant="body2" component="div">
                    <Typography
                      variant="body2"
                      component="span"
                      fontWeight="bold"
                      sx={{ mr: 1, color: "#212121" }}
                    >
                      {post.user.username}
                    </Typography>
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{ color: "#606060", lineHeight: 1.5 }}
                    >
                      {post.description}
                    </Typography>
                  </Typography>
                </Box>

                {/* View all comments link if more than 2 */}
                {comments[post.id]?.length > 2 && !showAllComments[post.id] && (
                  <Typography
                    variant="body2"
                    color="#606060"
                    sx={{
                      mt: 1.5,
                      cursor: "pointer",
                      "&:hover": { color: "#FF0000" },
                    }}
                    onClick={() =>
                      setShowAllComments((prev) => ({
                        ...prev,
                        [post.id]: true,
                      }))
                    }
                  >
                    View all {comments[post.id]?.length} comments
                  </Typography>
                )}

                {/* Comments with modern styling */}
                <List disablePadding sx={{ mt: 1.5 }}>
                  {(comments[post.id] || [])
                    .slice(
                      0,
                      showAllComments[post.id] ? comments[post.id].length : 2
                    )
                    .map((comment) => (
                      <ListItem
                        key={comment.id}
                        disablePadding
                        disableGutters
                        sx={{ mb: 0.8 }}
                      >
                        {editCommentId === comment.id ? (
                          <TextField
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            onBlur={() => handleSaveEdit(comment.id, post.id)}
                            fullWidth
                            size="small"
                            variant="outlined"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "20px",
                                borderColor: "#FFCDD2",
                                "&.Mui-focused": {
                                  borderColor: "#FF0000",
                                },
                              },
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              width: "100%",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="body2"
                              component="div"
                              sx={{ display: "flex", flexWrap: "wrap" }}
                            >
                              <Typography
                                variant="body2"
                                component="span"
                                fontWeight="bold"
                                sx={{ mr: 1, color: "#212121" }}
                              >
                                {comment.user.username}
                              </Typography>
                              <Typography
                                variant="body2"
                                component="span"
                                sx={{ color: "#606060" }}
                              >
                                {comment.content}
                              </Typography>
                            </Typography>

                            {(comment.user.email === user?.email ||
                              post.user.email === user?.email) && (
                              <Box ml={1} display="flex">
                                {comment.user.email === user?.email && (
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEdit(comment)}
                                    sx={{ p: 0.5, color: "#606060", "&:hover": { color: "#FF0000" } }}
                                  >
                                    <Edit
                                      fontSize="small"
                                      sx={{ fontSize: "0.9rem" }}
                                    />
                                  </IconButton>
                                )}
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(comment.id, post.id)}
                                  sx={{ p: 0.5, color: "#606060", "&:hover": { color: "#FF0000" } }}
                                >
                                  <Delete
                                    fontSize="small"
                                    sx={{ fontSize: "0.9rem" }}
                                  />
                                </IconButton>
                              </Box>
                            )}
                          </Box>
                        )}
                      </ListItem>
                    ))}
                </List>

                {/* Post Time with elegant styling */}
                <Typography
                  variant="caption"
                  sx={{
                    mt: 1.5,
                    display: "block",
                    color: "#606060",
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </Typography>

                {/* Add Comment Input with better styling */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 2,
                    pt: 2,
                    borderTop: "1px solid #FFCDD2",
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder="Add a comment..."
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                      sx: { fontSize: "0.9rem", color: "#212121" },
                    }}
                    value={newCommentText[post.id] || ""}
                    onChange={(e) =>
                      setNewCommentText((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleCommentSubmit(post.id);
                      }
                    }}
                    sx={{
                      "& .MuiInputBase-root": {
                        borderBottom: "1px solid #FFCDD2",
                        "&:hover": { borderBottom: "1px solid #FF0000" },
                        "&.Mui-focused": { borderBottom: "1px solid #FF0000" },
                      },
                    }}
                  />
                  <Button
                    onClick={() => handleCommentSubmit(post.id)}
                    disabled={!newCommentText[post.id]}
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                      color: !newCommentText[post.id] ? "#FFCDD2" : "#FF0000",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "transparent",
                        color: "#D32F2F",
                      },
                    }}
                  >
                    Post
                  </Button>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      </Box>
      
      <Leftsidebar />
    </Box>
  );
}