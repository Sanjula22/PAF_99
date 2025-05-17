import React, { useState, useEffect } from "react";
import axios from "../api/axiosConfig";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Container,
  Typography,
  Grid,
  IconButton,
  Paper,
  Divider,
  CircularProgress,
  Modal,
  Fade,
  Backdrop,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
} from "@mui/material";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Leftsidebar from "../components/homepage/Leftsidebar";
import { toast } from "react-toastify";

const ProgressUpdate = () => {
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [learningPlans, setLearningPlans] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUpdateId, setCurrentUpdateId] = useState(null);
  const [formData, setFormData] = useState({
    content: "",
    templateType: "TEXT",
    learningPlanId: "",
  });
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});

  const API_BASE_URL = "http://localhost:9090";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProgressUpdates();
    fetchLearningPlans();
  }, []);

  const fetchProgressUpdates = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user/progress-updates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProgressUpdates(response.data);
    } catch (err) {
      console.error("Error fetching progress updates:", err);
      toast.error(err.response?.data?.error || "Failed to fetch progress updates");
    } finally {
      setLoading(false);
    }
  };

  // Fetch learning plans for the select dropdown
  const fetchLearningPlans = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/learning-plans/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLearningPlans(response.data);
    } catch (err) {
      console.error("Error fetching learning plans:", err);
      toast.error(err.response?.data?.error || "Failed to fetch learning plans");
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.content.trim()) {
      errors.content = "Content is required";
    }
    if (formData.content.length > 500) {
      errors.content = "Content cannot exceed 500 characters";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const url = isEdit
        ? `${API_BASE_URL}/api/user/progress-updates/${currentUpdateId}${
            formData.learningPlanId ? `?learningPlanId=${formData.learningPlanId}` : ""
          }`
        : `${API_BASE_URL}/api/user/progress-updates${
            formData.learningPlanId ? `?learningPlanId=${formData.learningPlanId}` : ""
          }`;
      const method = isEdit ? "put" : "post";

      await axios[method](
        url,
        {
          content: formData.content,
          templateType: formData.templateType,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(isEdit ? "Progress update edited!" : "Progress update created!");
      await fetchProgressUpdates();
      resetForm();
      setOpenModal(false);
    } catch (err) {
      console.error("Error saving progress update:", err);
      toast.error(err.response?.data?.error || "Failed to save progress update");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (update) => {
    setIsEdit(true);
    setCurrentUpdateId(update.id);
    setFormData({
      content: update.content,
      templateType: update.templateType || "TEXT",
      learningPlanId: update.learningPlan?.id || "",
    });
    setOpenModal(true);
  };

  const handleDelete = async (updateId) => {
    if (!window.confirm("Are you sure you want to delete this progress update?")) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/user/progress-updates/${updateId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Progress update deleted!");
      await fetchProgressUpdates();
    } catch (err) {
      console.error("Error deleting progress update:", err);
      toast.error(err.response?.data?.error || "Failed to delete progress update");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsEdit(false);
    setCurrentUpdateId(null);
    setFormData({ content: "", templateType: "TEXT", learningPlanId: "" });
    setFormErrors({});
  };

  const getTemplateTypeColor = (type) => {
    switch (type) {
      case "TEXT":
        return "#FF0000";
      case "MARKDOWN":
        return "#00FF00";
      default:
        return "#606060";
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#FFFFFF" }}>
      <Container maxWidth="lg" sx={{ my: 4, flex: 1 }}>
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            mb: 4,
            borderRadius: 2,
            background: "#FF0000",
            color: "#FFFFFF",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "100%",
              height: "100%",
              opacity: 0.1,
              background: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><path d=\"M0 0 L50 50 L100 0 Z\" fill=\"%23fff\"/></svg>')",
              backgroundSize: "20px 20px",
            }}
          />
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <BookmarkAddIcon sx={{ fontSize: 36, mr: 2, color: "#FFFFFF" }} />
              <Box>
                <Typography variant="h4" fontWeight="700" sx={{ color: "#FFFFFF" }}>
                  My Progress Updates
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.9)", mt: 0.5 }}>
                  Track and share your learning journey
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<BookmarkAddIcon />}
              onClick={() => setOpenModal(true)}
              sx={{
                bgcolor: "#FFFFFF",
                color: "#FF0000",
                borderRadius: 2,
                px: 2,
                py: 1,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { bgcolor: "#FFF0F0" },
                display: { xs: "none", sm: "flex" },
              }}
            >
              Add Update
            </Button>
          </Box>
        </Paper>

        {/* Progress Updates List */}
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card sx={{ borderRadius: 2, height: "100%", border: "1px solid #FF4D4D" }}>
                  <Skeleton variant="rectangular" height={6} />
                  <CardContent>
                    <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
                    <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : progressUpdates.length === 0 ? (
          <Box
            sx={{
              p: 6,
              textAlign: "center",
              bgcolor: "#FFFFFF",
              borderRadius: 2,
              border: "1px solid #FF4D4D",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                bgcolor: "#FFF0F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <BookmarkAddIcon sx={{ fontSize: 48, color: "#FF0000" }} />
            </Box>
            <Typography variant="h5" fontWeight={600} color="#FF0000" sx={{ mb: 1 }}>
              No progress updates found
            </Typography>
            <Typography variant="body1" color="#FF0000" sx={{ mb: 3, maxWidth: 400, mx: "auto" }}>
              Start tracking your learning progress today!
            </Typography>
            <Button
              variant="contained"
              startIcon={<BookmarkAddIcon />}
              onClick={() => setOpenModal(true)}
              sx={{
                bgcolor: "#FF0000",
                px: 3,
                py: 1.2,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                color: "#FFFFFF",
                "&:hover": { bgcolor: "#E60000" },
              }}
            >
              Create Your First Update
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {progressUpdates.map((update) => (
              <Grid item xs={12} sm={6} md={4} key={update.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    border: "1px solid #FF4D4D",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  <Box sx={{ height: 6, bgcolor: getTemplateTypeColor(update.templateType) }} />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                      <Chip
                        label={update.templateType}
                        size="small"
                        sx={{
                          bgcolor: `${getTemplateTypeColor(update.templateType)}20`,
                          color: getTemplateTypeColor(update.templateType),
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#FF0000",
                        fontWeight: 700,
                        mb: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {update.content}
                    </Typography>
                    <Typography variant="body2" color="#FF0000" sx={{ mb: 1 }}>
                      Learning Plan: {update.learningPlan?.title || "None"}
                    </Typography>
                    <Typography variant="body2" color="#FF0000" sx={{ mb: 2 }}>
                      Created: {new Date(update.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
                    <IconButton
                      onClick={() => handleEdit(update)}
                      sx={{ color: "#FF0000", "&:hover": { color: "#E60000" } }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(update.id)}
                      sx={{ color: "#FF0000", "&:hover": { color: "#E60000" } }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Modal for Create/Edit Progress Update */}
        <Modal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            resetForm();
          }}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={openModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "90%",
                maxWidth: 500,
                bgcolor: "#FFFFFF",
                borderRadius: 3,
                boxShadow: 24,
                p: 4,
                outline: "none",
              }}
            >
              <Typography variant="h5" fontWeight="bold" color="#FF0000" sx={{ mb: 3, textAlign: "center" }}>
                {isEdit ? "Edit Progress Update" : "Create Progress Update"}
              </Typography>
              <TextField
                label="Content"
                name="content"
                value={formData.content}
                onChange={handleFormChange}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Describe your progress..."
                error={!!formErrors.content}
                helperText={formErrors.content}
                sx={{
                  mb: 3,
                  "& .MuiInputLabel-root.Mui-focused": { color: "#FF0000" },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#FF0000" },
                    borderRadius: 2,
                  },
                }}
              />
              <FormControl
                fullWidth
                sx={{
                  mb: 3,
                  "& .MuiInputLabel-root.Mui-focused": { color: "#FF0000" },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#FF0000" },
                    borderRadius: 2,
                  },
                }}
              >
                <InputLabel>Template Type</InputLabel>
                <Select
                  name="templateType"
                  value={formData.templateType}
                  onChange={handleFormChange}
                  label="Template Type"
                >
                  <MenuItem value="TEXT">Text</MenuItem>
                  <MenuItem value="MARKDOWN">Markdown</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                sx={{
                  mb: 3,
                  "& .MuiInputLabel-root.Mui-focused": { color: "#FF0000" },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#FF0000" },
                    borderRadius: 2,
                  },
                }}
              >
                <InputLabel>Learning Plan</InputLabel>
                <Select
                  name="learningPlanId"
                  value={formData.learningPlanId}
                  onChange={handleFormChange}
                  label="Learning Plan"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {learningPlans.map((plan) => (
                    <MenuItem key={plan.id} value={plan.id}>
                      {plan.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Button
                  onClick={() => {
                    setOpenModal(false);
                    resetForm();
                  }}
                  sx={{
                    color: "#757575",
                    textTransform: "none",
                    fontWeight: 500,
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{
                    bgcolor: "#FF0000",
                    color: "#FFFFFF",
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "#E60000" },
                    "&:disabled": { bgcolor: "#FF9999" },
                  }}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {isEdit ? "Update" : "Create"}
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Container>
      <Leftsidebar />
    </Box>
  );
};

export default ProgressUpdate;