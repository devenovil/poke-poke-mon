import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import store from "./store";
import { Provider, connect } from "react-redux";
import Notifications from "react-notification-system-redux";
import { SnackbarProvider, withSnackbar } from "notistack";
import { safeDeepGetWithType } from "./lib/json";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#007bc1"
    },
    secondary: {
      main: "#004a75"
    },
    grey: {
      "100": "#e5e5e5"
    }
  },
  overrides: {
    MuiSnackbar: {
      root: {
        maxWidth: "720px"
      }
    }
  }
});

const StyledSnackbar = withStyles({
  variantSuccess: {
    background: "linear-gradient(to left top, #a5d6a7, #4caf50)"
    // background: 'linear-gradient(to left top, #00C851, #007E34)'
    // backgroundColor: '#007E34'
  },
  variantError: {
    background: "linear-gradient(to left top, #ef9a9a, #f44336)"
    // background: 'linear-gradient(to left top, #FD2623, #CC0001)'
    // backgroundColor: '#CC0001'
  },
  variantWarning: {
    background: "linear-gradient(to left top, #ffcc80, #ff9800)"
    // background: 'linear-gradient(to left top, #FFBB33, #FF8800)'
    // backgroundColor: '#FF8800'
  },
  variantInfo: {
    background: "linear-gradient(to left top, #80deea, #00bcd4)"
    // background: 'linear-gradient(to left top, #33B5E7, #0099CB)'
    // backgroundColor: '#0099CB'
  }
})(SnackbarProvider);

class Base extends Component {
  handleClick = button => () => {
    // Avoid material-ui warnings. more info: https://material-ui.com/style/typography/#migration-to-typography-v2
    // eslint-disable-next-line no-underscore-dangle
    window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;
    this.props.enqueueSnackbar(button.message, { variant: button.variant });
  };

  render() {
    var notifs = safeDeepGetWithType(this, ["props", "notifications"], []);
    var length = notifs.length;
    if (length > 0) {
      const action = key => (
        <Fragment>
          <IconButton
            color="inherit"
            onClick={() => {
              this.props.closeSnackbar(key);
            }}
            aria-label="Close"
          >
            <CloseIcon style={{ height: 16, width: 16 }} />
          </IconButton>
        </Fragment>
      );
      var notif = notifs[length - 1];

      this.props.enqueueSnackbar(notif.message, {
        action,
        variant: notif.level,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right"
        }
      });
      // }
    }

    return (
      <div>
        <div style={{ visibility: "hidden" }}>
          <Notifications notifications={this.props.notifications} />
        </div>
        <App />
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    notifications: state.notifications
  };
};

const BaseC = connect(mapStateToProps)(withSnackbar(Base));

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <StyledSnackbar
        maxSnack={3}
        preventDuplicate={true}
        // autoHideDuration={2000}
      >
        <BaseC />
      </StyledSnackbar>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById("root")
);
