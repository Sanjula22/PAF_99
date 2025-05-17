import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Avatar,
  Divider,
  Chip,
  Paper,
  Button,
  IconButton,
  Skeleton,
  Modal,
  Fade,
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import Leftsidebar from "../components/homepage/Leftsidebar";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LinkIcon from "@mui/icons-material/Link";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { toast } from "react-toastify";

export default function LearningPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [newPlan, setNewPlan] = useState({
    title: "",
    topics: "",
    resources: "",
    targetDate: "",
    progress: "Not Started",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get("/learning-plans/all");
        setPlans(res.data);
      } catch (error) {
        console.error("Failed to fetch learning plans:", error);
        toast.error("Could not fetch learning plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const validateForm = (data) => {
    const errors = {};
    if (!data.title.trim()) errors.title = "Title is required";
    if (!data.topics.trim()) errors.topics = "At least one topic is required";
    if (!data.targetDate) errors.targetDate = "Target date is required";
    return errors;
  };

  const handlePlanCreated = () => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get("/learning-plans/all");
        setPlans(res.data);
      } catch (error) {
        console.error("Failed to fetch learning plans:", error);
        toast.error("Could not fetch learning plans");
      }
    };
    fetchPlans();
    setNewPlan({ title: "", topics: "", resources: "", targetDate: "", progress: "Not Started" });
    setFormErrors({});
  };

  const handleSaveNewPlan = async () => {
    const errors = validateForm(newPlan);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (newPlan.targetDate < today) {
      setFormErrors({ targetDate: "Target date cannot be in the past" });
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("/learning-plans", {
        ...newPlan,
        topics: newPlan.topics.split(",").map((t) => t.trim()).filter((t) => t),
        resources: newPlan.resources.split(",").map((r) => r.trim()).filter((r) => r),
      });
      toast.success("Plan created!");
      handlePlanCreated();
      setOpenAddModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this learning plan?")) {
      return;
    }

    try {
      await axios.delete(`/learning-plans/${planId}`);
      setPlans(plans.filter((plan) => plan.id !== planId));
      toast.success("Plan deleted!");
    } catch (error) {
      console.error("Failed to delete learning plan:", error);
      toast.error(error.response?.data?.message || "Failed to delete plan.");
    }
  };

  const handleEditPlan = (plan) => {
    setEditForm({
      id: plan.id,
      title: plan.title,
      topics: plan.topics.join(", "),
      resources: plan.resources.join(", "),
      targetDate: plan.targetDate,
      progress: plan.progress,
    });
    setFormErrors({});
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    const errors = validateForm(editForm);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (editForm.targetDate < today) {
      setFormErrors({ targetDate: "Target date cannot be in the past" });
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.put(`/learning-plans/${editForm.id}`, {
        ...editForm,
        topics: editForm.topics.split(",").map((t) => t.trim()).filter((t) => t),
        resources: editForm.resources.split(",").map((r) => r.trim()).filter((r) => r),
      });
      toast.success("Plan updated!");
      const fetchPlans = async () => {
        try {
          const res = await axios.get("/learning-plans/all");
          setPlans(res.data);
        } catch (error) {
          console.error("Failed to fetch learning plans:", error);
          toast.error("Could not fetch learning plans");
        }
      };
      fetchPlans();
      setEditDialogOpen(false);
      setEditForm(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get progress color
  const getProgressColor = (status) => {
    switch (status) {
      case "Not Started":
        return "#606060";
      case "In Progress":
        return "#FF0000";
      case "On Hold":
        return "#FF9900";
      case "Completed":
        return "#00FF00";
      default:
        return "#606060";
    }
  };

  // Helper function to get status emoji
  const getStatusEmoji = (status) => {
    switch (status) {
      case "Not Started":
        return "🔮";
      case "In Progress":
        return "🚀";
      case "On Hold":
        return "⏸";
      case "Completed":
        return "✅";
      default:
        return "📚";
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
        bgcolor: "#FFFFFF",
      }}
    >
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
              <LightbulbIcon sx={{ fontSize: 36, mr: 2, color: "#FFFFFF" }} />
              <Box>
                <Typography variant="h4" fontWeight="700" sx={{ color: "#FFFFFF" }}>
                  Learning Plans
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.9)", mt: 0.5 }}>
                  Share with others and learn together
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => setOpenAddModal(true)}
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
              Create Plan
            </Button>
          </Box>
        </Paper>

        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card sx={{ borderRadius: 2, height: "100%", overflow: "hidden", border: "1px solid #FF4D4D" }}>
                  <Skeleton variant="rectangular" height={6} />
                  <CardContent>
                    <Skeleton variant="rectangular" height={25} width={80} sx={{ borderRadius: 1, mb: 1 }} />
                    <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
                    <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" height={40} sx={{ mb: 1 }} />
                    <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Skeleton variant="circular" width={32} height={32} sx={{ mr: 1.5 }} />
                      <Skeleton variant="text" width={100} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : plans.length === 0 ? (
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
              <MenuBookIcon sx={{ fontSize: 48, color: "#FF0000" }} />
            </Box>
            <Typography variant="h5" fontWeight={600} color="#FF0000" sx={{ mb: 1 }}>
              No learning plans found
            </Typography>
            <Typography variant="body1" color="#FF0000" sx={{ mb: 3, maxWidth: 400, mx: "auto" }}>
              Be the first to share your learning journey with the community!
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => setOpenAddModal(true)}
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
              Create Your First Plan
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {plans.map((plan) => (
              <Grid item xs={12} sm={6} md={4} key={plan.id}>
                <Card
                  sx={{
                    bgcolor: "#FFFFFF",
                    borderRadius: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                    },
                    border: "1px solid #FF4D4D",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Box sx={{ height: 8, width: "100%", bgcolor: getProgressColor(plan.progress) }} />
                  <CardContent sx={{ flex: 1, p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Chip
                        icon={<Box component="span" sx={{ mr: -0.5 }}>{getStatusEmoji(plan.progress)}</Box>}
                        label={plan.progress}
                        size="small"
                        sx={{
                          bgcolor: `${getProgressColor(plan.progress)}20`,
                          color: getProgressColor(plan.progress),
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          height: 28,
                          border: `1px solid ${getProgressColor(plan.progress)}30`,
                          borderRadius: 1,
                          "& .MuiChip-icon": { fontSize: "1rem" },
                        }}
                      />
                      <Box>
                        <IconButton size="small" sx={{ color: "#FF0000" }} onClick={() => handleEditPlan(plan)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: "#FF0000" }} onClick={() => handleDeletePlan(plan.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: "#FF0000" }}>
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color: "#FF0000",
                        fontWeight: 700,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        lineHeight: 1.3,
                        height: "2.6em",
                        mb: 2,
                      }}
                    >
                      {plan.title}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                        p: 1.5,
                        bgcolor: "#FFF0F0",
                        borderRadius: 1,
                      }}
                    >
                      <MenuBookIcon sx={{ color: "#FF0000", mr: 1.5, fontSize: 18 }} />
                      <Typography
                        variant="body2"
                        color="#FF0000"
                        fontWeight={500}
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {plan.topics.join(", ")}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                      <LinkIcon sx={{ color: "#FF0000", mr: 1.5, fontSize: 18, mt: 0.3 }} />
                      <Typography
                        variant="body2"
                        color="#FF0000"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          lineHeight: 1.3,
                          height: "2.6em",
                        }}
                      >
                        {plan.resources.join(", ")}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                        p: 1.5,
                        bgcolor: "#FFF0F0",
                        borderRadius: 1,
                      }}
                    >
                      <CalendarTodayIcon sx={{ color: "#FF0000", mr: 1.5, fontSize: 18 }} />
                      <Typography variant="body2" color="#FF0000" fontWeight={500}>
                        {new Date(plan.targetDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2, background: "#E0E0E0" }} />
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar
                          sx={{
                            bgcolor: "#FF0000",
                            width: 36,
                            height: 36,
                            border: "2px solid #FFCDD2",
                          }}
                          src={plan.profileImage ? `http://localhost:9090${plan.profileImage}` : undefined}
                          alt={plan.username}
                        >
                          {(!plan.profileImage || !plan.username) && (plan.username?.charAt(0).toUpperCase() || "U")}
                        </Avatar>
                        <Typography variant="body2" color="#212121" fontWeight={600}>
                          {plan.username || "Anonymous"}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Modal for Create Learning Plan */}
        <Modal
          open={openAddModal}
          onClose={() => {
            setOpenAddModal(false);
            setFormErrors({});
            setNewPlan({ title: "", topics: "", resources: "", targetDate: "", progress: "Not Started" });
          }}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={openAddModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: "90%", sm: 400 },
                bgcolor: "white",
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(255, 0, 0, 0.1)",
                p: 4,
                outline: "none",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <DialogTitle sx={{ textAlign: "center", mb: 2, color: "#FF0000" }}>
                <Typography variant="h5" fontWeight="bold">
                  Create Learning Plan
                </Typography>
              </DialogTitle>
              <DialogContent sx={{ p: 0 }}>
                <TextField
                  label="Title"
                  fullWidth
                  value={newPlan.title}
                  onChange={(e) => {
                    setNewPlan({ ...newPlan, title: e.target.value });
                    setFormErrors({ ...formErrors, title: e.target.value.trim() ? "" : "Title is required" });
                  }}
                  error={!!formErrors.title}
                  helperText={formErrors.title || "Enter the title of your learning plan"}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": { borderColor: "#FF4D4D" },
                      "&.Mui-focused fieldset": { borderColor: "#FF0000" },
                    },
                    "& .MuiInputLabel-root": { color: "#757575" },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#FF0000" },
                  }}
                />
                <TextField
                  label="Topics (comma-separated)"
                  fullWidth
                  value={newPlan.topics}
                  onChange={(e) => {
                    setNewPlan({ ...newPlan, topics: e.target.value });
                    setFormErrors({ ...formErrors, topics: e.target.value.trim() ? "" : "At least one topic is required" });
                  }}
                  error={!!formErrors.topics}
                  helperText={formErrors.topics || "E.g., JavaScript, React, CSS"}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": { borderColor: "#FF4D4D" },
                      "&.Mui-focused fieldset": { borderColor: "#FF0000" },
                    },
                    "& .MuiInputLabel-root": { color: "#757575" },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#FF0000" },
                  }}
                />
                <TextField
                  label="Resources (comma-separated)"
                  fullWidth
                  value={newPlan.resources}
                  onChange={(e) => setNewPlan({ ...newPlan, resources: e.target.value })}
                  helperText="E.g., YouTube tutorials, Documentation (optional)"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": { borderColor: "#FF4D4D" },
                      "&.Mui-focused fieldset": { borderColor: "#FF0000" },
                    },
                    "& .MuiInputLabel-root": { color: "#757575" },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#FF0000" },
                  }}
                />
                <TextField
                  label="Target Date"
                  type="date"
                  fullWidth
                  value={newPlan.targetDate}
                  onChange={(e) => {
                    setNewPlan({ ...newPlan, targetDate: e.target.value });
                    const today = new Date().toISOString().split("T")[0];
                    setFormErrors({
                      ...formErrors,
                      targetDate: e.target.value
                        ? e.target.value < today
                          ? "Target date cannot be in the past"
                          : ""
                        : "Target date is required",
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: new Date().toISOString().split("T")[0] }}
                  error={!!formErrors.targetDate}
                  helperText={formErrors.targetDate || "Select a completion date"}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": { borderColor: "#FF4D4D" },
                      "&.Mui-focused fieldset": { borderColor: "#FF0000" },
                    },
                    "& .MuiInputLabel-root": { color: "#757575" },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#FF0000" },
                  }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel sx={{ color: "#757575", "&.Mui-focused": { color: "#FF0000" } }}>
                    Progress Status
                  </InputLabel>
                  <Select
                    value={newPlan.progress}
                    label="Progress Status"
                    onChange={(e) => setNewPlan({ ...newPlan, progress: e.target.value })}
                    sx={{
                      borderRadius: 2,
                      "& .MuiOutlinedInput-notchedOutline": {
                        "&:hover": { borderColor: "#FF4D4D" },
                        "&.Mui-focused": { borderColor: "#FF0000" },
                      },
                    }}
                  >
                    <MenuItem value="Not Started">Not Started</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="On Hold">On Hold</MenuItem>
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions sx={{ justifyContent: "center", gap: 2, mt: 2 }}>
                <Button
                  onClick={() => {
                    setOpenAddModal(false);
                    setFormErrors({});
                    setNewPlan({ title: "", topics: "", resources: "", targetDate: "", progress: "Not Started" });
                  }}
                  sx={{
                    color: "#757575",
                    textTransform: "none",
                    fontWeight: 500,
                    borderRadius: 8,
                    px: 4,
                    py: 1,
                    "&:hover": { bgcolor: "#FFF0F0", color: "#FF0000" },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaveNewPlan}
                  disabled={isSubmitting || Object.values(formErrors).some((error) => error)}
                  sx={{
                    bgcolor: "#FF0000",
                    color: "white",
                    borderRadius: 8,
                    px: 4,
                    py: 1,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "#E60000" },
                    "&:disabled": { bgcolor: "#FF9999" },
                  }}
                >
                  Create Plan
                </Button>
              </DialogActions>
            </Box>
          </Fade>
        </Modal>

        {/* Edit Plan Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setFormErrors({});
            setEditForm(null);
          }}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(255, 0, 0, 0.1)",
              maxWidth: 400,
              mx: "auto",
            },
          }}
        >
          <DialogTitle sx={{ pb: 1, textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FF0000" }}>
              Edit Learning Plan
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {editForm && (
              <Box>
                <TextField
                  label="Title"
                  fullWidth
                  margin="normal"
                  value={editForm.title}
                  onChange={(e) => {
                    setEditForm({ ...editForm, title: e.target.value });
                    setFormErrors({ ...formErrors, title: e.target.value.trim() ? "" : "Title is required" });
                  }}
                  error={!!formErrors.title}
                  helperText={formErrors.title || "Enter the title of your learning plan"}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": { borderColor: "#FF4D4D" },
                      "&.Mui-focused fieldset": { borderColor: "#FF0000" },
                    },
                    "& .MuiInputLabel-root": { color: "#757575" },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#FF0000" },
                  }}
                />
                <TextField
                  label="Topics (comma-separated)"
                  fullWidth
                  margin="normal"
                  value={editForm.topics}
                  onChange={(e) => {
                    setEditForm({ ...editForm, topics: e.target.value });
                    setFormErrors({ ...formErrors, topics: e.target.value.trim() ? "" : "At least one topic is required" });
                  }}
                  error={!!formErrors.topics}
                  helperText={formErrors.topics || "E.g., JavaScript, React, CSS"}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": { borderColor: "#FF4D4D" },
                      "&.Mui-focused fieldset": { borderColor: "#FF0000" },
                    },
                    "& .MuiInputLabel-root": { color: "#757575" },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#FF0000" },
                  }}
                />
                <TextField
                  label="Resources (comma-separated)"
                  fullWidth
                  margin="normal"
                  value={editForm.resources}
                  onChange={(e) => setEditForm({ ...editForm, resources: e.target.value })}
                  helperText="E.g., YouTube tutorials, Documentation (optional)"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": { borderColor: "#FF4D4D" },
                      "&.Mui-focused fieldset": { borderColor: "#FF0000" },
                    },
                    "& .MuiInputLabel-root": { color: "#757575" },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#FF0000" },
                  }}
                />
                <TextField
                  label="Target Date"
                  type="date"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  value={editForm.targetDate}
                  onChange={(e) => {
                    setEditForm({ ...editForm, targetDate: e.target.value });
                    const today = new Date().toISOString().split("T")[0];
                    setFormErrors({
                      ...formErrors,
                      targetDate: e.target.value
                        ? e.target.value < today
                          ? "Target date cannot be in the past"
                          : ""
                        : "Target date is required",
                    });
                  }}
                  inputProps={{ min: new Date().toISOString().split("T")[0] }}
                  error={!!formErrors.targetDate}
                  helperText={formErrors.targetDate || "Select a completion date"}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": { borderColor: "#FF4D4D" },
                      "&.Mui-focused fieldset": { borderColor: "#FF0000" },
                    },
                    "& .MuiInputLabel-root": { color: "#757575" },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#FF0000" },
                  }}
                />
                <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
                  <InputLabel sx={{ color: "#757575", "&.Mui-focused": { color: "#FF0000" } }}>
                    Progress Status
                  </InputLabel>
                  <Select
                    value={editForm.progress}
                    label="Progress Status"
                    onChange={(e) => setEditForm({ ...editForm, progress: e.target.value })}
                    sx={{
                      borderRadius: 2,
                      "& .MuiOutlinedInput-notchedOutline": {
                        "&:hover": { borderColor: "#FF4D4D" },
                        "&.Mui-focused": { borderColor: "#FF0000" },
                      },
                    }}
                  >
                    <MenuItem value="Not Started">Not Started</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="On Hold">On Hold</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1, justifyContent: "center", gap: 2 }}>
            <Button
              onClick={() => {
                setEditDialogOpen(false);
                setFormErrors({});
                setEditForm(null);
              }}
              sx={{
                color: "#757575",
                textTransform: "none",
                fontWeight: 500,
                borderRadius: 8,
                px: 4,
                py: 1,
                "&:hover": { bgcolor: "#FFF0F0", color: "#FF0000" },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleEditSave}
              disabled={isSubmitting || Object.values(formErrors).some((error) => error)}
              sx={{
                bgcolor: "#FF0000",
                color: "white",
                borderRadius: 8,
                px: 4,
                py: 1,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { bgcolor: "#E60000" },
                "&:disabled": { bgcolor: "#FF9999" },
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Leftsidebar />
    </Box>
  );
}