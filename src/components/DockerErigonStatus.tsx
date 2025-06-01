import { useState, useEffect } from "react";
import {
  Stack,
  Typography,
  Card,
  CardHeader,
  Collapse,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  Box,
  LinearProgress,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import ComputerIcon from "@mui/icons-material/Computer";
import StorageIcon from "@mui/icons-material/Storage";
import MemoryIcon from "@mui/icons-material/Memory";
import SyncIcon from "@mui/icons-material/Sync";
import WarningIcon from "@mui/icons-material/Warning";

// Types
type DockerErigonStatusProps = {
  expandedTool:
    | "docker"
    | "send"
    | "read"
    | "graph"
    | "swap"
    | "balance"
    | null;
  handleToolClick: (
    tool: "docker" | "read" | "send" | "graph" | "swap" | "balance"
  ) => void;
};

type DockerStatus = {
  containerId: string;
  name: string;
  status: string;
  cpuUsage: number;
  memoryUsage: number;
  memoryLimit: number;
  uptime: string;
};

type ErigonStatus = {
  syncStatus: string;
  currentBlock: number;
  highestBlock: number;
  peerCount: number;
  latestBlockHash?: string;
  syncProgress?: {
    percentage: number;
    downloaded: number; // in GB
    total: number; // in GB
    downloadRate: number; // in MB/s
  };
};

// Styles
const commonProgressSx = {
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  "& .MuiLinearProgress-bar": {
    backgroundColor: "#6200ea",
  },
};

// Mock API calls (replace with actual API endpoints)
const fetchDockerStatus = async (): Promise<DockerStatus> => {
  return {
    containerId: "erigon_1",
    name: "erigon-node",
    status: "running",
    cpuUsage: 12.5,
    memoryUsage: 4200, // in MB, from logs
    memoryLimit: 8000, // in MB, example limit
    uptime: "2 days, 4 hours",
  };
};

const fetchErigonStatus = async (): Promise<ErigonStatus> => {
  return {
    syncStatus: "Syncing",
    currentBlock: 18000000,
    highestBlock: 18000100,
    peerCount: 25,
    syncProgress: {
      percentage: 43.73,
      downloaded: 5.0, // in GB
      total: 11.5, // in GB
      downloadRate: 7.2, // in MB/s
    },
  };
};

// Mock log fetch (replace with actual log fetching, e.g., `docker logs`)
const fetchRecentLogs = async (): Promise<string[]> => {
  return [
    "[06-01|15:02:58.553] [1/6 OtterSync] Downloading progress='43.73% - 5.0GB/11.5GB' download-rate=7.2MB/s",
    "[06-01|15:03:01.162] Starting caplin",
    "[06-01|15:03:05.094] [Sentinel] Sentinel started",
  ];
};

// Main Component
const DockerErigonStatus: React.FC<DockerErigonStatusProps> = ({
  expandedTool,
  handleToolClick,
}) => {
  const [dockerStatus, setDockerStatus] = useState<DockerStatus | null>(null);
  const [erigonStatus, setErigonStatus] = useState<ErigonStatus | null>(null);
  const [recentLogs, setRecentLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [memoryWarning, setMemoryWarning] = useState<boolean>(false);

  useEffect(() => {
    let ws: WebSocket | null = null;

    const fetchInitialStatus = async () => {
      setLoading(true);
      try {
        const [dockerData, erigonData, logs] = await Promise.all([
          fetchDockerStatus(),
          fetchErigonStatus(),
          fetchRecentLogs(),
        ]);
        setDockerStatus(dockerData);
        setErigonStatus(erigonData);
        setRecentLogs(logs);
        setError(null);

        // Check for memory issues
        if (dockerData.memoryUsage / dockerData.memoryLimit > 0.9) {
          setMemoryWarning(true);
          setError(
            "High memory usage detected! Container may be at risk of OOM kill."
          );
        }
      } catch (err) {
        console.error("Error fetching status:", err);
        setError("Failed to fetch Docker or Erigon status");
      } finally {
        setLoading(false);
      }
    };

    const setupWebSocket = () => {
      ws = new WebSocket("ws://localhost:8545"); // Erigon WebSocket endpoint

      ws.onopen = () => {
        console.log("WebSocket connected");
        ws?.send(
          JSON.stringify({
            id: 1,
            method: "eth_subscribe",
            params: ["newHeads"],
          })
        );
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.params?.result) {
          const block = data.params.result;
          setErigonStatus((prev) =>
            prev
              ? {
                  ...prev,
                  currentBlock: parseInt(block.number, 16),
                  latestBlockHash: block.hash,
                }
              : prev
          );
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        setError("WebSocket connection failed");
      };

      ws.onclose = () => {
        console.log("WebSocket closed, attempting to reconnect...");
        setTimeout(setupWebSocket, 5000);
      };
    };

    fetchInitialStatus();
    setupWebSocket();

    // Periodic Docker status and logs refresh
    const interval = setInterval(async () => {
      try {
        const [dockerData, logs] = await Promise.all([
          fetchDockerStatus(),
          fetchRecentLogs(),
        ]);
        setDockerStatus(dockerData);
        setRecentLogs(logs);
        if (dockerData.memoryUsage / dockerData.memoryLimit > 0.9) {
          setMemoryWarning(true);
          setError(
            "High memory usage detected! Container may be at risk of OOM kill."
          );
        } else {
          setMemoryWarning(false);
        }
      } catch (err) {
        console.error("Error fetching Docker status or logs:", err);
      }
    }, 30000);

    return () => {
      ws?.close();
      clearInterval(interval);
    };
  }, []);

  return (
    <Card
      sx={{
        background: "linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)",
        borderRadius: 1,
        boxShadow:
          expandedTool === "docker"
            ? "0 8px 32px rgba(0, 0, 0, 0.3)"
            : "0 4px 16px rgba(0, 0, 0, 0.2)",
        transform: expandedTool === "docker" ? "scale(1.02)" : "scale(1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        zIndex: expandedTool === "docker" ? 2 : 1,
        width: { xs: "100%", sm: "400px" },
        "&:hover": {
          transform: expandedTool !== "docker" ? "scale(1.05)" : "scale(1.02)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        },
      }}
    >
      <CardHeader
        title={
          <Box width="100%" textAlign="center">
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1.125rem", sm: "1.25rem" },
                fontWeight: "bold",
                color: "#ffffff",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            >
              Docker & Erigon Status
            </Typography>
            <Collapse in={expandedTool === "docker"}>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontStyle: "italic",
                }}
              >
                Monitor your Erigon node and Docker container
              </Typography>
            </Collapse>
          </Box>
        }
        onClick={() => handleToolClick("docker")}
      />
      <Collapse in={expandedTool === "docker"}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <CardContent
            sx={{
              p: { xs: 2, sm: 3 },
              pt: 1,
              background: "rgba(255, 255, 255, 0.05)",
            }}
          >
            <Stack spacing={2}>
              {memoryWarning && (
                <Alert severity="warning" icon={<WarningIcon />}>
                  Warning: Memory usage is high. Increase Docker memory limit or
                  set GOMEMLIMIT to prevent OOM kills.
                </Alert>
              )}
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 2,
                    mb: 2,
                  }}
                >
                  <CircularProgress size={24} sx={{ color: "#ffffff" }} />
                </Box>
              ) : error ? (
                <Typography
                  variant="body2"
                  sx={{ mt: 1, textAlign: "center", color: "#f44336" }}
                >
                  {error}
                </Typography>
              ) : !dockerStatus || !erigonStatus ? (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    textAlign: "center",
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  No status data available
                </Typography>
              ) : (
                <>
                  <List
                    sx={{
                      p: 0,
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: 1,
                      maxHeight: "300px",
                      overflowY: "auto",
                      "&::-webkit-scrollbar": {
                        width: "8px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "4px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "rgba(255, 255, 255, 0.3)",
                        borderRadius: "4px",
                      },
                      "&::-webkit-scrollbar-thumb:hover": {
                        background: "rgba(255, 255, 255, 0.5)",
                      },
                    }}
                  >
                    {/* Docker Status Items */}
                    <ListItem
                      sx={{
                        py: 1,
                        px: 2,
                        borderBottom: "1px solid",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#6200ea" }}>
                          <ComputerIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography sx={{ color: "#ffffff" }}>
                            Container Name
                          </Typography>
                        }
                        secondary={
                          <Typography
                            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                          >
                            {dockerStatus.name}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem
                      sx={{
                        py: 1,
                        px: 2,
                        borderBottom: "1px solid",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#6200ea" }}>
                          <StorageIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography sx={{ color: "#ffffff" }}>
                            Status
                          </Typography>
                        }
                        secondary={
                          <Typography
                            sx={{
                              color:
                                dockerStatus.status === "running"
                                  ? "#4caf50"
                                  : "#f44336",
                            }}
                          >
                            {dockerStatus.status}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem
                      sx={{
                        py: 1,
                        px: 2,
                        borderBottom: "1px solid",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#6200ea" }}>
                          <MemoryIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography sx={{ color: "#ffffff" }}>
                            CPU Usage
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography
                              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                            >
                              {dockerStatus.cpuUsage.toFixed(2)}%
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={dockerStatus.cpuUsage}
                              sx={{ ...commonProgressSx, mt: 1 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    <ListItem
                      sx={{
                        py: 1,
                        px: 2,
                        borderBottom: "1px solid",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#6200ea" }}>
                          <MemoryIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography sx={{ color: "#ffffff" }}>
                            Memory Usage
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography
                              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                            >
                              {(dockerStatus.memoryUsage / 1024).toFixed(2)} GB
                              / {(dockerStatus.memoryLimit / 1024).toFixed(2)}{" "}
                              GB
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={
                                (dockerStatus.memoryUsage /
                                  dockerStatus.memoryLimit) *
                                100
                              }
                              sx={{ ...commonProgressSx, mt: 1 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    <ListItem
                      sx={{
                        py: 1,
                        px: 2,
                        borderBottom: "1px solid",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#6200ea" }}>
                          <ComputerIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography sx={{ color: "#ffffff" }}>
                            Uptime
                          </Typography>
                        }
                        secondary={
                          <Typography
                            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                          >
                            {dockerStatus.uptime}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {/* Erigon Status Items */}
                    <ListItem
                      sx={{
                        py: 1,
                        px: 2,
                        borderBottom: "1px solid",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#6200ea" }}>
                          <SyncIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography sx={{ color: "#ffffff" }}>
                            Sync Status
                          </Typography>
                        }
                        secondary={
                          <Typography
                            sx={{
                              color:
                                erigonStatus.syncStatus === "Synced"
                                  ? "#4caf50"
                                  : "#ff9800",
                            }}
                          >
                            {erigonStatus.syncStatus}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem
                      sx={{
                        py: 1,
                        px: 2,
                        borderBottom: "1px solid",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#6200ea" }}>
                          <StorageIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography sx={{ color: "#ffffff" }}>
                            Current Block
                          </Typography>
                        }
                        secondary={
                          <Typography
                            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                          >
                            {erigonStatus.currentBlock}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem
                      sx={{
                        py: 1,
                        px: 2,
                        borderBottom: "1px solid",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#6200ea" }}>
                          <StorageIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography sx={{ color: "#ffffff" }}>
                            Latest Block Hash
                          </Typography>
                        }
                        secondary={
                          <Typography
                            sx={{
                              color: "rgba(255, 255, 255, 0.7)",
                              wordBreak: "break-all",
                            }}
                          >
                            {erigonStatus.latestBlockHash ||
                              "Waiting for new block..."}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem
                      sx={{
                        py: 1,
                        px: 2,
                        borderBottom: "1px solid",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#6200ea" }}>
                          <StorageIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography sx={{ color: "#ffffff" }}>
                            Sync Progress
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography
                              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                            >
                              {erigonStatus.syncProgress
                                ? `${erigonStatus.syncProgress.percentage.toFixed(
                                    2
                                  )}% (${
                                    erigonStatus.syncProgress.downloaded
                                  } GB / ${erigonStatus.syncProgress.total} GB)`
                                : "Not syncing"}
                            </Typography>
                            {erigonStatus.syncProgress && (
                              <LinearProgress
                                variant="determinate"
                                value={erigonStatus.syncProgress.percentage}
                                sx={{ ...commonProgressSx, mt: 1 }}
                              />
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    <ListItem
                      sx={{
                        py: 1,
                        px: 2,
                        borderBottom: "1px solid",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#6200ea" }}>
                          <StorageIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography sx={{ color: "#ffffff" }}>
                            Download Rate
                          </Typography>
                        }
                        secondary={
                          <Typography
                            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                          >
                            {erigonStatus.syncProgress
                              ? `${erigonStatus.syncProgress.downloadRate.toFixed(
                                  2
                                )} MB/s`
                              : "N/A"}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem
                      sx={{
                        py: 1,
                        px: 2,
                        borderBottom: "1px solid",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#6200ea" }}>
                          <StorageIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography sx={{ color: "#ffffff" }}>
                            Highest Known Block
                          </Typography>
                        }
                        secondary={
                          <Typography
                            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                          >
                            {erigonStatus.highestBlock}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem
                      sx={{
                        py: 1,
                        px: 2,
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#6200ea" }}>
                          <ComputerIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography sx={{ color: "#ffffff" }}>
                            Peer Count
                          </Typography>
                        }
                        secondary={
                          <Typography
                            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                          >
                            {erigonStatus.peerCount}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                  {/* Recent Logs */}
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#ffffff", mt: 2 }}
                  >
                    Recent Logs
                  </Typography>
                  <List
                    sx={{
                      p: 0,
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: 1,
                      maxHeight: "150px",
                      overflowY: "auto",
                      "&::-webkit-scrollbar": {
                        width: "8px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "4px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "rgba(255, 255, 255, 0.3)",
                        borderRadius: "4px",
                      },
                      "&::-webkit-scrollbar-thumb:hover": {
                        background: "rgba(255, 255, 255, 0.5)",
                      },
                    }}
                  >
                    {recentLogs.map((log, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          py: 0.5,
                          px: 2,
                          borderBottom: "1px solid",
                          borderColor: "rgba(255, 255, 255, 0.2)",
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography
                              variant="caption"
                              sx={{
                                color: "rgba(255, 255, 255, 0.7)",
                                wordBreak: "break-all",
                              }}
                            >
                              {log}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              <Typography
                variant="caption"
                sx={{
                  mt: 1,
                  textAlign: "center",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontStyle: "italic",
                }}
              >
                Powered by Docker & Erigon
              </Typography>
            </Stack>
          </CardContent>
        </motion.div>
      </Collapse>
    </Card>
  );
};

export default DockerErigonStatus;
