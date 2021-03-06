import React, { Component } from "react";
import { TextField, Button, Grid, Breadcrumbs, Link } from "@material-ui/core";
import {
  getUserToken,
  updateConfigMail,
  getParamConfig,
  updateRole,
} from "../../utils/functions";

import { Link as RouterLink } from "react-router-dom";

class ConfigMail extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      email_admin: "",
      password: "",
      passConfirme: "",
      showPassword: false,
      error: "",
      isError: [false, false, false],
      open: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleAdd = (e) => {
    if (this.state.email_admin) {
      const req = { email: this.state.email_admin, role: true };
      updateRole(req).then((res) => {
        if (res.status === 200) {
          this.setState({
            open: true,
          });
        } else {
          const err = res.err ? res.err : "Connexion au serveur a échoué !";
          this.setState({
            error: err,
          });
        }
      });
    }
  };

  handleRemove = (e) => {
    const userToken = getUserToken();

    if (this.state.email_admin && this.state.email_admin !== userToken.email) {
      const req = { email: this.state.email_admin, role: false };
      updateRole(req).then((res) => {
        if (res.status === 200) {
          this.setState({
            open: true,
          });
        } else {
          const err = res.err ? res.err : "Connexion au serveur a échoué !";
          this.setState({
            error: err,
          });
        }
      });
    }
  };
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      error: "",
    });
  }

  handleClickShowPassword = (e) => {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  };

  handleClose() {
    this.setState({
      open: false,
    });
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.state.email) {
      if (!this.state.password) {
        this.setState({
          error: "Saisissez votre mot de passe !",
          isError: [false, true, true],
        });
      } else if (this.state.password !== this.state.passConfirme) {
        this.setState({
          error: "Les mots de passe saisis ne sont pas identiques",
          isError: [false, true, true],
        });
      } else {
        const myToken = getUserToken();
        const auth = {
          email_root: myToken.email,
          email: this.state.email,
          password: this.state.password,
        };
        updateConfigMail(auth).then((res) => {
          if (res.status === 200) {
            this.setState({
              open: true,
            });
          } else {
            const err = res.err ? res.err : "Connexion au serveur a échoué !";
            this.setState({
              error: err,
            });
          }
        });
      }
    } else if (!this.state.email) {
      this.setState({
        error: "Saisissez votre adresse e-mail !",
        isError: [true, false, false],
      });
    }
  }

  render() {
    return (
      <div className="configMail cms">
        <Breadcrumbs
          separator={<i className="fas fa-caret-right"></i>}
          aria-label="Breadcrumb"
          className="breadcrumbs"
        >
          <Link
            id="home"
            key={0}
            color="inherit"
            component={RouterLink}
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
          <div>Gestion serveur</div>
        </Breadcrumbs>

        <div className="bg-white paddingContainer">
          <Grid>
            <Grid item>
              <h2>
                {" "}
                Gestion des droits d'administrateurs (ajouter où supprimer les
                droits d'admin):
              </h2>
              <Grid container direction={"column"}>
                <Grid item xs={6}>
                  <TextField
                    id="standard-email-input-2"
                    required
                    fullWidth
                    variant="outlined"
                    className="input"
                    label="Adresse email"
                    type="email"
                    name="email_admin"
                    autoComplete="email"
                    onChange={this.onChange}
                    value={this.state.email_admin}
                    error={this.state.isError[1]}
                  />
                </Grid>
                <Grid
                  item
                  container
                  direction={"row"}
                  justify="space-evenly"
                  alignItems="center"
                  xs={6}
                >
                  <Grid item>
                    <Button
                      className="submit button fontWeightMedium plain bg-secondaryLight"
                      onClick={this.handleAdd}
                    >
                      Ajouter
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      className="submit button fontWeightMedium plain bg-secondaryLight"
                      onClick={this.handleRemove}
                    >
                      Supprimer
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              {/*<h2>
                Configurer le serveur SMTP d'envoi du mail aux utilisateurs
              </h2>
              <form
                className="form"
                noValidate
                onSubmit={this.onSubmit}
                autoComplete="off"
              >
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item xs={12}>
                    <TextField
                      id="standard-email-input"
                      required
                      fullWidth
                      variant="outlined"
                      className="input"
                      label="Adresse email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      onChange={this.onChange}
                      value={this.state.email}
                      error={this.state.isError[1]}
                    />
                  </Grid>
                  <Grid item>
                    <Grid
                      container
                      alignItems="center"
                      justify="space-evenly"
                      spacing={1}
                    >
                      <Grid item xs>
                        <TextField
                          id="password"
                          required
                          className="input"
                          variant="outlined"
                          fullWidth
                          label="Mot de passe"
                          type={this.state.showPassword ? "text" : "password"}
                          name="password"
                          autoComplete="current-password"
                          onChange={this.onChange}
                          value={this.state.password}
                          error={this.state.isError[2]}
                        />
                      </Grid>
                      <Grid item xs>
                        <TextField
                          id="password-confirme"
                          required
                          className="input"
                          variant="outlined"
                          fullWidth
                          label="Confirmation"
                          type={this.state.showPassword ? "text" : "password"}
                          name="passConfirme"
                          autoComplete="current-password"
                          onChange={this.onChange}
                          value={this.state.passConfirme}
                          error={this.state.isError[3]}
                        />{" "}
                      </Grid>
                      <Grid item xs={1}>
                        <InputAdornment position="end">
                          <IconButton
                            className="togglePassword"
                            aria-label="Toggle password visibility"
                            onClick={this.handleClickShowPassword}
                          >
                            {this.state.showPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Button
                  className="submit button fontWeightMedium plain bg-secondaryLight"
                  type="submit"
                >
                  Mettre à jour
                </Button>
              </form>
              {this.state.error ? (
                <div className="text-error">{this.state.error}</div>
              ) : (
                ""
              )}
              <Dialog
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.open}
                onClose={this.handleClose}
              >
                <DialogTitle id="customized-dialog-title">
                  <IconButton
                    aria-label="close"
                    className="closeButton"
                    onClick={this.handleClose}
                  >
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>

                <DialogContent>
                  <div className="fontWeightBold text-primary">
                    {" "}
                    Votre configuration a été bien mis à jour !
                  </div>
                </DialogContent>
              </Dialog>*/}
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default ConfigMail;
