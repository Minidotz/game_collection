import { Box } from '@mui/material';
import styles from './index.module.css';
import pageStyles from '../../styles/page.module.css';

export default function Contact() {
    return (
        <Box className={`${pageStyles.content} ${styles.contactContainer}`}>
            <p>
                Game collection project created by Stratos Paraskevaidis. For more info, email me at <a href="mailto:dipar59@hotmail.com">dipar59@hotmail.com</a>. 
            </p>
        </Box>
    );
}
