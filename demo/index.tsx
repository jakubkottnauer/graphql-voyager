import * as React from 'react';
import { render } from 'react-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';

import { theme } from '../src/components/MUITheme';
import { GraphQLVoyager } from '../src';
import LogoIcon from './icons/logo-small.svg';

import { IntrospectionModal } from './IntrospectionModal';
import { defaultPreset } from './presets';

import './components.css';

export default class Demo extends React.Component {
  state = {
    changeSchemaModalOpen: false,
    introspection: defaultPreset,
  };

  constructor(props) {
    super(props);

    const { url, withCredentials } = getQueryParams();
    if (url) {
      this.state.introspection = introspectionQuery =>
        fetch(url, {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: introspectionQuery }),
          ...(withCredentials === 'true' ? { credentials: 'include', mode: 'cors' } : {}),
        }).then(response => response.json());
    }
  }

  public render() {
    const { changeSchemaModalOpen, introspection } = this.state;

    const closeChangeSchema = () => this.setState({ changeSchemaModalOpen: false });

    return (
      <MuiThemeProvider theme={theme}>
        <GraphQLVoyager introspection={introspection}>
          <GraphQLVoyager.PanelHeader>
            <div className="voyager-panel">
              <Logo />
            </div>
          </GraphQLVoyager.PanelHeader>
        </GraphQLVoyager>
        <IntrospectionModal
          open={changeSchemaModalOpen}
          onClose={closeChangeSchema}
          onChange={introspection => this.setState({ introspection })}
        />
      </MuiThemeProvider>
    );
  }
}

function getQueryParams(): { [key: string]: string } {
  const query = window.location.search.substring(1);
  const params = {};

  for (const param of query.split('&')) {
    const [key, value] = param.split('=');
    params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
  }
  return params;
}

class Logo extends React.Component {
  render() {
    return (
      <div className="voyager-logo">
        <a href="https://github.com/APIs-guru/graphql-voyager" target="_blank">
          <div className="logo">
            <LogoIcon />
            <h2 className="title">
              <strong>Data Model</strong> Voyager
            </h2>
          </div>
        </a>
      </div>
    );
  }
}

render(<Demo />, document.getElementById('root'));
