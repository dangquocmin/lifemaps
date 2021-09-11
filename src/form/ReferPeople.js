import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import Autocomplete, {
  createFilterOptions
} from "@material-ui/lab/Autocomplete";
import Avatar from "@material-ui/core/Avatar";
import FormLabel from "@material-ui/core/FormLabel";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import { makeStyles } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import AddIcon from "@material-ui/icons/AddCircle";
import Chip from "@material-ui/core/Chip";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getReferPeople } from "../api/Request";
import { useTranslation } from "react-i18next";
import "date-fns";
import ModalForm from "./ModalForm";
import PeopleInfo from "./PeopleInfo";
import Tooltip from "@material-ui/core/Tooltip";
import Card from "@material-ui/core/Card";
const filter = createFilterOptions();

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "100%",
    backgroundColor: theme.palette.background.paper
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3)
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7)
  },
  chip: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5)
    },
    cursor: "pointer"
  },
  pointer: {
    cursor: "pointer"
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
    background: "transparent"
  },
  margin: {
    margin: theme.spacing(1)
  },
  noMaxWidth: {
    maxWidth: "none"
  }
}));

export default function ReferPeople() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  let tooltipClickTime = false;
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState([]);
  const [referPeople, setReferPeople] = useState(null);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    } else {
      onChangeHandle("");
    }
  }, [open]);
  const { t } = useTranslation();

  const isTooltipClick = () => {
    return tooltipClickTime;
  };
  const optionsData = options.map((option) => {
    const firstLetter = option.name[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
      ...option
    };
  });
  const setValueForceUnique = (valueX) => {
    let list = {};
    valueX.map((e, idx) => {
      if (list[e.id]) {
        list[e.id].push(idx);
      } else {
        list[e.id] = [idx];
      }
    });
    let r = [];
    for (let i in list) {
      if (list[i].length <= 1) {
        r.push(valueX[list[i].pop()]);
      }
    }
    setValue(r);
  };

  const handleSubmit = async (dialogValue, cancel) => {
    setReferPeople(null);
    if (cancel) {
      return false;
    }
    const firstLetter = dialogValue.name[0].toUpperCase();
    dialogValue["firstLetter"] = /[0-9]/.test(firstLetter)
      ? "0-9"
      : firstLetter;
    value.push(dialogValue);
    setValueForceUnique(value);
  };

  const getTagText = (parts) => {
    return parts.map((part, index) => (
      <span style={{ fontWeight: part.highlight ? 700 : 400 }}>
        {part.text}
      </span>
    ));
  };

  const isSelected = (item) => {
    let r = false;
    value.map((e, idx) => {
      if (e.id === item.id) {
        r = true;
        return r;
      }
    });
    return r;
  };
  const onChangeHandle = async (value) => {
    setLoading(true);
    const r = await getReferPeople(value);
    setLoading(false);
    setOptions(r);
  };

  const tooltipClick = () => {
    tooltipClickTime = true;
  };

  return (
    <div>
      <Autocomplete
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        loading={loading}
        value={value}
        onChange={(event, newValue) => {
          if (isTooltipClick()) {
            tooltipClickTime = false;
            return false;
          }
          tooltipClickTime = false;
          let last = newValue.slice(-1)[0];

          if (last && !last.firstLetter) {
            // timeout to avoid instant validation of the dialog's form.
            return setTimeout(() => {
              setReferPeople({
                name: last.inputValue,
                avatar:
                  "http://diembaoaz.com/wp-content/uploads/2018/11/anh-girl-xinh-9-1.jpg",
                id: ""
              });
            });
          }
          setValueForceUnique(newValue);
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          if (params.inputValue !== "") {
            filtered.push({
              inputValue: params.inputValue,
              name: t("refer_people.add_new_with_name", {
                name: params.inputValue
              }),
              isAddNew: true
            });
          }

          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        multiple
        limitTags={5}
        id="multiple-limit-tags"
        options={optionsData.sort(
          (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
        )}
        groupBy={(option) => option.firstLetter}
        getOptionLabel={(option) => {
          // e.g value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.name;
        }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <div className={classes.chip}>
              <Chip
                className={classes.pointer}
                avatar={
                  <Tooltip
                    classes={{ tooltip: classes.noMaxWidth }}
                    placement="top"
                    title={
                      <Card onClick={tooltipClick}>
                        <PeopleInfo
                          setReferPeople={setReferPeople}
                          entity={option}
                        />
                      </Card>
                    }
                    interactive
                  >
                    <Avatar
                      className={classes.pointer}
                      alt={`Avatar`}
                      src={option.avatar}
                    />
                  </Tooltip>
                }
                label={
                  <Tooltip
                    classes={{ tooltip: classes.noMaxWidth }}
                    placement="top"
                    title={
                      <Card onClick={tooltipClick}>
                        <PeopleInfo
                          setReferPeople={setReferPeople}
                          entity={option}
                        />
                      </Card>
                    }
                    interactive
                  >
                    <FormLabel className={classes.pointer}>
                      {option.name}
                    </FormLabel>
                  </Tooltip>
                }
                {...getTagProps({ index })}
              />
            </div>
          ))
        }
        renderOption={(option, { inputValue }) => {
          let name = option.name;
          const matches = match(name, inputValue);
          const parts = parse(name, matches);

          return (
            <List dense className={classes.root}>
              {option.isAddNew ? (
                <ListItem>
                  <AddIcon color={"primary"} />
                  <ListItemText primary={option.name} />
                </ListItem>
              ) : (
                <ListItem>
                  <Tooltip
                    classes={{ tooltip: classes.noMaxWidth }}
                    placement="top"
                    title={
                      <Card onClick={tooltipClick}>
                        <PeopleInfo
                          setReferPeople={setReferPeople}
                          entity={option}
                        />
                      </Card>
                    }
                    interactive
                  >
                    <ListItemAvatar>
                      <Avatar alt={`Avatar`} src={option.avatar} />
                    </ListItemAvatar>
                  </Tooltip>
                  <ListItemText primary={getTagText(parts)} />
                  <ListItemSecondaryAction>
                    {isSelected(option) ? (
                      <CheckIcon color={"primary"} />
                    ) : null}
                  </ListItemSecondaryAction>
                </ListItem>
              )}
            </List>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label={t("refer_people.placeholder")}
            placeholder={t("refer_people.placeholder")}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              )
            }}
            onChange={(ev) => {
              // dont fire API if the user delete or not entered anything
              if (ev.target.value !== "" || ev.target.value !== null) {
                onChangeHandle(ev.target.value);
              }
            }}
          />
        )}
      />
      {referPeople ? (
        <ModalForm afterSubmit={handleSubmit} entity={referPeople} />
      ) : null}
    </div>
  );
}
