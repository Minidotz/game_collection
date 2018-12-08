import React from 'react';
import { List, ListItem, Avatar, ListItemText } from '@material-ui/core';
import { Image as ImgIcon} from '@material-ui/icons'
import Link from 'react-router-dom/Link';

export default function GameList(props) {
    return (
        <List>
            {props.data.length > 0 ? (
                props.data.map(d => {
                    return (
                        <ListItem key={d._id} button component={Link} to={'/game/' + d.guid} >
                            {d.image ? (
                                <Avatar alt={d.title} src={d.image} />
                            ) : (
                                <Avatar><ImgIcon /></Avatar>
                            )}
                            <ListItemText primary={d.title} />
                        </ListItem>
                    )
                })
            ) : (
                    <ListItem>
                        <ListItemText primary={<em>No data</em>} />
                    </ListItem>
                )
            }
        </List>
    )
}