// Profile.js
import { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import {
  Container,
  Typography,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Card,
  CardContent,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  Chip,
  Badge,
  AvatarGroup,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import { toast } from "react-toastify";
import Leftsidebar from "../components/homepage/Leftsidebar";
import StatusUpload from "../components/StatusUpload";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import AddPostForm from "../pages/AddPost";
import { useAuth } from "../auth/AuthContext"; // Added to access user data

export default function Profile() {
  const { user } = useAuth(); // Added to get user data including profileImage
  const [posts, setPosts] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [followRequests, setFollowRequests] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:9090";
  const [statuses, setStatuses] = useState([]);
  const [followCounts, setFollowCounts] = useState({
    followers: 0,
    following: 0,
  });
  const [showAddPostModal, setShowAddPostModal] = useState(false);

  const fetchFollowCounts = () => {
    axios.get("/follow/counts").then((res) => setFollowCounts(res.data));
  };

  const fetchPosts = () => {
    axios.get("/posts/my").then((res) => setPosts(res.data));
  };

  const fetchFollowRequests = () => {
    axios.get("/follow/requests").then((res) => setFollowRequests(res.data));
  };

  useEffect(() => {
    fetchPosts();
    fetchFollowRequests();
    fetchFollowCounts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/posts/${id}`);
      toast.success("Post deleted");
      fetchPosts();
    } catch (err) {
      toast.error("Failed to delete post");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleAcceptFollow = (followId) => {
    axios.post(`/follow/accept/${followId}`).then(() => {
      toast.success("Follow request accepted");
      setFollowRequests((prev) => prev.filter((req) => req.id !== followId));
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

  const handleEditProfile = () => { // Added function for edit button
    navigate("/settings");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
        backgroundColor: "#F5F5F5",
      }}
    >
      
      <Container maxWidth="lg" sx={{ mt: 5, pb: 8 }}>
        {/* Profile Header */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            mb: 4,
            borderRadius: 3,
            backgroundColor: "#FFFFFF",
            boxShadow: "0px 2px 16px rgba(0, 0, 0, 0.05)",
            overflow: "hidden",
            border: "1px solid #FFCDD2",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Box 
              sx={{ 
                position: "absolute", 
                top: -80, 
                left: -20, 
                right: -20, 
                height: 160, 
                background: "linear-gradient(135deg, #FF0000 0%, #D32F2F 100%)",
                opacity: 0.1,
                borderRadius: "100% / 40%",
                zIndex: 0 
              }} 
            />
            <Box 
              display="flex" 
              flexDirection={{ xs: "column", sm: "row" }} 
              alignItems={{ xs: "center", sm: "flex-start" }} 
              mb={4}
              position="relative"
              zIndex={1}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <IconButton
                    size="small"
                    onClick={handleEditProfile} // Added navigation to settings
                    sx={{
                      bgcolor: "#FF0000",
                      color: "#FFFFFF",
                      "&:hover": { bgcolor: "#D32F2F" },
                      boxShadow: "0px 2px 8px rgba(255, 0, 0, 0.3)",
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                }
              >
                <Avatar
                  sx={{
                    width: 96,
                    height: 96,
                    bgcolor: "#FF0000",
                    border: "4px solid #FFFFFF",
                    boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.06)",
                  }}
                  src={user?.profileImage ? `${BASE_URL}${user.profileImage}` : undefined} // Updated with user data
                  alt={user?.username || "Your Profile"} // Updated with user data
                >
                  <AccountCircleIcon sx={{ fontSize: 60, color: "#FFFFFF" }} />
                </Avatar>
              </Badge>
              <Box 
                ml={{ xs: 0, sm: 3 }}
                mt={{ xs: 2, sm: 0 }}
                textAlign={{ xs: "center", sm: "left" }}
              >
                <Typography variant="h5" fontWeight="700" color="#212121">
                  Your Profile
                </Typography>
                <Typography variant="body2" sx={{ color: "#606060" }}>
                  View and manage your profile information
                </Typography>
              </Box>
              <Box flexGrow={1} />
              <Box 
                display="flex" 
                gap={2}
                mt={{ xs: 3, sm: 0 }}
                flexDirection={{ xs: "column", sm: "row" }}
                width={{ xs: "100%", sm: "auto" }}
              >
                <Button
                  variant="outlined"
                  startIcon={<BookmarkIcon />}
                  onClick={() => navigate("/my-learning-plans")}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    px: 3,
                    py: 1.2,
                    borderColor: "#FFCDD2",
                    color: "#212121",
                    fontWeight: 600,
                    "&:hover": {
                      borderColor: "#FF0000",
                      backgroundColor: "#FFEBEE",
                      color: "#FF0000",
                    },
                  }}
                >
                  My Learning
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => navigate("/add-post")}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    px: 3,
                    py: 1.2,
                    fontWeight: 600,
                    backgroundColor: "#FF0000",
                    color: "#FFFFFF",
                    boxShadow: "0px 4px 14px rgba(255, 0, 0, 0.2)",
                    "&:hover": { 
                      backgroundColor: "#D32F2F",
                      boxShadow: "0px 4px 18px rgba(211, 47, 47, 0.25)",
                    },
                  }}
                >
                  Add Post
                </Button>
              </Box>
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <StatusUpload onUpload={loadStatuses} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 3,
                    p: 3,
                    border: "1px solid #FFCDD2",
                    boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.03)",
                  }}
                >
                  <Box 
                    display="flex" 
                    justifyContent="space-around" 
                    mb={2}
                    sx={{
                      background: "linear-gradient(to right, rgba(255, 0, 0, 0.03), rgba(211, 47, 47, 0.03))",
                      borderRadius: 2,
                      py: 2,
                    }}
                  >
                    <Box textAlign="center">
                      <Typography variant="h4" fontWeight="700" color="#212121">
                        {followCounts.followers}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#606060" }}>
                        Followers
                      </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ mx: 2, borderColor: "#FFCDD2" }} />
                    <Box textAlign="center">
                      <Typography variant="h4" fontWeight="700" color="#212121">
                        {followCounts.following}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#606060" }}>
                        Following
                      </Typography>
                    </Box>
                  </Box>
                  <Box mt={3}>
                    {/* <Typography
                      variant="body2"
                      fontWeight={500}
                      sx={{ color: "#212121", mb: 1.5 }}
                    >
                      Recent followers
                    </Typography> */}
                    {/* <AvatarGroup 
                      max={5}
                      sx={{ 
                        justifyContent: "flex-start",
                        "& .MuiAvatar-root": {
                          width: 40,
                          height: 40,
                          border: "2px solid #FFFFFF",
                          boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.05)",
                        }
                      }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <Avatar
                          key={i}
                          sx={{ 
                            bgcolor: i % 2 === 0 ? "#FF0000" : "#FFCDD2",
                            color: "#FFFFFF",
                          }}
                        >
                          {String.fromCharCode(65 + i)}
                        </Avatar>
                      ))}
                    </AvatarGroup> */}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Follow Requests */}
        {followRequests.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 3,
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 2px 16px rgba(0, 0, 0, 0.05)",
              border: "1px solid #FFCDD2",
            }}
          >
            <Box display="flex" alignItems="center" mb={3}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: "rgba(255, 0, 0, 0.08)",
                  mr: 2,
                }}
              >
                <PersonAddIcon sx={{ color: "#FF0000" }} />
              </Box>
              <Typography variant="h6" fontWeight="600" color="#212121">
                Follow Requests
              </Typography>
              <Box flexGrow={1} />
              <Chip
                label={followRequests.length}
                size="small"
                sx={{
                  backgroundColor: "rgba(255, 0, 0, 0.08)",
                  color: "#FF0000",
                  fontWeight: 600,
                  borderRadius: 2,
                  border: "none",
                }}
              />
            </Box>
            <List disablePadding>
              {followRequests.map((req) => (
                <ListItem
                  key={req.id}
                  sx={{
                    mb: 2,
                    backgroundColor: "#F5F5F5",
                    borderRadius: 2,
                    "&:hover": { backgroundColor: "#E0E0E0" },
                    py: 1.5,
                    px: 2,
                  }}
                  secondaryAction={
                    <Box display="flex" gap={1}>
                      <Button
                        size="small"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          color: "#606060",
                          fontWeight: 500,
                          "&:hover": { backgroundColor: "#FFEBEE" },
                        }}
                      >
                        Ignore
                      </Button>
                      <Button
                        onClick={() => handleAcceptFollow(req.id)}
                        variant="contained"
                        size="small"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          px: 3,
                          fontWeight: 500,
                          backgroundColor: "#FF0000",
                          color: "#FFFFFF",
                          "&:hover": { backgroundColor: "#D32F2F" },
                          boxShadow: "0px 2px 8px rgba(255, 0, 0, 0.2)",
                        }}
                      >
                        Accept
                      </Button>
                    </Box>
                  }
                >
                  <Avatar
                    sx={{ 
                      mr: 2, 
                      bgcolor: "#FF0000",
                      color: "#FFFFFF",
                      width: 42, 
                      height: 42,
                      border: "2px solid #FFFFFF",
                      boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.03)",
                    }}
                    src={req.follower.profileImage ? `${BASE_URL}${req.follower.profileImage}` : undefined}
                    alt={req.follower.username}
                  >
                    {(!req.follower.profileImage || !req.follower.username) && (req.follower.username?.charAt(0).toUpperCase() || "U")}
                  </Avatar>
                  <ListItemText
                    primary={
                      <Typography fontWeight="600" color="#212121">
                        {req.follower.username}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: "#606060" }}>
                        {req.follower.email}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* My Posts Section */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3.5}
          mt={5}
        >
          <Typography variant="h5" fontWeight="700" color="#212121">
            My Posts
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} lg={4} key={post.id}>
              <Card
                sx={{
                  bgcolor: "#FFFFFF",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.03)",
                  border: "1px solid #FFCDD2",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.06)",
                  },
                }}
              >
                {post.mediaPaths?.length > 0 && (
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16/9",
                      maxHeight: 220,
                      overflow: "hidden",
                    }}
                  >
                    <Swiper 
                      slidesPerView={1} 
                      style={{ borderRadius: "0" }}
                    >
                      {post.mediaPaths.map((path, idx) => (
                        <SwiperSlide key={idx}>
                          <Box
                            sx={{
                              width: "100%",
                              height: "220px",
                              overflow: "hidden",
                              maxWidth: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#F5F5F5",
                            }}
                          >
                            {path.toLowerCase().endsWith(".mp4") ? (
                              <video
                                src={`${BASE_URL}${path}`}
                                controls
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  backgroundColor: "#000",
                                }}
                              />
                            ) : (
                              <img
                                src={`${BASE_URL}${path}`}
                                alt={`media-${idx}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            )}
                          </Box>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "100%",
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0) 30%)",
                        zIndex: 2,
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        display: "flex",
                        gap: 1,
                        zIndex: 10,
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.9)",
                          backdropFilter: "blur(4px)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                          "&:hover": { bgcolor: "#FFFFFF" },
                          width: 36,
                          height: 36,
                        }}
                        onClick={() => navigate(`/edit-post/${post.id}`)}
                      >
                        <EditIcon fontSize="small" sx={{ color: "#FF0000" }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.9)",
                          backdropFilter: "blur(4px)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                          "&:hover": { bgcolor: "#FFFFFF" },
                          width: 36,
                          height: 36,
                        }}
                        onClick={() => setConfirmDeleteId(post.id)}
                      >
                        <DeleteIcon
                          fontSize="small"
                          sx={{ color: "#FF0000" }}
                        />
                      </IconButton>
                    </Box>
                  </Box>
                )}
                <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <Avatar
                      sx={{
                        bgcolor: "#FF0000",
                        color: "#FFFFFF",
                        width: 36,
                        height: 36,
                        border: "2px solid #FFFFFF",
                        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.03)",
                      }}
                      src={post.user?.profileImage ? `${BASE_URL}${post.user.profileImage}` : undefined}
                      alt={post.user?.username || "You"}
                    >
                      {(!post.user?.profileImage || !post.user?.username) && (post.user?.username?.charAt(0).toUpperCase() || "U")}
                    </Avatar>
                    <Typography variant="subtitle2" color="#212121" fontWeight={500}>
                      {post.user?.username || "You"}
                    </Typography>
                    <Box flexGrow={1} />
                    <IconButton size="small" sx={{ color: "#606060" }}>
                      <MoreHorizIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    mb={1.5}
                    color="#212121"
                    sx={{
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 1,
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="#606060"
                    sx={{
                      lineHeight: 1.6,
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 3,
                      mt: "auto",
                    }}
                  >
                    {post.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={!!confirmDeleteId}
          onClose={() => setConfirmDeleteId(null)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 1,
              maxWidth: "400px",
              width: "100%",
              boxShadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)",
              bgcolor: "#F5F5F5",
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, pt: 3, pb: 2, color: "#212121" }}>
            Are you sure you want to delete this post?
          </DialogTitle>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={() => setConfirmDeleteId(null)}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                py: 1,
                fontWeight: 600,
                color: "#606060",
                "&:hover": { bgcolor: "#E0E0E0" },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDelete(confirmDeleteId)}
              color="error"
              variant="contained"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                py: 1,
                fontWeight: 600,
                bgcolor: "#FF0000",
                "&:hover": { bgcolor: "#D32F2F" },
                boxShadow: "0px 2px 8px rgba(255, 0, 0, 0.2)",
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Modal
          open={showAddPostModal}
          onClose={() => setShowAddPostModal(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={showAddPostModal}>
            <Box
              sx={{
                width: "90%",
                maxWidth: 600,
                margin: "10vh auto",
                outline: "none",
                borderRadius: 3,
                overflow: "hidden",
                bgcolor: "#F5F5F5",
              }}
            >
              <AddPostForm
                onClose={() => setShowAddPostModal(false)}
                onPostCreated={() =>
                  axios.get("/posts/my").then((res) => setPosts(res.data))
                }
              />
            </Box>
          </Fade>
        </Modal>
      </Container>
      <Leftsidebar />
    </Box>
  );
}