import React, { Component } from "react";

import ReactDOMServer from "react-dom/server";
import {
  createStyled,
  createElementFromHTML,
  getParamConfig,
  downloadFile,
  generatePDF
} from "../utils/functions";
import {
  Paper,
  Typography,
  Grid,
  IconButton,
  Button,
  TextField,
  Link,
  Dialog,
  Menu,
  MenuItem
} from "@material-ui/core";
import NewLine from "@material-ui/icons/SubdirectoryArrowLeftOutlined";
import SpaceLineIcon from "@material-ui/icons/FormatLineSpacingOutlined";
import SpaceBarIcon from "@material-ui/icons/SpaceBarOutlined";
import ImageIIF from "../utils/ImageIIIF";
import "../styles/WillDisplay.css";
import classNames from "classnames";
import isEqual from "lodash/isEqual";
import ExportIcon from "@material-ui/icons/SaveAltOutlined";

const Styled = createStyled(theme => ({
  paper: {
    padding: theme.spacing(2),
    color: "#212121",
    backgroundColor: "#FAFAFA",
    textAlign: "justify",
    fontSize: 18
  },

  typography: {
    fontFamily: "-apple-system",

    fontWeight: 600
  },
  title: {
    fontSize: 24,
    fontStyle: "oblique",
    textAlign: "center",
    fontWeight: 600
  },
  linkPage: {
    color: "#212121",
    fontSize: 18,
    fontWeight: 400,
    "&:hover": {
      color: "#0091EA"
    }
  },
  selectedLink: {
    fontWeight: 600,
    color: "#0091EA",
    fontSize: 18
  },
  nextPage: {
    display: "block",
    marginLeft: "90%"
  },
  urlWill: {
    color: "#0091EA",
    fontSize: 14
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  modalPaper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

export function createPage(page, idx, type, nextPage) {
  const listTypes = { transcription: "Transcription", edition: "Édition" };
  let output = (
    <Styled>
      {({ classes }) => (
        <div>
          <Typography className={classes.title}>{listTypes[type]}</Typography>
          <Paper className={classes.paper}>
            {
              <div
                dangerouslySetInnerHTML={{
                  __html: page[idx][type]
                }}
              />
            }
            {idx < page.length - 1 ? nextPage : null}
          </Paper>
        </div>
      )}
    </Styled>
  );

  return output;
}
export default class WillDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idx: 0,
      cur_page: null,
      copyLink: null,
      openModal: false,
      anchorEl: null,
      anchorElMenu: null
    };

    this.months = [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre"
    ];
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleExportTEIClick = this.handleExportTEIClick.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleExportClick = this.handleExportClick.bind(this);
    this.handleExportClose = this.handleExportClose.bind(this);
    this.handleExportPDFClick = this.handleExportPDFClick.bind(this);
  }

  handleAlertClose = event => {
    this.setState({
      open: false
    });
  };

  handlePageClick(event) {
    window.history.replaceState(
      getParamConfig("web_url"),
      "will",
      getParamConfig("web_url") +
        "/testament/" +
        this.props.id +
        "/" +
        this.props.data["will_pages"][event.target.getAttribute("value")][
          "page_type"
        ].type +
        "_" +
        this.props.data["will_pages"][event.target.getAttribute("value")][
          "page_type"
        ].id
    );

    if (event.target.getAttribute("value") !== this.state.idx) {
      this.setState({
        idx: event.target.getAttribute("value")
      });
    }
  }

  handleOpenModal(event) {
    const curLink = event.target.getAttribute("id")
      ? getParamConfig("web_url") +
        "/testament/" +
        this.props.id +
        "/" +
        this.props.data["will_pages"][event.target.getAttribute("id")][
          "page_type"
        ].type +
        "_" +
        this.props.data["will_pages"][event.target.getAttribute("id")][
          "page_type"
        ].id
      : null;
    if (curLink) {
      this.setState({
        copyLink: curLink,
        openModal: true,
        anchorEl: Boolean(this.state.anchorEl) ? null : event.currentTarget
      });
    }
  }

  handleCloseModal() {
    this.setState({
      openModal: false
    });
  }

  handleExportTEIClick() {
    downloadFile(
      getParamConfig("web_url") + "/files/will_" + this.props.id + ".xml",
      "will_" + this.props.id + ".xml"
    );
  }

  handleExportPDFClick() {
    generatePDF(this.props.data);
  }

  handleNextPage(event) {
    document.documentElement.scrollTop = 0;
    this.setState({
      idx: parseInt(this.state.idx, 10) + 1
    });
  }
  componentDidMount() {
    const cur_idx = this.props.data["will_pages"].findIndex(item => {
      return isEqual(item["page_type"], this.props.cur_page);
    });

    if (cur_idx !== -1) {
      this.setState({
        idx: cur_idx
      });
    }
    let lbCollection = document.getElementsByClassName("lb");
    for (let item of lbCollection) {
      item.before(
        createElementFromHTML(
          ReactDOMServer.renderToStaticMarkup(
            <NewLine
              titleAccess="changement de ligne"
              color="primary"
              style={{ cursor: "help" }}
              id="newLine_lb"
            />
          )
        )
      );
    }
    let spaceVerCollection = document.getElementsByClassName("space_vertical");
    for (let item of spaceVerCollection) {
      item.append(
        createElementFromHTML(
          ReactDOMServer.renderToStaticMarkup(
            <SpaceLineIcon
              titleAccess="Marque un espace vertical"
              color="primary"
              style={{ cursor: "help" }}
              id="spaceLine_vertical"
            />
          )
        )
      );
    }
    let spaceHorCollection = document.getElementsByClassName(
      "space_horizontal"
    );
    for (let item of spaceHorCollection) {
      item.append(
        createElementFromHTML(
          ReactDOMServer.renderToStaticMarkup(
            <SpaceBarIcon
              titleAccess="Marque un espace horizontal"
              color="primary"
              style={{ cursor: "help" }}
              id="spaceLine_horizontal"
            />
          )
        )
      );
    }
  }

  handleExportClick(event) {
    this.setState({
      anchorElMenu: event.currentTarget
    });
  }

  handleExportClose() {
    this.setState({
      anchorElMenu: null
    });
  }

  componentDidUpdate() {
    if (document.getElementById("newLine_lb") === null) {
      let lbCollection = document.getElementsByClassName("lb");
      for (let item of lbCollection) {
        item.before(
          createElementFromHTML(
            ReactDOMServer.renderToStaticMarkup(
              <NewLine
                titleAccess="changement de ligne"
                color="primary"
                style={{ cursor: "help" }}
                id="newLine_lb"
              />
            )
          )
        );
      }
    }
    if (document.getElementById("spaceLine_vertical") === null) {
      let spaceHorCollection = document.getElementsByClassName(
        "space_vertical"
      );
      for (let item of spaceHorCollection) {
        item.append(
          createElementFromHTML(
            ReactDOMServer.renderToStaticMarkup(
              <SpaceLineIcon
                titleAccess="Marque un espace vertical"
                color="primary"
                style={{ cursor: "help" }}
                id="spaceLine_vertical"
              />
            )
          )
        );
      }
    }
    if (document.getElementById("spaceLine_horizontal") === null) {
      let spaceHorCollection = document.getElementsByClassName(
        "space_horizental"
      );
      for (let item of spaceHorCollection) {
        item.append(
          createElementFromHTML(
            ReactDOMServer.renderToStaticMarkup(
              <SpaceBarIcon
                titleAccess="Marque un espace horizontal"
                color="primary"
                style={{ cursor: "help" }}
                id="spaceLine_horizontal"
              />
            )
          )
        );
      }
    }
  }

  render() {
    /* const popper_open = Boolean(this.state.anchorEl);
    const popper_id = popper_open ? "transitions-popper" : undefined;*/

    const nextPage = (
      <Styled>
        {({ classes }) => (
          <Button
            color="primary"
            title="Page suivante"
            onClick={this.handleNextPage}
            className={classes.nextPage}
          >
            [...]
          </Button>
        )}
      </Styled>
    );
    let output = null;
    if (this.props.data) {
      const will_uri =
        getParamConfig("web_url") + "/testament/" + this.props.id;
      const cur_idx =
        this.props.data["will_pages"].length <= this.state.idx
          ? 0
          : this.state.idx;
      let death_date = Boolean(this.props.data["will_contents.death_date"])
        ? new Date(this.props.data["will_contents.death_date"])
        : null;

      death_date = Boolean(death_date)
        ? death_date.toLocaleDateString().split("/")
        : null;
      let will_date = Boolean(this.props.data["will_contents.will_date"])
        ? new Date(this.props.data["will_contents.will_date"])
        : null;

      will_date = Boolean(will_date)
        ? will_date.toLocaleDateString().split("/")
        : null;

      output = (
        <Styled>
          {({ classes }) => (
            <div>
              <Grid container direction="column" justify="flex-start">
                <Grid key={3} item>
                  <IconButton
                    style={{ marginLeft: "90%" }}
                    id="btExport"
                    aria-label="Export"
                    title="Exporter le testament en format TEI"
                    onClick={this.handleExportClick}
                  >
                    <ExportIcon fontSize="large" />
                  </IconButton>
                  <Menu
                    id="simple-menu-explor"
                    anchorEl={this.state.anchorElMenu}
                    keepMounted
                    open={Boolean(this.state.anchorElMenu)}
                    onClose={this.handleExportClose}
                    elevation={0}
                    getContentAnchorEl={null}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center"
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center"
                    }}
                  >
                    <MenuItem onClick={this.handleExplorClose}>
                      <Button id="bt-tei" onClick={this.handleExportTEIClick}>
                        TEI
                      </Button>
                    </MenuItem>
                    <MenuItem onClick={this.handleExplorClose}>
                      <Button id="bt-pdf" onClick={this.handleExportPDFClick}>
                        PDF
                      </Button>
                    </MenuItem>
                  </Menu>
                </Grid>
                <Grid key={2} item>
                  <Paper>
                    <Grid container justify="flex-start" alignItems="center">
                      <Grid
                        item
                        className={classNames(
                          classes.typography,
                          classes.paper
                        )}
                        xs={6}
                      >
                        <Typography>
                          Testament de{" "}
                          <Link
                            href={
                              getParamConfig("web_url") +
                              "/testateur/" +
                              this.props.data["testator.ref"]
                            }
                            target="_blank"
                          >
                            {" "}
                            {this.props.data["testator.name"]}{" "}
                          </Link>
                        </Typography>
                        <Typography>
                          Mort pour la france
                          {Boolean(death_date)
                            ? " le " +
                              death_date[0] +
                              " " +
                              this.months[death_date[1] - 1] +
                              " " +
                              death_date[2]
                            : ""}
                          {Boolean(
                            this.props.data["will_contents.death_place_norm"]
                          ) ? (
                            <span>
                              {" "}
                              à{" "}
                              {Boolean(
                                this.props.data["will_contents.death_place_ref"]
                              ) ? (
                                <Link
                                  href={
                                    getParamConfig("web_url") +
                                    "/place/" +
                                    this.props.data[
                                      "will_contents.death_place_ref"
                                    ]
                                  }
                                  target="_blank"
                                >
                                  {
                                    this.props.data[
                                      "will_contents.death_place_norm"
                                    ]
                                  }
                                </Link>
                              ) : (
                                this.props.data[
                                  "will_contents.death_place_norm"
                                ]
                              )}
                            </span>
                          ) : (
                            ""
                          )}
                        </Typography>
                        {Boolean(will_date) ||
                        Boolean(
                          this.props.data["will_contents.will_place_norm"]
                        ) ? (
                          <Typography>
                            {Boolean(will_date)
                              ? " Testament rédigé le " +
                                will_date[0] +
                                " " +
                                this.months[will_date[1] - 1] +
                                " " +
                                will_date[2]
                              : ""}{" "}
                            {Boolean(
                              this.props.data["will_contents.will_place_norm"]
                            ) ? (
                              <span>
                                {" "}
                                à{" "}
                                {Boolean(
                                  this.props.data[
                                    "will_contents.will_place_ref"
                                  ]
                                ) ? (
                                  <Link
                                    href={
                                      getParamConfig("web_url") +
                                      "/place/" +
                                      this.props.data[
                                        "will_contents.will_place_ref"
                                      ]
                                    }
                                    target="_blank"
                                  >
                                    {
                                      this.props.data[
                                        "will_contents.will_place_norm"
                                      ]
                                    }
                                  </Link>
                                ) : (
                                  this.props.data[
                                    "will_contents.will_place_norm"
                                  ]
                                )}
                              </span>
                            ) : (
                              ""
                            )}
                          </Typography>
                        ) : (
                          ""
                        )}
                        <Typography>
                          Cote aux{" "}
                          {this.props.data["will_identifier.institution"]}{" "}
                          {this.props.data["will_identifier.cote"]}
                        </Typography>
                        <Typography>
                          {this.props.data[
                            "will_physDesc.support"
                          ][0].toUpperCase() +
                            this.props.data["will_physDesc.support"].slice(1)}
                          , {this.props.data["will_physDesc.handDesc"]},{" "}
                          {this.props.data["will_physDesc.dim"]["width"]}
                          {this.props.data["will_physDesc.dim"]["unit"]} x{" "}
                          {this.props.data["will_physDesc.dim"]["height"]}
                          {this.props.data["will_physDesc.dim"]["unit"]}
                        </Typography>
                        <Grid container direction="row" spacing={1}>
                          <Grid item>
                            <Typography> Lien de testament : </Typography>
                          </Grid>
                          <Grid item>
                            <Link
                              href={will_uri}
                              target="_blank"
                              className={classes.urlWill}
                            >
                              {" "}
                              {will_uri}{" "}
                            </Link>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        className={classNames(
                          classes.typography,
                          classes.paper
                        )}
                        xs={6}
                      >
                        <Typography variant="h6">
                          Les contributeurs :
                        </Typography>
                        {this.props.data["contributions"].map(
                          (contributor, i) => {
                            return (
                              <Typography key={i}>
                                {" "}
                                {contributor["resp"][0].toUpperCase() +
                                  contributor["resp"].substring(1)}{" "}
                                : {contributor["persName"].join(", ")}
                              </Typography>
                            );
                          }
                        )}
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid key={0} item>
                  {this.props.createPageMenu(
                    this.props.id,
                    this.props.data["will_pages"],
                    cur_idx,
                    this.handlePageClick,
                    this.handleOpenModal
                  )}
                </Grid>
                <Grid key={1} item>
                  <Grid
                    container
                    justify="center"
                    alignItems="flex-start"
                    direction="row"
                    spacing={2}
                  >
                    <Grid key={10} item sm={4}>
                      <Typography className={classes.title}>Image</Typography>
                      <Paper className={classes.paper}>
                        <ImageIIF
                          url={
                            this.props.data["will_pages"][cur_idx][
                              "picture_url"
                            ]
                          }
                          id="willImage"
                        />
                      </Paper>
                    </Grid>
                    <Grid key={11} item sm={4}>
                      {createPage(
                        this.props.data["will_pages"],
                        cur_idx,
                        "transcription",
                        nextPage
                      )}
                    </Grid>
                    <Grid key={12} item sm={4}>
                      {createPage(
                        this.props.data["will_pages"],
                        cur_idx,
                        "edition",
                        nextPage
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/* <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                key="topCenter"
                open={this.state.open}
                onClose={this.handleAlertClose}
                ContentProps={{
                  "aria-describedby": "message-id"
                }}
                message={
                  <span id="message-id">
                    Merci de vous identifier pour télécharger les testaments !
                  </span>
                }
              ></Snackbar> */}

              <Dialog
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.openModal}
                onClose={this.handleCloseModal}
                maxWidth="md"
                fullWidth={true}
              >
                <div className={classes.paper}>
                  <Grid
                    container
                    alignItems="center"
                    justify="flex-start"
                    direction="row"
                    className={classNames(classes.typography, classes.paper)}
                    spacing={1}
                  >
                    <Grid item>
                      <Typography> Lien de testament : </Typography>
                    </Grid>
                    <Grid item xs>
                      <TextField
                        id="uriSelect"
                        defaultValue={this.state.copyLink}
                        fullWidth={true}
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    </Grid>
                  </Grid>
                </div>
              </Dialog>
              {/* <Popper
                id={
                  popper_id
                }
                open={popper}
                anchorEl={this.state.anchorEl}
                transition
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={350}>
                    <div className={classes.paper}>
                      <Grid
                        container
                        alignItems="center"
                        justify="flex-start"
                        direction="row"
                        className={classNames(
                          classes.typography,
                          classes.paper
                        )}
                        spacing={1}
                      >
                        <Grid item>
                          <Typography> Lien de testament : </Typography>
                        </Grid>
                        <Grid item xs>
                          <TextField
                            id="uriSelect"
                            defaultValue={this.state.copyLink}
                            fullWidth={true}
                            InputProps={{
                              readOnly: true
                            }}
                          />
                        </Grid>
                      </Grid>
                    </div>
                  </Fade>
                )}
                          </Popper>*/}
            </div>
          )}
        </Styled>
      );
    }

    return output;
  }
}