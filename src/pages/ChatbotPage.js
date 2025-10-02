import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Paper,
  Typography,
  IconButton,
  Alert,
  AlertTitle,
  Container,
  TextField,
  InputAdornment,
  Chip,
  Link as MuiLink,
  Divider,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AndroidIcon from "@mui/icons-material/Android";
import SendIcon from "@mui/icons-material/Send";
import LinkIcon from "@mui/icons-material/Link";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const MASCOT_NAME = "Mama";
const BOT_TAGLINE = "Your friendly maternity & postpartum info helper";

const NAV_MOBILE = 56;
const NAV_DESKTOP = 64;

export default function ChatbotPage() {
  const [messages, setMessages] = useState(() => [
    {
      id: "opening-bot-1",
      role: "assistant",
      content: `Hi! I'm ${MASCOT_NAME}. ${BOT_TAGLINE}.\n\nI can answer questions with citations using our trusted knowledge base.`,
      sources: [],
    },
    {
      id: "opening-bot-2",
      role: "assistant",
      tone: "warning",
      content:
        "If you may be experiencing a medical emergency, call 911 (U.S.) or your local emergency number. This chat does not provide medical diagnosis or treatment.",
      sources: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showTopBanner, setShowTopBanner] = useState(true);

  const listRef = useRef(null);
  const isDesktop = useMediaQuery("(min-width:900px)");
  const NAV_HEIGHT = isDesktop ? NAV_DESKTOP : NAV_MOBILE;

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, sending]);

  const conversationForApi = useMemo(
    () =>
      messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content })),
    [messages]
  );

  async function sendMessage(e) {
    e?.preventDefault();
    if (!input.trim() || sending) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/rag/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          history: conversationForApi,
        }),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();

      const botMsg = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: data.answer ?? "(No answer returned)",
        sources: Array.isArray(data.sources) ? data.sources : [],
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          tone: "error",
          content:
            "Sorry — I couldn't complete that request. Please try again in a moment.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      sendMessage(e);
    }
  }

  return (
    <Box display="flex" flexDirection="column" height="100dvh" width="100%">
      {/* Top App Bar */}
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{ borderBottom: "1px solid #e0e0e0" }}
      >
        <Toolbar sx={{ minHeight: 56, px: 2 }}>
          <ChatBubbleOutlineIcon sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="subtitle1" fontWeight={600}>
            {MASCOT_NAME} Chat
          </Typography>
          <Box sx={{ ml: "auto" }}>
            <Typography variant="caption" color="text.secondary">
              RAG-enabled
            </Typography>
          </Box>
        </Toolbar>
        {showTopBanner && (
          <Alert
            severity="warning"
            icon={false}
            sx={{ borderTop: "1px solid #f5e6c3", borderRadius: 0 }}
            action={
              <IconButton
                color="inherit"
                size="small"
                onClick={() => setShowTopBanner(false)}
                aria-label="dismiss disclaimer"
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <AlertTitle>Educational use only</AlertTitle>
            Not a substitute for professional medical advice, diagnosis, or
            treatment. In an emergency, call 911 or your local emergency number.
          </Alert>
        )}
      </AppBar>

      {/* Messages */}
      <Container
        maxWidth="md"
        disableGutters
        sx={{
          flex: 1,
          overflowY: "auto",
          px: { xs: 1.5, sm: 2 },
          py: 2,
          pb: 3,
        }}
        ref={listRef}
      >
        <Box display="flex" flexDirection="column" gap={1.5}>
          {messages.map((m) => (
            <ChatBubble key={m.id} role={m.role} tone={m.tone}>
              <MarkdownText text={m.content} />
              {m.sources && m.sources.length > 0 && (
                <SourceChips sources={m.sources} />
              )}
            </ChatBubble>
          ))}

          {sending && (
            <ChatBubble role="assistant">
              <TypingDots />
            </ChatBubble>
          )}
        </Box>
      </Container>

      {/* Composer with legal note */}
      <Box
        component="form"
        onSubmit={sendMessage}
        sx={{
          position: "sticky",
          bottom: `calc(${NAV_HEIGHT}px + env(safe-area-inset-bottom, 0px))`,
          borderTop: "1px solid #e0e0e0",
          bgcolor: "background.paper",
          px: { xs: 1.5, sm: 2 },
          pt: 1,
          pb: 1.25,
          zIndex: 11,
        }}
      >
        <Container maxWidth="md" disableGutters sx={{ px: { xs: 0, sm: 0 } }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 0.75 }}
          >
            {MASCOT_NAME} provides educational content only and does not
            practice medicine. Always consult a qualified healthcare
            professional for personal medical concerns.
          </Typography>

          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={6}
            placeholder={`Ask ${MASCOT_NAME}…`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="submit"
                    color="primary"
                    disabled={sending || input.trim().length === 0}
                    aria-label="send"
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box display="flex" justifyContent="flex-end" mt={0.5}>
            <Typography variant="caption" color="text.secondary">
              {input.length}/4000
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* spacer */}
      <Box
        height={`calc(${NAV_HEIGHT}px + env(safe-area-inset-bottom, 0px))`}
        sx={{ flexShrink: 0 }}
      />
    </Box>
  );
}

