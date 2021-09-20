import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { logError } from '@edx/frontend-platform/logging';
import {
  Button, Dropdown, Icon, IconButton, ModalPopup,
} from '@edx/paragon';
import { MoreVert } from '@edx/paragon/icons';

import { ContentActions } from '../../data/constants';
import messages from '../messages';
import { useActions } from '../utils';

function ActionsDropdown({
  intl,
  commentOrPost,
  disabled,
  actionHandlers,
}) {
  const [isOpen, setOpen] = useState(false);
  const dropdownIconRef = React.useRef(null);
  const actions = useActions(commentOrPost);
  const handleActions = (action) => {
    const actionFunction = actionHandlers[action];
    if (actionFunction) {
      actionFunction();
    } else {
      logError(`Unknown or unimplemented action ${action}`);
    }
  };
  return (
    <>
      <span ref={dropdownIconRef}>
        <IconButton
          onClick={() => setOpen(!isOpen)}
          alt={intl.formatMessage(messages.actionsAlt)}
          src={MoreVert}
          iconAs={Icon}
          disabled={disabled}
        />
      </span>
      <ModalPopup
        onClose={() => setOpen(false)}
        positionRef={dropdownIconRef}
        isOpen={isOpen}
        placement="auto-start"
      >
        <div className="bg-white p-1 shadow d-flex flex-column">
          {actions.map(action => (
            <>
              {action.action === ContentActions.DELETE
              && <Dropdown.Divider key="divider" />}

              <Dropdown.Item
                as={Button}
                key={action.id}
                variant="tertiary"
                size="inline"
                onClick={() => {
                  setOpen(false);
                  handleActions(action.action);
                }}
                className="d-flex justify-content-start py-1.5 mr-4"
              >
                <Icon src={action.icon} className="mr-1" /> {intl.formatMessage(action.label)}
              </Dropdown.Item>
            </>
          ))}
        </div>
      </ModalPopup>
    </>
  );
}

ActionsDropdown.propTypes = {
  intl: intlShape.isRequired,
  commentOrPost: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  disabled: PropTypes.bool,
  actionHandlers: PropTypes.objectOf(PropTypes.func).isRequired,
};

ActionsDropdown.defaultProps = {
  disabled: false,
};

export default injectIntl(ActionsDropdown);
