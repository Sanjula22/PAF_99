import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  MenuItem,
  FormControl,
  Select,
  Box,
  Chip,
  InputLabel,
  Divider,
  LinearProgress,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import { toast } from "react-toastify";
import Leftsidebar from "../components/homepage/Leftsidebar";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import AddLearningPlanForm from "../pages/AddLearningPlan";

export default function MyLearningPlans() {
  const [plans, setPlans] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const navigate = useNavigate();

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/learning-plans/my");
      setPlans(res.data);
    } catch (err) {
      toast.error("Could not fetch learning plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleOpenEdit = (plan) => {
    setEditForm({
      ...plan,
      topics: plan.topics.join(", "),
      resources: plan.resources.join(", "),
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    const today = new Date().toISOString().split("T")[0];

    if (editForm.targetDate < today) {
      toast.error("Target date cannot be in the past.");
      return;
    }

    try {
      await axios.post("/learning-plans", {
        ...editForm,
        topics: editForm.topics.split(",").map((t) => t.trim()),
        resources: editForm.resources.split(",").map((r) => r.trim()),
      });
      toast.success("Plan updated!");
      fetchPlans();
      setEditDialogOpen(false);
    } catch (err) {
      toast.error("Update failed!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/learning-plans/${id}`);
      toast.success("Plan deleted!");
      fetchPlans();
    } catch (err) {
      toast.error("Failed to delete plan.");
    } finally {
      setConfirmDeleteId(null);
    }
  };

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
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
        <Container maxWidth="lg">
          {/* Header Section with YouTube-themed styling */}
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
                right: "0",
                width: "100%",
                height: "100%",
                opacity: 0.1,
                background: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><path d=\"M0 0 L50 50 L100 0 Z\" fill=\"%23fff\"/></svg>')",
                backgroundSize: "20px 20px",
              }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "relative",
                zIndex: 1,
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <BookmarkIcon sx={{ fontSize: 36, mr: 2, color: "#FFFFFF" }} />
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight="700"
                    sx={{ color: "#FFFFFF" }}
                  >
                    My Learning Progress
                  </Typography>
                  <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.9)", mt: 0.5 }}>
                    Track your personal learning journey
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenAddModal(true)}
                sx={{
                  bgcolor: "#FFFFFF",
                  color: "#FF0000",
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "#FFF0F0",
                  },
                  display: { xs: "none", sm: "flex" },
                }}
              >
                Create New Plan
              </Button>
            </Box>
          </Paper>

          {loading ? (
            <LinearProgress sx={{ bgcolor: "#FFF0F0", color: "#FF0000" }} />
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
                <BookmarkIcon sx={{ fontSize: 48, color: "#FF0000" }} />
              </Box>
              <Typography variant="h5" fontWeight={600} color="#FF0000" sx={{ mb: 1 }}>
                No Learning Plans Yet
              </Typography>
              <Typography variant="body1" color="#FF0000" sx={{ mb: 3, maxWidth: 400, mx: "auto" }}>
                Create your first learning plan to track your progress
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenAddModal(true)}
                sx={{
                  bgcolor: "#FF0000",
                  color: "#FFFFFF",
                  borderRadius: 8,
                  px: 4,
                  py: 1.2,
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "#E60000",
                  },
                }}
              >
                Get Started
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {plans.map((plan) => (
                <Grid item xs={12} sm={6} md={4} key={plan.id}>
                  <Card
                    sx={{
                      borderRadius: 4,
                      border: "1px solid #FF4D4D",
                      backgroundColor: "#FFFFFF",
                      height: "100%",
                      boxShadow: "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 8,
                        width: "100%",
                        bgcolor: getProgressColor(plan.progress),
                      }}
                    />
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        mb={2}
                      >
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="#FF0000"
                        >
                          {plan.title}
                        </Typography>
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
                            "& .MuiChip-icon": {
                              fontSize: "1rem",
                            },
                          }}
                        />
                      </Box>

                      <Box mb={1}>
                        <Typography
                          variant="subtitle2"
                          color="#FF0000"
                          fontWeight="600"
                        >
                          Topics
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                          {plan.topics.map((topic, idx) => (
                            <Chip
                              key={idx}
                              label={topic}
                              size="small"
                              sx={{ bgcolor: "#FFF0F0", color: "#FF0000" }}
                            />
                          ))}
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2, borderColor: "#E0E0E0" }} />

                      <Box mb={1}>
                        <Typography
                          variant="subtitle2"
                          color="#FF0000"
                          fontWeight="600"
                        >
                          Resources
                        </Typography>
                        <Typography variant="body2" color="#FF0000">
                          {plan.resources.join(", ")}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="#FF0000" mt={1}>
                        <strong>Target Date:</strong>{" "}
                        {new Date(plan.targetDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>

                      <Box
                        mt={3}
                        display="flex"
                        justifyContent="flex-end"
                        gap={1}
                      >
                        <IconButton
                          onClick={() => handleOpenEdit(plan)}
                          sx={{ color: "#FF0000" }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => setConfirmDeleteId(plan.id)}
                          sx={{ color: "#FF0000" }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={!!confirmDeleteId}
            onClose={() => setConfirmDeleteId(null)}
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
              },
            }}
          >
            <DialogTitle sx={{ pb: 1, color: "#FF0000" }}>
              Delete Learning Plan?
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="#212121">
                This action cannot be undone. The plan will be permanently removed.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button
                onClick={() => setConfirmDeleteId(null)}
                sx={{
                  color: "#757575",
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => handleDelete(confirmDeleteId)}
                sx={{
                  bgcolor: "#FF0000",
                  color: "#FFFFFF",
                  textTransform: "none",
                  borderRadius: 8,
                  fontWeight: 500,
                  "&:hover": {
                    bgcolor: "#E60000",
                  },
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Edit Plan Dialog */}
          <Dialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
              },
            }}
          >
            <DialogTitle sx={{ pb: 1 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#FF0000" }}
              >
                Edit Learning Plan
              </Typography>
            </DialogTitle>
            <DialogContent>
              {editForm && (
                <Box sx={{ pt: 2 }}>
                  <TextField
                    label="Title"
                    fullWidth
                    margin="normal"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#FF0000",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#FF0000",
                      },
                    }}
                  />

                  <TextField
                    label="Topics (comma-separated)"
                    fullWidth
                    margin="normal"
                    value={editForm.topics}
                    onChange={(e) =>
                      setEditForm({ ...editForm, topics: e.target.value })
                    }
                    helperText="Separate multiple topics with commas"
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#FF0000",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#FF0000",
                      },
                    }}
                  />

                  <TextField
                    label="Resources (comma-separated)"
                    fullWidth
                    margin="normal"
                    value={editForm.resources}
                    onChange={(e) =>
                      setEditForm({ ...editForm, resources: e.target.value })
                    }
                    helperText="Separate multiple resources with commas"
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#FF0000",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#FF0000",
                      },
                    }}
                  />

                  <TextField
                    label="Target Date"
                    type="date"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    value={editForm.targetDate}
                    onChange={(e) =>
                      setEditForm({ ...editForm, targetDate: e.target.value })
                    }
                    inputProps={{ min: new Date().toISOString().split("T")[0] }}
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#FF0000",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#FF0000",
                      },
                    }}
                  />

                  <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
                    <InputLabel
                      id="progress-label"
                      sx={{ "&.Mui-focused": { color: "#FF0000" } }}
                    >
                      Progress Status
                    </InputLabel>
                    <Select
                      labelId="progress-label"
                      value={editForm.progress}
                      label="Progress Status"
                      onChange={(e) =>
                        setEditForm({ ...editForm, progress: e.target.value })
                      }
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          "&.Mui-focused": {
                            borderColor: "#FF0000",
                          },
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
            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button
                onClick={() => setEditDialogOpen(false)}
                sx={{
                  color: "#757575",
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleEditSave}
                sx={{
                  bgcolor: "#FF0000",
                  color: "#FFFFFF",
                  borderRadius: 8,
                  px: 3,
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "#E60000",
                  },
                }}
              >
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>

          {/* Add Learning Plan Modal */}
          <Modal
            open={openAddModal}
            onClose={() => setOpenAddModal(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
          >
            <Fade in={openAddModal}>
              <Box
                sx={{
                  width: "90%",
                  maxWidth: 650,
                  mx: "auto",
                  mt: "10vh",
                  outline: "none",
                  bgcolor: "#FFFFFF",
                  borderRadius: 3,
                  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
                }}
              >
                <AddLearningPlanForm
                  onClose={() => setOpenAddModal(false)}
                  onPlanCreated={fetchPlans}
                />
              </Box>
            </Fade>
          </Modal>
        </Container>
      </Box>
      <Leftsidebar />
    </Box>
  );
}