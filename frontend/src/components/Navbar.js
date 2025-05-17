import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Badge,
  Tooltip,
  Divider,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../api/axiosConfig";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notiAnchorEl, setNotiAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    let interval;
    if (user) {
      const fetchNotifications = () => {
        axios
          .get("/notifications")
          .then((res) => setNotifications(res.data))
          .catch(() => setNotifications([]));
      };
      fetchNotifications();
      interval = setInterval(fetchNotifications, 10000);
    }
    return () => clearInterval(interval);
  }, [user]);

  const handleOpenNotifications = (e) => {
    setNotiAnchorEl(e.currentTarget);
    axios.put("/notifications/mark-read").then(() => {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    });
  };

  return (
    <AppBar position="sticky" elevation={0} color="inherit" sx={{ borderBottom: "1px solid #FFCDD2", bgcolor: "#F5F5F5" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: { xs: 2, md: 4 } }}>
        
        {/* Logo / Brand */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            letterSpacing: 0.5,
            color: "#FF0000",
            cursor: user ? "pointer" : "default",
            opacity: user ? 1 : 0.5,
          }}
          onClick={() => user && navigate("/home")}
        >
          SkillMind
        </Typography>

        {user ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Learning Plans Link */}
            <Button
              onClick={() => navigate("/learning-plans")}
              sx={{
                color: "#212121",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { color: "#FF0000" }
              }}
            >
              Learning
            </Button>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton onClick={handleOpenNotifications} sx={{ color: "#212121" }}>
                <Badge badgeContent={unreadCount} sx={{ "& .MuiBadge-badge": { bgcolor: "#FF0000" } }}>
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={notiAnchorEl}
              open={Boolean(notiAnchorEl)}
              onClose={() => setNotiAnchorEl(null)}
              PaperProps={{
                sx: {
                  width: 320,
                  borderRadius: 2,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  bgcolor: "#F5F5F5",
                },
              }}
            >
              <Box px={2} py={1.5}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: "#212121" }}>
                  Notifications
                </Typography>
              </Box>
              <Divider sx={{ borderColor: "#FFCDD2" }} />
              {notifications.length === 0 ? (
                <MenuItem disabled sx={{ color: "#606060" }}>No new notifications</MenuItem>
              ) : (
                notifications.map((n, i) => (
                  <MenuItem
                    key={i}
                    sx={{
                      whiteSpace: "normal",
                      fontWeight: n.read ? 400 : 600,
                      color: n.read ? "#606060" : "#212121",
                      "&:hover": { bgcolor: "#E0E0E0" },
                    }}
                  >
                    {n.message}
                  </MenuItem>
                ))
              )}
            </Menu>

            {/* User Avatar */}
            <Tooltip title="Account">
              <IconButton onClick={handleMenuOpen}>
                <Avatar
                  sx={{ width: 44, height: 44, bgcolor: "#FF0000", border: "2px solid #FFCDD2" }}
                  src={user.profileImage ? `http://localhost:9090${user.profileImage}` : undefined}
                  alt={user.username}
                >
                  {!user.profileImage && user.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  borderRadius: 2,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  bgcolor: "#F5F5F5",
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/profile");
                }}
                sx={{ color: "#212121", "&:hover": { bgcolor: "#E0E0E0" } }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/settings");
                }}
                sx={{ color: "#212121", "&:hover": { bgcolor: "#E0E0E0" } }}
              >
                Settings
              </MenuItem>
              <Divider sx={{ borderColor: "#FFCDD2" }} />
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  logout();
                  navigate("/signin");
                }}
                sx={{ color: "#FF0000", "&:hover": { bgcolor: "#E0E0E0" } }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button
            variant="outlined"
            onClick={() => navigate("/signin")}
            sx={{
              color: "#FF0000",
              borderColor: "#FF0000",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#FFEBEE",
                borderColor: "#D32F2F",
                color: "#D32F2F",
              },
            }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}