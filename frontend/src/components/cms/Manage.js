import React, { Component } from "react";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";

import {
  getHits,
  getParamConfig,
  removePost,
  updatePost,
} from "../../utils/functions";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Radio,
  TableContainer,
  MenuList,
  MenuItem,
  Grid,
  Breadcrumbs,
  Link,
  Box,
} from "@material-ui/core";
import NewPost from "./NewPost";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import EditPost from "./EditPost";
import { Link as RouterLink } from "react-router-dom";

// Up to top page click
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (Boolean(document.getElementById("btTop"))) {
    if (
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 100
    ) {
      document.getElementById("btTop").style.display = "block";
    } else {
      document.getElementById("btTop").style.display = "none";
    }
  }
}

function desc(a, b, orderBy) {
  if (b._source[orderBy] < a._source[orderBy]) {
    return -1;
  }
  if (b._source[orderBy] > a._source[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
  { id: "title", numeric: false, disablePadding: false, label: "Titre" },
  {
    id: "author",
    numeric: false,
    disablePadding: false,
    label: "Auteur",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow className="head">
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={order}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className="visuallyHidden">
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell></TableCell>
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected, handleAddNewPost, handleRemovePost, title } = props;

  return (
    <Toolbar className="toolBar" id={title}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Tooltip id={title} title="Ajouter un nouveau post">
            <Button
              className="button iconButton"
              onClick={handleAddNewPost}
              value={title}
              aria-label="add"
            >
              <i className="fas fa-2x fa-file-medical"></i>
            </Button>
          </Tooltip>
          <h2
            className="card-title bg-dark-gray text-white fontWeightMedium"
            id="tableTitle"
          >
            {title}
          </h2>
        </Grid>

        <Grid item>
          {numSelected > 0 ? (
            <Grid container direction="row" alignItems="center" spacing={1}>
              <Grid item>
                <Typography className="fontWeightRegular" color="inherit">
                  {numSelected} sélectionné(s)
                </Typography>
              </Grid>
              <Grid item>
                <Tooltip title="Suppression de contenu">
                  <Button
                    className="button plain primaryMain"
                    value={title}
                    onClick={handleRemovePost}
                    aria-label="delete"
                  >
                    <i className="fas fa-sm fa-trash-alt"></i>
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
          ) : (
            <Button
              className="button plain primaryMain"
              disabled
              aria-label="delete"
            >
              <i className="fas fa-sm fa-trash-alt"></i>
            </Button>
          )}
        </Grid>
      </Grid>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  handleAddNewPost: PropTypes.func.isRequired,
  handleRemovePost: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
const AlertMessage = (props) => {
  const { openAlert, handleClose, message } = props;

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      key="topCenter"
      open={openAlert}
      onClose={handleClose}
      autoHideDuration={3000}
      ContentProps={{
        "aria-describedby": "message-id",
      }}
      message={<span id="message-id">{message}</span>}
    />
  );
};

AlertMessage.propTypes = {
  openAlert: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default class Manage extends Component {
  constructor(props) {
    super();
    this.state = {
      order: {
        articles: "asc",
        news: "asc",
        about: "asc",
      },
      orderBy: "title",
      selected: { articles: [], news: [], about: [] },
      choice: 2,
      open: false,
      openAlert: false,
      mess: "",
      editData: null,
      selectedItem: { articles: null, news: null, about: null },
      news: [],
      articles: [],
      about: [],
      type: null,
    };
  }

  handleRequestSort = (title) => {
    return function (event, property) {
      const isDesc =
        this.state.orderBy === property && this.state.order[title] === "desc";
      let order_ = this.state.order;
      order_[title] = isDesc ? "asc" : "desc";
      this.setState({
        order: order_,
        orderBy: property,
      });
    }.bind(this);
  };

  handleSelectAllClick = (data, title) => {
    return function (event) {
      let selected_ = this.state.selected;
      if (event.target.checked) {
        selected_[title] = data.map((n) => n["_id"]);

        this.setState({
          selected: selected_,
        });
      } else {
        selected_[title] = [];

        this.setState({
          selected: selected_,
        });
      }
    }.bind(this);
  };

  handleClick = (event, name, title) => {
    const selectedIndex = this.state.selected[title].indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(this.state.selected[title], name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(this.state.selected[title].slice(1));
    } else if (selectedIndex === this.state.selected[title].length - 1) {
      newSelected = newSelected.concat(this.state.selected[title].slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        this.state.selected[title].slice(0, selectedIndex),
        this.state.selected[title].slice(selectedIndex + 1)
      );
    }
    let selected_ = this.state.selected;
    selected_[title] = newSelected;
    const type_ = { articles: 1, news: 2, about: 3 };
    this.setState({
      selected: selected_,
      type: type_[title],
    });
  };

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage,
    });
  };

  handleAddNewPost = (event) => {
    const type_ = { articles: 1, news: 2, about: 3 };
    this.setState({
      choice: 0,
      type: type_[event.currentTarget.value],
    });
  };

  handleBackToManager = (event) => {
    document.location.reload();
  };

  handleRemovePost = (event) => {
    const type_ = { articles: 1, news: 2, about: 3 };
    this.setState({
      open: true,
      type: type_[event.currentTarget.value],
    });
  };

  handleDialogClose = (event) => {
    this.setState({
      open: false,
    });
  };

  handleDialogConfirm = (event) => {
    const type_ = ["articles", "news", "about"];
    removePost(this.state.selected[type_[this.state.type - 1]]).then((res) => {
      if (res.status === 200) {
        this.setState({
          open: false,
          openAlert: true,
          mess: res.mess,
        });
      } else {
        this.setState({
          open: false,
          openAlert: true,
          mess: res.err,
        });
      }
    });
  };

  handleAlertClose = (event) => {
    document.location.reload();
  };

  handleUpdatePost = (data) => {
    return function (e) {
      this.setState({
        choice: 1,
        editData: data,
      });
    }.bind(this);
  };

  handleSelectItem = (title) => {
    return function (event) {
      if (Boolean(this.state.selectedItem[title])) {
        const item = {
          id: [this.state.selectedItem[title]],
          doc: [{ selected: false }],
        };
        updatePost(item).then((res) => {
          if (res.status === 200) {
            console.log("Mise à jour avec succees");
          } else {
            console.log("Echec ");
          }
        });
      }
      const item = {
        id: [event.target.value],
        doc: [{ selected: true }],
      };
      updatePost(item).then((res) => {
        if (res.status === 200) {
          console.log("Mise à jour avec succees");
        } else {
          console.log("Echec ");
        }
      });

      let selectedItem_ = this.state.selectedItem;
      selectedItem_[title] = event.target.value;
      this.setState({
        selectedItem: selectedItem_,
      });
    }.bind(this);
  };

  setDefaultView(data, title) {
    const isSelected = (name) =>
      this.state.selected[title].indexOf(name) !== -1;

    return (
      <div>
        <TableContainer className="tableContainer">
          <EnhancedTableToolbar
            numSelected={this.state.selected[title].length}
            handleAddNewPost={this.handleAddNewPost}
            handleRemovePost={this.handleRemovePost}
            title={title}
          />

          <Table
            className="table"
            aria-labelledby="tableTitle"
            size={"medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              numSelected={this.state.selected[title].length}
              order={this.state.order[title]}
              orderBy={this.state.orderBy}
              onSelectAllClick={this.handleSelectAllClick(data, title)}
              onRequestSort={this.handleRequestSort(title)}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(
                data,
                getSorting(this.state.order[title], this.state.orderBy)
              ).map((row, index) => {
                const isItemSelected = isSelected(row["_id"]);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row["_id"]}
                    selected={isItemSelected}
                  >
                    <TableCell
                      onClick={(event) =>
                        this.handleClick(event, row["_id"], title)
                      }
                      role="checkbox"
                      padding="checkbox"
                    >
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row._source["title"]}
                    </TableCell>
                    <TableCell align="left">{row._source["author"]}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Mise à jour du contenu">
                        <Button
                          className="button iconButton"
                          onClick={this.handleUpdatePost(row)}
                          aria-label="update"
                        >
                          <i className="fas fa-pen"></i>
                        </Button>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Sélectionner l'élément à ajouter à la page d'accueil">
                        <Radio
                          checked={this.state.selectedItem[title] === row._id}
                          onChange={this.handleSelectItem(title)}
                          value={row._id}
                        />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }

  componentDidMount() {
    getHits(
      getParamConfig("es_host") + "/" + getParamConfig("es_index_cms")
    ).then((data) => {
      data.forEach((item) => {
        switch (parseInt(item._source["type"], 10)) {
          case 1:
            this.state.articles.push(item);
            break;
          case 2:
            this.state.news.push(item);
            break;
          case 3:
            this.state.about.push(item);
            break;
          default:
            break;
        }
      });

      this.state.articles.sort(function (a, b) {
        return a._source["order"] - b._source["order"];
      });

      let idx = this.state.articles.findIndex(
        (item) => item._source["selected"] === true
      );
      let selectedItem_ = this.state.selectedItem;
      if (idx > -1) {
        selectedItem_["articles"] = this.state.articles[idx]._id;
      }
      idx = this.state.news.findIndex(
        (item) => item._source["selected"] === true
      );
      if (idx > -1) {
        selectedItem_["news"] = this.state.news[idx]._id;
      }

      this.state.about.sort(function (a, b) {
        return a._source["order"] - b._source["order"];
      });

      idx = this.state.about.findIndex(
        (item) => item._source["selected"] === true
      );
      if (idx > -1) {
        selectedItem_["about"] = this.state.about[idx]._id;
      }
      this.setState({
        articles: this.state.articles,
        news: this.state.news,
        about: this.state.about,
        selectedItem: selectedItem_,
      });
    });
  }

  topFunction = function () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };
  render() {
    const menu = (
      <div className="leftMenu bg-gray">
        <MenuList>
          <MenuItem className="bg-dark-gray" key={1}>
            <a className="text-white" href="#articlesDiv">
              État de la recherche
            </a>
          </MenuItem>
          <MenuItem className="bg-dark-gray" key={2}>
            {" "}
            <a className="text-white" href="#newsDiv">
              Actualités
            </a>
          </MenuItem>
          <MenuItem className="bg-dark-gray" key={3}>
            <a className="text-white" href="#aboutDiv">
              À propos
            </a>
          </MenuItem>
        </MenuList>
      </div>
    );

    const backButton = (
      <Tooltip title="Retour dans gestion de contenu">
        <Button
          variant="contained"
          onClick={this.handleBackToManager}
          startIcon={<ArrowBackIcon />}
          className="backBt"
        >
          Gestion de contenu
        </Button>
      </Tooltip>
    );

    switch (this.state.choice) {
      case 0:
        this.curView = (
          <NewPost
            backButton={backButton}
            type={this.state.type}
            alertMessage={AlertMessage}
            favorisList={
              parseInt(this.state.type, 10) === 1
                ? this.state.articles
                : this.state.about
            }
          />
        );
        break;
      case 1:
        this.curView = (
          <EditPost
            backButton={backButton}
            alertMessage={AlertMessage}
            data={this.state.editData}
            favorisList={
              parseInt(this.state.editData._source["type"], 10) === 1
                ? this.state.articles
                : this.state.about
            }
          />
        );
        break;
      case 2:
        this.curView = (
          <div className="manage_root cms">
            <Breadcrumbs
              separator={<i className="fas fa-caret-right"></i>}
              aria-label="Breadcrumb"
              className="breadcrumbs"
            >
              <Link
                id="home"
                key={0}
                color="inherit"
                href={getParamConfig("web_url") + "/accueil"}
              >
                Accueil
              </Link>

              <Link
                id="espace"
                key={1}
                color="inherit"
                component={RouterLink}
                to="/espace"
              >
                Mon espace
              </Link>
              <div>Administration</div>
              <div>Gestion de contenu</div>
            </Breadcrumbs>

            <h1 className="heading">
              <i className="far fa-edit"></i> Gestion de contenu
            </h1>

            <Grid container direction="row" justify="center" spacing={0}>
              <Grid item xs={12} md={2}>
                {menu}
              </Grid>
              <Grid className="bg-white" item xs={12} md={10}>
                <section id="articlesDiv">
                  {this.setDefaultView(this.state.articles, "articles")}
                </section>
                <section id="newsDiv">
                  {" "}
                  {this.setDefaultView(this.state.news, "news")}
                </section>
                <section id="aboutDiv">
                  {" "}
                  {this.setDefaultView(this.state.about, "about")}
                </section>
              </Grid>
            </Grid>
            <Dialog
              open={this.state.open}
              onClose={this.handleDialogClose}
              aria-labelledby="draggable-dialog-title"
            >
              <DialogTitle
                style={{ cursor: "move" }}
                id="draggable-dialog-title"
              >
                Confirmation
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Souhaitez-vous vraiment supprimer les éléments sélectionnés ?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={this.handleDialogClose}
                  className="button plain primaryMain"
                >
                  Annuler
                </Button>
                <Button
                  onClick={this.handleDialogConfirm}
                  className="button plain bg-danger"
                >
                  Supprimer
                </Button>
              </DialogActions>
            </Dialog>
            <AlertMessage
              message={this.state.mess}
              openAlert={this.state.openAlert}
              handleClose={this.handleAlertClose}
            />

            <Box display="flex" justifyContent="flex-end">
              <Tooltip
                title="Haut de page"
                style={{ cursor: "hand" }}
                interactive
              >
                <Button
                  id="btTop"
                  onClick={this.topFunction}
                  aria-label="Remonter en haut de la page"
                  className="iconButton"
                >
                  <i className="fas fa-level-up-alt"></i>
                </Button>
              </Tooltip>
            </Box>
          </div>
        );

        break;
      default:
        break;
    }
    return this.curView;
  }
}
