import "./EditView.css";
import React from 'react';
import {Typography} from '@mui/material';
import Icon from '@mui/material/Icon';
import {Image} from "@mui/icons-material";
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

function EditView() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div className="container">
            <div className="text_container">
                <Typography variant="h6" component="h2">
                    Here is your UI based on your wireframe.
                </Typography>
                <Typography variant="h6" component="h2">
                    You can regenerate the UI or edit it to your liking.
                </Typography>
            </div>
            <div className="help_container">
                <Typography variant="h6" component="h2" className="text_container">
                    See instructions on how to edit your computer.
                </Typography>
                <Icon onClick={handleOpen}>help_outline</Icon>
            </div>
            <Image 
                style={{ 
                    height: 500, 
                    width: 400, 
                    borderRadius: 20,
                    margin: 10,
                }}>
            </Image>
            <Button 
                variant="contained"
                onClick={() => console.log('regenerate')}>
                    Regenerate
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="modal_container">
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Edition instruction
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        First
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Second
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Third
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
};

export default EditView;