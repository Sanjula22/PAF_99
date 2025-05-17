import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Tooltip,
  IconButton,
  Badge,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  AutoGraph,
  BookmarkBorder,
  Person,
  Menu,
  Close,
  AddBox,
  BarChart,
} from "@mui/icons-material";
import { useAuth } from "../../auth/AuthContext";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

export default function Leftsidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { user } = useAuth();
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [activeNavId, setActiveNavId] = useState(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

  const navItems = [
    { id: "home", icon: <Home />, text: "Home", path: "/home" },
    {
      id: "learning-paths",
      icon: <AutoGraph />,
      text: "Learning Plan",
      path: "/learning-plans",
    },
    {
      id: "learning-progress",
      icon: <BarChart />,
      text: "Learning Progress",
      path: "/progress-update",
    },
    { id: "profile", icon: <Person />, text: "Profile", path: "/profile" },
  ];

  const handleNavClick = (id) => {
    setActiveNavId(id);
  };

  const isActive = (id, path) => {
    if (path === "/learning-plans") {
      return activeNavId === id;
    }
    return location.pathname === path;
  };

  const renderNavItems = () => (
    <>
      {navItems.map((item) => (
        <Button
          key={item.id}
          component={Link}
          to={item.path}
          startIcon={item.icon}
          onClick={() => handleNavClick(item.id)}
          sx={{
            textTransform: "none",
            color: isActive(item.id, item.path) ? "#FF0000" : "#212121",
            fontWeight: isActive(item.id, item.path) ? "600" : "400",
            backgroundColor: isActive(item.id, item.path)
              ? "#FFEBEE"
              : "transparent",
            borderRadius: "8px",
            py: 1.5,
            px: 2,
            justifyContent: { xs: "center", md: "flex-start" },
            width: "100%",
            "&:hover": {
              backgroundColor: "#E0E0E0",
              color: "#FF0000",
            },
            transition: "all 0.2s ease",
          }}
        >
          <Box sx={{ display: { xs: "none", md: "block" }, ml: 1 }}>
            {item.text}
          </Box>
        </Button>
      ))}
    </>
  );

  const mobileMenuToggle = (
    <Box
      sx={{
        display: { xs: "flex", md: "none" },
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 1100,
      }}
    >
      <IconButton
        onClick={toggleMobileMenu}
        sx={{
          backgroundColor: "#FF0000",
          color: "#FFFFFF",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          "&:hover": {
            backgroundColor: "#D32F2F",
          },
        }}
      >
        {mobileOpen ? <Close /> : <AddBox />}
      </IconButton>
    </Box>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <Box
        sx={{
          width: { xs: 0, md: 240 },
          flexShrink: 0,
          height: "100vh",
          position: "sticky",
          top: 0,
          borderRight: "1px solid #FFCDD2",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          bgcolor: "#F5F5F5",
          px: 2,
          py: 3,
          gap: 1,
          overflow: "hidden",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 4, px: 1 }}>
          <SupportAgentIcon sx={{ color: "#FF0000", mr: 1, fontSize: 28 }} />
          <Typography
            variant="h5"
            component={Link}
            to="/home"
            sx={{
              fontFamily: "Inter, sans-serif",
              textDecoration: "none",
              color: "#FF0000",
              fontWeight: "bold",
              letterSpacing: "-0.5px",
            }}
          >
            SkillMind
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {renderNavItems()}
        </Box>

        <Button
          variant="contained"
          onClick={() => setShowAddPostModal(true)}
          sx={{
            mt: "auto",
            textTransform: "none",
            borderRadius: "8px",
            fontWeight: "600",
            py: 1.2,
            backgroundColor: "#FF0000",
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#D32F2F",
            },
            boxShadow: "none",
          }}
          startIcon={<AddBox />}
        >
          <Box sx={{ display: { xs: "none", md: "block" } }}>Create</Box>
        </Button>
      </Box>

      {/* Mobile Bottom Navigation */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 56,
          backgroundColor: "#F5F5F5",
          borderTop: "1px solid #FFCDD2",
          zIndex: 1000,
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {navItems.slice(0, 4).map((item) => (
          <Tooltip key={item.id} title={item.text} placement="top">
            <IconButton
              component={Link}
              to={item.path}
              onClick={() => handleNavClick(item.id)}
              sx={{
                color: isActive(item.id, item.path) ? "#FF0000" : "#212121",
                p: 1.5,
                borderRadius: "50%",
                "&:hover": {
                  backgroundColor: "#E0E0E0",
                },
              }}
            >
              {item.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>

      {/* Overlay and Slide-in Mobile Menu */}
      <Box
        sx={{
          display: { xs: mobileOpen ? "block" : "none", md: "none" },
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1050,
        }}
        onClick={toggleMobileMenu}
      />
      <Box
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          width: 280,
          height: "100%",
          backgroundColor: "#F5F5F5",
          zIndex: 1100,
          transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease",
          display: { xs: "flex", md: "none" },
          flexDirection: "column",
          p: 2,
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#212121" }}
          >
            Menu
          </Typography>
          <IconButton onClick={toggleMobileMenu}>
            <Close sx={{ color: "#212121" }} />
          </IconButton>
        </Box>

        {navItems.map((item) => (
          <Button
            key={item.id}
            component={Link}
            to={item.path}
            startIcon={item.icon}
            onClick={() => {
              handleNavClick(item.id);
              toggleMobileMenu();
            }}
            sx={{
              textTransform: "none",
              color: isActive(item.id, item.path) ? "#FF0000" : "#212121",
              fontWeight: isActive(item.id, item.path) ? "600" : "400",
              backgroundColor: isActive(item.id, item.path)
                ? "#FFEBEE"
                : "transparent",
              borderRadius: "8px",
              py: 1.5,
              px: 2,
              justifyContent: "flex-start",
              width: "100%",
              textAlign: "left",
              "&:hover": {
                backgroundColor: "#E0E0E0",
                color: "#FF0000",
              },
            }}
          >
            {item.text}
          </Button>
        ))}

        <Button
          variant="contained"
          onClick={() => {
            setShowAddPostModal(true);
            toggleMobileMenu();
          }}
          sx={{
            mt: "auto",
            textTransform: "none",
            borderRadius: "8px",
            fontWeight: "600",
            py: 1.2,
            backgroundColor: "#FF0000",
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#D32F2F",
            },
          }}
          startIcon={<AddBox />}
        >
          Create Post
        </Button>
      </Box>

      {mobileMenuToggle}
    </>
  );
}
