import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useSelector } from 'react-redux';

// Define Redux state interface for type safety
interface RootState {
  hash: {
    myhash: `0x${string}` | null;
  };
}

// Interface for the component props
interface ReadATransactionProps {
  expandedTool: 'send' | 'graph' | null;
  handleToolClick: (tool: 'send' | 'graph') => void;
  setAnchorEl: (el: HTMLElement | null) => void;
}

// Interface for ReadTransaction's props
interface ReadTransactionProps {
  myhash: `0x${string}` | null;
}

// ReadTransaction Component
function ReadTransaction({ myhash }: ReadTransactionProps) {

  return (
    <div>
      {!myhash  && (
        <Typography variant="body2" color="text.secondary">
          No transaction hash available
        </Typography>
      )}
    </div>
  );
}

const ReadATransaction = ({
  expandedTool,
  handleToolClick,
  setAnchorEl,
}: ReadATransactionProps) => {
  // Fetch hash from Redux store with proper typing
  const hash = useSelector((state: RootState) => state.hash.myhash);

  // State to control visibility of the div
  const [showDiv, setShowDiv] = useState(false);

  // Debugging: Log the hash to verify its value
  React.useEffect(() => {
    console.log('Redux hash:', hash);
  }, [hash]);

  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  // Function triggered by button click
  const triggerTodoAction = () => {
    // Example logic: Log the hash or perform an action
    console.log('Todo action triggered with hash:', hash);
    
    // Optionally, process the hash (replace with your logic)
    if (hash) {
      console.log('Processing transaction:', hash);
      // Example: You could make an API call, dispatch a Redux action, etc.
    } else {
      console.log('No hash available for processing');
    }

    // Show the div
    setShowDiv(true);
  };

  return (
    <Card
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 4,
        boxShadow: expandedTool === 'send' ? 6 : 3,
        transform: expandedTool === 'send' ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        zIndex: expandedTool === 'send' ? 2 : 1,
        cursor: 'pointer',
        width: { xs: '100%', sm: '400px' },
        maxWidth: '100%',
        ...(expandedTool !== 'send' && {
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }),
      }}
      onClick={() => handleToolClick('send')}
    >
      <CardHeader
        title={
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1.125rem', sm: '1.25rem' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.primary',
              width: '100%',
            }}
          >
            <IconButton
              onClick={handleIconClick}
              sx={{
                color: 'primary.main',
                '&:hover': {
                  color: 'secondary.main',
                },
              }}
              aria-label="Transaction info"
            >
              <InfoIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
            </IconButton>
            Read a Transaction
          </Typography>
        }
        sx={{
          p: { xs: 1.5, sm: 2 },
          textAlign: 'center',
        }}
      />
      <Collapse in={expandedTool === 'send'}>
        <CardContent
          sx={{
            p: { xs: 2, sm: 3 },
            pt: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 1.5, sm: 2 },
            }}
          >
            <TextField
              label="Transaction Hash"
              variant="outlined"
              value={hash || ''}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                },
              }}
            />
            <ReadTransaction myhash={hash} />
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              fullWidth
              onClick={triggerTodoAction}
            >
Search by Hash        </Button>
            {showDiv && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.primary">
                  On the todolist
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default ReadATransaction;