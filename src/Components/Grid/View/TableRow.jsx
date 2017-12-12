import React from 'react';
import TableCell from './TableCell.jsx';
import styles from '../../../../styles/AppStyles.css'
import format from 'format-number';

class TableRow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSelected: this.props.selectState,
            shouldAnimate: false,
            data: props.data,
            columnOrder: this.props.columnKeyValues,
        }
        this.dynamicBackgroundColor = undefined;
        this.handleRowClick = this.handleRowClick.bind(this);

        // this.dataKeysJsonpathMapper = {
        //     "amerOrEuro": "/data/amerOrEuro",
        //     "contractSize":"/data/contractSize",
        //     "counterparty": "/data/counterparty",

        //     "maturityDate": "/data/maturityDate/str",

        //     "payCurrency": "/data/pay/currency",
        //     "payDiscountCurve": "/data/pay/discountCurve",
        //     "payFixedRate": "/data/pay/fixedRate",
        //     "payNotional": "/data/pay/notional",

        //     "putOrCall":"/data/putOrCall",            

        //     "receiveCurrency": "/data/receive/currency",
        //     "receiveDiscountCurve": "/data/receive/discountCurve",
        //     "receiveIndex": "/data/receive/index",
        //     "receiveNotional": "/data/receive/notional",

        //     "strike":"/data/strike",

        //     "lastUpdated": "/lastUpdated/str",

        //     "payLeg": "/output/componentPrices/payLeg",
        //     "receiveLeg": "/output/componentPrices/receiveLeg",

        //     "price": "/output/price",
        //     "rho10bps": "/output/rho10bps",
        //     "gamma1pct": "/output/gamma1pct",
        //     "delta1pct": "/output/delta1pct",
        //     "vega1pt": "/output/vega1pt",            
        //     "volatility":"/output/volatility",

        //     "product": "/product",
        //     "underlier": "/underlier",
        //     "vertex": "/vertex"
        // }

        this.dataKeysJsonpathMapper = {
            "amerOrEuro": "/AmerOrEuro",
            "contractSize": "/ContractSize",
            "counterparty": "/Counterparty",

            "maturityDate": "/MaturityDate",

            "payCurrency": "/PayCurrency",
            "payDiscountCurve": "/PayDiscountCurve",
            "payFixedRate": "/PayFixedRate",
            "payNotional": "/PayNotional",

            "putOrCall": "/PutOrCall",

            "receiveCurrency": "/ReceiveCurrency",
            "receiveDiscountCurve": "/RreceiveDiscountCurve",
            "receiveIndex": "/ReceiveIndex",
            "receiveNotional": "/ReceiveNotional",

            "strike": "/Strike",

            "lastUpdated": "/LastUpdated",

            "payLeg": "/PayLeg",
            "receiveLeg": "/ReceiveLeg",

            "price": "/Price",
            "rho10bps": "/Rho10bps",
            "gamma1pct": "/Gamma1pct",
            "delta1pct": "/Delta1pct",
            "vega1pt": "/Vega1pt",
            "volatility": "/Volatility",

            "name": "/Name",
            "underlier": "/Underlier",
            "vertex": "/Vertex"
        }
    }

    handleRowClick(e) {
        e.preventDefault();
        console.log('Is Ctrl Pressed: ' + e.shiftKey);
        this.props.selectionDataUpdateHandler(this.props.indexVal,this.props.parentRowKey, e); // Update the selection state in the data
    }

    triggerUpdate(newdata, selectState) {
        this.setState({ data: newdata, isSelected: selectState });
    }

    formatNumber(number) {
        let myFormat = format({ prefix: '$', integerSeparator: ',' });
        let formattedNum = myFormat(number);
        return formattedNum;
    }

    getCellDataForKey(data, key) {
        let result, jsonpathforkey = this.dataKeysJsonpathMapper[key];

        if (jsonpathforkey == undefined) {
            return '';
        } else {
            let pathComponents = jsonpathforkey.split('/');
            pathComponents = pathComponents.filter(item => {
                if (item != "")
                    return item;
            })
            if (pathComponents.length == 0) {
                result = data[key];
            } else {
                result = data;
                pathComponents.forEach(pathComponent => {
                    result = result[pathComponent];
                })
            }
        }

        if ((key === 'receiveLeg' || key === 'price' || key === 'payLeg') && result !== null) {
            return this.formatNumber(result.toFixed(2));
        }
        return result;
    }

    render() {
        this.dynamicBackgroundColor = this.state.isSelected ? '#7cb6ff' : this.props.isRowColored ? '#edeff2' : '#FFFFFF';

        return (
            <tr ref={"tableRow"}
                className={styles.tableGridRow}
                onClick={this.handleRowClick}
                style={{ backgroundColor: this.dynamicBackgroundColor }}>
                {this.props.isGroupedView ? <td className={styles.tdGroupedView}></td> : null}
                {
                    this.state.columnOrder.map((item, i) => {
                        return <TableCell key={i} parentBackgroundColor={this.dynamicBackgroundColor}
                            cellData={this.getCellDataForKey(this.state.data, item.columnkey)}></TableCell>
                    })
                }
            </tr>
        )
    }

}



export default TableRow;