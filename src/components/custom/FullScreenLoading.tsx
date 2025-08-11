import {CircularProgress} from "@mui/joy";

export const FullScreenLoading = () => (
  <div
    style={{
      position:'absolute',
      minHeight: '100vh',
      left: 0,
      bottom: 0,
      top: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <CircularProgress
      color="warning"
      size="sm"
      variant="soft"
      value={30}
      thickness={2}
    />
    </div>
);
