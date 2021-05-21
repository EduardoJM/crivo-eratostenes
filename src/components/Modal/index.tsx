import React from 'react';
import { animated, useTransition } from 'react-spring';
import { MdClose } from 'react-icons/md';

import './styles.css';

export interface ModalProps {
    opened: boolean;
    onCloseRequested(): void;
    title?: string;
}

const Modal: React.FC<ModalProps> = (props) => {
    const {
        opened,
        onCloseRequested,
        title = null,
        children,
    } = props;

    const transitions = useTransition(opened, {
        from: { opacity: 0, },
        enter: { opacity: 1, },
        leave: { opacity: 0, },
    });

    return transitions((styles, item) => item ? (
        <animated.div className="modal-overlay" style={styles}>
            <div className="modal-overlay-top">
                <div className="modal-content">
                    {title !== null && title !== undefined && (
                        <h3 className="title">{title}</h3>
                    )}
                    {children}

                    <span className="close-button" onClick={onCloseRequested}>
                        <MdClose size={24} />
                    </span>
                </div>
            </div>
        </animated.div>
    ) : (<></>));
};

export default Modal;
