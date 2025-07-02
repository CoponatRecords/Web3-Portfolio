"use client";

import React, { useState, Suspense, memo, useMemo, useCallback } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Box,
  Container,
  Typography,
  Button,
  styled,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  ButtonGroup,
  IconButton,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TelegramIcon from "@mui/icons-material/Telegram";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CodeIcon from "@mui/icons-material/Code";
import { motion } from "framer-motion";

import {
  PortfolioTool,
  ToolDefinition,
  web3Tools,
  otherWorks,
  OtherWorksDefinition,
} from "./portfolio-tools";

SyntaxHighlighter.registerLanguage("tsx", tsx);

const GlassContainer = styled(Container)(({ theme }) => ({
  background: "rgba(10, 10, 25, 0.6)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  minHeight: "calc(100vh - 48px)",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
    borderRadius: 0,
  },
}));

import type { FC, LazyExoticComponent, Dispatch, SetStateAction } from "react";

interface ToolComponentProps {
  expandedTool: PortfolioTool;
  handleToolClick: () => void;
  setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>;
}

interface MemoizedToolComponentProps {
  component: LazyExoticComponent<FC<ToolComponentProps>>;
  toolId: PortfolioTool;
  handleClose: (toolId: PortfolioTool, actionType?: string) => void;
  setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>;
}

const MemoizedToolComponent = memo(
  ({
    component: Component,
    toolId,
    handleClose,
    setAnchorEl,
  }: MemoizedToolComponentProps) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        minHeight: 200,
      }}
    >
      <Component
        expandedTool={toolId}
        handleToolClick={() => handleClose(toolId, "close")}
        setAnchorEl={setAnchorEl}
      />
    </Box>
  )
);

