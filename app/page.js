'use client'
import Image from "next/image";
import { useState } from "react";
import { Box, Stack, TextField, Button } from '@mui/material';

export default function Home() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "Hi, I'm a support station. How can I support you?"
  }]);

  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    if (!message.trim()) return; // Do not send empty messages
    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' }
    ]);

    try {
      const response = await fetchWithRetry('/api/chat', {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }])
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let result = '';
      reader.read().then(function processText({ done, value }) {
        if (done) return result;
        const text = decoder.decode(value || new Int8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);

          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            }
          ];
        });
        return reader.read().then(processText);
      });
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error, e.g., show notification to the user
    }
  };

  async function fetchWithRetry(url, options, retries = 3) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        if (response.status === 429 && retries > 0) {
          await new Promise(res => setTimeout(res, 1000)); // Wait before retrying
          return fetchWithRetry(url, options, retries - 1);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      return response;
    } catch (error) {
      if (retries > 0) {
        return fetchWithRetry(url, options, retries - 1);
      } else {
        throw error;
      }
    }
  }

  return (
    <Box width={'100vw'} height={"100vh"} display='flex' flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
      <Stack direction={"column"} width="600px" height={"700px"} border="1px solid black" padding={2} spacing={3}>
        <Stack direction={"column"} spacing={2} flexGrow={1} overflow={"auto"} maxHeight={"100%"}>
          {
            messages.map((message, index) => (
              <Box key={index} display="flex" justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}>
                <Box bgcolor={message.role === 'assistant' ? '#1fbae8' : '#1fbae8'} color="white" borderRadius={16} p={3}>
                  {message.content}
                </Box>
              </Box>
            ))
          }
        </Stack>
        <Stack direction={"row"} spacing={2}>
          <TextField label="message" fullWidth value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button variant="contained" onClick={sendMessage}>Send</Button>
        </Stack>
      </Stack>
    </Box>
  );
}