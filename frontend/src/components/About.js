import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {
  createStyled,
  getParamConfig,
  getHitsFromQuery,
  getTotalHits
} from "../utils/functions";
import {
  Breadcrumbs,
  Paper,
  Link,
  Typography,
  Grid,
  IconButton,
  MenuList,
  MenuItem
} from "@material-ui/core";
import MoreIcon from "@material-ui/icons/More";
import { ReactiveBase, ReactiveList } from "@appbaseio/reactivesearch";
import classNames from "classnames";

const { ResultListWrapper } = ReactiveList;

const Styled = createStyled(theme => ({
  root: {
    flexWrap: "wrap",
    margin: theme.spacing(2, 0, 0, 2)
  },
  list: {
    width: "60%",
    border: "1px solid #dadce0",
    margin: "auto",
    marginTop: theme.spacing(4)
  },
  detail: {
    border: "1px solid #dadce0",
    marginTop: theme.spacing(4)
  },
  item: {
    textAlign: "justify",
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    backgroundColor: "#f5f5f5"
  },
  foot: {
    fontSize: 14,
    margin: theme.spacing(1)
  },
  head: {
    fontSize: 14,
    margin: theme.spacing(1),
    padding: theme.spacing(1)
  },
  title: {
    color: "#000000",
    fontSize: "1.5em"
  },
  icon: {
    fontSize: 20
  },
  menu: {
    marginTop: theme.spacing(4),
    fontSize: 14,
    textAlign: "justify",
    display: "block",
    verticalAlign: "middle"
  },
  link: {
    textTransform: "none",
    paddingLeft: 15,
    color: "#212121",
    fontWeight: 500,
    fontFamily: "-apple-system",
    "&:hover, &:focus": {
      color: "#0091EA",
      fontWeight: 600,
      backgroundColor: "#eceff1"
    },
    "&:active": {
      color: "#0091EA",
      fontWeight: 600
    }
  },
  activedLink: {
    color: "#0091EA",
    fontWeight: 600
  }
}));

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectedId: ""
    };
    this.handleListItemClick = this.handleListItemClick.bind(this);
  }

  handleListItemClick(event) {
    /*const itemFind = this.state.lastNews.find(function (item) {
      return item["_id"] === event.target.id;
    });*/

    this.setState({
      selectedId: event.target.id
    });
  }

  componentDidMount() {
    const url = document.location.href;
    const idx = url.lastIndexOf("about/");

    const totalHits = getTotalHits(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_cms")
    );
    const total = typeof totalHits === "object" ? totalHits.value : totalHits;

    const newData = getHitsFromQuery(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_cms"),
      JSON.stringify({
        size: total,
        query: {
          term: {
            type: 3
          }
        },
        sort: [{ created: { order: "desc" } }]
      })
    );

    if (idx !== -1) {
      const id_query = url.substring(idx + 6).split("/");
      const hits = getHitsFromQuery(
        getParamConfig("es_host") + "/" + getParamConfig("es_index_cms"),
        JSON.stringify({
          query: {
            term: {
              _id: id_query[0]
            }
          }
        })
      );
      this.setState({
        data: newData,
        selectedId: hits.length > 0 ? hits[0]["_id"] : newData[0]["_id"]
      });
    } else {
      this.setState({
        data: newData,
        selectedId: newData[0]["_id"]
      });
    }
  }

  render() {
    const curItem =
      this.state.selectedId === ""
        ? this.state.data[0]
        : this.state.data.find(
            function(item) {
              return item["_id"] === this.state.selectedId;
            }.bind(this)
          );

    const prevLink = document.referrer.includes("search?")
      ? "/search?" + document.referrer.split("?")[1]
      : "/search";
    const currLink = [
      <Link
        id="about"
        key={1}
        color="inherit"
        component={RouterLink}
        to="/about"
      >
        {" "}
        A propos{" "}
      </Link>,
      <Typography key={2} color="textPrimary">
        {curItem ? curItem._source["title"] : null}
      </Typography>
    ];

    const navBar = (
      <Paper elevation={0}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="Breadcrumb"
        >
          <Link
            id="search"
            key={0}
            color="inherit"
            component={RouterLink}
            to={prevLink}
          >
            {" "}
            Recherche{" "}
          </Link>
          {currLink}
        </Breadcrumbs>
      </Paper>
    );

    const menuAbout = (
      <Styled>
        {({ classes }) => (
          <Paper className={classes.menu}>
            <MenuList>
              {this.state.data.map((item, i) => (
                <MenuItem key={i}>
                  <Link
                    id={item["_id"]}
                    className={
                      this.state.selectedId === item["_id"]
                        ? classNames(classes.link, classes.activedLink)
                        : classes.link
                    }
                    component={RouterLink}
                    to={"/about/" + item["_id"]}
                    onClick={this.handleListItemClick}
                  >
                    {item._source["title"]}
                  </Link>
                </MenuItem>
              ))}
            </MenuList>
          </Paper>
        )}
      </Styled>
    );

    const date = Boolean(curItem) ? new Date(curItem._source["created"]) : null;

    return (
      <Styled>
        {({ classes }) =>
          Boolean(curItem) ? (
            <div className={classes.root}>
              {navBar}

              <Grid container direction="row" spacing={2}>
                <Grid item xs={4}>
                  {menuAbout}
                </Grid>
                <Grid item xs={8}>
                  <div className={classes.detail}>
                    <Paper className={classes.item} key={0}>
                      <Typography className={classes.title}>
                        {" "}
                        {curItem._source["title"]}{" "}
                      </Typography>
                      <Paper className={classes.head}>
                        <Grid
                          container
                          direction="row"
                          justify="space-between"
                          alignItems="center"
                        >
                          <Grid item>{curItem._source["author"]}</Grid>
                          <Grid item>
                            {Boolean(date)
                              ? "Mise à jour le " +
                                date.toLocaleDateString() +
                                " à " +
                                date.toLocaleTimeString()
                              : ""}
                          </Grid>
                        </Grid>
                      </Paper>
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            curItem._source["detail"] !== ""
                              ? curItem._source["detail"]
                              : curItem._source["summary"]
                        }}
                      ></div>
                    </Paper>
                  </div>
                </Grid>
              </Grid>
            </div>
          ) : (
            <Typography variant="h3">
              Aucune information à afficher !
            </Typography>
          )
        }
      </Styled>
    );
  }
}

export default About;
