import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  root: {
    minWidth: 345,
    maxWidth: 345
  },
  action: {
    paddingBottom: 30
  }
});

export default function PeopleInfo({ entity, setReferPeople }) {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt={entity.name}
          height="140"
          image={entity.avatar}
          title={entity.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h6">
            {entity.name}
            {entity.position ? (
              <span style={{ fontSize: "12pt" }}> ({entity.position})</span>
            ) : null}
          </Typography>
          <Typography gutterBottom variant="body2" component="p">
            {entity.email}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {entity.note}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.action}>
        <Button size="small" color="primary">
          {t("actions.view")}
        </Button>
        <Button
          onClick={() => {
            setReferPeople(entity);
          }}
          size="small"
          color="primary"
        >
          {t("actions.edit")}
        </Button>
      </CardActions>
    </Card>
  );
}
