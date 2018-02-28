/**
 *
 * ConfigPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

// You can find these components in either
// ./node_modules/strapi-helper-plugin/lib/src
// or strapi/packages/strapi-helper-plugin/lib/src
import ContainerFluid from 'components/ContainerFluid';
import HeaderNav from 'components/HeaderNav';
import PluginHeader from 'components/PluginHeader';


// You can find these utils in either
// ./node_modules/strapi-helper-plugin/lib/src
// or strapi/packages/strapi-helper-plugin/lib/src
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import {
  getSettings,
  onCancel,
} from './actions';

import reducer from './reducer';
import saga from './saga';
import selectConfigPage from './selectors';

class ConfigPage extends React.Component {
  componentDidMount() {
    this.getSettings(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // Get new settings on navigation change
    if (nextProps.match.params.env !== this.props.match.params.env) {
      this.getSettings(nextProps);
    }
  }

  /**
   * Get Settings depending on the props
   * @param  {Object} props
   * @return {Func}       calls the saga that gets the current settings
   */
  getSettings = (props) => {
    const { match: { params: { env} } } = props;
    this.props.getSettings(env);
  }

  generateLinks = () => {
    const headerNavLinks = this.context.appEnvironments.reduce((acc, current) => {
      const link = Object.assign(current, { to: `/plugins/upload/configurations/${current.name}` });
      acc.push(link);
      return acc;
    }, []).sort(link => link.name === 'production');

    return headerNavLinks;
  }

  pluginHeaderActions = [
    {
      kind: 'secondary',
      label: 'app.components.Button.cancel',
      onClick: this.props.onCancel,
      type: 'button',
    },
    {
      kind: 'primary',
      label: 'app.components.Button.save',
      onClick: () => console.log('will save'),
      type: 'button',
    },
  ];

  render() {
    return (
      <div>
        <form onSubmit={(e) => e.preventDefault()}>
          <ContainerFluid>
            <PluginHeader
              actions={this.pluginHeaderActions}
              description={{ id: 'upload.ConfigPage.description' }}
              title={{ id: 'upload.ConfigPage.title'}}
            />
            <HeaderNav links={this.generateLinks()} />
          </ContainerFluid>
        </form>
      </div>
    );
  }
}

ConfigPage.contextTypes = {
  appEnvironments: PropTypes.array,
};

ConfigPage.defaultProps = {};

ConfigPage.propTypes = {
  getSettings: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSettings,
      onCancel,
    },
    dispatch,
  );
}

const mapStateToProps = selectConfigPage();

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'configPage', reducer });
const withSaga = injectSaga({ key: 'configPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ConfigPage);