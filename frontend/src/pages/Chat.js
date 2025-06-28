import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Paper,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Send,
  Add,
  Group,
  Person,
  School,
  Message,
  MoreVert,
  Search,
  AttachFile,
  EmojiEmotions,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

function Chat() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openNewChat, setOpenNewChat] = useState(false);
  const [newChatData, setNewChatData] = useState({
    title: '',
    type: 'direct',
    participants: [],
  });
  const messagesEndRef = useRef(null);

  const currentUser = { userId: 1, name: 'Current User' }; // This should come from auth context

  useEffect(() => {
    fetchConversations();
    fetchUsers();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.conversationId);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/chat/conversations/${currentUser.userId}`);
      setConversations(response.data.data || []);
    } catch (error) {
      setError('Failed to fetch conversations');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(`http://localhost:4000/chat/messages/${conversationId}`);
      setMessages(response.data.data || []);
    } catch (error) {
      setError('Failed to fetch messages');
      console.error('Error:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/student');
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:4000/course');
      setCourses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await axios.post('http://localhost:4000/chat/messages', {
        conversationId: selectedConversation.conversationId,
        senderId: currentUser.userId,
        content: newMessage,
      });

      setMessages(prev => [...prev, response.data.data]);
      setNewMessage('');
    } catch (error) {
      setError('Failed to send message');
      console.error('Error:', error);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await axios.post('http://localhost:4000/chat/conversations', {
        ...newChatData,
        participants: [...newChatData.participants, currentUser.userId],
      });

      setConversations(prev => [response.data.data, ...prev]);
      setOpenNewChat(false);
      setNewChatData({ title: '', type: 'direct', participants: [] });
    } catch (error) {
      setError('Failed to create conversation');
      console.error('Error:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getConversationIcon = (type) => {
    switch (type) {
      case 'group':
        return <Group />;
      case 'course':
        return <School />;
      default:
        return <Person />;
    }
  };

  const getConversationColor = (type) => {
    switch (type) {
      case 'group':
        return '#8b5cf6';
      case 'course':
        return '#3b82f6';
      default:
        return '#10b981';
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ p: 3, height: 'calc(100vh - 100px)' }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
          Chat & Messages
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Communicate with students, lecturers, and course groups
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ height: 'calc(100% - 120px)' }}>
        {/* Conversations List */}
        <Grid item xs={12} md={4}>
          <MotionCard
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            sx={{ height: '100%' }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Conversations
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpenNewChat(true)}
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5855eb 0%, #7c3aed 100%)',
                    },
                  }}
                >
                  New Chat
                </Button>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List sx={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto' }}>
                  {conversations.map((conversation, index) => (
                    <React.Fragment key={conversation.conversationId}>
                      <ListItem
                        button
                        selected={selectedConversation?.conversationId === conversation.conversationId}
                        onClick={() => setSelectedConversation(conversation)}
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          '&.Mui-selected': {
                            backgroundColor: '#f1f5f9',
                            '&:hover': {
                              backgroundColor: '#e2e8f0',
                            },
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              backgroundColor: getConversationColor(conversation.type),
                              color: 'white',
                            }}
                          >
                            {getConversationIcon(conversation.type)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={conversation.title}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {conversation.lastMessage}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {conversation.lastMessageTime && new Date(conversation.lastMessageTime).toLocaleDateString()}
                              </Typography>
                            </Box>
                          }
                        />
                        <Chip
                          label={conversation.type}
                          size="small"
                          sx={{
                            backgroundColor: getConversationColor(conversation.type),
                            color: 'white',
                            '& .MuiChip-label': { color: 'white' },
                          }}
                        />
                      </ListItem>
                      {index < conversations.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Chat Area */}
        <Grid item xs={12} md={8}>
          <MotionCard
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <Box
                  sx={{
                    p: 2,
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        backgroundColor: getConversationColor(selectedConversation.type),
                        color: 'white',
                        mr: 2,
                      }}
                    >
                      {getConversationIcon(selectedConversation.type)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {selectedConversation.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedConversation.type} conversation
                      </Typography>
                    </Box>
                    <IconButton>
                      <MoreVert />
                    </IconButton>
                  </Box>
                </Box>

                {/* Messages */}
                <Box
                  sx={{
                    flex: 1,
                    p: 2,
                    overflow: 'auto',
                    backgroundColor: '#f8fafc',
                    maxHeight: 'calc(100vh - 400px)',
                  }}
                >
                  {messages.map((message, index) => (
                    <Box
                      key={message.messageId}
                      sx={{
                        display: 'flex',
                        justifyContent: message.senderId === currentUser.userId ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Paper
                        sx={{
                          p: 2,
                          maxWidth: '70%',
                          backgroundColor: message.senderId === currentUser.userId ? '#6366f1' : 'white',
                          color: message.senderId === currentUser.userId ? 'white' : 'inherit',
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {message.senderName}
                        </Typography>
                        <Typography variant="body1">{message.content}</Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            opacity: 0.7,
                            display: 'block',
                            mt: 0.5,
                          }}
                        >
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                  <div ref={messagesEndRef} />
                </Box>

                {/* Message Input */}
                <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small">
                      <AttachFile />
                    </IconButton>
                    <IconButton size="small">
                      <EmojiEmotions />
                    </IconButton>
                    <TextField
                      fullWidth
                      multiline
                      maxRows={4}
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      variant="outlined"
                      size="small"
                    />
                    <Button
                      variant="contained"
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      sx={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5855eb 0%, #7c3aed 100%)',
                        },
                      }}
                    >
                      <Send />
                    </Button>
                  </Box>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: '#64748b',
                }}
              >
                <Message sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Select a conversation
                </Typography>
                <Typography variant="body2">
                  Choose a conversation from the list to start messaging
                </Typography>
              </Box>
            )}
          </MotionCard>
        </Grid>
      </Grid>

      {/* New Chat Dialog */}
      <Dialog open={openNewChat} onClose={() => setOpenNewChat(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Conversation</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Conversation Title"
              value={newChatData.title}
              onChange={(e) => setNewChatData({ ...newChatData, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Conversation Type</InputLabel>
              <Select
                value={newChatData.type}
                label="Conversation Type"
                onChange={(e) => setNewChatData({ ...newChatData, type: e.target.value })}
              >
                <MenuItem value="direct">Direct Message</MenuItem>
                <MenuItem value="group">Group Chat</MenuItem>
                <MenuItem value="course">Course Chat</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Participants</InputLabel>
              <Select
                multiple
                value={newChatData.participants}
                label="Participants"
                onChange={(e) => setNewChatData({ ...newChatData, participants: e.target.value })}
              >
                {users.map((user) => (
                  <MenuItem key={user.studentId} value={user.studentId}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewChat(false)}>Cancel</Button>
          <Button onClick={createNewChat} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </MotionBox>
  );
}

export default Chat; 