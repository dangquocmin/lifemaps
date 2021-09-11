import React from "react";

import { Tree, TreeNode } from "react-organizational-chart";
import _ from "lodash";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import BusinessIcon from "@material-ui/icons/Business";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import PlusIcon from "@material-ui/icons/Add";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Badge from "@material-ui/core/Badge";
import Tooltip from "@material-ui/core/Tooltip";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop } from "react-dnd";
import organization from "./org.json";
import DeleteModal from "./DeleteModal";
import FormModal from "./FormModal";
import MapInfo from "./map/Info";
import { ToastProvider } from "react-toast-notifications";
import { DefaultToastContainer } from "react-toast-notifications";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import "./style.css";

import {
  createMuiTheme,
  makeStyles,
  ThemeProvider
} from "@material-ui/core/styles";

export const MyCustomToastContainer = (props) => (
  <DefaultToastContainer {...props} style={{ zIndex: 9999 }} />
);

const useStyles = makeStyles((theme) => ({
  root: {
    background: "white",
    display: "inline-block",
    borderRadius: 16
  },
  expand: {
    transform: "rotate(0deg)",
    marginTop: -10,
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.short
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: "#ECECF4"
  },
  noMaxWidth: {
    maxWidth: "none"
  }
}));

function Organization({
  org,
  onCollapse,
  collapsed,
  setO,
  setDeleteModalOpen,
  setFormModalOpen
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentHover, setCurrentHover] = React.useState(null);
  const [o2, setO2] = React.useState(org);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleClose();
    setDeleteModalOpen(true);
  };

  const handleEdit = () => {
    handleClose();
    setFormModalOpen(true);
  };

  const handleAddNew = () => {
    // o2["tradingName"] = "aaa";
    // o2["account"] = [
    //   {
    //     name: "Account 5",
    //     product: { name: "325 Plans" }
    //   }
    // ];

    // o2["organizationChildRelationship"] = [
    //   {
    //     tradingName: "Coca-Cola xx",
    //     account: [
    //       {
    //         name: "Account xx",
    //         product: { name: "325 Plans" }
    //       }
    //     ]
    //   }
    // ];
    // setO2(o2);
    // setO(o2);
    setFormModalOpen(true);
    handleClose();
  };

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "account",
    drop: () => ({ name: org.tradingName }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });
  const isActive = canDrop && isOver;
  let backgroundColor = "white";
  if (isActive) {
    backgroundColor = "#ddffd2";
  } else if (canDrop) {
    backgroundColor = "#ffeedc";
  }
  return (
    <Card
      onMouseOver={(event) => {
        setCurrentHover(event.target);
      }}
      onMouseOut={() => {
        setCurrentHover(null);
      }}
      variant="outlined"
      className={classes.root}
      ref={drop}
      style={{ backgroundColor }}
    >
      <CardHeader
        avatar={
          <Tooltip
            placement="top"
            classes={{ tooltip: classes.noMaxWidth }}
            title={<MapInfo entity={o2} />}
            interactive
          >
            <Badge
              style={{ cursor: "pointer" }}
              color="secondary"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
              }}
              showZero
              invisible={!collapsed}
              overlap="circle"
              badgeContent={_.size(o2.organizationChildRelationship)}
              onClick={onCollapse}
            >
              <Avatar className={classes.avatar}>
                <BusinessIcon color="primary" />
              </Avatar>
            </Badge>
          </Tooltip>
        }
        title={o2.tradingName}
        action={
          <IconButton size="small" onClick={handleClick}>
            <MoreVertIcon style={{ opacity: currentHover ? "1" : "0" }} />
          </IconButton>
        }
      />

      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose}>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Edit" />
        </MenuItem>
        <MenuItem onClick={handleAddNew}>
          <ListItemIcon>
            <PlusIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Add new child" />
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon color="secondary" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>

      <IconButton
        size="small"
        onClick={onCollapse}
        className={clsx(classes.expand, {
          [classes.expandOpen]: !collapsed
        })}
      >
        <ExpandMoreIcon />
      </IconButton>
    </Card>
  );
}
function Account({ a }) {
  const classes = useStyles();
  const [{ isDragging }, drag] = useDrag({
    item: { name: a.name, type: "account" },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        alert(`You moved ${item.name} to ${dropResult.name}`);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });
  const opacity = isDragging ? 0.4 : 1;
  return (
    <Card
      variant="outlined"
      className={classes.root}
      ref={drag}
      style={{ cursor: "pointer", opacity }}
    >
      <CardHeader
        avatar={
          <Avatar className={classes.avatar}>
            <AccountBalanceIcon color="secondary" />
          </Avatar>
        }
        title={a.name}
      />
    </Card>
  );
}
function Product({ p }) {
  const classes = useStyles();
  return (
    <Card variant="outlined" className={classes.root}>
      <CardContent>
        <Typography variant="subtitle2">{p.name}</Typography>
      </CardContent>
    </Card>
  );
}
function Node({ o, parent, setDeleteModalOpen, setFormModalOpen }) {
  const [collapsed, setCollapsed] = React.useState(o.collapsed);
  const [o2, setO2] = React.useState(o);
  const [rand, setR] = React.useState(null);
  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const changed = (o) => {
    setR(Math.random(0, 999999));
    setO2(o);
  };

  React.useEffect(() => {
    o2.collapsed = collapsed;
  });
  const T = parent
    ? TreeNode
    : (props) => (
        <Tree
          {...props}
          lineWidth={"2px"}
          lineColor={"#bbc"}
          lineBorderRadius={"12px"}
        >
          {props.children}
        </Tree>
      );
  return collapsed ? (
    <T
      label={
        <Organization
          org={o2}
          onCollapse={handleCollapse}
          collapsed={collapsed}
          setO={changed}
          setDeleteModalOpen={setDeleteModalOpen}
          setFormModalOpen={setFormModalOpen}
        />
      }
    />
  ) : (
    <T
      label={
        <Organization
          org={o2}
          onCollapse={handleCollapse}
          collapsed={collapsed}
          setO={changed}
          setDeleteModalOpen={setDeleteModalOpen}
          setFormModalOpen={setFormModalOpen}
        />
      }
    >
      {_.map(o2.account, (a) => (
        <TreeNode label={<Account a={a} />}>
          <TreeNode label={<Product p={a.product} />} />
        </TreeNode>
      ))}
      {_.map(o2.organizationChildRelationship, (c) => (
        <Node
          setFormModalOpen={setFormModalOpen}
          setDeleteModalOpen={setDeleteModalOpen}
          o={c}
          parent={o2}
        />
      ))}
    </T>
  );
}
const theme = createMuiTheme({
  palette: {
    background: "#ECECF4"
  },
  fontFamily: "Roboto, sans-serif"
});

