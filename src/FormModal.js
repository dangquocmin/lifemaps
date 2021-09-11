import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import Slide from "@material-ui/core/Slide";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import clsx from "clsx";
import ReferPeople from "./form/ReferPeople";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { IconPicker } from "react-fa-icon-picker";
import ColorPicker from "./map/ColorPicker";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  root2: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  margin: {
    margin: theme.spacing(1)
  },
  withoutLabel: {
    marginTop: theme.spacing(3)
  },
  textField: {
    width: "50ch"
  }
}));

const DialogTitle = (props) => {
  const { children, onClose, ...other } = props;
  const classes = useStyles();
  return (
    <MuiDialogTitle disableTypography className={classes.root2} {...other}>
      <Typography variant="h6">
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </Typography>
    </MuiDialogTitle>
  );
};

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

export default function AlertDialogSlide({
  handleActionFunc,
  isOpen,
  setOpen
}) {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    amount: "",
    password: "",
    weight: "",
    weightRange: "",
    showPassword: false,
    icon: "",
    icon_color: "black"
  });

  const handleChange = (prop, value) => {
    setValues({ ...values, [prop]: value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAction = () => {
    handleActionFunc();
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const showPickedIcon = (icon) => {
    console.info(icon); // prints {name: "access_alarm", code: "e190"}
  };

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={"lg"}
        fullScreen={fullScreen}
        open={isOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle aria-labelledby="customized-dialog-title">
          Edit
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="alert-dialog-slide-description">
            <div>
              <FormControl
                fullWidth
                className={classes.margin}
                variant="outlined"
              >
                <IconPicker
                  buttonStyles={{
                    borderColor: "#ccc",
                    borderRadius: "100%"
                  }}
                  pickerIconStyles={{
                    padding: "10px",
                    color: values.icon_color
                  }}
                  containerStyles={{
                    borderColor: "#bbb",
                    borderWidth: "1px",
                    padding: "20px"
                  }}
                  value={values.icon}
                  onChange={(v) => handleChange("icon", v)}
                  searchInputStyles={{
                    height: "30px",
                    border: "0",
                    borderBottom: "1px solid #ccc",
                    padding: "5px",
                    marginBottom: "10px"
                  }}
                />
                <ColorPicker />
              </FormControl>
              <FormControl
                fullWidth
                className={classes.margin}
                variant="outlined"
              >
                <TextField
                  id="outlined-search"
                  label="Tên"
                  type="search"
                  variant="outlined"
                />
              </FormControl>
              <FormControl
                fullWidth
                className={classes.margin}
                variant="outlined"
              >
                <TextField
                  id="outlined-textarea"
                  label="Mô tả"
                  placeholder="Mô tả"
                  rows={4}
                  multiline
                  variant="outlined"
                />
              </FormControl>
              <FormControl
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
              >
                <TextField
                  type="number"
                  label="Mức lương thấp nhất"
                  id="outlined-start-adornment"
                  className={clsx(classes.margin, classes.textField)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                  variant="outlined"
                />
              </FormControl>

              <FormControl
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
              >
                <TextField
                  type="number"
                  label="Mức lương cao nhất"
                  id="outlined-start-adornment"
                  className={clsx(classes.margin, classes.textField)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                  variant="outlined"
                />
              </FormControl>
              <FormControl
                fullWidth
                className={classes.margin}
                variant="outlined"
              >
                <ReferPeople />
              </FormControl>

              <FormControl
                fullWidth
                className={classes.margin}
                variant="outlined"
              >
                <ReferPeople />
              </FormControl>

              <FormControl
                fullWidth
                className={classes.margin}
                variant="outlined"
              >
                <ReferPeople />
              </FormControl>

              <FormControl
                fullWidth
                className={classes.margin}
                variant="outlined"
              >
                <TextField
                  id="outlined-textarea"
                  label="Ghi chú"
                  placeholder="Ghi chú"
                  rows={4}
                  multiline
                  variant="outlined"
                />
              </FormControl>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAction} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