function ChatBubble({ role, tone, children }) {
  const isUser = role === "user";

  const bg = isUser
    ? "#4F46E5"
    : tone === "warning"
    ? "#FFF7E6"
    : tone === "error"
    ? "#FFE7E7"
    : "#FFFFFF";

  const color = isUser ? "#FFFFFF" : "#1f2937";
  const border = isUser
    ? "none"
    : tone === "warning"
    ? "1px solid #F2E0B8"
    : tone === "error"
    ? "1px solid #F4BBBB"
    : "1px solid #e0e0e0";

  return (
    <Box display="flex" justifyContent={isUser ? "flex-end" : "flex-start"}>
      {!isUser && (
        <Box
          sx={{
            mr: 1,
            mt: 0.25,
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "1px solid #e0e0e0",
            bgcolor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <AndroidIcon fontSize="inherit" sx={{ fontSize: 18 }} />
        </Box>
      )}
      <Paper
        elevation={0}
        sx={{
          maxWidth: "85%",
          px: 2,
          py: 1.25,
          borderRadius: 3,
          bgcolor: bg,
          color,
          border,
        }}
      >
        {children}
      </Paper>
    </Box>
  );
}

function SourceChips({ sources }) {
  return (
    <Box mt={1} display="flex" flexWrap="wrap" gap={0.75}>
      {sources.map((s, idx) => {
        const label = s.title || (s.url ? new URL(s.url).hostname : "Source");
        const quote =
          s.quote && s.quote.length > 0 ? ` • “${truncate(s.quote, 90)}”` : "";

        const chip = (
          <Chip
            key={idx}
            size="small"
            icon={<LinkIcon sx={{ fontSize: 16 }} />}
            label={`${label}${quote}`}
            clickable={!!s.url}
          />
        );

        return s.url ? (
          <MuiLink
            key={idx}
            href={s.url}
            target="_blank"
            rel="noreferrer noopener"
            underline="none"
          >
            {chip}
          </MuiLink>
        ) : (
          chip
        );
      })}
    </Box>
  );
}

function MarkdownText({ text }) {
  const withLinks = text.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer noopener">$1</a>'
  );
  const withBold = withLinks.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  const withItalics = withBold.replace(
    /(^|\s)\*([^*]+)\*(?=\s|$)/g,
    "$1<em>$2</em>"
  );
  return (
    <Typography
      variant="body2"
      component="div"
      sx={{
        "& a": { textDecoration: "underline", color: "inherit" },
        "& p": { m: 0 },
      }}
      dangerouslySetInnerHTML={{ __html: withItalics.replace(/\n/g, "<br/>") }}
    />
  );
}

function TypingDots() {
  const dot = {
    display: "inline-block",
    width: 8,
    height: 8,
    borderRadius: 9999,
    background: "#a8a29e",
    marginRight: 6,
    animation: "typingPulse 0.9s ease-in-out infinite",
  };

  return (
    <Box display="flex" alignItems="center" aria-label="typing…">
      <Box sx={dot} />
      <Box sx={{ ...dot, animationDelay: ".15s" }} />
      <Box sx={{ ...dot, animationDelay: ".3s" }} />
      <style>{`
        @keyframes typingPulse {
          0% { opacity: .2; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-2px); }
          100% { opacity: .2; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
}

function truncate(str = "", n = 100) {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}