const Home = () => {
  const [selectedToolId, setSelectedToolId] = useState<PortfolioTool | null>(
    null
  );
  const [currentToolView, setCurrentToolView] = useState<"tool" | "code">(
    "tool"
  );
  const [, setAnchorEl] = useState<null | HTMLElement>(null);

  const allTools = useMemo(() => [...web3Tools, ...otherWorks], []);
  const selectedTool = useMemo(
    () => allTools.find((t) => t.id === selectedToolId) || null,
    [selectedToolId, allTools]
  );
  const hasCode = selectedTool && "code" in selectedTool && selectedTool.code;

  const handleToolAction = useCallback(
    (toolId: PortfolioTool | null, actionType?: string) => {
      if (actionType === "close" || selectedToolId === toolId) {
        setSelectedToolId(null);
        setCurrentToolView("tool");
        return;
      }
      setSelectedToolId(toolId);
      const newlySelected = allTools.find((t) => t.id === toolId);
      setCurrentToolView("tool");
      if (newlySelected && "code" in newlySelected) {
        setCurrentToolView("tool");
      }
    },
    [selectedToolId, allTools]
  );

  const renderToolList = useCallback(
    (tools: ToolDefinition[] | OtherWorksDefinition[], title: string) => (
      <>
        <Typography variant="h5" sx={{ mt: 4, mb: 2, textAlign: "center" }}>
          {title}
        </Typography>
        <List sx={{ width: "100%", maxWidth: "100%", borderRadius: 2 }}>
          {tools.map((tool) => {
            const isSelected = selectedToolId === tool.id && !tool.link;
            return (
              <React.Fragment key={tool.id}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <ListItem disablePadding>
                    <ListItemButton
                      target="_blank"
                      href={tool.link || undefined}
                      onClick={
                        tool.link ? undefined : () => handleToolAction(tool.id)
                      }
                      sx={{
                        py: 1.5,
                        px: 3,
                        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                        background: isSelected
                          ? "rgba(0, 247, 255, 0.15)"
                          : "transparent",
                        "&:hover": {
                          background: isSelected
                            ? "rgba(0, 247, 255, 0.2)"
                            : "rgba(255, 255, 255, 0.08)",
                        },
                        borderRadius: isSelected ? "8px 8px 0 0" : "8px",
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            variant="h6"
                            component="span"
                            sx={{ color: isSelected ? "info.main" : "white" }}
                          >
                            {tool.name}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            {tool.description}
                          </Typography>
                        }
                      />
                      {isSelected && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToolAction(tool.id, "close");
                          }}
                          sx={{ ml: 2, color: "rgba(255, 5, 5, 0.99)" }}
                        />
                      )}
                      {!isSelected && !tool.link && (
                        <Button
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToolAction(tool.id);
                          }}
                          sx={{ ml: 2, color: "white" }}
                        >
                          View Details
                        </Button>
                      )}
                      {tool.link && (
                        <Button
                          size="small"
                          href={tool.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          sx={{ ml: 2, color: "white" }}
                        >
                          Visit{" "}
                          <OpenInNewIcon
                            sx={{ ml: 0.5, fontSize: "inherit" }}
                          />
                        </Button>
                      )}
                    </ListItemButton>
                  </ListItem>
                </motion.div>
                {isSelected && selectedTool && (
                  <Box
                    sx={{
                      background: "rgba(15, 15, 35, 0.8)",
                      border: "1px solid rgba(0, 247, 255, 0.3)",
                      borderTop: "none",
                      borderRadius: "0 0 8px 8px",
                      p: 2,
                      mb: 2,
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mb: 2,
                        }}
                      >
                        <ButtonGroup variant="contained">
                          <Button
                            onClick={() => setCurrentToolView("tool")}
                            startIcon={<VisibilityIcon />}
                          >
                            Tool
                          </Button>
                          {hasCode && (
                            <Button
                              onClick={() => setCurrentToolView("code")}
                              startIcon={<CodeIcon />}
                            >
                              Code
                            </Button>
                          )}
                        </ButtonGroup>
                      </Box>
                      {currentToolView === "tool" && selectedTool.component && (
                        <Suspense
                          fallback={
                            <CircularProgress
                              sx={{ display: "block", margin: "auto", my: 4 }}
                            />
                          }
                        >
                          <MemoizedToolComponent
                            component={selectedTool.component}
                            toolId={tool.id}
                            handleClose={handleToolAction}
                            setAnchorEl={setAnchorEl}
                          />
                        </Suspense>
                      )}
                      {currentToolView === "code" && hasCode && (
                        <Box
                          sx={{
                            bgcolor: "rgba(0, 0, 0, 0.7)",
                            p: 2,
                            borderRadius: 1,
                            overflowX: "auto",
                            maxHeight: 400,
                          }}
                        >
                          <SyntaxHighlighter
                            language="tsx"
                            style={vscDarkPlus}
                            showLineNumbers
                            customStyle={{
                              background: "transparent",
                              padding: 16,
                            }}
                          >
                            {(selectedTool as ToolDefinition).code}
                          </SyntaxHighlighter>
                        </Box>
                      )}
                    </motion.div>
                  </Box>
                )}
              </React.Fragment>
            );
          })}
        </List>
      </>
    ),
    [selectedTool, selectedToolId, currentToolView, handleToolAction, hasCode]
  );

  return (
    <Box sx={{ p: { xs: 0, md: 3 }, justifyContent: "center" }}>
      <GlassContainer sx={{ width: "100%" }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{ mt: 3, mb: 4, textAlign: "center" }}
              >
                FrontEnd Web3 Portfolio
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ textAlign: "center", mb: 4 }}
              >
                Explore a collection of my web development and Web3 projects.
                Click on a tool to view its details and code.
              </Typography>
            </motion.div>
            {renderToolList(web3Tools, "My Web3 Portfolio Tools")}
            {renderToolList(otherWorks, "Other Projects")}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
                mb: 2,
                gap: 2,
              }}
            >
              <IconButton
                component="a"
                href="https://github.com/CoponatRecords"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                }}
              >
                <GitHubIcon fontSize="large" />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.linkedin.com/in/sebastiencoponat/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "white", border: "1px solid #0A66C2" }}
              >
                <LinkedInIcon fontSize="large" />
              </IconButton>
              <IconButton
                component="a"
                href="https://t.me/sebcoponat"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "white", border: "1px solid #0088CC" }}
              >
                <TelegramIcon fontSize="large" />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </GlassContainer>
    </Box>
  );
};

export default Home;
