import React, { useMemo, useState, useEffect, MouseEvent } from 'react';
import { animated } from 'react-spring';
import { useTransition } from 'react-spring/web';
import { MdClose } from 'react-icons/md';

import './styles.css';

let id = 0;

export type AddFunction = (msg: string) => void;

export interface MessageHubProps {
    config?: {
        tension: number
        friction: number
        precision: number
    };
    timeout?: number;
    children: (add: AddFunction) => void;
}

interface Item {
    key: number;
    msg: string;
}

const MessageHub: React.FC<MessageHubProps> = (props) => {
    const {
        config = { tension: 125, friction: 20, precision: 0.1 },
        timeout = 3000,
        children
    } = props;
    const refMap = useMemo(() => new WeakMap(), [])
    const cancelMap = useMemo(() => new WeakMap(), [])
    const [items, setItems] = useState<Item[]>([])

    const transitions = useTransition(items, {
        from: { opacity: 0, height: 0, life: '100%' },
        keys: item => item.key,
        enter: item => async (next, cancel) => {
          cancelMap.set(item, cancel)
          await next({ opacity: 1, height: refMap.get(item).offsetHeight })
          await next({ life: '0%' })
        },
        leave: [{ opacity: 0 }, { height: 0 }],
        onRest: (result, ctrl, item) => {
          setItems(state =>
            state.filter(i => {
              return i.key !== item.key
            })
          )
        },
        config: (item, index, phase) => key => (phase === 'enter' && key === 'life' ? { duration: timeout } : config),
    });

    useEffect(() => {
        children((msg: string) => {
          setItems(state => [...state, { key: id++, msg }])
        });
    }, [children]);

    return (
        <div className="messageHub-container">
            {transitions(({ life, ...style }, item) => (
                <animated.div className="messageHub-message" style={style}>
                    <div
                        className="messageHub-content"
                        ref={(ref: HTMLDivElement) => ref && refMap.set(item, ref)}
                    >
                        <animated.div className="messageHub-life" style={{ right: life }} />
                        <p>{item.msg}</p>
                        <button
                            className="messageHub-button"
                            onClick={(e: MouseEvent) => {
                                e.stopPropagation()
                                if (cancelMap.has(item)) cancelMap.get(item)()
                            }}
                        >
                            <MdClose size={18} />
                        </button>
                    </div>
                </animated.div>
            ))}
        </div>
    )
}

export default MessageHub;