export default function App(props) {
  const [x, setX] = React.useState(organization);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [formModalOpen, setFormModalOpen] = React.useState(true);
  const handleDelete = () => {
    setDeleteModalOpen(false);
  };
  const handleFormAction = () => {
    setFormModalOpen(false);
  };
  return (
    <ThemeProvider theme={theme}>
      <ToastProvider components={{ ToastContainer: MyCustomToastContainer }}>
        <Box bgcolor="background" padding={6}>
          <DndProvider backend={HTML5Backend}>
            {/* <TransformWrapper
              initialScale={1}
              initialPositionX={200}
              initialPositionY={100}
            > */}
            {/* {({ zoomIn, zoomOut, resetTransform, ...rest }) => ( */}
            <React.Fragment>
              {/* <div className="tools">
                    <button onClick={() => zoomIn()}>+</button>
                    <button onClick={() => zoomOut()}>-</button>
                    <button onClick={() => resetTransform()}>x</button>
                  </div> */}
              <TransformComponent>
                <Node
                  setFormModalOpen={setFormModalOpen}
                  setDeleteModalOpen={setDeleteModalOpen}
                  o={x}
                  setO={setX}
                />
                <DeleteModal
                  handleActionFunc={handleDelete}
                  setOpen={setDeleteModalOpen}
                  isOpen={deleteModalOpen}
                />
                <FormModal
                  handleActionFunc={handleFormAction}
                  setOpen={setFormModalOpen}
                  isOpen={formModalOpen}
                />
              </TransformComponent>
            </React.Fragment>
            {/* )} */}
            {/* </TransformWrapper> */}
          </DndProvider>
        </Box>
      </ToastProvider>
    </ThemeProvider>
  );
}
