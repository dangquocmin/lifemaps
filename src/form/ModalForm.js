import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import WebsiteIcon from "@material-ui/icons/DesktopWindows";
import CircularProgress from "@material-ui/core/CircularProgress";
import { addReferPeople, updateReferPeople } from "../api/Request";
import Backdrop from "@material-ui/core/Backdrop";
import { useToasts } from "react-toast-notifications";
import { useTranslation } from "react-i18next";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import "date-fns";
import clsx from "clsx";
import DateFnsUtils from "@date-io/date-fns";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Grid from "@material-ui/core/Grid";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import AvatarUploader from "react-avatar-uploader";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { useTheme } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
    background: "transparent"
  },
  margin: {
    margin: theme.spacing(1)
  }
}));

export default function ModalForm({ afterSubmit, entity }) {
  const classes = useStyles();
  const [toggleOpen, setToggleOpen] = useState(true);
  const [submittingPeople, setSubmittingPeople] = useState(false);
  const { addToast } = useToasts();
  const { t } = useTranslation();

  const isAddNew = () => {
    return !entity.id;
  };

  const getFormTitle = () => {
    return isAddNew()
      ? t("refer_people.add_form.title")
      : t("refer_people.edit_form.title");
  };

  const getFormDescription = () => {
    return isAddNew()
      ? t("refer_people.add_form.description")
      : t("refer_people.edit_form.description");
  };

  const getSuccessMsg = () => {
    return isAddNew()
      ? t("refer_people.add_form.success")
      : t("refer_people.edit_form.success");
  };

  const handleClose = (cancel = true) => {
    afterSubmit(entity, cancel);
    setToggleOpen(false);
  };

  const [formData, setFormData] = React.useState(entity);

  const [selectedDate, setSelectedDate] = React.useState(
    entity.birthday ?? new Date("2014-08-18T21:11:54")
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
    formData.birthday = date;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmittingPeople(true);
    if (isAddNew()) {
      await addReferPeople(formData);
    } else {
      await updateReferPeople(formData);
    }

    addToast(getSuccessMsg(), {
      appearance: "success",
      autoDismiss: true
    });
    setSubmittingPeople(false);
    handleClose(false);
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Dialog
          fullScreen={fullScreen}
          fullWidth={true}
          open={toggleOpen}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
          aria-describedby="alert-dialog-slide-description"
          maxWidth={"md"}
          keepMounted
        >
          <DialogTitle id="form-dialog-title">{getFormTitle()}</DialogTitle>
          <form onSubmit={handleSubmit} style={{ overflow: "auto" }}>
            <DialogContent dividers>
              <DialogContentText>
                {getFormDescription()}
                <Grid container justifyContent="space-around">
                  <AvatarUploader
                    name="avatar-x"
                    defaultImg={formData.avatar}
                    size="150"
                    uploadURL="http://localhost:3000"
                    fileType={"image/png"}
                  />
                </Grid>
                <FormControl
                  fullWidth
                  className={classes.margin}
                  variant="outlined"
                >
                  <TextField
                    required
                    id="outlined-search"
                    label={t("refer_people.form_fields.name")}
                    type="text"
                    variant="outlined"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData({ ...formData, name: event.target.value })
                    }
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  className={classes.margin}
                  variant="outlined"
                >
                  <TextField
                    id="outlined-search"
                    label={t("refer_people.form_fields.email")}
                    type="email"
                    variant="outlined"
                    value={formData.email}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        email: event.target.value
                      })
                    }
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  className={classes.margin}
                  variant="outlined"
                >
                  <TextField
                    id="outlined-search"
                    label={t("refer_people.form_fields.position")}
                    type="text"
                    variant="outlined"
                    value={formData.position}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        position: event.target.value
                      })
                    }
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  className={classes.margin}
                  variant="outlined"
                >
                  <TextField
                    id="outlined-search"
                    label={t("refer_people.form_fields.phone")}
                    type="text"
                    variant="outlined"
                    value={formData.phone}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        phone: event.target.value
                      })
                    }
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  className={classes.margin}
                  variant="outlined"
                >
                  <TextField
                    multiline
                    rows={4}
                    id="outlined-search"
                    label={t("refer_people.form_fields.address")}
                    type="text"
                    variant="outlined"
                    value={formData.address}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        address: event.target.value
                      })
                    }
                  />
                </FormControl>
                <FormControl
                  className={clsx(classes.margin, classes.textField)}
                  variant="outlined"
                >
                  <FormLabel component="legend">
                    {t("refer_people.form_fields.sex")}
                  </FormLabel>
                  <RadioGroup
                    row
                    value={formData.sex}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        sex: event.target.value
                      })
                    }
                  >
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label={t("refer_people.form_fields.sex_value.female")}
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label={t("refer_people.form_fields.sex_value.male")}
                    />
                    <FormControlLabel
                      value="other"
                      control={<Radio />}
                      label={t("refer_people.form_fields.sex_value.other")}
                    />
                  </RadioGroup>
                </FormControl>
                <FormControl variant="outlined">
                  <KeyboardDatePicker
                    margin="normal"
                    label={t("refer_people.form_fields.birthday")}
                    format="MM/dd/yyyy"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date"
                    }}
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  className={classes.margin}
                  variant="outlined"
                >
                  <TextField
                    type="text"
                    label={t("refer_people.form_fields.website")}
                    value={formData.website}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        website: event.target.value
                      })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WebsiteIcon />
                        </InputAdornment>
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
                  <TextField
                    type="text"
                    label={t("refer_people.form_fields.facebook")}
                    value={formData.facebook}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        facebook: event.target.value
                      })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FacebookIcon />
                        </InputAdornment>
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
                  <TextField
                    type="text"
                    label={t("refer_people.form_fields.twitter")}
                    value={formData.twitter}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        twitter: event.target.value
                      })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TwitterIcon />
                        </InputAdornment>
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
                  <TextField
                    multiline
                    rows={4}
                    id="outlined-search"
                    label={t("refer_people.form_fields.note")}
                    type="text"
                    variant="outlined"
                    value={formData.note}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        note: event.target.value
                      })
                    }
                  />
                </FormControl>
              </DialogContentText>
            </DialogContent>
          </form>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              {t("actions.cancel")}
            </Button>
            <Button type="submit" onClick={handleSubmit} color="primary">
              {isAddNew() ? t("actions.add") : t("actions.update")}
            </Button>
          </DialogActions>
          <Backdrop className={classes.backdrop} open={submittingPeople}>
            <CircularProgress color="primary" />
          </Backdrop>
        </Dialog>
      </MuiPickersUtilsProvider>
    </div>
  );
}
