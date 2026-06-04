import React, { useState, useRef, useEffect } from "react";
import {
  FloatButton,
  Button,
  Input,
  Space,
  Tag,
  Empty,
  Spin,
  Card,
  Row,
  Col,
  Divider,
  message,
  Tooltip,
  Select,
  DatePicker,
  Badge,
} from "antd";
import {
  RobotOutlined,
  CloseOutlined,
  SendOutlined,
  ClearOutlined,
  BugOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { theme as antdTheme } from "antd";
import { useThemeStore } from "store/themeStore";
import { useNavigate } from "react-router-dom";

interface ChatMessage {
  id: string;
  type: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  command?: string;
  data?: any;
  actionStatus?: "pending" | "success" | "error";
}

interface DashboardCommand {
  action: string;
  target: string;
  section?: string;
  filters?: Record<string, any>;
  asteroidId?: string;
  dateRange?: { start: string; end: string };
  exportFormat?: "json" | "csv";
}

const AIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "system",
      content: `🚀 NASA Dashboard AI Assistant\n\nI can help you control and navigate the dashboard. Try these commands:\n\n📊 Dashboard:\n• "Show dashboard" • "Display KPI metrics" • "Show today's approaches" • "Get alerts"\n\n🔭 Asteroid Data:\n• "Show upcoming approaches" • "Show historical data" • "List hazardous asteroids" • "Show high velocity objects"\n\n🔍 Detailed Info:\n• "Show details for [asteroid]" • "Get risk score" • "View orbital info" • "Export data"\n\n⚙️ Navigation:\n• "Go to dashboard" • "Open upcoming list" • "View historical" • "Navigate to details"\n\n💾 Data Export:\n• "Export dashboard data" • "Export asteroid data" • "Download as JSON"`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { token } = antdTheme.useToken();
  const { mode } = useThemeStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Comprehensive command parser
  const parseCommand = (input: string): DashboardCommand | null => {
    const lowerInput = input.toLowerCase();

    // Navigation Commands
    if (
      lowerInput.match(/^(show|go to|open|navigate to|view)\s+(dashboard|main)$/i)
    ) {
      return {
        action: "navigate_to_section",
        target: "dashboard",
        section: "dashboard",
      };
    }

    if (
      lowerInput.match(
        /^(show|go to|open|navigate to|view)\s+(upcoming|neo-upcoming|upcoming approaches)$/i
      )
    ) {
      return {
        action: "navigate_to_section",
        target: "upcoming",
        section: "neo-upcoming",
      };
    }

    if (
      lowerInput.match(
        /^(show|go to|open|navigate to|view)\s+(historical|neo-historical|historical data)$/i
      )
    ) {
      return {
        action: "navigate_to_section",
        target: "historical",
        section: "neo-historical",
      };
    }

    // Dashboard Metrics Commands
    if (
      lowerInput.match(
        /^(show|display|get|fetch)\s+(dashboard\s+)?(summary|kpi|metrics|overview)$/i
      )
    ) {
      return {
        action: "display_dashboard_summary",
        target: "dashboard",
      };
    }

    if (
      lowerInput.match(
        /^(show|display|get|fetch)\s+(kpi|key\s+performance|statistic).*cards?$/i
      )
    ) {
      return {
        action: "display_kpi_cards",
        target: "dashboard",
      };
    }

    if (
      lowerInput.match(/^(show|display|get|fetch).*daily.*chart/i) ||
      lowerInput.match(/objects\s+per\s+day/i)
    ) {
      return {
        action: "display_daily_chart",
        target: "dashboard",
      };
    }

    if (lowerInput.match(/^(show|display|get|fetch).*hazard.*level/i)) {
      return {
        action: "display_hazard_level",
        target: "dashboard",
      };
    }

    if (
      lowerInput.match(/^(show|display|get|fetch).*(today|todays).*close.*approach/i)
    ) {
      return {
        action: "display_close_approaches",
        target: "dashboard",
      };
    }

    if (
      lowerInput.match(
        /^(show|display|get|fetch|refresh)\s+(critical\s+)?alerts?$/i
      )
    ) {
      return {
        action: "display_alerts",
        target: "dashboard",
      };
    }

    if (lowerInput.match(/^(refresh|reload).*dashboard/i)) {
      return {
        action: "refresh_data",
        target: "dashboard",
      };
    }

    // Asteroid Listing Commands
    if (
      lowerInput.match(/^(show|list|display).*(upcoming|future).*(approach|asteroid)/i)
    ) {
      return {
        action: "show_upcoming_approaches",
        target: "upcoming",
      };
    }

    if (
      lowerInput.match(
        /^(show|list|display|filter).*(hazard|dangerous|potentially hazardous)/i
      )
    ) {
      return {
        action: "filter_asteroids",
        target: "upcoming",
        filters: { is_potentially_hazardous_asteroid: true },
      };
    }

    if (lowerInput.match(/^(show|list|display|filter).*(high|high-risk).*risk/i)) {
      return {
        action: "filter_asteroids",
        target: "upcoming",
        filters: { risk_tier: "High" },
      };
    }

    if (
      lowerInput.match(/^(show|list|display|filter).*(medium|moderate).*risk/i)
    ) {
      return {
        action: "filter_asteroids",
        target: "upcoming",
        filters: { risk_tier: "Medium" },
      };
    }

    if (
      lowerInput.match(/^(show|list|display|filter).*(high|very high).*(velocity|speed)/i)
    ) {
      return {
        action: "filter_asteroids",
        target: "upcoming",
        filters: { velocity_threshold: 20 },
      };
    }

    // Asteroid Detail Commands
    const asteroidMatch = input.match(/show.*details.*for\s+(.+?)(?:\s+|$)/i);
    if (asteroidMatch) {
      return {
        action: "show_asteroid_details",
        target: "detail",
        asteroidId: asteroidMatch[1].trim(),
      };
    }

    const riskMatch = input.match(/get.*risk.*(?:score|for|of)\s+(.+?)(?:\s+|$)/i);
    if (riskMatch) {
      return {
        action: "show_asteroid_details",
        target: "detail",
        asteroidId: riskMatch[1].trim(),
      };
    }

    if (input.match(/show.*orbit.*info/i)) {
      return {
        action: "show_orbit_details",
        target: "detail",
      };
    }

    if (input.match(/display.*close.*approach.*history/i)) {
      return {
        action: "show_approach_history",
        target: "detail",
      };
    }

    // Data Export Commands
    if (input.match(/export.*dashboard.*data/i)) {
      return {
        action: "export_data",
        target: "dashboard",
        exportFormat: "json",
      };
    }

    if (input.match(/export.*asteroid.*data/i)) {
      return {
        action: "export_data",
        target: "upcoming",
        exportFormat: "json",
      };
    }

    if (input.match(/export.*(?:as\s+)?json/i)) {
      return {
        action: "export_data",
        target: "current",
        exportFormat: "json",
      };
    }

    // Filter by Date Commands
    const dateMatch = input.match(
      /(?:show|filter).*(?:from|between|from)\s+(\d{4}-\d{2}-\d{2})\s+to\s+(\d{4}-\d{2}-\d{2})/i
    );
    if (dateMatch) {
      return {
        action: "filter_asteroids",
        target: "upcoming",
        filters: {
          dateRange: { start: dateMatch[1], end: dateMatch[2] },
        },
      };
    }

    // Search Commands
    const searchMatch = input.match(/search.*(?:for|asteroid|by name)\s+(.+?)(?:\s+|$)/i);
    if (searchMatch) {
      return {
        action: "search_asteroid",
        target: "upcoming",
        filters: { searchTerm: searchMatch[1].trim() },
      };
    }

    // Reset/Clear Commands
    if (input.match(/^(clear|reset|reset all filters|clear filters)$/i)) {
      return {
        action: "clear_filters",
        target: "current",
      };
    }

    // Refresh Commands
    if (input.match(/^refresh\s+all\s+data$/i)) {
      return {
        action: "refresh_all_data",
        target: "dashboard",
      };
    }

    return null;
  };

  // Generate AI Response
  const generateAIResponse = (command: DashboardCommand | null, userInput: string): string => {
    if (!command) {
      return `❓ I didn't quite understand that command.\n\nHere are some things you can ask:\n• "Show dashboard"\n• "Show upcoming approaches"\n• "Show hazardous asteroids"\n• "Show details for [asteroid name]"\n• "Export data"\n• "Refresh data"\n\nTry something like: "Show upcoming approaches" or "List hazardous asteroids"`;
    }

    const responses: Record<string, string> = {
      navigate_to_section: `🧭 Navigating to ${command.section === "dashboard" ? "Dashboard" : command.section === "neo-upcoming" ? "Upcoming Approaches" : "Historical Data"}...`,
      display_dashboard_summary: `📊 Fetching dashboard summary and metrics...`,
      display_kpi_cards: `💰 Loading KPI cards (Total Objects, Hazardous, Closest Approach, Highest Velocity)...`,
      display_daily_chart: `📈 Displaying objects per day chart (Last 7 days)...`,
      display_hazard_level: `⚠️ Showing miss distance safety level and hazard assessment...`,
      display_close_approaches: `🔥 Loading today's close approaches...`,
      display_alerts: `🚨 Retrieving critical alerts and warnings...`,
      refresh_data: `🔄 Refreshing dashboard data from NASA API...`,
      show_upcoming_approaches: `📅 Loading upcoming near-Earth object approaches...`,
      filter_asteroids: `🔍 Filtering asteroids based on criteria...`,
      show_asteroid_details: `🪨 Opening detailed information for asteroid "${command.asteroidId}"...`,
      show_orbit_details: `🌍 Displaying orbital parameters and information...`,
      show_approach_history: `📜 Loading close approach history...`,
      export_data: `💾 Exporting data as ${command.exportFormat?.toUpperCase()}...`,
      search_asteroid: `🔎 Searching for asteroid: "${command.filters?.searchTerm}"...`,
      clear_filters: `✨ Clearing all filters and resetting view...`,
      refresh_all_data: `🔄 Refreshing all dashboard data...`,
    };

    return responses[command.action] || "⏳ Processing your command...";
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Parse the command
      const command = parseCommand(input);

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Generate assistant response
      const assistantResponse = generateAIResponse(command, input);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: assistantResponse,
        timestamp: new Date(),
        command: command?.action,
        data: command,
        actionStatus: "success",
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Trigger actual dashboard action
      if (command) {
        triggerDashboardAction(command);
        message.success("Command executed!");
      } else {
        message.info("Could not parse command - type 'help' for examples");
      }
    } catch (error) {
      console.error("Error processing command:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: "assistant",
        content: "❌ Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
        actionStatus: "error",
      };
      setMessages((prev) => [...prev, errorMessage]);
      message.error("Command failed");
    } finally {
      setLoading(false);
    }
  };

  const triggerDashboardAction = (command: DashboardCommand) => {
    // Dispatch custom events for dashboard interactions
    switch (command.action) {
      case "navigate_to_section":
        if (command.section === "dashboard") navigate("/inventory/dashboard");
        else if (command.section === "neo-upcoming")
          navigate("/inventory/neo-upcoming");
        else if (command.section === "neo-historical")
          navigate("/inventory/neo-historical");
        break;

      case "show_asteroid_details":
        if (command.asteroidId) {
          navigate(`/inventory/neo-detail/${command.asteroidId}`);
        }
        break;

      case "export_data":
        window.dispatchEvent(
          new CustomEvent("ai-command", {
            detail: { action: "export_data", format: command.exportFormat },
          })
        );
        break;

      case "filter_asteroids":
        window.dispatchEvent(
          new CustomEvent("ai-command", {
            detail: { action: "filter_asteroids", filters: command.filters },
          })
        );
        break;

      case "refresh_all_data":
        window.dispatchEvent(
          new CustomEvent("ai-command", {
            detail: { action: "refresh_data" },
          })
        );
        break;

      default:
        window.dispatchEvent(
          new CustomEvent("ai-command", {
            detail: command,
          })
        );
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        type: "system",
        content: "Chat cleared! Ready to help you navigate the dashboard.",
        timestamp: new Date(),
      },
    ]);
  };

  const handleQuickCommand = (cmd: string) => {
    setInput(cmd);
  };

  return (
    <>
      <FloatButton
        icon={open ? <CloseOutlined /> : <RobotOutlined />}
        type="primary"
        tooltip={open ? "Close Assistant" : "AI Assistant"}
        style={{ right: 80, bottom: 32 }}
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div
          style={{
            position: "fixed",
            right: 32,
            bottom: 90,
            width: 450,
            height: 680,
            zIndex: 200,
            borderRadius: token.borderRadiusLG,
            border: `1px solid ${token.colorBorder}`,
            backgroundColor: token.colorBgContainer,
            boxShadow: token.boxShadowSecondary,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 16px",
              borderBottom: `1px solid ${token.colorBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryBorder})`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "white",
              }}
            >
              <RobotOutlined style={{ fontSize: 18 }} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>
                NASA Dashboard AI
              </span>
            </div>
            <Space size={4}>
              <Tooltip title="Help">
                <Button
                  type="text"
                  size="small"
                  icon={<QuestionCircleOutlined />}
                  onClick={() => setShowHelp(!showHelp)}
                  style={{ color: "white" }}
                />
              </Tooltip>
              <Badge
                color={token.colorSuccess}
                text={
                  <span style={{ fontSize: 11, color: "white" }}>
                    ACTIVE
                  </span>
                }
                style={{ marginRight: 0 }}
              />
            </Space>
          </div>

          {/* Quick Commands (collapsible) */}
          {showHelp && (
            <div
              style={{
                padding: "12px 16px",
                borderBottom: `1px solid ${token.colorBorder}`,
                background: mode === "dark" ? token.colorBgLayout : "#fafafa",
                maxHeight: 120,
                overflowY: "auto",
                fontSize: 12,
              }}
            >
              <div style={{ marginBottom: 8, fontWeight: 600 }}>
                Quick Commands:
              </div>
              <Space wrap style={{ fontSize: 11 }}>
                <Tag
                  onClick={() =>
                    handleQuickCommand("Show dashboard")
                  }
                  style={{ cursor: "pointer" }}
                >
                  Dashboard
                </Tag>
                <Tag
                  onClick={() =>
                    handleQuickCommand("Show upcoming approaches")
                  }
                  style={{ cursor: "pointer" }}
                >
                  Upcoming
                </Tag>
                <Tag
                  onClick={() =>
                    handleQuickCommand("Show hazardous asteroids")
                  }
                  style={{ cursor: "pointer" }}
                >
                  Hazardous
                </Tag>
                <Tag
                  onClick={() => handleQuickCommand("Export data")}
                  style={{ cursor: "pointer" }}
                >
                  Export
                </Tag>
                <Tag
                  onClick={() =>
                    handleQuickCommand("Refresh all data")
                  }
                  style={{ cursor: "pointer" }}
                >
                  Refresh
                </Tag>
              </Space>
            </div>
          )}

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              background:
                mode === "dark" ? token.colorBgLayout : "#fafafa",
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.type === "user" ? "flex-end" : "flex-start",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "12px 14px",
                    borderRadius: 8,
                    fontSize: 13,
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    backgroundColor:
                      msg.type === "user"
                        ? token.colorPrimary
                        : msg.type === "system"
                          ? token.colorBgElevated
                          : token.colorBgContainer,
                    color:
                      msg.type === "user"
                        ? "white"
                        : token.colorText,
                    border:
                      msg.type === "assistant"
                        ? `1px solid ${token.colorBorder}`
                        : "none",
                    boxShadow:
                      msg.type === "assistant"
                        ? `0 1px 4px ${token.colorBorder}`
                        : "none",
                  }}
                >
                  {msg.content}
                  {msg.command && (
                    <div
                      style={{
                        marginTop: 8,
                        paddingTop: 8,
                        borderTop: `1px solid ${token.colorBorder}`,
                      }}
                    >
                      <Space size={4} wrap>
                        {msg.actionStatus === "success" ? (
                          <CheckCircleOutlined
                            style={{
                              color: token.colorSuccess,
                              fontSize: 12,
                            }}
                          />
                        ) : msg.actionStatus === "error" ? (
                          <ExclamationCircleOutlined
                            style={{
                              color: token.colorError,
                              fontSize: 12,
                            }}
                          />
                        ) : (
                          <BugOutlined
                            style={{
                              color: token.colorWarning,
                              fontSize: 12,
                            }}
                          />
                        )}
                        <Tag
                          color="cyan"
                          style={{ fontSize: 10, margin: 0 }}
                        >
                          {msg.command}
                        </Tag>
                      </Space>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "flex-start",
                }}
              >
                <Spin size="small" style={{ marginTop: 4 }} />
                <span
                  style={{
                    color: token.colorTextSecondary,
                    fontSize: 12,
                  }}
                >
                  Processing...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              borderTop: `1px solid ${token.colorBorder}`,
              padding: "12px",
              display: "flex",
              gap: 8,
              background: token.colorBgContainer,
            }}
          >
            <Input
              placeholder='Try: "Show dashboard" or "List hazardous"...'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={handleSendMessage}
              disabled={loading}
              size="small"
              style={{ borderRadius: 4 }}
            />
            <Button
              icon={<SendOutlined />}
              onClick={handleSendMessage}
              loading={loading}
              type="primary"
              size="small"
            />
            <Button
              icon={<ClearOutlined />}
              onClick={handleClearChat}
              size="small"
              title="Clear chat"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
