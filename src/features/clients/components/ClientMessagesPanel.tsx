// FILE: features/clients/components/ClientMessagesPanel.tsx
// PURPOSE: Sticky messages panel rendering chat history and composer, aligned to the right column.
// NOTES: Preserves original alignment, colors, and sticky behavior when used within a sticky container.

import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import type { Message } from '../types';

const CLIENT_MESSAGES_PANEL_MAX_WIDTH_PX = 420;
const CLIENT_MESSAGES_PANEL_STICKY_TOP_PX = 80;

export interface ClientMessagesPanelProps {
  messages: Message[];
}

export default function ClientMessagesPanel({ messages }: ClientMessagesPanelProps) {
  return (
    <Box
      sx={{
        position: { md: 'sticky' },
        top: { md: CLIENT_MESSAGES_PANEL_STICKY_TOP_PX },
        alignSelf: 'flex-start',
        width: '100%',
        maxWidth: CLIENT_MESSAGES_PANEL_MAX_WIDTH_PX,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: 1,
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Messages
        </Typography>

        {/* Scrollable list */}
        <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto', mb: 2 }}>
          <Stack spacing={1}>
            {messages.map((msg) => {
              const isCompany = msg.sender === 'company';
              return (
                <Box
                  key={msg.id}
                  sx={{ display: 'flex', justifyContent: isCompany ? 'flex-end' : 'flex-start' }}
                >
                  <Box
                    sx={{
                      maxWidth: '75%',
                      px: 1.5,
                      py: 1,
                      bgcolor: isCompany ? 'primary.main' : 'grey.200',
                      color: isCompany ? 'primary.contrastText' : 'text.primary',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">{msg.text}</Typography>
                    <Typography
                      variant="caption"
                      color={isCompany ? 'primary.contrastText' : 'text.secondary'}
                    >
                      {new Date(msg.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Box>

        {/* Composer */}
        <Stack direction="row" spacing={1}>
          <TextField fullWidth size="small" placeholder="Type a message…" />
          <Button variant="contained">Send</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
