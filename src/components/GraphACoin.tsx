import { Card, CardHeader, Typography, Collapse, CardContent } from "@mui/material"
import { motion } from "framer-motion"
import CointousdChartContainer from "./CointousdChartContainer"

interface GraphACoinProps {
    expandedTool: "send" |"read" |  "graph" |"swap" |  null; // Controls which tool is expanded in the UI
    handleToolClick: (tool: "send" |"read" | "graph"| "swap") => void; // Callback to toggle tool expansion
  }

export const GraphACoin = ({
    expandedTool,
    handleToolClick,
  }: GraphACoinProps) => {return(
    <>
    <Card
                            sx={{
                              backgroundColor: "background.paper",
                              borderRadius: 4,
                              boxShadow: expandedTool === "graph" ? 6 : 3,
                              transform:
                                expandedTool === "graph"
                                  ? "scale(1.02)"
                                  : "scale(1)",
                              transition:
                                "transform 0.2s ease, box-shadow 0.2s ease",
                              zIndex: expandedTool === "graph" ? 2 : 1,
                              cursor: "pointer",
                              width: { xs: "100%", sm: "400px" },
                              "&:hover": {
                                transform:
                                  expandedTool !== "graph"
                                    ? "scale(1.05)"
                                    : "scale(1.02)",
                              },
                            }}
                            onClick={() => handleToolClick("graph")}
                          >
                            <CardHeader
                              title={
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontSize: { xs: "1.125rem", sm: "1.25rem" },
                                    color: "text.primary",
                                    textAlign: "center",
                                    width: "100%",
                                  }}
                                >
                                  Graph a Coin
                                </Typography>
                              }
                              sx={{
                                p: { xs: 1.5, sm: 2 },
                                textAlign: "center",
                              }}
                            />
                            <Collapse in={expandedTool === "graph"}>
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <CardContent sx={{ p: { xs: 2, sm: 3 }, pt: 1 }}>
                                  <CointousdChartContainer />
                                </CardContent>
                              </motion.div>
                            </Collapse>
                          </Card></>
)}