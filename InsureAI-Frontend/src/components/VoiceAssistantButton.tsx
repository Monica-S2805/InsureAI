import { Button, Typography, Box } from "@mui/material";
import { useVoiceAssistant } from "../hooks/useVoiceAssistant";

export default function VoiceAssistantButton({ role }: { role: string }) {
  const { listening, response, startListening } = useVoiceAssistant(role);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Button variant="contained" color="secondary" onClick={startListening}>
        {listening ? "Listening..." : "Start Voice Assistant"}
      </Button>

      {response && (
        <Typography sx={{ color: "white" }}>
          Assistant: {response}
        </Typography>
      )}
    </Box>
  );
}
