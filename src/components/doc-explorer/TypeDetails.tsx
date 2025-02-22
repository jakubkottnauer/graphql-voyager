import { SimplifiedTypeWithIDs } from '../../introspection/types';
import { isEmpty, map } from 'lodash';
import * as React from 'react';

import Markdown from '../utils/Markdown';
import Description from './Description';
import WrappedTypeName from './WrappedTypeName';

interface TypeDetailsProps {
  type: SimplifiedTypeWithIDs;
  onTypeLink: (any) => void;
}

export default class TypeDetails extends React.Component<TypeDetailsProps> {
  renderFields(type: SimplifiedTypeWithIDs, onTypeLink) {
    if (isEmpty(type.inputFields)) return null;

    return (
      <div className="doc-category">
        <div className="title">attributes</div>
        {map(type.inputFields, field => {
          return (
            <div key={field.id} className="item">
              <a className="field-name">{field.name}</a>
              <WrappedTypeName container={field} onTypeLink={onTypeLink} />
              <Markdown text={field.description} className="description-box -field" />
            </div>
          );
        })}
      </div>
    );
  }

  renderEnumValues(type: SimplifiedTypeWithIDs) {
    if (isEmpty(type.enumValues)) return null;

    return (
      <div className="doc-category">
        <div className="title">values</div>
        {map(type.enumValues, value => (
          <EnumValue key={value.name} value={value} />
        ))}
      </div>
    );
  }

  render() {
    const { type, onTypeLink } = this.props;

    return (
      <div className="type-details">
        <header>
          <h3>{type.name}</h3>
          <Description className="-doc-type" text={type.description} />
        </header>
        <div className="doc-categories">
          {this.renderFields(type, onTypeLink)}
          {this.renderEnumValues(type)}
        </div>
      </div>
    );
  }
}

interface EnumValueProps {
  value: any;
}

class EnumValue extends React.Component<EnumValueProps> {
  render() {
    const { value } = this.props;
    return (
      <div className="item">
        <div className="enum-value">{value.name}</div>
        <Markdown className="description-box -enum-value" text={value.description} />
        {value.deprecationReason && (
          <Markdown className="doc-deprecation" text={value.deprecationReason} />
        )}
      </div>
    );
  }
}
