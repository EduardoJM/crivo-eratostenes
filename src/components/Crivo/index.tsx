import React, { useState, useRef } from 'react';
import {MdCheck} from 'react-icons/md';

import Modal from '../Modal';
import MessageHub, { AddFunction } from '../MessageHub';

import './styles.css';

export interface CrivoProps {
    max?: number;
    columns?: number;
}

interface CrivoTableCell {
    row: number;
    col: number;
    value: number;
    crived: boolean;
}

const Crivo: React.FC<CrivoProps> = (props) => {
    const {
        max = 100,
        columns = 10,
    } = props;

    function createRawTable() {
        let rows: CrivoTableCell[][] = [];
        let i = 1;
        let k = 1;
        let row: CrivoTableCell[] = [];
        while (i <= max) {
            for (let j = 1; j <= columns; j += 1) {
                row.push({
                    col: j,
                    row: k,
                    value: i,
                    crived: false,
                })
                i += 1;
            }
            rows.push(row);
            row = []
            k += 1;
        }
        return rows;
    }

    const addRefFunction = useRef<null | AddFunction>(null)

    const [nextCriveNumber, setNextCriveNumber] = useState(2);
    const [stoped, setStoped] = useState(false);
    const [dataTable, setDataTable] = useState<CrivoTableCell[][]>(() => createRawTable());

    function testCrivo(criveNumber: number) {
        let crived = 0;
        for (let i = 0; i < dataTable.length; i += 1) {
            for (let j = 0; j < dataTable[i].length; j += 1) {
                const cell = dataTable[i][j];
                if ((cell.value !== criveNumber) && (cell.value % criveNumber === 0)) {
                    if (!cell.crived) {
                        crived += 1;
                    }
                }
            }
        }
        return (crived > 0);
    }

    function handleNextClick() {
        let criveNumber = nextCriveNumber;
        while (!testCrivo(criveNumber)) {
            criveNumber += 1;
            if (criveNumber >= max) {
                break;
            }
        }
        if (!testCrivo(criveNumber)) {
            setStoped(true);
            return;
        }
        const newTable: CrivoTableCell[][] = [];
        let crived = [];
        for (let i = 0; i < dataTable.length; i += 1) {
            let row: CrivoTableCell[] = [];
            for (let j = 0; j < dataTable[i].length; j += 1) {
                const cell = dataTable[i][j];
                if ((cell.value !== criveNumber) && (cell.value % criveNumber === 0)) {
                    if (!cell.crived) {
                        crived.push(cell.value);
                    }
                    row.push({
                        ...cell,
                        crived: true,
                    });
                } else {
                    row.push(cell);
                }
            }
            newTable.push(row);
            row = [];
        }
        let message = `Remover todos os multiplos de ${criveNumber}, exceto ele mesmo: {${crived.join(', ')}}.`;
        const flatDataTable: CrivoTableCell[] = [];
        newTable.forEach((row) => flatDataTable.push(...row));
        const filtered = flatDataTable.filter((item) => !item.crived && item.value > criveNumber);
        if (filtered.length === 0) {
            message = `${message} N??o h?? mais n??meros compostos na tabela.`;
        } else {
            message = `${message} O n??mero ${filtered[0].value} ?? o pr??ximo n??mero primo.`;
            setNextCriveNumber(filtered[0].value);
            setDataTable(newTable);
        }
        if (addRefFunction.current) {
            addRefFunction.current(message);
        }
    }

    function handleModalClose() {
        setStoped(false);
    }

    function handleClearClick() {
        setDataTable(createRawTable());
        setNextCriveNumber(2);
    }

    return (
        <>
            <table className="crivo" cellSpacing={10}>
                <tbody>
                    {dataTable.map((row, index) => (
                        <tr key={index}>
                            {row.map((col, index) => (
                                <td
                                    key={index}
                                    className={`${col.value === 1 ? 'number-one' : col.crived ? 'crived' : ''}`}
                                >
                                    {col.value}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="buttons-row">
                <button onClick={handleClearClick}>Limpar</button>
                <button onClick={handleNextClick}>Avan??ar</button>
            </div>

            <Modal
                opened={stoped}
                onCloseRequested={handleModalClose}
                title="Ops! Chegamos no nosso limite!"
            >
                <p className="modal-center-text">
                    <MdCheck size={120} />
                    <br/>
                    N??o h?? mais checagens, todos os n??meros n??o apagados da tabela s??o n??meros primos.
                </p>
            </Modal>

            <MessageHub
                children={(add: AddFunction) => {
                    addRefFunction.current = add;
                }}
            />
        </>
    );
};

export default Crivo;
