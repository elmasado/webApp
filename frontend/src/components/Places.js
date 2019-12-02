import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import { ReactiveBase, ReactiveList } from "@appbaseio/reactivesearch";

import {
  Paper,
  Select,
  MenuItem,
  Breadcrumbs,
  Link,
  Typography
} from "@material-ui/core";
import "../styles/Testator.css";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { getParamConfig } from "../utils/functions";
import { ExplorMenu } from "./Wills";
import PlaceDisplay from "./PlaceDisplay";

const { ResultListWrapper } = ReactiveList;

class Places extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field: "city.keyword",
      order: "asc",
      value: 1
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    switch (event.target.value) {
      case 1:
        this.setState({
          value: event.target.value,
          field: "city.keyword",
          order: "asc"
        });
        break;
      case 2:
        this.setState({
          value: event.target.value,
          field: "city.keyword",
          order: "desc"
        });
        break;
      case 3:
        this.setState({
          value: event.target.value,
          field: "region.keyword",
          order: "asc"
        });
        break;
      case 4:
        this.setState({
          value: event.target.value,
          field: "region.keyword",
          order: "desc"
        });
        break;
      case 5:
        this.setState({
          value: event.target.value,
          field: "country.keyword",
          order: "asc"
        });
        break;
      case 6:
        this.setState({
          value: event.target.value,
          field: "country.keyword",
          order: "desc"
        });
        break;
      default:
        this.setState({
          value: event.target.value,
          field: "city.keyword",
          order: "asc"
        });
        break;
    }
  }

  render() {
    return (
      <ReactiveBase
        app={getParamConfig("es_index_places")}
        url={getParamConfig("es_host")}
        type="_doc"
      >
        <ExplorMenu selectedId="places" />
        <div className="wills_menu">
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
                to="/recherche"
              >
                {" "}
                Recherche{" "}
              </Link>
              <Typography color="textPrimary">Les lieux</Typography>
            </Breadcrumbs>
          </Paper>
        </div>
        <div className="wills_order">
          Trier par :
          <Select value={this.state.value} onChange={this.handleChange}>
            <MenuItem value={1}>commune (A-Z)</MenuItem>
            <MenuItem value={2}>commune (Z-A)</MenuItem>
            <MenuItem value={3}>région (A-Z)</MenuItem>
            <MenuItem value={4}>région (Z-A)</MenuItem>
            <MenuItem value={5}>pays (A-Z)</MenuItem>
            <MenuItem value={6}>pays (Z-A)</MenuItem>
          </Select>
        </div>

        <div>
          <ReactiveList
            dataField={this.state.field}
            componentId="place"
            stream={true}
            pagination={true}
            paginationAt="top"
            size={1}
            pages={10}
            sortBy={this.state.order}
            showEndPage={false}
            renderResultStats={function(stats) {
              return `${stats.numberOfResults} lieux trouvés.`;
            }}
            URLParams={false}
          >
            {({ data, error, loading }) => (
              <ResultListWrapper>
                {data.map((item, j) => {
                  window.history.replaceState(
                    getParamConfig("web_url"),
                    "place",
                    getParamConfig("web_url") + "/place/" + item["_id"]
                  );
                  return (
                    <div className="root" key={j}>
                      <Paper>
                        <PlaceDisplay id={item["_id"]} data={item} />
                      </Paper>
                    </div>
                  );
                })}
              </ResultListWrapper>
            )}
          </ReactiveList>
        </div>
      </ReactiveBase>
    );
  }
}

export default Places;