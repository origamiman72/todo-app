import React, { Component } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

function CategoryMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (category) => {
        setAnchorEl(null);
        props.setCategory(category)
    };

    if (!props.categories || props.categories.length === 0) {
        return null;
    } else {
        return (
            <div className={props.className}>
                <Button aria-controls="simple-menu" aria-haspopup="true" variant="outlined" onClick={handleClick}>
                    {props.label || "Categories"}
                </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                >
                    <MenuItem onClick={() => handleClose(null)}>None</MenuItem>
                {props.categories.map((category) => (
                    <MenuItem key={category} onClick={() => {
                        handleClose(category);
                    }}>{category}</MenuItem>
                    
                ))
                }
            </Menu>
            </div>
        );

    }

}

export default CategoryMenu;