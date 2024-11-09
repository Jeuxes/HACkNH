import { styled } from '@mui/system';

export const PRIMARY_COLOR = "#FFFFFF";
// export const PRIMARY_COLOR = "#7444C0";
export const SECONDARY_COLOR = "#AAAAAA";
export const WHITE = "#FFFFFF";
export const SECONDARY_WHITE = "#F7F7FC";
export const TERTIARY_WHITE = "#FAFAFA";
export const LIGHTEST_GRAY = "#e1e1e1";
export const LIGHT_GRAY = "#A0A0A0";
export const GRAY = "#757E90";
export const DARK_GRAY = "#363636";
export const BLACK = "#000000";

export const ONLINE_STATUS = "#46A575";
export const OFFLINE_STATUS = "#D04949";

export const STAR_ACTIONS = "#FFA200";
export const LIKE_ACTIONS = "#B644B2";
export const DISLIKE_ACTIONS = "#363636";
export const FLASH_ACTIONS = "#5028D7";

const useStyles = styled((theme) => ({
  appBar: {
    borderRadius: 15,
    margin: '30px 0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    color: 'rgba(0,183,255, 1)',
  },
  image: {
    marginLeft: '15px',
  },
}));


export default useStyles;