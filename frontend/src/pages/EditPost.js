
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import {
  Container, Typography, TextField, Button, Box, Paper,
  Stack, IconButton
} from "@mui/material";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Leftsidebar from "../components/homepage/Leftsidebar";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: "", description: "", mediaPaths: [] });
  const [files, setFiles] = useState([]);
  const BASE_URL = "http://localhost:9090";

  useEffect(() => {
    axios.get(`/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch(() => {
        toast.error("Failed to load post");
        navigate("/profile");
      });
  }, [id, navigate]);

  const handleUpdate = async () => {
    if (!post.title || !post.description) {
      toast.error("Title and description are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", post.title);
    formData.append("description", post.description);
    files.forEach((file) => formData.append("files", file));

    try {
      await axios.put(`/posts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post updated!");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update post");
    }
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
  };

  const handleRemoveFile = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  }, []);

  const handleDragOver = (e) => e.preventDefault();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#FFFFFF" }}>
      
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: "#FFFFFF",
            border: "1px solid #DBDBDB",
          }}
        >
          <Typography variant="h5" fontWeight="600" color="#000000" sx={{ mb: 3 }}>
            ✏️ Edit Your Post
          </Typography>

          <TextField
            fullWidth
            label="Post Title"
            variant="outlined"
            margin="normal"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#FAFAFA',
                '& fieldset': { borderColor: '#DBDBDB' },
                '&:hover fieldset': { borderColor: '#262626' },
                '&.Mui-focused fieldset': { borderColor: '#262626' }
              }
            }}
          />

          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            variant="outlined"
            margin="normal"
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#FAFAFA',
                '& fieldset': { borderColor: '#DBDBDB' },
                '&:hover fieldset': { borderColor: '#262626' },
                '&.Mui-focused fieldset': { borderColor: '#262626' }
              }
            }}
          />

          {post.mediaPaths?.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ mt: 4, mb: 1, color: "#8e8e8e" }}>
                Existing Media
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {post.mediaPaths.map((path, i) => (
                  <Box key={i} sx={{ width: 100, height: 100, borderRadius: 2, overflow: "hidden", border: "1px solid #DBDBDB" }}>
                    {path.match(/\.(mp4|webm)$/i) ? (
                      <video src={`${BASE_URL}${path}`} controls style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <img src={`${BASE_URL}${path}`} alt="existing" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                  </Box>
                ))}
              </Stack>
            </>
          )}

          <Box
            mt={4}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            sx={{
              p: 4,
              border: "2px dashed #DBDBDB",
              borderRadius: 3,
              textAlign: "center",
              color: "#8e8e8e",
              backgroundColor: "#FAFAFA",
              cursor: "pointer",
            }}
          >
            <Typography variant="body1" fontWeight="500">
              Drag & drop media files here or
            </Typography>
            <Button
              component="label"
              sx={{
                mt: 1,
                textTransform: "none",
                borderRadius: 2,
                borderColor: "#262626",
                color: "#262626",
                "&:hover": {
                  backgroundColor: "#F5F5F5",
                  borderColor: "#000000"
                }
              }}
              variant="outlined"
            >
              📁 Select Files
              <input type="file" hidden multiple accept="image/*,video/*" onChange={handleFileChange} />
            </Button>
          </Box>

          {files.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ mt: 4, mb: 1, color: "#8e8e8e" }}>
                New Uploads
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {files.map((file, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: "relative",
                      width: 100,
                      height: 100,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid #DBDBDB",
                    }}
                  >
                    {file.type.includes("video") ? (
                      <video src={URL.createObjectURL(file)} controls style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <img src={URL.createObjectURL(file)} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                    <IconButton
                      onClick={() => handleRemoveFile(index)}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        color: "#FFFFFF",
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </>
          )}

          <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/profile")}
              sx={{
                textTransform: "none",
                borderRadius: 3,
                borderColor: "#262626",
                color: "#262626",
                "&:hover": {
                  borderColor: "#000000",
                  backgroundColor: "#F5F5F5"
                }
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              size="large"
              onClick={handleUpdate}
              sx={{
                flex: 1,
                py: 1.5,
                fontWeight: "bold",
                backgroundColor: "#6366F1",
                textTransform: "none",
                borderRadius: 3,
                color: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "#6366F1 ",
                },
              }}
            >
              💾 Save Changes
            </Button>
          </Stack>
        </Paper>
      </Container>
      <Leftsidebar />
    </Box>
  );
}
